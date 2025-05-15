export interface PredictionResult {
  id: string;
  fileName: string;
  diseaseType: string;
  confidenceScore: number;
  interpretation: string; // Detailed interpretation from ML model (mocked)
  summary: string;       // Simplified summary from AI
  timestamp: string;     // ISO string, e.g., new Date().toISOString()
}
