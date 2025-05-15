import { HeartPulse } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="w-full py-6 bg-card shadow-md">
      <div className="container mx-auto flex items-center justify-center sm:justify-start">
        <HeartPulse className="h-10 w-10 text-primary mr-3" />
        <h1 className="text-3xl font-bold text-primary">HeartView</h1>
      </div>
    </header>
  );
}
