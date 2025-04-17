"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Bell, HelpCircle } from 'lucide-react';

export function ProfileMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Handle body class when dropdown opens/closes
  useEffect(() => {
   
  }, [isOpen]);

  if (!user) return null;
  
  // Get first letter of name or email
  const getInitial = () => {
    const name = user.user_metadata?.name || user.email || 'User';
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="avatar"
          className="relative h-10 w-10 rounded-full overflow-hidden border border-purple-500/20
            bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-indigo-500/20
            font-display text-base font-medium shadow-[0_0_10px_rgba(168,85,247,0.15)]"
        >
          <span className="text-purple-200 drop-shadow-[0_2px_3px_rgba(168,85,247,0.3)]">
            {getInitial()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="min-w-[180px] max-w-[240px] bg-black/90 backdrop-blur-sm border-purple-500/20 text-purple-100"
        forceMount
      >
        <DropdownMenuLabel className="font-display tracking-wide py-2">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-purple-200 truncate">
              {user.user_metadata?.name || 'User'}
            </p>
            <p className="text-xs text-purple-300/60 font-normal truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <DropdownMenuItem className="flex items-center gap-3 text-[13px] py-2 cursor-pointer group">
          <Settings className="w-4 h-4 text-purple-300/70 group-hover:text-purple-200" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-3 text-[13px] py-2 cursor-pointer group">
          <Bell className="w-4 h-4 text-purple-300/70 group-hover:text-purple-200" />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-3 text-[13px] py-2 cursor-pointer group">
          <HelpCircle className="w-4 h-4 text-purple-300/70 group-hover:text-purple-200" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="flex items-center gap-3 text-[13px] py-2 cursor-pointer group text-red-400 focus:text-red-400"
        >
          <LogOut className="w-4 h-4 group-hover:text-red-300" />
          <span className="group-hover:text-red-300">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}