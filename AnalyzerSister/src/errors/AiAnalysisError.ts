export class AiAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiAnalysisError";
  }
}
