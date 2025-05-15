
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/AppHeader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HeartView - ECG Analysis & Chat',
  description: 'Upload ECG data to predict heart conditions and chat with an AI assistant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background`} 
        suppressHydrationWarning={true}
      >
        <AppHeader />
        <main className="flex-grow w-full">
          {children}
        </main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t bg-card mt-auto">
          HeartView &copy; {new Date().getFullYear()} - For demonstration purposes only.
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
