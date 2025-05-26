// FILE: app/api/dream/route.ts
import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// --- Configuração do Upstash Rate Limiter ---
let redis: Redis | null = null;
let ratelimitHour: Ratelimit | null = null; // Limiter para a regra por hora
let ratelimitDay: Ratelimit | null = null;  // Limiter para a regra por dia

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Limiter para 5 requisições por hora
    ratelimitHour = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, '1h'), // 5 requisições / 1 hora
      analytics: true,
      prefix: 'ratelimit_dream_api_handler_hourly_v2', // Prefixo atualizado para evitar conflito com testes anteriores
    });

    // Limiter para 10 requisições por dia
    ratelimitDay = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '1d'), // 10 requisições / 1 dia (24 horas)
      analytics: true,
      prefix: 'ratelimit_dream_api_handler_daily_v2', // Prefixo atualizado
    });

    console.log("Upstash Rate Limiters (hourly & daily) inicializados DENTRO de /api/dream/route.ts");
  } catch (error) {
    console.error("Falha ao inicializar Upstash Redis/Ratelimiters em /api/dream/route.ts:", error);
    // ratelimitHour e ratelimitDay permanecerão null
  }
} else {
  console.warn(
    'Variáveis de ambiente do Upstash Redis não configuradas. O Rate Limiting para /api/dream estará desabilitado.'
  );
}

const N8N_INTERNAL_WEBHOOK_URL = process.env.N8N_INTERNAL_WEBHOOK_URL;

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',').shift()?.trim() ||
             request.headers.get('x-vercel-forwarded-for')?.split(',').shift()?.trim() ||
             '127.0.0.1';

  // --- Checagem do Rate Limiting (encadeada e manual) ---
  let rateLimitExceededInfo: { exceeded: boolean, message: string, limit: number, remaining: number, reset: number } = {
    exceeded: false,
    message: "",
    limit: 0,
    remaining: 0,
    reset: Date.now() + 3600000 // Default reset para 1 hora em ms
  };

  // 1. Checar limite diário primeiro
  if (ratelimitDay) {
    try {
      const { success, limit, remaining, reset } = await ratelimitDay.limit(ip);
      if (!success) {
        rateLimitExceededInfo = { exceeded: true, message: `You've reached the daily request limit (${limit} per day).`, limit, remaining, reset };
        console.warn(`Rate limit DIÁRIO excedido para /api/dream por IP: ${ip}`);
      } else {
        // Guarda info do limite menos restritivo se passou, para os headers
        rateLimitExceededInfo = { ...rateLimitExceededInfo, limit, remaining, reset };
      }
    } catch (error) {
      console.error("Erro durante a verificação de rate limiting DIÁRIO com Upstash:", error);
    }
  }

  // 2. Se passou no limite diário (ou se o limiter diário não está ativo/configurado), checar limite por hora
  if (!rateLimitExceededInfo.exceeded && ratelimitHour) {
    try {
      const { success, limit, remaining, reset } = await ratelimitHour.limit(ip);
      // A informação do limite horário é mais relevante para o reset time imediato se ele for atingido
      rateLimitExceededInfo = { ...rateLimitExceededInfo, limit, remaining, reset }; // Atualiza sempre, pegando o reset mais próximo
      if (!success) {
        rateLimitExceededInfo.exceeded = true;
        rateLimitExceededInfo.message = `You've reached the hourly request limit (${limit} per hour).`;
        console.warn(`Rate limit HORÁRIO excedido para /api/dream por IP: ${ip}`);
      }
    } catch (error) {
      console.error("Erro durante a verificação de rate limiting HORÁRIO com Upstash:", error);
    }
  }

  // Se algum limite foi excedido
  if (rateLimitExceededInfo.exceeded) {
    const timeLeftSeconds = Math.max(0, Math.ceil((rateLimitExceededInfo.reset - Date.now()) / 1000));
    const tryAgainMessage = timeLeftSeconds > 0 ? `Please try again in about ${Math.ceil(timeLeftSeconds / 60)} minute(s).` : "Please try again shortly.";
    const fullMessage = `${rateLimitExceededInfo.message} ${tryAgainMessage}`;

    return NextResponse.json(
      { error: fullMessage },
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

  // --- Lógica Principal do Endpoint (se passou por todos os rate limits ou se RL está desativado) ---
  if (!N8N_INTERNAL_WEBHOOK_URL) {
    console.error('N8N_INTERNAL_WEBHOOK_URL não está configurada no servidor.');
    return NextResponse.json(
      { error: 'Internal server configuration error. Please contact support.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { dreamText, timestamp, sessionId } = body;

    if (!dreamText || typeof dreamText !== 'string' || dreamText.trim().length === 0) {
      return NextResponse.json({ error: 'Dream text cannot be empty.' }, { status: 400 });
    }
    if (dreamText.length > 5000) {
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
    return NextResponse.json(n8nData, { status: 200 });

  } catch (error) {
    console.error('Erro no Route Handler /api/dream (após checagem de rate limit):', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred on the server.' },
      { status: 500 }
    );
  }
}