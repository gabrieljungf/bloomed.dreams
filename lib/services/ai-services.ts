// ARQUIVO FINAL E ATUALIZADO: lib/services/ai.service.ts

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Definimos a estrutura da resposta que esperamos da IA
export type DreamAnalysisResult = {
  isDream: false;
} | {
  isDream: true;
  title: string;
  mood: 'neutral' | 'happy' | 'sad' | 'anxious' | 'exciting' | 'fearful' | 'confused';
  tags: string[];
};

/**
 * Analisa um texto de entrada para determinar se é um sonho e, em caso afirmativo,
 * extrai título, humor e tags.
 * @param userInput O texto digitado pelo usuário.
 * @returns Um objeto com a análise completa do sonho ou indicando que não é um sonho.
 */
export async function analyzeDreamInput(userInput: string): Promise<DreamAnalysisResult> {
  if (!OPENROUTER_API_KEY) {
    console.error("[AI Service] OpenRouter API Key não está configurada.");
    return { isDream: false };
  }

  if (userInput.trim() === '') {
    return { isDream: false };
  }
  
  console.log(`[AI Service] Sending input to LLM for full analysis: "${userInput}"`);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-preview-09-2025", 
        messages: [
          {
            role: "system",
            // ====================== PROMPT ATUALIZADO ======================
            content: `Você é um assistente de análise de sonhos para o aplicativo Bloomed Dreams. Sua função é analisar a mensagem do usuário e retornar um objeto JSON.

Regras:
1.  Primeiro, determine se a mensagem é uma descrição de um sonho.
2.  Se NÃO for um sonho (ex: um cumprimento, uma pergunta), retorne: \`{"isDream": false}\`.
3.  Se FOR um sonho, retorne um JSON com a seguinte estrutura:
    - "isDream": true
    - "title": Um título poético e curto (3 a 7 palavras) para o sonho.
    - "mood": O sentimento principal do sonho. Escolha UMA das seguintes opções: 'neutral', 'happy', 'sad', 'anxious', 'exciting', 'fearful', 'confused'.
    - "tags": Um array com 3 a 5 tags (palavras-chave únicas, em minúsculas) que resumem os elementos principais do sonho.

Exemplo de Sonho: "sonhei que estava voando sobre uma cidade de cristal e me sentia livre"
Sua Resposta: \`{"isDream": true, "title": "Voo sobre a Cidade de Cristal", "mood": "happy", "tags": ["voar", "cidade", "cristal", "liberdade"]}\`

Exemplo de Não-Sonho: "oi tudo bem"
Sua Resposta: \`{"isDream": false}\``
            // =================================================================
          },
          {
            role: "user",
            content: userInput
          }
        ],
        response_format: { "type": "json_object" }, 
        temperature: 0.2, // Um pouco de criatividade para o título
      })
    });

    if (!response.ok) {
      console.error(`[AI Service] Erro na chamada ao OpenRouter: ${response.status} ${response.statusText}`);
      return { isDream: false };
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    console.log(`[AI Service] Raw output from LLM: ${rawContent}`);

    try {
      const jsonString = rawContent.replace(/```json\n/g, '').replace(/```/g, '');
      const parsedJson = JSON.parse(jsonString);

      // Se for um sonho, retorne a estrutura completa. Caso contrário, a simples.
      if (parsedJson.isDream === true) {
        return {
          isDream: true,
          title: parsedJson.title || "Untitled Dream",
          mood: parsedJson.mood || "neutral",
          tags: parsedJson.tags || []
        };
      } else {
        return { isDream: false };
      }
    } catch (e) {
      console.error("[AI Service] Failed to parse JSON from LLM.", e);
      return { isDream: false };
    }
    
  } catch (error) {
    console.error("[AI Service] Erro de rede ao tentar analisar a mensagem:", error);
    return { isDream: false };
  }
}