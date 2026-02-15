"use client";

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function HeaderLogo() {
  return (
    <Link href="/dashboard" className="group inline-flex items-center gap-2 sm:gap-3">
      <Image
        src="/images/Logo-Bloomed-Dreams.png"
        alt="Bloomed Dreams Mushroom Logo"
        width={30}
        height={30}
        className="shrink-0 sm:h-9 sm:w-9"
      />

      <h1
        className={cn(
          'whitespace-nowrap font-display-marcellus leading-none tracking-normal text-white/90',
          'text-lg sm:text-2xl'
        )}
      >
        bloomed dreams.
      </h1>
    </Link>
  );
}
