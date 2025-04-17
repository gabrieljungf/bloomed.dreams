"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { MoonStar } from 'lucide-react';
import Link from 'next/link';
import { PageBackground } from '@/components/page-background';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  return (
    <PageBackground>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-sm w-full space-y-8">
          <div className="flex flex-col items-center space-y-2">
            <Link href="/" className="flex flex-col items-center space-y-1 group">
              <MoonStar className="text-purple-400/90 w-8 h-8 logo-glow group-hover:scale-110 transition-transform duration-300" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300/90 via-purple-400/90 to-purple-300/90 text-transparent bg-clip-text tracking-tight font-display">
                BLOOMED DREAMS
              </h1>
            </Link>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-white/5">
            {children}
          </div>
        </div>
      </div>
    </PageBackground>
  );
}