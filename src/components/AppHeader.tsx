
"use client";

import Link from 'next/link';
import { HeartPulse, Home, History, MessageSquare, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from 'react';

export default function AppHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClasses = (path: string, isMobile: boolean = false) => 
    cn(
      "font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 rounded-md",
      isMobile 
        ? "text-base py-3 px-3" 
        : "text-sm py-2 px-3",
      pathname === path ? "bg-primary/10 text-primary font-semibold" : ""
    );

  const commonNavLinks = (isMobile: boolean) => (
    <>
      <Link href="/" className={navLinkClasses("/", isMobile)} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        <Home className={cn("h-4 w-4", isMobile && "h-5 w-5")} /> 
        <span>Home</span>
      </Link>
      <Link href="/history" className={navLinkClasses("/history", isMobile)} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        <History className={cn("h-4 w-4", isMobile && "h-5 w-5")} /> 
        <span>History</span>
      </Link>
      <Link href="/chat" className={navLinkClasses("/chat", isMobile)} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        <MessageSquare className={cn("h-4 w-4", isMobile && "h-5 w-5")} /> 
        <span>Chat</span>
      </Link>
    </>
  );

  return (
    <header className="w-full py-3 bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          <HeartPulse className="h-8 w-8" />
          <h1 className="text-2xl font-bold">HeartView</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-4">
          {commonNavLinks(false)}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 sm:w-1/2 pt-0 px-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2 text-primary">
                   <HeartPulse className="h-7 w-7" />
                   HeartView
                </SheetTitle>
                 <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 p-4 mt-2">
                {/* By calling setIsMobileMenuOpen(false) in onClick, we ensure the sheet closes after navigation */}
                {/* SheetClose asChild could also be used around each Link for declarative closing */}
                {commonNavLinks(true)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
