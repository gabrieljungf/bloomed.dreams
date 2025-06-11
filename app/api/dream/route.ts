// FILE: app/api/dream/route.ts
import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// --- Configuração do Upstash Rate Limiter ---
let redis: Redis | null = null;
let ratelimitHour: Ratelimit | null = null;
let ratelimitDay: Ratelimit | null = null;

const REDIS_KEY_TOTAL_MESSAGES = 'dreamchat:total_messages';
const REDIS_KEY_TOTAL_ERRORS = 'dreamchat:total_errors';
const REDIS_KEY_UNIQUE_USERS_SET = 'dreamchat:users';
const REDIS_KEY_RATE_LIMITED_REQUESTS = 'dreamchat:total_rate_limited'; // Nova chave

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimitHour = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, '1h'),
      analytics: true,
      prefix: 'ratelimit_dream_api_handler_hourly_v2',
    });

    ratelimitDay = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '1d'),
      analytics: true,
      prefix: 'ratelimit_dream_api_handler_daily_v2',
    });

    console.log("Upstash Rate Limiters (hourly & daily) inicializados DENTRO de /api/dream/route.ts");
  } catch (error) {
    console.error("Falha ao inicializar Upstash Redis/Ratelimiters em /api/dream/route.ts:", error);
    // Se o Redis estiver configurado, poderíamos tentar logar um erro aqui,
    // mas é provável que o próprio redis seja o que falhou.
  }
} else {
  console.warn('Variáveis de ambiente do Upstash Redis não configuradas. O Rate Limiting para /api/dream estará desabilitado.');
}

const N8N_INTERNAL_WEBHOOK_URL = process.env.N8N_INTERNAL_WEBHOOK_URL;

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',').shift()?.trim() ||
             request.headers.get('x-vercel-forwarded-for')?.split(',').shift()?.trim() ||
             '127.0.0.1';
  
  console.log(`Requisição recebida em /api/dream de IP: ${ip}`);

  let rateLimitExceededInfo = {
    exceeded: false,
    message: "",
    limit: 0,
    remaining: 0,
    reset: Date.now() + 3600000
  };

  // 1. Checar limite diário primeiro
  if (ratelimitDay) {
    try {
      const { success, limit, remaining, reset } = await ratelimitDay.limit(ip);
      if (!success) {
        rateLimitExceededInfo = { exceeded: true, message: `You've reached the daily request limit (${limit} per day).`, limit, remaining, reset };
        console.warn(`Rate limit DIÁRIO excedido para /api/dream por IP: ${ip}`);
        // Incrementar métrica de rate limit, NÃO de erro
        if (redis) await redis.incr(REDIS_KEY_RATE_LIMITED_REQUESTS);
      } else {
        rateLimitExceededInfo = { ...rateLimitExceededInfo, limit, remaining, reset };
      }
    } catch (error) { // Erro ao tentar verificar o rate limit (ex: Upstash indisponível)
      console.error("Erro durante a verificação de rate limiting DIÁRIO com Upstash:", error);
      if (redis) await redis.incr(REDIS_KEY_TOTAL_ERRORS); // ISSO é um erro
    }
  }

  // 2. Se passou no limite diário (ou se o limiter diário não está ativo/configurado), checar limite por hora
  if (!rateLimitExceededInfo.exceeded && ratelimitHour) {
    try {
      const { success, limit, remaining, reset } = await ratelimitHour.limit(ip);
      rateLimitExceededInfo = { ...rateLimitExceededInfo, limit, remaining, reset };
      if (!success) {
        rateLimitExceededInfo.exceeded = true;
        rateLimitExceededInfo.message = `You've reached the hourly request limit (${limit} per hour).`;
        console.warn(`Rate limit HORÁRIO excedido para /api/dream por IP: ${ip}`);
        // Incrementar métrica de rate limit, NÃO de erro
        if (redis) await redis.incr(REDIS_KEY_RATE_LIMITED_REQUESTS);
      }
    } catch (error) { // Erro ao tentar verificar o rate limit
      console.error("Erro durante a verificação de rate limiting HORÁRIO com Upstash:", error);
      if (redis) await redis.incr(REDIS_KEY_TOTAL_ERRORS); // ISSO é um erro
    }
  }

  // Se algum limite foi excedido e uma mensagem de erro foi definida (pelas verificações acima)
  if (rateLimitExceededInfo.exceeded && rateLimitExceededInfo.message) {
    const timeLeftSeconds = Math.max(0, Math.ceil((rateLimitExceededInfo.reset - Date.now()) / 1000));
    const tryAgainMessage = timeLeftSeconds > 0
      ? `Please try again in about ${Math.ceil(timeLeftSeconds / 60)} minute(s).`
      : "Please try again shortly.";
    const fullMessage = `${rateLimitExceededInfo.message} ${tryAgainMessage}`;

    const scope =
      rateLimitExceededInfo.message.toLowerCase().includes("daily") ? "daily" :
      rateLimitExceededInfo.message.toLowerCase().includes("hourly") ? "hourly" :
      "unknown";

    return NextResponse.json(
      { error: fullMessage, scope },
      {
        status: 429,
        headers: {
          'X-Ratelimit-Limit': rateLimitExceededInfo.limit.toString(),
          'X-Ratelimit-Remaining': rateLimitExceededInfo.remaining.toString(),
          'X-Ratelimit-Reset': new Date(rateLimitExceededInfo.reset).toISOString(),
        },
      }
    );
  }

  if (!ratelimitDay && !ratelimitHour) {
      console.warn("Nenhum Rate limiter para /api/dream está ativo (Upstash não configurado). Permitindo requisição.");
  }

  if (!N8N_INTERNAL_WEBHOOK_URL) {
    console.error('N8N_INTERNAL_WEBHOOK_URL não está configurada no servidor.');
    if (redis) await redis.incr(REDIS_KEY_TOTAL_ERRORS);
    return NextResponse.json(
      { error: 'Internal server configuration error. Please contact support.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { dreamText, timestamp, sessionId } = body;

    if (!dreamText || typeof dreamText !== 'string' || dreamText.trim().length === 0) {
      if (redis) await redis.incr(REDIS_KEY_TOTAL_ERRORS);
      return NextResponse.json({ error: 'Dream text cannot be empty.' }, { status: 400 });
    }
    if (dreamText.length > 5000) {
      if (redis) await redis.incr(REDIS_KEY_TOTAL_ERRORS);
      return NextResponse.json({ error: 'Dream text is too long. Please keep it under 5000 characters.' }, { status: 400 });
    }

    const n8nResponse = await fetch(N8N_INTERNAL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ dreamText, timestamp, sessionId }),
    });

    if (!n8nResponse.ok) {
      if (redis) await redis.incr(REDIS_KEY_TOTAL_ERRORS);
      let errorMsg = `N8N API Error: ${n8nResponse.status}`;
      try {
        const errorData = await n8nResponse.json();
        errorMsg = errorData.error || errorData.message || `N8N Request Failed (${n8nResponse.status})`;
      } catch (e) {
        const textError = await n8nResponse.text();
        console.error("N8N non-JSON error response:", textError);
        errorMsg = textError || errorMsg;
      }
      console.error("Erro ao chamar N8N:", errorMsg);
      return NextResponse.json(
        { error: 'Failed to get a response from the dream decoder service.' },
        { status: n8nResponse.status }
      );
    }

    const n8nData = await n8nResponse.json();

    if (redis && sessionId) {
      try {
        await redis.sadd(REDIS_KEY_UNIQUE_USERS_SET, sessionId);
        await redis.incr(REDIS_KEY_TOTAL_MESSAGES);
      } catch (e) {
        console.warn("Falha ao atualizar métricas de SUCESSO no Redis:", e);
        // Poderia ser um erro, mas cuidado para não entrar em loop se o redis estiver com problemas
        // if (redis) await redis.incr(REDIS_KEY_TOTAL_ERRORS);
      }
    }

    return NextResponse.json(n8nData, { status: 200 });
  } catch (error) {
    console.error('Erro no Route Handler /api/dream (após checagem de rate limit):', error);
    if (redis) await redis.incr(REDIS_KEY_TOTAL_ERRORS);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred on the server.' },
      { status: 500 }
    );
  }
}