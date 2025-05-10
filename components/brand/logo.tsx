// FILE: src/components/brand/logo.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export function Logo({
  className = "",
  imageWidth = 90,  // Você pode ajustar este valor padrão
  imageHeight = 90, // Você pode ajustar este valor padrão
}: LogoProps) {

  // --- CONFIGURAÇÃO DA FONTE PARA O TÍTULO ---
  // Para testar Cormorant Garamond (com bold, se o peso 700 foi carregado no layout.tsx):
  // const displayFontClass = 'font-display-cormorant';
  // const fontWeightClass = 'font-bold';

  // Para testar Marcellus (geralmente sem bold, pois só tem peso 400):
  const displayFontClass = 'font-display-marcellus';
  const fontWeightClass = 'font-normal'; // Ou 'font-normal' se quiser ser explícito. Remova 'font-bold' do h1 abaixo se usar Marcellus.

  return (
    <Link href="/" className={cn('flex flex-col items-center', className)}>
        <Image
          src="/images/Logo-Bloomed-Dreams.png" // Verifique se este caminho está correto
          alt="Bloomed Dreams Icon"
          width={imageWidth}
          height={imageHeight}
          priority // Bom para o logo na página inicial
        />

      <h1
        className={cn(
          "text-[66px] bg-gradient-to-r from-purple-300/90 via-purple-400/90 to-purple-300/90 text-transparent bg-clip-text tracking-tight",
          displayFontClass,
          fontWeightClass 
        )}
      >
        bloomed dreams.
      </h1>
      <p className="text-2xs font-light tracking-[0.15em] leading-[0.1] uppercase text-purple-300/70">
        Dream. Decode. Get bloomed.
      </p>
    </Link>
  );
}