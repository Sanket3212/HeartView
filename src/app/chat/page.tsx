
"use client";

import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, User, Bot, AlertCircle } from "lucide-react";
import { askChatbot, type ChatInput, type ChatOutput } from '@/ai/flows/chat-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Added Avatar

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  // Initial greeting from bot
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Hello! I'm HeartView AI. How can I help you today with general questions about ECGs, heart health, or the HeartView app?",
        timestamp: new Date(),
      }
    ]);
  }, []);


  const handleSendMessage = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const chatInput: ChatInput = { message: userMessage.content };
      // If implementing history:
      // const historyForAI = messages.map(m => ({role: m.role, content: m.content}));
      // chatInput.history = historyForAI;

      const result: ChatOutput = await askChatbot(chatInput);
      
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (e: unknown) {
      console.error("Chatbot Error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred with the chatbot.";
      setError(errorMessage);
      // Optionally add an error message to the chat
      // const errorBotMessage: ChatMessage = {
      //   id: crypto.randomUUID(),
      //   role: 'assistant',
      //   content: "I'm sorry, I encountered an error. Please try again.",
      //   timestamp: new Date(),
      // };
      // setMessages(prevMessages => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const quickQuestions = [
    "What is an ECG?",
    "Tell me about Atrial Fibrillation.",
    "How does HeartView analyze data?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    // Trigger form submission logic directly
    // This requires handleSendMessage to not strictly rely on the event object
    // or to simulate a submission if needed.
    // For simplicity, we can just set the input value and let the user click send,
    // or call a modified submit logic.
    // Let's try to submit it directly.
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question.trim(),
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue(""); // Clear input after setting
    setIsLoading(true);
    setError(null);

    // Inline the rest of handleSendMessage logic for the quick question
    (async () => {
      try {
        const chatInput: ChatInput = { message: userMessage.content };
        const result: ChatOutput = await askChatbot(chatInput);
        const botMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (e: unknown) {
        console.error("Chatbot Error (Quick Question):", e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred with the chatbot.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    })();
  };


  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-var(--header-height)-var(--footer-height)-2rem)] md:h-[calc(100vh-var(--header-height)-var(--footer-height)-4rem)]"
         style={{'--header-height': '65px', '--footer-height': '57px'} as React.CSSProperties}} // Adjust these values based on actual header/footer height
    >
      <Card className="w-full max-w-2xl mx-auto flex flex-col flex-grow shadow-xl" data-ai-hint="chat interface">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bot className="h-6 w-6 text-primary" />
            Chat with HeartView AI
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 flex flex-col">
          <ScrollArea className="flex-grow p-4" viewportRef={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-2.5 shadow-md text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card border border-border text-card-foreground rounded-bl-none'
                    }`}
                  >
                    {message.content.split('\\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                     <p className={`text-xs mt-1.5 ${message.role === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                <div className="flex items-end gap-2 justify-start">
                  <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] rounded-xl px-4 py-3 shadow-md bg-card border text-card-foreground rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length <= 1 && ( // Show quick questions only if it's just the initial greeting
            <div className="p-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Or try a quick question:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map(q => (
                  <Button key={q} variant="outline" size="sm" onClick={() => handleQuickQuestion(q)} disabled={isLoading}>
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}


          {error && (
            <div className="p-4 border-t">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Chat Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="p-4 border-t bg-background/80">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow text-sm"
                disabled={isLoading}
                aria-label="Chat message input"
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

