import { supabase, isMockSupabase } from '../config/supabase';
import { mockDreamAnalyses } from '../mocks/profile-mocks';

export class DreamService {
  static async getDreamAnalyses(userId: string) {
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

  static async createDreamAnalysis(userId: string, dreamContent: string, analysis: string) {
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
}