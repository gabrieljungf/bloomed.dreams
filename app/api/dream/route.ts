// FILE: app/api/dream/route.ts
import { NextResponse } from 'next/server';

// Esta é a URL real do seu N8N, que NÃO será exposta ao cliente.
// Você a definirá nas variáveis de ambiente da Vercel (e localmente em .env.local se precisar).
const N8N_WEBHOOK_URL = process.env.N8N_INTERNAL_WEBHOOK_URL;

export async function POST(request: Request) {
  // Verificar se a URL do N8N está configurada no servidor
  if (!N8N_WEBHOOK_URL) {
    console.error('N8N_INTERNAL_WEBHOOK_URL não está configurada no servidor.');
    return NextResponse.json(
      { error: 'Internal server configuration error. Please contact support.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { dreamText, timestamp, sessionId } = body;

    // ----- Validação de dreamText.length (veja abaixo) -----
    if (!dreamText || typeof dreamText !== 'string' || dreamText.trim().length === 0) {
      return NextResponse.json({ error: 'Dream text cannot be empty.' }, { status: 400 });
    }
    if (dreamText.length > 5000) { // Exemplo de limite de 5000 caracteres
      return NextResponse.json({ error: 'Dream text is too long. Please keep it under 5000 characters.' }, { status: 400 });
    }
    // ----- Fim da Validação -----


    // Faça a requisição para o N8N a partir do seu servidor Next.js
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        dreamText,
        timestamp,
        sessionId,
      }),
    });

    // Verifique se a resposta do N8N foi bem-sucedida
    if (!n8nResponse.ok) {
      let errorMsg = `N8N API Error: ${n8nResponse.status}`;
      try {
        const errorData = await n8nResponse.json();
        errorMsg = errorData.error || errorData.message || `N8N Request Failed (${n8nResponse.status})`;
      } catch (e) {
        // Se o erro do N8N não for JSON, use o texto ou o status
        const textError = await n8nResponse.text();
        console.error("N8N non-JSON error response:", textError);
        errorMsg = textError || errorMsg;
      }
      console.error("Erro ao chamar N8N:", errorMsg);
      // Retorne um erro genérico para o cliente, mas logue o erro detalhado no servidor
      return NextResponse.json(
        { error: 'Failed to get a response from the dream decoder service.' },
        { status: n8nResponse.status } // Repasse o status do erro do N8N, se apropriado
      );
    }

    // Obtenha a resposta do N8N (assumindo que é JSON)
    const n8nData = await n8nResponse.json();

    // Retorne a resposta do N8N para o cliente
    return NextResponse.json(n8nData, { status: 200 });

  } catch (error) {
    console.error('Erro no Route Handler /api/dream:', error);
    // Trate outros erros (ex: erro ao parsear o JSON do request)
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred on the server.' },
      { status: 500 }
    );
  }
}