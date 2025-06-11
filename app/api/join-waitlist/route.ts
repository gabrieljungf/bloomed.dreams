// FILE: app/api/join-waitlist/route.ts
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis'; // Você já instalou isso para o rate limiter

// Variáveis para o cliente Redis (escopo do módulo)
let redisClient: Redis | null = null;

// Tenta inicializar o cliente Redis UMA VEZ quando este módulo é carregado
// (em ambientes serverless, isso pode rodar em cada "cold start" da função)
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log("Cliente Upstash Redis inicializado para /api/join-waitlist");
  } catch (error) {
    console.error("Falha ao inicializar cliente Upstash Redis para /api/join-waitlist:", error);
  }
} else {
  console.warn(
    'Variáveis de ambiente do Upstash Redis não configuradas. API /api/join-waitlist não poderá salvar emails.'
  );
}

export async function POST(request: Request) {
  // Verifica se o cliente Redis foi inicializado com sucesso
  if (!redisClient) {
    console.error("Serviço de armazenamento (Redis) não está configurado ou falhou ao inicializar.");
    return NextResponse.json({ error: 'Service not available. Please try again later.' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { email } = body;

    // Validação básica do email
    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    // Nome da chave no Redis onde os emails serão armazenados (um conjunto)
    const redisKeyForWaitlist = 'dreamchat:waitlist';

    // Adiciona o email ao conjunto no Redis
    // O comando 'sadd' adiciona o membro ao conjunto.
    // Retorna 1 se o membro foi adicionado, 0 se o membro já existia.
    const result = await redisClient.sadd(redisKeyForWaitlist, email);

    if (result === 1) {
      console.log(`Email ${email} adicionado à lista de espera (${redisKeyForWaitlist}).`);
    } else {
      console.log(`Email ${email} já estava na lista de espera (${redisKeyForWaitlist}).`);
    }

    return NextResponse.json({ message: 'Thank you! You have been added to our waitlist.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error in /api/join-waitlist handler:', error);
    // Se for um erro específico do Redis, você pode querer logá-lo de forma diferente
    // if (error.name === 'RedisError') { ... }
    return NextResponse.json({ error: 'An unexpected error occurred while trying to join the waitlist.' }, { status: 500 });
  }
}