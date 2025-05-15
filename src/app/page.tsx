
"use client";

import { useState, useEffect } from 'react';
import FileUploadForm from "@/components/FileUploadForm";
import PredictionDisplayCard from "@/components/PredictionDisplayCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { PredictionResult } from '@/lib/types';
import { AlertCircle, XCircle, HeartPulse } from 'lucide-react'; // Added HeartPulse import

const MAX_HISTORY_ITEMS = 10; // Limit the number of history items

export default function HeartViewPage() {
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the most recent prediction from history on initial mount, if any
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('predictionHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory) as PredictionResult[];
        if (parsedHistory.length > 0) {
          // setCurrentPrediction(parsedHistory[0]); // Optionally display the latest from history
        }
      }
    } catch (e) {
      console.error("Failed to parse prediction history from localStorage on main page", e);
    }
  }, []);


  const handleUploadSuccess = (prediction: PredictionResult) => {
    setCurrentPrediction(prediction); // Display this new prediction

    // Update history in localStorage
    try {
      const storedHistory = localStorage.getItem('predictionHistory');
      let currentLocalHistory: PredictionResult[] = [];
      if (storedHistory) {
        currentLocalHistory = JSON.parse(storedHistory) as PredictionResult[];
      }
      const updatedHistory = [prediction, ...currentLocalHistory];
      const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem('predictionHistory', JSON.stringify(trimmedHistory));
    } catch (e) {
      console.error("Failed to update prediction history in localStorage", e);
      // setError("Could not save prediction to history."); // Optional: notify user
    }
    
    setError(null); // Clear previous errors
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };
  
  const clearError = () => {
    setError(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center space-y-8">
      {error && (
        <Alert variant="destructive" className="w-full max-w-lg relative">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <button onClick={clearError} className="absolute top-2 right-2 p-1 rounded-md hover:bg-destructive/20">
            <XCircle className="h-5 w-5" />
          </button>
        </Alert>
      )}

      <FileUploadForm
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />

      {isLoading && (
        <div className="text-center text-muted-foreground">
          <p>Analyzing your ECG data...</p>
        </div>
      )}

      {currentPrediction && !isLoading && (
        <section className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Current Analysis</h2>
          <PredictionDisplayCard prediction={currentPrediction} />
        </section>
      )}

      {!currentPrediction && !isLoading && !error && (
         <div className="text-center text-muted-foreground mt-8 p-6 border rounded-lg shadow-sm bg-card w-full max-w-lg" data-ai-hint="welcome message app description">
            <HeartPulse className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Welcome to HeartView</h2>
            <p>Upload your ECG data (CSV file) to get an AI-powered analysis and insights into potential heart conditions.</p>
            <p className="mt-2 text-sm">Navigate to the <span className="font-semibold text-primary">History</span> page to see past analyses or try our <span className="font-semibold text-primary">Chat</span> assistant.</p>
        </div>
      )}
    </div>
  );
}
