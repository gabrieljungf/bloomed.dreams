// ARQUIVO ATUALIZADO: components/profile-menu.tsx

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
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
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        {/* A MUDANÇA ESTÁ AQUI: Usando size="icon" que define h-10 w-10 */}
        <Button 
          variant="avatar"
          size="icon" 
          className="relative rounded-full overflow-hidden border border-purple-500/20
            bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-indigo-500/20
            shadow-[0_0_10px_rgba(168,85,247,0.15)]"
        >
          {/* Ícone aumentado para h-5 w-5 para melhor proporção */}
          <User className="h-5 w-5 text-purple-200/90" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="min-w-[180px] max-w-[240px] bg-black/90 backdrop-blur-sm border-purple-500/20 text-purple-100"
        forceMount
      >
        <DropdownMenuLabel className="font-display tracking-wide py-2">
          <div className="space-y-0.5">
            <p className="text-xs text-purple-300/60 font-normal truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
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