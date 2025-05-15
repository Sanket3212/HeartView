"use client";

import { useState, useEffect } from 'react';
import FileUploadForm from "@/components/FileUploadForm";
import PredictionDisplayCard from "@/components/PredictionDisplayCard";
import PredictionHistoryItem from "@/components/PredictionHistoryItem";
import AppHeader from "@/components/AppHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PredictionResult } from '@/lib/types';
import { History, AlertCircle, XCircle } from 'lucide-react';

const MAX_HISTORY_ITEMS = 10; // Limit the number of history items

export default function HeartViewPage() {
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage on initial mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('predictionHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory) as PredictionResult[];
        setPredictionHistory(parsedHistory);
        // Set the most recent history item as current prediction if desired, or leave currentPrediction null
        // if (parsedHistory.length > 0) {
        //   setCurrentPrediction(parsedHistory[0]);
        // }
      } catch (e) {
        console.error("Failed to parse prediction history from localStorage", e);
        localStorage.removeItem('predictionHistory'); // Clear corrupted data
      }
    }
  }, []);

  // Update localStorage whenever predictionHistory changes
  useEffect(() => {
    if (predictionHistory.length > 0 || localStorage.getItem('predictionHistory')) {
      localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
    }
  }, [predictionHistory]);

  const handleUploadSuccess = (prediction: PredictionResult) => {
    setCurrentPrediction(prediction);
    setPredictionHistory(prevHistory => {
      const updatedHistory = [prediction, ...prevHistory];
      // Limit history size
      return updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    });
    setError(null); // Clear previous errors
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    // Do not clear current prediction on error, user might want to see previous one
  };

  const handleSelectPredictionFromHistory = (prediction: PredictionResult) => {
    setCurrentPrediction(prediction);
    // Optionally, scroll to top or to the prediction display card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const clearError = () => {
    setError(null);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center space-y-8">
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

        {currentPrediction && (
          <section className="w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Current Analysis</h2>
            <PredictionDisplayCard prediction={currentPrediction} />
          </section>
        )}

        {predictionHistory.length > 0 && (
          <section className="w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 justify-center text-primary">
              <History className="h-7 w-7" />
              Prediction History
            </h2>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-card shadow-sm">
              <div className="space-y-4">
                {predictionHistory.map((histPrediction) => (
                  <PredictionHistoryItem 
                    key={histPrediction.id} 
                    prediction={histPrediction} 
                    onSelectPrediction={handleSelectPredictionFromHistory}
                  />
                ))}
              </div>
            </ScrollArea>
          </section>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t mt-auto">
        HeartView &copy; {new Date().getFullYear()} - For demonstration purposes only.
      </footer>
    </div>
  );
}
