-- Add background_video and background_audio columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS background_video TEXT,
ADD COLUMN IF NOT EXISTS background_audio TEXT;