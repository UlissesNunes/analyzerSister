import { z } from "zod";

export const FeedbackLayerSchema = z.object({
  severity: z.enum(["green", "yellow", "red"]),
  category: z.string().min(1),
  message: z.string().min(1),
  line_reference: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  explanation: z.string().optional(),
});

export const PdfAnalysisResultSchema = z.object({
  text: z.string().min(1),
  feedback: z.array(FeedbackLayerSchema).min(0),
  meta: z.object({
    pages: z.number().int().nonnegative(),
    processingTimeMs: z.number().int().nonnegative(),
    model: z.string().min(1),
  }),
});

export type FeedbackLayer = z.infer<typeof FeedbackLayerSchema>;
export type PdfAnalysisResult = z.infer<typeof PdfAnalysisResultSchema>;
