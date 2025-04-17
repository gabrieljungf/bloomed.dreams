import { supabase, isMockSupabase } from '../config/supabase';
import { mockProfile } from '../mocks/profile-mocks';

export class ProfileService {
  static async createProfile(userId: string, name: string, email: string) {
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

  static async getProfile(userId: string) {
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

  static async updateCredits(userId: string, credits: number) {
    if (isMockSupabase) {
      return { data: { ...mockProfile, credits }, error: null };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ credits })
      .eq('id', userId);
    
    if (error) throw error;
  }
}