"use client";

import { ProfileMenu } from '@/components/profile-menu';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HeaderLogo } from '@/components/brand/header-logo';
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
      <div className="mx-auto h-14 px-4 sm:h-16 sm:px-6">
        <div className="relative flex h-full items-center justify-between md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-6 w-6 text-purple-200" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] border-r-white/10 bg-[#030014] p-0">
              <div className="border-b border-white/10 p-4">
                <HeaderLogo />
              </div>
              <nav className="flex flex-col gap-2 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'rounded-md p-3 text-base transition-colors',
                      link.soon
                        ? 'cursor-not-allowed text-purple-200/40'
                        : pathname === link.href
                          ? 'bg-purple-500/10 text-purple-100'
                          : 'text-purple-200/70 hover:bg-purple-500/10'
                    )}
                    onClick={(e) => {
                      if (link.soon) e.preventDefault();
                    }}
                  >
                    {link.name}
                    {link.soon && (
                      <span className="ml-2 rounded-full bg-purple-500/15 px-1.5 py-0.5 text-[10px] text-purple-300/60">
                        soon
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="absolute left-1/2 -translate-x-1/2">
            <HeaderLogo />
          </div>

          <ProfileMenu />
        </div>

        <div className="hidden h-full items-center justify-between md:flex">
          <div className="flex items-center gap-16">
            <HeaderLogo />
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'relative whitespace-nowrap py-2 text-sm font-light transition-colors',
                    link.soon
                      ? 'cursor-not-allowed text-purple-200/40'
                      : pathname === link.href
                        ? 'text-purple-100'
                        : 'text-purple-200/75 hover:text-purple-200/95'
                  )}
                  onClick={(e) => {
                    if (link.soon) e.preventDefault();
                  }}
                >
                  {link.name}
                  {link.soon && (
                    <span className="ml-2 rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] text-purple-300/60">
                      soon
                    </span>
                  )}
                  {pathname === link.href && !link.soon && (
                    <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-purple-300/80" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
