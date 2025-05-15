
"use client";

import { useState, useEffect } from 'react';
import PredictionDisplayCard from "@/components/PredictionDisplayCard";
import PredictionHistoryItem from "@/components/PredictionHistoryItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PredictionResult } from '@/lib/types';
import { History as HistoryIcon, BarChart3, Inbox } from 'lucide-react'; // Renamed History to HistoryIcon to avoid conflict
import { Card } from '@/components/ui/card';

export default function HistoryPage() {
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResult | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure localStorage is accessed only on the client
    try {
      const storedHistory = localStorage.getItem('predictionHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory) as PredictionResult[];
        setPredictionHistory(parsedHistory);
        if (parsedHistory.length > 0 && !selectedPrediction) {
          // Optionally select the first item by default
          // setSelectedPrediction(parsedHistory[0]); 
        }
      }
    } catch (e) {
      console.error("Failed to parse prediction history from localStorage", e);
      localStorage.removeItem('predictionHistory'); // Clear corrupted data
    }
  }, [selectedPrediction]); // Rerun if selectedPrediction changes to ensure consistency, though primary load is once

  const handleSelectPredictionFromHistory = (prediction: PredictionResult) => {
    setSelectedPrediction(prediction);
    // Scroll to the top or to the display card for better UX
    // window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  if (!isClient) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex flex-col items-center space-y-6">
        <div className="flex items-center justify-center text-2xl font-semibold text-primary gap-2 mt-6 mb-4">
          <HistoryIcon className="h-7 w-7" />
          Prediction History
        </div>
        <p className="text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
      <Card className="w-full lg:w-1/3 shadow-lg" data-ai-hint="historical records list">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-primary">
            <HistoryIcon className="h-7 w-7" />
            History Log
          </h2>
          {predictionHistory.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-250px)] lg:h-[calc(100vh-200px)] w-full rounded-md pr-3">
              <div className="space-y-4">
                {predictionHistory.map((histPrediction) => (
                  <PredictionHistoryItem 
                    key={histPrediction.id} 
                    prediction={histPrediction} 
                    onSelectPrediction={handleSelectPredictionFromHistory}
                    isActive={selectedPrediction?.id === histPrediction.id}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="font-semibold">No history yet.</p>
              <p className="text-sm">Upload an ECG file on the Home page to see results here.</p>
            </div>
          )}
        </div>
      </Card>

      <div className="w-full lg:w-2/3 lg:sticky lg:top-24"> {/* Sticky for desktop */}
        {selectedPrediction ? (
          <section className="w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center text-primary flex items-center gap-2 justify-center">
              <BarChart3 className="h-7 w-7" />
              Selected Analysis Details
            </h2>
            <PredictionDisplayCard prediction={selectedPrediction} />
          </section>
        ) : (
          predictionHistory.length > 0 && (
            <Card className="w-full shadow-lg flex flex-col items-center justify-center p-8 min-h-[300px] bg-card" data-ai-hint="data placeholder">
               <BarChart3 className="h-16 w-16 text-primary/50 mb-4" />
              <p className="text-lg text-muted-foreground">Select an item from the history log to view details.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
