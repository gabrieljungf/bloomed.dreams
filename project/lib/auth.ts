import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isMockSupabase } from './supabase';

// Mock auth responses for development
const mockAuthResponse = {
  data: { user: { id: '123', email: 'test@example.com', user_metadata: { name: 'Test User' } } },
  error: null
};

export async function resetPassword(email: string) {
  if (isMockSupabase) {
    return mockAuthResponse;
  }
  const supabase = createClientComponentClient();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function signIn(email: string, password: string) {
  if (isMockSupabase) {
    return mockAuthResponse;
  }
  const supabase = createClientComponentClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, name: string) {
  if (isMockSupabase) {
    return mockAuthResponse;
  }
  const supabase = createClientComponentClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
}

export async function signOut() {
  if (isMockSupabase) {
    return { error: null };
  }
  const supabase = createClientComponentClient();
  return supabase.auth.signOut();
}