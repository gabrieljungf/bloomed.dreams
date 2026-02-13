// ARQUIVO ATUALIZADO: components/layouts/dashboard-nav.tsx

"use client";

import { ProfileMenu } from '@/components/profile-menu';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HeaderLogo } from '@/components/brand/header-logo';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function DashboardNav() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dream Journal', href: '/dashboard' },
    { name: 'Decoder', href: '/dashboard/decoder', soon: true },
    { name: 'Blooming Path', href: '/dashboard/path', soon: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-gradient-to-b from-purple-950/40 to-black/80 backdrop-blur-sm">
      {/* Container principal agora usa Grid no mobile e Flex no desktop */}
      <div className="px-4 sm:px-6 h-14 sm:h-16 mx-auto grid grid-cols-3 items-center md:flex md:justify-between">
        
        {/* --- Seção Esquerda (Logo e Nav Desktop / Menu Mobile) --- */}
        <div className="justify-self-start flex items-center gap-8">
          {/* Menu Mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-6 w-6 text-purple-200" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#030014] border-r-white/10 p-0 w-[280px]">
                <div className="p-4 border-b border-white/10">
                    <HeaderLogo />
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        href={link.href} 
                        className={cn(
                          "text-base p-3 rounded-md transition-colors",
                          link.soon ? "text-purple-200/40 cursor-not-allowed" :
                          pathname === link.href ? "text-purple-100 bg-purple-500/10" :
                          "text-purple-200/70 hover:bg-purple-500/10"
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
          
          {/* Logo e Nav Desktop */}
          <div className="hidden md:flex items-center gap-16">
            <HeaderLogo />
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={cn(
                    "font-light transition-colors relative py-2 text-sm whitespace-nowrap",
                    link.soon 
                      ? "text-purple-200/40 cursor-not-allowed" 
                      : pathname === link.href 
                        ? "text-purple-100" 
                        : "text-purple-200/75 hover:text-purple-200/95"
                  )} 
                  onClick={(e) => { if (link.soon) e.preventDefault(); }}
                >
                  {link.name}
                  {link.soon && (
                    <span className="ml-2 text-[10px] bg-purple-500/15 px-2 py-0.5 rounded-full text-purple-300/60">soon</span>
                  )}
                  {pathname === link.href && !link.soon && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-purple-300/80"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* --- Seção Central (Apenas para o Logo no Mobile) --- */}
        <div className="justify-self-center md:hidden">
          <HeaderLogo />
        </div>

        {/* --- Seção Direita (Ícone de Perfil) --- */}
        <div className="justify-self-end">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
