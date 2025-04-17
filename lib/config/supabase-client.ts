import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DEVELOPMENT_CONFIG } from './constants';

export function getSupabaseClient() {
  return createClientComponentClient({
    supabaseUrl: process.env.NODE_ENV === 'development' 
      ? DEVELOPMENT_CONFIG.supabaseUrl 
      : process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NODE_ENV === 'development'
      ? DEVELOPMENT_CONFIG.supabaseKey
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}