"use client";

import { StarField } from './star-field';
import { BackgroundEffects } from './background-effects';

export function PageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050008] via-[#0F001A] to-[#050008] relative">
      {/* Background layers */}
      <div className="fixed inset-0">
        {/* Stars layer na base */}
        <div className="absolute inset-0 z-[0]">
          <StarField />
        </div>

        {/* Animated gradient por cima das estrelas */}
        <div className="absolute inset-0 z-[1]">
          <BackgroundEffects />
        </div>
        
        {/* Gradientes radiais por cima de tudo */}
        <div className="absolute inset-0 z-[2]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.08),transparent_40%)]" />
        </div>
      </div>
      
      {/* Content layer */}
      <div className="relative z-[3]">
        {children}
      </div>
    </div>
  );
}