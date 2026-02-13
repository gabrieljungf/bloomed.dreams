// Em: components/auth/auth-prompt.tsx
"use client";

import Link from 'next/link';
import { useAuth } from './auth-provider';
import { ArrowRight } from 'lucide-react';

export function AuthPrompt() {
  const { user, loading } = useAuth();

  // Não renderiza nada enquanto carrega para evitar "piscar"
  if (loading) {
    return <div className="h-10" />; // Placeholder de altura
  }

  return (
    <div className="text-center mt-8 p-4 border-t border-purple-500/10 w-full max-w-md mx-auto">
      {user ? (
        // Mensagem para usuário LOGADO
        <div className="space-y-2">
          <p className="text-sm text-purple-200/80">Welcome back, Dreamer.</p>
          <Link href="/dashboard" className="inline-flex items-center text-md font-semibold text-purple-300 hover:text-purple-100 transition-colors">
            Go to your Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        // Mensagem para VISITANTE
        <p className="text-xs text-purple-300/70">
          Want to save your dreams and discover patterns?{' '}
          <Link href="/login" className="font-semibold text-purple-300 hover:text-purple-100 underline underline-offset-2 transition-colors">
            Login
          </Link>
          {' or '}
          <Link href="/signup" className="font-semibold text-purple-300 hover:text-purple-100 underline underline-offset-2 transition-colors">
            Create an Account
          </Link>.
        </p>
      )}
    </div>
  );
}