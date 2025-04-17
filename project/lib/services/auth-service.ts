import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isMockSupabase } from '../config/supabase';
import { mockAuthResponse } from '../mocks/auth-mocks';

export class AuthService {
  static async resetPassword(email: string) {
    if (isMockSupabase) {
      return mockAuthResponse;
    }
    const supabase = createClientComponentClient();
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }

  static async signIn(email: string, password: string) {
    if (isMockSupabase) {
      return mockAuthResponse;
    }
    const supabase = createClientComponentClient();
    return supabase.auth.signInWithPassword({ email, password });
  }

  static async signUp(email: string, password: string, name: string) {
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

  static async signOut() {
    if (isMockSupabase) {
      return { error: null };
    }
    const supabase = createClientComponentClient();
    return supabase.auth.signOut();
  }
}