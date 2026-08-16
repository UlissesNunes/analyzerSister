import { PdfAnalysisResultSchema } from "../validation/schemas";
import type { PdfAnalysisResult } from "../../types/pdf";

export interface AiProvider {
  analyze(text: string, meta: { pages: number }): Promise<PdfAnalysisResult>;
}

export class GeminiProvider implements AiProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    this.apiKey = apiKey;
  }

  async analyze(text: string, meta: { pages: number }): Promise<PdfAnalysisResult> {
    const prompt = this.buildPrompt(text, meta.pages);

    // Simulação: usa apiKey e prompt para evitar warnings
    const rawResponse = await this.fakeCall(prompt);

    // Validação com Zod
    const validated = PdfAnalysisResultSchema.parse(rawResponse);
    return validated;
  }

  private buildPrompt(text: string, pages: number): string {
    return `
Você é um avaliador técnico de atendimentos via WhatsApp para empresas.
Entrada: um bloco de texto em Português Brasileiro.
Tarefa: analisar o atendimento e retornar APENAS um JSON válido conforme o schema abaixo.

Regras:
- Seja assertivo; não use termos como "talvez" ou "acho".
- Classifique cada item em três camadas: "green", "yellow", "red".
- Inclua justificativas curtas e acionáveis.
- Idioma: Português Brasileiro.
- Saída: apenas JSON.

Formato:
{
  "text": "${text}",
  "feedback": [
    {
      "severity": "green|yellow|red",
      "category": "<categoria>",
      "message": "<justificativa curta>",
      "line_reference": "<opcional>",
      "confidence": <0.0-1.0 opcional>,
      "explanation": "<opcional>"
    }
  ],
  "meta": {
    "pages": ${pages},
    "processingTimeMs": 0,
    "model": "gemini-free"
  }
}
    `;
  }

  // Simulação para testes locais antes da integração real
  private async fakeCall(prompt: string): Promise<unknown> {
    // Usa apiKey e prompt para evitar warnings
    console.log("Usando API Key (mascarada):", this.apiKey.substring(0, 4) + "****");
    console.log("Prompt gerado (preview):", prompt.slice(0, 80) + "...");

    return {
      text: "Exemplo de análise simulada",
      feedback: [
        {
          severity: "green",
          category: "saudacao",
          message: "Saudação cordial e adequada",
          confidence: 0.9
        }
      ],
      meta: {
        pages: 1,
        processingTimeMs: 1234,
        model: "gemini-free"
      }
    };
  }
}
