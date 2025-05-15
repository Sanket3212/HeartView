
"use client";

import Link from 'next/link';
import { HeartPulse, Home, History, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AppHeader() {
  const pathname = usePathname();

  const navLinkClasses = (path: string) => 
    cn(
      "text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 py-2 px-3 rounded-md",
      pathname === path ? "bg-primary/10 text-primary font-semibold" : ""
    );

  return (
    <header className="w-full py-3 bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          <HeartPulse className="h-8 w-8" />
          <h1 className="text-2xl font-bold">HeartView</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className={navLinkClasses("/")}>
            <Home className="h-4 w-4" /> 
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link href="/history" className={navLinkClasses("/history")}>
            <History className="h-4 w-4" /> 
            <span className="hidden sm:inline">History</span>
          </Link>
          <Link href="/chat" className={navLinkClasses("/chat")}>
            <MessageSquare className="h-4 w-4" /> 
            <span className="hidden sm:inline">Chat</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
