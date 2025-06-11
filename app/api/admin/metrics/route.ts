// FILE: src/app/api/admin/metrics/route.ts (ou onde estiver seu arquivo de métricas)
import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const REDIS_KEY_UNIQUE_USERS_SET = "dreamchat:users";
const REDIS_KEY_TOTAL_MESSAGES = "dreamchat:total_messages";
const REDIS_KEY_TOTAL_ERRORS = "dreamchat:total_errors";
const REDIS_KEY_WAITLIST_SET = "dreamchat:waitlist"; // Assumindo que waitlist é um SET
const REDIS_KEY_RATE_LIMITED_REQUESTS = 'dreamchat:total_rate_limited'; // Nova chave

export async function GET() {
  try {
    const [
        users,
        messages,
        errors,
        waitlist,
        rateLimited // Adicionada nova métrica
    ] = await Promise.all([
      redis.scard(REDIS_KEY_UNIQUE_USERS_SET),
      redis.get<number>(REDIS_KEY_TOTAL_MESSAGES) || 0,
      redis.get<number>(REDIS_KEY_TOTAL_ERRORS) || 0,
      redis.scard(REDIS_KEY_WAITLIST_SET) || 0, // Se waitlist for um contador simples, use .get()
      redis.get<number>(REDIS_KEY_RATE_LIMITED_REQUESTS) || 0, // Buscar nova métrica
    ]);

    return NextResponse.json({
      totalUniqueUsers: users,
      totalMessages: Number(messages),
      totalErrors: Number(errors),
      totalWaitlist: waitlist,
      totalRateLimited: Number(rateLimited), // Incluir nova métrica
    });
  } catch (error) {
      console.error("Erro ao buscar métricas do Redis:", error);
      return NextResponse.json({ error: "Falha ao buscar métricas" }, { status: 500 });
  }
}