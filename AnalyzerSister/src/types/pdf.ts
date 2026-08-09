import type { FeedbackLayer } from "./feedback";


export interface PdfAnalysisResult {
  text: string;
  feedback: FeedbackLayer[];
  meta: {
    pages: number;
    processingTimeMs: number;
    model: string;
  };
}
