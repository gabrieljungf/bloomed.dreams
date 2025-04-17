import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// For development, use mock values if env vars are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project-id.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper to check if we're using mock credentials
export const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL;