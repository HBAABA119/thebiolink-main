// Script to apply the migration manually
// This script outputs the SQL needed to fix the database issues

console.log(`
To fix the database error, run the following SQL queries in your Supabase SQL Editor:

1. First, drop and recreate the badges table:
--------------------
DROP TABLE IF EXISTS badges CASCADE;

CREATE TABLE badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  position INTEGER DEFAULT 0
);

CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_badges_position ON badges(position);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges" ON badges
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own badges" ON badges
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own badges" ON badges
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own badges" ON badges
  FOR DELETE USING (user_id = auth.uid());
--------------------

2. Then, update the get_user_data function:
--------------------
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
--------------------

These queries will fix the foreign key relationship issue and refresh the schema cache.
`);