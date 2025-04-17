"use client";

import { useAuth } from '@/components/auth-provider';
import { ProfileMenu } from '@/components/profile-menu';
import { Menu, Moon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardNavProps {
  onMenuClick: () => void;
}

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm bg-black/40">
      <div className="h-16 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-full">
          {/* Left section */}
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5 text-purple-300" />
            </Button>
            
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <Moon className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-display text-lg text-white/90 tracking-wide hidden sm:inline">
                BLOOMED DREAMS
              </span>
            </Link>
          </div>

          {/* Right section - using flex-1 to balance the left section */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
            <Button 
              onClick={() => {/* Will be connected to chat widget */}}
              className="bg-gradient-to-r from-purple-500/80 to-indigo-500/80 
                hover:from-purple-500/90 hover:to-indigo-500/90
                text-white font-medium px-0.5 sm:px-6
                rounded-full shadow-lg shadow-purple-500/20
                hover:shadow-purple-500/30
                transition-all duration-300 border border-white/10
                hover:border-white/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline whitespace-nowrap">Record Dream</span>
            </Button>
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}