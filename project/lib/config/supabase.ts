import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { DEVELOPMENT_CONFIG } from './constants';

// Use development config in development, env vars in production
const supabaseUrl = process.env.NODE_ENV === 'development' 
  ? DEVELOPMENT_CONFIG.supabaseUrl 
  : process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseKey = process.env.NODE_ENV === 'development'
  ? DEVELOPMENT_CONFIG.supabaseKey
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export const isMockSupabase = process.env.NODE_ENV === 'development';