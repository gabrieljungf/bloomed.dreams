// ARQUIVO ATUALIZADO E RESPONSIVO: components/brand/header-logo.tsx

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function HeaderLogo() {
  return (
    <Link 
      href="/dashboard" 
      className="inline-flex items-center gap-2 sm:gap-3 group"
    >
      <Image
        src="/images/Logo-Bloomed-Dreams.png" // Certifique-se que o caminho da imagem está correto
        alt="Bloomed Dreams Mushroom Logo"
        width={36}
        height={36}
        className="flex-shrink-0" // Impede que a imagem seja espremida
      />
      
      {/* 
        A MÁGICA ESTÁ AQUI:
        - text-xl: Tamanho da fonte em telas pequenas.
        - sm:text-2xl: A fonte aumenta em telas um pouco maiores.
        - whitespace-nowrap: Proíbe o navegador de quebrar a linha.
      */}
      <h1 className={cn(
        "font-display-marcellus text-white/90 tracking-normal leading-none",
        "text-xl sm:text-2xl", 
        "whitespace-nowrap"
      )}>
        bloomed dreams.
      </h1>
    </Link>
  );
}