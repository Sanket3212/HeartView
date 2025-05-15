"use server";

import { generateSummary } from '@/ai/flows/generate-summary';
import type { PredictionResult } from '@/lib/types';
import { ZodError } from 'zod';

// Mock disease types and interpretations for variety
const mockData = [
  {
    diseaseType: "Normal Sinus Rhythm",
    confidenceScore: 0.98,
    interpretation: "The ECG indicates a normal sinus rhythm with regular heart rate and normal intervals. No significant abnormalities detected.",
  },
  {
    diseaseType: "Atrial Fibrillation",
    confidenceScore: 0.92,
    interpretation: "The ECG shows signs of atrial fibrillation with a rapid ventricular response. QRS complexes are narrow, and P waves are absent, replaced by fibrillatory waves.",
  },
  {
    diseaseType: "Ventricular Tachycardia",
    confidenceScore: 0.85,
    interpretation: "Wide QRS complexes observed at a rapid rate, characteristic of ventricular tachycardia. Immediate medical attention is advised.",
  },
  {
    diseaseType: "Bradycardia",
    confidenceScore: 0.95,
    interpretation: "The heart rate is significantly below normal (less than 60 bpm), indicating bradycardia. P waves are present and precede each QRS complex.",
  }
];

export async function processECGFile(formData: FormData): Promise<{ prediction: PredictionResult | null; error: string | null }> {
  const file = formData.get('ecgFile') as File;

  if (!file || file.size === 0) {
    return { prediction: null, error: "No file uploaded or file is empty." };
  }

  if (file.type !== 'text/csv') {
    return { prediction: null, error: "Invalid file type. Please upload a CSV file." };
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Select a random mock data entry
  const randomMockEntry = mockData[Math.floor(Math.random() * mockData.length)];

  const mockPredictionBase = {
    id: crypto.randomUUID(),
    fileName: file.name,
    diseaseType: randomMockEntry.diseaseType,
    confidenceScore: randomMockEntry.confidenceScore,
    interpretation: randomMockEntry.interpretation,
    timestamp: new Date().toISOString(),
  };

  try {
    const summaryResult = await generateSummary({ interpretation: mockPredictionBase.interpretation });
    const fullPrediction: PredictionResult = {
      ...mockPredictionBase,
      summary: summaryResult.summary,
    };
    return { prediction: fullPrediction, error: null };
  } catch (e: unknown) {
    console.error("AI Summary Generation Error:", e);
    let errorMessage = "An unexpected error occurred during AI summary generation.";
    if (e instanceof ZodError) {
      errorMessage = "AI summary output validation failed: " + e.errors.map(err => `${err.path.join('.')} - ${err.message}`).join(', ');
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }
    
    // Return prediction without summary if AI fails
    const predictionWithoutSummary: PredictionResult = {
      ...mockPredictionBase,
      summary: "Summary could not be generated due to an error.",
    };
    return { prediction: predictionWithoutSummary, error: `AI summary generation failed: ${errorMessage}` };
  }
}
