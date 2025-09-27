-- Fix RLS policies to allow public read access for profile viewing
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can view their own links" ON links;
DROP POLICY IF EXISTS "Users can view their own badges" ON badges;

-- Create new policies that allow public read access
CREATE POLICY "Users are publicly visible" ON users
  FOR SELECT USING (true);

CREATE POLICY "User links are publicly visible" ON links
  FOR SELECT USING (true);

CREATE POLICY "User badges are publicly visible" ON badges
  FOR SELECT USING (true);

-- Keep the existing insert/update/delete policies
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can delete their own data" ON users
  FOR DELETE USING (id = auth.uid());

CREATE POLICY "Users can insert their own links" ON links
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own links" ON links
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own links" ON links
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own badges" ON badges
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own badges" ON badges
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own badges" ON badges
  FOR DELETE USING (user_id = auth.uid());