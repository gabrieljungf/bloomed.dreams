// Em: app/(auth)/layout.tsx
"use client";

import { PageBackground } from '@/components/page-background';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Este layout agora apenas cria o fundo e centraliza o conteúdo.
  // A logo e o card serão responsabilidade dos componentes filhos (LoginForm, SignupForm).
  return (
    <PageBackground>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-sm w-full bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10">
          {children}
        </div>
      </div>
    </PageBackground>
  );
}