import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Celebration {
  id: string;
  title: string;
  description?: string;
  target_date: string;
  creator_id?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  celebration_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  uploaded_by?: string;
  created_at: string;
}

export interface GuestbookMessage {
  id: string;
  celebration_id: string;
  author_name: string;
  message: string;
  author_id?: string;
  admin_reply?: string;
  reply_timestamp?: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  celebration_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  order_index: number;
  created_at: string;
}

export interface QuizResponse {
  id: string;
  celebration_id: string;
  user_id?: string;
  responses: number[];
  score: number;
  completed_at: string;
}