-- Fix badges table foreign key relationship
-- First, drop the table if it exists with incorrect schema
DROP TABLE IF EXISTS badges CASCADE;

-- Recreate badges table with proper foreign key relationship
CREATE TABLE badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  position INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_badges_position ON badges(position);

-- Enable Row Level Security (RLS)
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Create policies for badges table
CREATE POLICY "Users can view their own badges" ON badges
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own badges" ON badges
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own badges" ON badges
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own badges" ON badges
  FOR DELETE USING (user_id = auth.uid());