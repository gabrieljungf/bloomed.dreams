"use client";

import { useAuth } from '@/components/auth-provider';

export function DashboardHeader(): JSX.Element {
  const { user } = useAuth();
  const name: string = user?.user_metadata?.name || 'Dreamer';

  return (
    <div className="flex flex-col items-center space-y-3">
      <h1 className="text-4xl font-display text-purple-100 tracking-tight">
        Welcome back, {name}
      </h1>
      <p className="text-sm text-purple-200/70 font-light">
        Your dreams are whispering... shall we listen?
      </p>
    </div>
  );
}