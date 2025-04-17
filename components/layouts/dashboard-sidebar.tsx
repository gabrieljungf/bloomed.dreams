"use client";

import { 
  Home,
  BookOpen,
  Brain,
  Trophy,
  Palette,
  TestTube,
  Network,
  Compass,
  User,
  Sparkles,
  X,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const navigationItems = [
    { name: 'Home', icon: Home, href: '/dashboard' },
    { name: 'Dream Journal', icon: BookOpen, href: '/dashboard/journal' },
    { name: 'Dream Decoder', icon: Brain, href: '/dashboard/decoder' },
    { name: 'Blooming Path', icon: Trophy, href: '/dashboard/path' },
    { type: 'divider', label: 'Coming Soon' },
    { name: 'Your Dreams on Canvas', icon: Palette, href: '/dashboard/canvas', soon: true },
    { name: 'Dream Lab', icon: TestTube, href: '/dashboard/lab', soon: true },
    { name: 'Collective Consciousness', icon: Network, href: '/dashboard/collective', soon: true },
    { name: 'Your Guide, Your Way', icon: Compass, href: '/dashboard/guide', soon: true },
    { type: 'divider', label: 'Personal' },
    { name: 'Bloom Space', icon: User, href: '/dashboard/space' }
  ];

  return (
    <>
      {open && (
        <div 
          className="mobile-menu-overlay"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed lg:fixed left-0 top-0 lg:top-16 bottom-0 w-[280px] lg:w-64 bg-black/40 backdrop-blur-sm border-r border-white/5 z-50 transition-transform duration-300 ease-in-out flex flex-col",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-3 lg:hidden border-b border-white/5">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-purple-300" />
            <span className="font-display text-base sm:text-lg text-white/90">BLOOMED DREAMS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-purple-300 hover:text-purple-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto mobile-scroll">
          <nav className="space-y-1.5">
            {navigationItems.map((item, index) => (
              'type' in item ? (
                <div key={index} className="mt-5 mb-2">
                  <div className="border-t border-purple-400/25 pt-4 pb-2">
                    <p className="text-xs font-display tracking-wider text-purple-300/60 uppercase px-4">
                      {item.label}
                    </p>
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[13px] group relative transition-all duration-300 font-display tracking-wide font-light border border-transparent",
                    pathname === item.href
                      ? "bg-purple-500/20 text-purple-200 border-purple-400/10 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                      : item.soon
                        ? "text-white/30 hover:text-white/50 hover:bg-purple-900/10"                      
                        : "text-white/60 hover:text-white/80 hover:bg-purple-900/25"
                  )}
                >
                   {item.icon && <item.icon className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-125 duration-500 ease-out flex-shrink-0",
                    item.soon ? "text-purple-400/40" : ""
                  )} />}
                  <span>{item.name}</span>
                  {item.soon && (
                    <span className="ml-auto text-[10px] bg-purple-500/15 px-2 py-0.5 rounded-full text-purple-300/90 font-display tracking-wider">
                      soon
                    </span>
                  )}
                  {pathname === item.href && (
                    <Sparkles className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/40" />
                  )}
                </Link>
              )
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}