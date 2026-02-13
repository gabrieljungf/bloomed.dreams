import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { analyzeDreamInput } from '@/lib/services/ai-services';

let redis: Redis | null = null;
let ratelimitHour: Ratelimit | null = null;
let ratelimitDay: Ratelimit | null = null;

const REDIS_KEY_TOTAL_MESSAGES = 'dreamchat:total_messages';
const REDIS_KEY_TOTAL_ERRORS = 'dreamchat:total_errors';
const REDIS_KEY_UNIQUE_USERS_SET = 'dreamchat:users';

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimitHour = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1h'),
      analytics: true,
      prefix: 'ratelimit_dream_api_handler_hourly_v2',
    });

    ratelimitDay = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1d'),
      analytics: true,
      prefix: 'ratelimit_dream_api_handler_daily_v2',
    });
  } catch (error) {
    console.error('[Upstash] Failed to initialize Redis/Ratelimit:', error);
  }
} else {
  console.warn('[Upstash] Redis env vars not configured. Metrics/rate-limit disabled.');
}

const N8N_INTERNAL_WEBHOOK_URL = process.env.N8N_INTERNAL_WEBHOOK_URL;

async function safeRedisIncr(key: string) {
  if (!redis) return;
  try {
    await redis.incr(key);
  } catch (error) {
    console.error(`[Redis] Failed to increment key "${key}". Continuing.`, error);
  }
}

async function safeRedisTrackMessage(sessionId: string) {
  if (!redis) return;
  try {
    const pipeline = redis.pipeline();
    pipeline.sadd(REDIS_KEY_UNIQUE_USERS_SET, sessionId);
    pipeline.incr(REDIS_KEY_TOTAL_MESSAGES);
    await pipeline.exec();
  } catch (error) {
    console.error('[Redis] Metrics pipeline failed. Continuing.', error);
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  if (!N8N_INTERNAL_WEBHOOK_URL) {
    console.error('[Config] N8N_INTERNAL_WEBHOOK_URL is not configured.');
    await safeRedisIncr(REDIS_KEY_TOTAL_ERRORS);
    return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { dreamText, timestamp, sessionId } = body ?? {};

    if (!dreamText || typeof dreamText !== 'string' || dreamText.trim().length === 0) {
      await safeRedisIncr(REDIS_KEY_TOTAL_ERRORS);
      return NextResponse.json({ error: 'Dream text cannot be empty.' }, { status: 400 });
    }

    let session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'] | null = null;
    try {
      const { data } = await supabase.auth.getSession();
      session = data?.session ?? null;
    } catch (error) {
      console.error('[Supabase] getSession failed. Continuing without session.', error);
      session = null;
    }

    const [n8nResult, analysisResult] = await Promise.allSettled([
      fetch(N8N_INTERNAL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ dreamText, timestamp, sessionId }),
      }),
      analyzeDreamInput(dreamText),
    ]);

    if (n8nResult.status === 'rejected') {
      console.error('[Core] n8n request failed:', n8nResult.reason);
      await safeRedisIncr(REDIS_KEY_TOTAL_ERRORS);
      return NextResponse.json({ error: 'n8n core service is unavailable.' }, { status: 502 });
    }

    if (analysisResult.status === 'rejected') {
      console.error('[Core] LLM analysis failed:', analysisResult.reason);
      await safeRedisIncr(REDIS_KEY_TOTAL_ERRORS);
      return NextResponse.json({ error: 'LLM core analysis failed.' }, { status: 502 });
    }

    const n8nResponse = n8nResult.value;

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text().catch(() => '');
      console.error(`[Core] n8n failed with status ${n8nResponse.status}: ${errorText}`);
      await safeRedisIncr(REDIS_KEY_TOTAL_ERRORS);
      return NextResponse.json({ error: `n8n failed ${n8nResponse.status}` }, { status: 502 });
    }

    let interpretation = '';
    try {
      const n8nData = await n8nResponse.json();
      interpretation = n8nData?.output ?? '';
    } catch (error) {
      console.error('[Core] Failed to parse n8n response JSON:', error);
      await safeRedisIncr(REDIS_KEY_TOTAL_ERRORS);
      return NextResponse.json({ error: 'Invalid n8n response format.' }, { status: 502 });
    }

    const dreamAnalysis = analysisResult.value;
    let savedDreamData = null;

    if (dreamAnalysis.isDream && session) {
      try {
        const { data: newDream, error: dbError } = await supabase
          .from('dreams')
          .insert({
            user_id: session.user.id,
            content: dreamText,
            interpretation,
            title: dreamAnalysis.title,
            mood: dreamAnalysis.mood,
            tags: dreamAnalysis.tags,
          })
          .select()
          .single();

        if (dbError) {
          console.error('[Supabase] Failed to save dream. Continuing without persistence:', dbError);
        } else {
          savedDreamData = newDream;
        }
      } catch (error) {
        console.error('[Supabase] Exception while saving dream. Continuing.', error);
      }
    }

    if (sessionId && typeof sessionId === 'string') {
      await safeRedisTrackMessage(sessionId);
    }

    return NextResponse.json(
      {
        interpretation,
        savedDream: savedDreamData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API /dream] Unexpected handler error:', error);
    await safeRedisIncr(REDIS_KEY_TOTAL_ERRORS);
    return NextResponse.json({ error: 'An unexpected error occurred on the server.' }, { status: 500 });
  }
}
