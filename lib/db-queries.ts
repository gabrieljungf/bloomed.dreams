import { supabase, isMockSupabase } from './supabase';

// Mock data for development
const mockProfile = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  credits: 5
};

const mockDreamAnalyses = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    user_id: '123',
    dream_content: 'Test dream content',
    analysis: 'Test analysis'
  }
];

export async function createProfile(userId: string, name: string, email: string) {
  if (isMockSupabase) {
    return { data: mockProfile, error: null };
  }

  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      name,
      email,
      credits: 5
    });
  
  if (error) throw error;
}

export async function getProfile(userId: string) {
  if (isMockSupabase) {
    return { data: mockProfile, error: null };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getDreamAnalyses(userId: string) {
  if (isMockSupabase) {
    return { data: mockDreamAnalyses, error: null };
  }

  const { data, error } = await supabase
    .from('dream_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createDreamAnalysis(userId: string, dreamContent: string, analysis: string) {
  if (isMockSupabase) {
    return { data: mockDreamAnalyses[0], error: null };
  }

  const { error } = await supabase
    .from('dream_analyses')
    .insert({
      user_id: userId,
      dream_content: dreamContent,
      analysis: analysis
    });
  
  if (error) throw error;
}

export async function updateCredits(userId: string, credits: number) {
  if (isMockSupabase) {
    return { data: { ...mockProfile, credits }, error: null };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ credits })
    .eq('id', userId);
  
  if (error) throw error;
}