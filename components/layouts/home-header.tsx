// Em: components/layouts/home-header.tsx
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';
import { useAuth } from '@/components/auth/auth-provider'; // Importe o hook de autenticação
import { ArrowRight } from 'lucide-react';

export function HomeHeader() {
  const { user, loading } = useAuth();

  // Não renderiza nada enquanto carrega o estado de autenticação para evitar piscar a UI
  if (loading) {
    return <div className="h-[72px]" />; // Um placeholder de altura para evitar pulos de layout
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto flex items-center justify-between p-4 sm:p-6">
        {/* Usamos a variante 'small' da logo, que é mais apropriada para um header */}
        <Logo variant="small" />

        <nav>
          {user ? (
            // Se o usuário estiver logado
            <Link href="/dashboard">
              <Button 
                className="bg-purple-500/10 border border-purple-500/20 text-purple-200 hover:bg-purple-500/20"
                variant="outline"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            // Se o usuário NÃO estiver logado
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-purple-200/80 hover:text-purple-100 text-xs sm:text-sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  className="bg-purple-500/10 border border-purple-500/20 text-purple-200 hover:bg-purple-500/20 text-xs sm:text-sm"
                  variant="outline"
                  size="sm"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </motion.header>
  );
}