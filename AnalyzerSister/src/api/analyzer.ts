import { process } from "zod/v4/core";
import { AiAnalysisError } from "../errors/AiAnalysisError";
import { PdfParseError } from "../errors/PdfParseError";
import { RateLimitExceededError } from "../errors/RateLimitExceededError";
import { ValidationError } from "../errors/ValidationError";
import { GeminiProvider } from "../lib/ai/GeminiProvider";
import { PdfAnalysisResultSchema } from "../lib/validation/schemas";


// Placeholder para quota global (Vercel KV)
async function checkQuota(): Promise<void> {
  const quotaAvailable = true; // simulação
  if (!quotaAvailable) {
    throw new RateLimitExceededError("Limite global de análises atingido");
  }
}

// Placeholder para extração de texto do PDF
async function extractPdfText(fileBuffer: Buffer): Promise<string> {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new PdfParseError("Arquivo PDF inválido ou vazio");
  }
  return "Texto extraído simulado do PDF";
}

export default async function handler(req: Request, res: Response) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const fileBuffer = Buffer.from(req.body?.pdf || "");
    const text = await extractPdfText(fileBuffer);

    await checkQuota();

    const apiKey = process.env.GEMINI_API_KEY || "";
    const provider = new GeminiProvider(apiKey);

    const result = await provider.analyze(text, { pages: 1 });
    const validated = PdfAnalysisResultSchema.parse(result);

    return res.status(200).json(validated);
  } catch (err: unknown) {
    if (err instanceof PdfParseError) {
      return res.status(422).json({ error: "Erro na extração do PDF", details: err.message });
    }
    if (err instanceof RateLimitExceededError) {
      return res.status(429).json({ error: "Limite de análises atingido", details: err.message });
    }
    if (err instanceof ValidationError) {
      return res.status(422).json({ error: "Resposta inválida da IA", details: err.message });
    }
    if (err instanceof AiAnalysisError) {
      return res.status(500).json({ error: "Erro na análise da IA", details: err.message });
    }

    return res.status(500).json({ error: "Erro inesperado", details: (err as Error).message });
  }
}
