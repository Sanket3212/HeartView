"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PredictionResult } from "@/lib/types";
import { FileText, CalendarDays } from "lucide-react";
import { format } from 'date-fns';

interface PredictionHistoryItemProps {
  prediction: PredictionResult;
  onSelectPrediction: (prediction: PredictionResult) => void;
}

export default function PredictionHistoryItem({ prediction, onSelectPrediction }: PredictionHistoryItemProps) {
  const confidencePercentage = Math.round(prediction.confidenceScore * 100);
  
  return (
    <Card 
      className="w-full shadow-md hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onSelectPrediction(prediction)}
      data-ai-hint="medical record"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{prediction.diseaseType}</span>
          <Badge variant={prediction.confidenceScore > 0.8 ? "default" : "secondary"} className={prediction.confidenceScore > 0.8 ? 'bg-green-100 text-green-700 border-green-300' : 'bg-orange-100 text-orange-700 border-orange-300'}>
            {confidencePercentage}%
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs flex items-center gap-1">
          <FileText className="h-3 w-3" /> {prediction.fileName}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
         <p className="text-xs text-muted-foreground truncate">{prediction.summary}</p>
      </CardContent>
      <div className="px-6 pb-3 text-xs text-muted-foreground flex items-center gap-1">
         <CalendarDays className="h-3 w-3" />
         <span>{format(new Date(prediction.timestamp), "MMM d, yyyy HH:mm")}</span>
      </div>
    </Card>
  );
}
