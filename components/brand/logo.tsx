// FILE: src/components/brand/logo.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  imageWidthIntrinsic?: number; // Renomeado para clareza: esta é a dimensão original da imagem
  imageHeightIntrinsic?: number;
}

export function Logo({
  className = "",
  imageWidthIntrinsic = 90,  // Dimensão original da sua imagem para otimização do Next/Image
  imageHeightIntrinsic = 90,
}: LogoProps) {

  const displayFontClass = 'font-display-marcellus';
  const fontWeightClass = 'font-normal'; // Marcellus geralmente usa peso 400 (normal)

  return (
    <Link href="/" className={cn(
        'flex flex-col items-center group',
        'space-y-1 sm:space-y-2', // Espaçamento vertical menor no mobile, aumenta um pouco em 'sm'
        className
      )}>
      <div className={cn(
        "logo-image-container group-hover:scale-105 transition-transform duration-300",
        // Define um tamanho base menor para a imagem no mobile e aumenta em breakpoints maiores
        "w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] lg:w-[90px] lg:h-[90px]"
      )}>
        <Image
          src="/images/Logo-Bloomed-Dreams.png"
          alt="Bloomed Dreams Icon"
          width={imageWidthIntrinsic}  // Para Next.js otimizar
          height={imageHeightIntrinsic}
          priority
          className="w-full h-full object-contain" // Faz a imagem preencher o div container
        />
      </div>

      <h1
        className={cn(
          // Tamanhos de fonte responsivos: Começa menor e aumenta
          "text-3xl",                     // Base para mobile (ex: 30px)
          "sm:text-4xl",                  // Para telas 'sm' e acima (ex: 36px)
          "md:text-5xl",                  // Para telas 'md' e acima (ex: 48px)
          "lg:text-[58px]",            // Opcional para telas ainda maiores se text-5xl não for suficiente
          "bg-gradient-to-r from-purple-300/90 via-purple-400/90 to-purple-300/90 text-transparent bg-clip-text",
          "tracking-tight",               // Tracking 'tight' pode ser bom para títulos grandes
          displayFontClass,               // Aplica font-display-marcellus
          fontWeightClass                 // Aplica font-normal (para Marcellus)
        )}
      >
        bloomed dreams.
      </h1>

      <p className={cn(
        "font-light uppercase",
        "text-3xs sm:text-2xs", // Usa 'text-3xs' (8px) como base, e 'text-2xs' (10px) a partir de 'sm'
        "text-purple-300/75",
        "tracking-wider sm:tracking-[0.1em]",
        "leading-snug sm:leading-normal" // Pode querer ajustar leading também
      )}>
        Dream. Decode. Get bloomed.
      </p>
    </Link>
  );
}