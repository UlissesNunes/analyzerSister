export type FeedbackSeverity = "green" | "yellow" | "red";

export interface FeedbackLayer {
  severity: FeedbackSeverity;
  category: string;
  message: string;
  line_reference?: string;
  confidence?: number;
  explanation?: string;
}
