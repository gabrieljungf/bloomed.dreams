"use client";

import { useAuth } from '@/components/auth/auth-provider';
import { DashboardNav } from './dashboard-nav';
import { StarField } from '@/components/star-field';

export function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#030014] relative">
      {/* Fundo estelar (camada de trás) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarField />
      </div>

      {/* Textura sutil (sobre as estrelas) */}
      <div className="noise-layer" />

      {/* Conteúdo (acima de tudo) */}
      <div className="relative z-20 flex flex-col h-screen">
        <DashboardNav />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}