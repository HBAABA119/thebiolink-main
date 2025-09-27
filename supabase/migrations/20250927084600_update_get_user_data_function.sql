-- Update the get_user_data function to work with the new badges table
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