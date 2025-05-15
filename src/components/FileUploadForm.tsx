"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import type { PredictionResult } from '@/lib/types';

interface FileUploadFormProps {
  onUploadSuccess: (prediction: PredictionResult) => void;
  onUploadError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

export default function FileUploadForm({ onUploadSuccess, onUploadError, setIsLoading, isLoading }: FileUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv") {
        setSelectedFile(file);
        setFileName(file.name);
        onUploadError(""); // Clear previous errors
      } else {
        setSelectedFile(null);
        setFileName("");
        onUploadError("Invalid file type. Please select a CSV file.");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      onUploadError("Please select a CSV file to upload.");
      return;
    }

    setIsLoading(true);
    onUploadError(""); // Clear previous errors

    const formData = new FormData();
    formData.append('ecgFile', selectedFile);

    // This is where you would call your server action
    // For now, using a placeholder for the actual server action import and call
    const { processECGFile } = await import('@/app/actions'); 
    const result = await processECGFile(formData);

    if (result.error) {
      onUploadError(result.error);
      if (result.prediction) { // If there's a partial prediction despite an error (e.g. summary failed)
        onUploadSuccess(result.prediction);
      }
    } else if (result.prediction) {
      onUploadSuccess(result.prediction);
    } else {
      onUploadError("An unexpected error occurred."); // Should not happen if action is well-defined
    }
    
    setIsLoading(false);
    // Optionally reset file input after submission
    // setSelectedFile(null);
    // setFileName("");
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = "";
    // }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg" data-ai-hint="data import">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <UploadCloud className="h-7 w-7 text-primary" />
          Upload ECG Data
        </CardTitle>
        <CardDescription>Select a CSV file containing ECG signal data for analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ecgFile" className="text-base">ECG File (CSV)</Label>
            <Input
              id="ecgFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              disabled={isLoading}
            />
            {fileName && (
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <FileText className="mr-2 h-4 w-4" />
                <span>{fileName}</span>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || !selectedFile}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Analyze ECG Data"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
