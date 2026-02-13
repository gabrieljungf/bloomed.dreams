// ARQUIVO NOVO: components/layouts/mobile-sidebar.tsx

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'Journal', href: '/dashboard' },
  { name: 'Decoder', href: '/dashboard/decoder', soon: true },
  { name: 'Blooming Path', href: '/dashboard/path', soon: true },
];

export function MobileSidebar() {
  const pathname = usePathname();
  
  return (
    // Escondido em telas 'md' e maiores
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6 text-purple-200" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#030014] border-r-white/10 p-0">
          <div className="p-6 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-300" />
              <span className="font-display-marcellus text-lg text-white">BLOOMED DREAMS</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-base p-3 rounded-md transition-colors relative",
                  link.soon
                    ? "text-purple-200/40 cursor-not-allowed"
                    : pathname === link.href
                      ? "text-purple-100 bg-purple-500/10"
                      : "text-purple-200/70 hover:bg-purple-500/10"
                )}
                onClick={(e) => { if (link.soon) e.preventDefault(); }}
              >
                {link.name}
                {link.soon && <span className="ml-2 text-[10px] bg-purple-500/15 px-1.5 py-0.5 rounded-full text-purple-300/60">soon</span>}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}