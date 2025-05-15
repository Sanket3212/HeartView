"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { PredictionResult } from "@/lib/types";
import { HeartPulse, Lightbulb, FileText, CalendarDays, CheckCircle2, AlertTriangle } from "lucide-react";
import { format } from 'date-fns';

interface PredictionDisplayCardProps {
  prediction: PredictionResult;
}

export default function PredictionDisplayCard({ prediction }: PredictionDisplayCardProps) {
  const confidencePercentage = Math.round(prediction.confidenceScore * 100);
  const isConfident = prediction.confidenceScore > 0.8; // Example threshold

  return (
    <Card className="w-full max-w-lg shadow-xl" data-ai-hint="data analysis">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <HeartPulse className="h-7 w-7 text-primary" />
          ECG Analysis Result
        </CardTitle>
        <CardDescription>
          Prediction based on the uploaded ECG data from <span className="font-semibold">{prediction.fileName}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Predicted Condition</h3>
          <p className="text-xl font-bold text-primary">{prediction.diseaseType}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Confidence Score</h3>
          <div className="flex items-center gap-2">
            <Progress value={confidencePercentage} className="w-full h-3" />
            <span className={`font-semibold ${isConfident ? 'text-green-600' : 'text-orange-500'}`}>
              {confidencePercentage}%
            </span>
          </div>
           <Badge variant={isConfident ? "default" : "destructive"} className={`mt-1 ${isConfident ? 'bg-green-100 text-green-700 border-green-300' : 'bg-orange-100 text-orange-700 border-orange-300'}`}>
            {isConfident ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <AlertTriangle className="mr-1 h-3 w-3" />}
            {isConfident ? 'High Confidence' : 'Moderate Confidence'}
          </Badge>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            AI Generated Summary
          </h3>
          <p className="text-sm bg-secondary p-3 rounded-md text-secondary-foreground">{prediction.summary}</p>
        </div>

        {prediction.interpretation && (
           <div>
            <h3 className="text-sm font-medium text-muted-foreground">Detailed Interpretation (Mock)</h3>
            <p className="text-xs text-muted-foreground italic p-3 border rounded-md">{prediction.interpretation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between items-center">
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{prediction.fileName}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            <span>Analyzed: {format(new Date(prediction.timestamp), "PPpp")}</span>
          </div>
      </CardFooter>
    </Card>
  );
}
