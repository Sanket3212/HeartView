
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PredictionResult } from "@/lib/types";
import { FileText, CalendarDays, CheckCircle } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface PredictionHistoryItemProps {
  prediction: PredictionResult;
  onSelectPrediction: (prediction: PredictionResult) => void;
  isActive?: boolean;
}

export default function PredictionHistoryItem({ prediction, onSelectPrediction, isActive }: PredictionHistoryItemProps) {
  const confidencePercentage = Math.round(prediction.confidenceScore * 100);
  
  return (
    <Card 
      className={cn(
        "w-full shadow-md hover:shadow-lg transition-all cursor-pointer border-2",
        isActive ? "border-primary shadow-primary/20" : "border-transparent hover:border-primary/30",
        "group" 
      )}
      onClick={() => onSelectPrediction(prediction)}
      data-ai-hint="medical record"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectPrediction(prediction);}}
      role="button"
      aria-pressed={isActive}
    >
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <span className="truncate group-hover:text-primary transition-colors">{prediction.diseaseType}</span>
          {isActive && <CheckCircle className="h-5 w-5 text-primary ml-2 flex-shrink-0" />}
          {!isActive && 
            <Badge variant={prediction.confidenceScore > 0.8 ? "default" : "secondary"} className={cn(
              prediction.confidenceScore > 0.8 ? 'bg-green-100 text-green-700 border-green-300' : 'bg-orange-100 text-orange-700 border-orange-300',
              "text-xs"
            )}>
              {confidencePercentage}%
            </Badge>
          }
        </CardTitle>
        <CardDescription className="text-xs flex items-center gap-1 text-muted-foreground">
          <FileText className="h-3 w-3" /> 
          <span className="truncate">{prediction.fileName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2 px-4">
         <p className="text-xs text-muted-foreground truncate">{prediction.summary}</p>
      </CardContent>
      <div className="px-4 pb-3 text-xs text-muted-foreground flex items-center gap-1">
         <CalendarDays className="h-3 w-3" />
         <span>{format(new Date(prediction.timestamp), "MMM d, yyyy HH:mm")}</span>
      </div>
    </Card>
  );
}
