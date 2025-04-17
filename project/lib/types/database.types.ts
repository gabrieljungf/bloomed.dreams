export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          name: string
          credits: number
          email: string
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          credits?: number
          email: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          credits?: number
          email?: string
        }
      }
      dream_analyses: {
        Row: {
          id: string
          created_at: string
          user_id: string
          dream_content: string
          analysis: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          dream_content: string
          analysis: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          dream_content?: string
          analysis?: string
        }
      }
    }
  }
}