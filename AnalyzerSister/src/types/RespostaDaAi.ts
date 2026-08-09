import type { PdfAnalysisResult } from "./pdf";

export interface AiProviderResponse {
  raw: unknown;
  validated: PdfAnalysisResult;
}
