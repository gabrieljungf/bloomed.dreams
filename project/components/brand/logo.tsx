"use client";

import { MoonStar } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex flex-col items-center space-y-1 group ${className}`}>
      <MoonStar className="text-purple-400/90 w-12 h-12 logo-glow group-hover:scale-110 transition-transform duration-300" />
      <h1 className="text-[52px] font-bold bg-gradient-to-r from-purple-300/90 via-purple-400/90 to-purple-300/90 text-transparent bg-clip-text tracking-tight font-display">
        BLOOMED DREAMS
      </h1>
      <p className="text-[10px] font-light tracking-[0.1em] leading-[1.6] uppercase text-purple-200/60">
        Dream. Decode. Get bloomed.
      </p>
    </Link>
  );
}