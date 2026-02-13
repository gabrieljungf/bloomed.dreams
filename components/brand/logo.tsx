// Em: components/brand/logo.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'large' | 'small'; // Prop para controlar o tamanho
}

export function Logo({ className = "", variant = 'large' }: LogoProps) {
  const isLarge = variant === 'large';
  const displayFontClass = 'font-display-marcellus';
  const fontWeightClass = 'font-normal';

  // --- LÓGICA DE TAMANHO REFINADA ---
  // A imagem na variante 'large' agora é maior, mas o texto continua igual.
  const imageContainerSize = isLarge ? "w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px]" : "w-[60px] h-[60px]";
  const imageIntrinsicSize = isLarge ? 100 : 60; // Tamanho para otimização do Next/Image

  // O tamanho do texto permanece o mesmo de antes.
  const titleSize = isLarge ? "text-4xl sm:text-5xl md:text-6xl" : "text-4xl";
  const subtitleSize = isLarge ? "text-3xs sm:text-2xs" : "text-3xs";

  return (
    <Link 
      href="/" 
      className={cn(
        'flex flex-col items-center group',
        isLarge ? 'space-y-1 sm:space-y-2' : 'space-y-1',
        className
    )}>
      <div className={cn(
        "logo-image-container group-hover:scale-105 transition-transform duration-300",
        imageContainerSize
      )}>
        <Image
          src="/images/Logo-Bloomed-Dreams.png"
          alt="Bloomed Dreams Icon"
          width={imageIntrinsicSize}
          height={imageIntrinsicSize}
          priority
          className="w-full h-full object-contain"
        />
      </div>

      <h1 className={cn(
          titleSize,
          "bg-gradient-to-r from-purple-300/90 via-purple-400/90 to-purple-300/90 text-transparent bg-clip-text",
          "tracking-tight",
          displayFontClass,
          fontWeightClass
      )}>
        bloomed dreams.
      </h1>

      <p className={cn(
        "font-light uppercase",
        subtitleSize,
        "text-purple-300/75",
        "tracking-wider sm:tracking-[0.1em]",
        "leading-snug sm:leading-normal"
      )}>
        Dream. Decode. Get bloomed.
      </p>
    </Link>
  );
}