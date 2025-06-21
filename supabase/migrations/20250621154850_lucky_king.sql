/*
  # Birthday Celebration App Database Schema

  1. New Tables
    - `celebrations`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `target_date` (timestamptz)
      - `creator_id` (uuid, references auth.users)
      - `is_public` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `photos`
      - `id` (uuid, primary key)
      - `celebration_id` (uuid, references celebrations)
      - `file_path` (text)
      - `file_name` (text)
      - `file_size` (integer)
      - `uploaded_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
    
    - `guestbook_messages`
      - `id` (uuid, primary key)
      - `celebration_id` (uuid, references celebrations)
      - `author_name` (text)
      - `message` (text)
      - `author_id` (uuid, references auth.users, nullable)
      - `created_at` (timestamptz)
    
    - `quiz_questions`
      - `id` (uuid, primary key)
      - `celebration_id` (uuid, references celebrations)
      - `question` (text)
      - `options` (jsonb)
      - `correct_answer` (integer)
      - `order_index` (integer)
      - `created_at` (timestamptz)
    
    - `quiz_responses`
      - `id` (uuid, primary key)
      - `celebration_id` (uuid, references celebrations)
      - `user_id` (uuid, references auth.users, nullable)
      - `responses` (jsonb)
      - `score` (integer)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and public access
    - Ensure proper data isolation between celebrations

  3. Storage
    - Create bucket for photo uploads
    - Set up proper access policies for file storage
*/

-- Create celebrations table
CREATE TABLE IF NOT EXISTS celebrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Birthday Celebration',
  description text,
  target_date timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  creator_id uuid REFERENCES auth.users(id),
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  celebration_id uuid REFERENCES celebrations(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create guestbook_messages table
CREATE TABLE IF NOT EXISTS guestbook_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  celebration_id uuid REFERENCES celebrations(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  message text NOT NULL,
  author_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  celebration_id uuid REFERENCES celebrations(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  correct_answer integer NOT NULL DEFAULT 0,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  celebration_id uuid REFERENCES celebrations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  responses jsonb NOT NULL DEFAULT '[]',
  score integer DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE celebrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Celebrations policies
CREATE POLICY "Anyone can view public celebrations"
  ON celebrations FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Users can create celebrations"
  ON celebrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their celebrations"
  ON celebrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Photos policies
CREATE POLICY "Anyone can view photos from public celebrations"
  ON photos FOR SELECT
  TO public
  USING (
    celebration_id IN (
      SELECT id FROM celebrations WHERE is_public = true
    )
  );

CREATE POLICY "Authenticated users can upload photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (
    celebration_id IN (
      SELECT id FROM celebrations WHERE is_public = true
    )
  );

-- Guestbook messages policies
CREATE POLICY "Anyone can view guestbook messages from public celebrations"
  ON guestbook_messages FOR SELECT
  TO public
  USING (
    celebration_id IN (
      SELECT id FROM celebrations WHERE is_public = true
    )
  );

CREATE POLICY "Anyone can add guestbook messages to public celebrations"
  ON guestbook_messages FOR INSERT
  TO public
  WITH CHECK (
    celebration_id IN (
      SELECT id FROM celebrations WHERE is_public = true
    )
  );

-- Quiz questions policies
CREATE POLICY "Anyone can view quiz questions from public celebrations"
  ON quiz_questions FOR SELECT
  TO public
  USING (
    celebration_id IN (
      SELECT id FROM celebrations WHERE is_public = true
    )
  );

CREATE POLICY "Creators can manage quiz questions"
  ON quiz_questions FOR ALL
  TO authenticated
  USING (
    celebration_id IN (
      SELECT id FROM celebrations WHERE creator_id = auth.uid()
    )
  );

-- Quiz responses policies
CREATE POLICY "Users can view their own quiz responses"
  ON quiz_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit quiz responses"
  ON quiz_responses FOR INSERT
  TO public
  WITH CHECK (
    celebration_id IN (
      SELECT id FROM celebrations WHERE is_public = true
    )
  );

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('celebration-photos', 'celebration-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for photos
CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'celebration-photos');

CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'celebration-photos');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_celebrations_target_date ON celebrations(target_date);
CREATE INDEX IF NOT EXISTS idx_photos_celebration_id ON photos(celebration_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_celebration_id ON guestbook_messages(celebration_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_celebration_id ON quiz_questions(celebration_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_celebration_id ON quiz_responses(celebration_id);

-- Create a default celebration for demo purposes
INSERT INTO celebrations (title, description, target_date, is_public)
VALUES (
  'Birthday Celebration',
  'Join us for an amazing birthday celebration filled with joy, laughter, and wonderful memories!',
  now() + interval '7 days',
  true
) ON CONFLICT DO NOTHING;

-- Add default quiz questions
DO $$
DECLARE
  celebration_id uuid;
BEGIN
  SELECT id INTO celebration_id FROM celebrations WHERE title = 'Birthday Celebration' LIMIT 1;
  
  IF celebration_id IS NOT NULL THEN
    INSERT INTO quiz_questions (celebration_id, question, options, correct_answer, order_index) VALUES
    (celebration_id, 'What makes this person special to you?', '["Their kindness", "Their humor", "Their wisdom", "All of the above"]', 3, 1),
    (celebration_id, 'What''s the best birthday gift for them?', '["Something handmade", "An experience", "Something practical", "A surprise"]', 1, 2),
    (celebration_id, 'How would you describe their personality?', '["Adventurous", "Caring", "Creative", "Inspiring"]', 3, 3)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;