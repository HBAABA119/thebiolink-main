-- LinkSpark Database Schema
-- This schema should be executed in the Supabase SQL Editor

-- Drop existing tables if they exist (for clean setup)
-- NOTE: Only run this if you want to reset your database!
-- DROP TABLE IF EXISTS links CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS badges CASCADE;

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  background TEXT,
  background_video TEXT,
  background_audio TEXT,
  is_email_verified BOOLEAN DEFAULT false,
  password_hash TEXT NOT NULL,
  ip_address TEXT
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT,
  position INTEGER DEFAULT 0
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  position INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON links(position);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_position ON badges(position);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can delete their own data" ON users
  FOR DELETE USING (id = auth.uid());

-- Create policies for links table
CREATE POLICY "Users can view their own links" ON links
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own links" ON links
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own links" ON links
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own links" ON links
  FOR DELETE USING (user_id = auth.uid());

-- Create policies for badges table
CREATE POLICY "Users can view their own badges" ON badges
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own badges" ON badges
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own badges" ON badges
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own badges" ON badges
  FOR DELETE USING (user_id = auth.uid());

-- Create a function to get user data with links and badges
-- Note: This function requires proper permissions to work
CREATE OR REPLACE FUNCTION get_user_data(user_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT row_to_json(u)
    FROM (
      SELECT 
        u.id,
        u.created_at,
        u.email,
        u.username,
        u.name,
        u.avatar,
        u.bio,
        u.background,
        u.background_video,
        u.background_audio,
        u.is_email_verified,
        (
          SELECT json_agg(l ORDER BY l.position)
          FROM links l
          WHERE l.user_id = u.id
        ) AS links,
        (
          SELECT json_agg(b ORDER BY b.position)
          FROM badges b
          WHERE b.user_id = u.id
        ) AS badges
      FROM users u
      WHERE u.id = user_id
    ) u
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;