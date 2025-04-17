"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { mockAuthResponse } from '@/lib/mocks/auth-mocks';
import { isMockSupabase } from '@/lib/config/supabase';
import { getSupabaseClient } from '@/lib/config/supabase-client';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (isMockSupabase) {
      setUser(mockAuthResponse.data.user as User);
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN') router.refresh();
      if (event === 'SIGNED_OUT') {
        router.refresh();
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const signIn = async (email: string, password: string) => {
    if (isMockSupabase) {
      setUser(mockAuthResponse.data.user as User);
      router.push('/dashboard');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    router.push('/dashboard');
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (isMockSupabase) {
      setUser(mockAuthResponse.data.user as User);
      router.push('/dashboard');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    if (error) throw error;
    router.push('/dashboard');
  };

  const signOut = async () => {
    if (isMockSupabase) {
      setUser(null);
      router.push('/');
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}