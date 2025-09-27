import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { updateUserProfile, saveUserLinks, saveUserBadges } from '@/lib/supabaseStorage';

export async function PUT(request: NextRequest) {
  const sessionId = (await cookies()).get('biolink_session')?.value;
  if (!sessionId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { profile, links, badges } = await request.json();

    if (profile) {
      await updateUserProfile(sessionId, profile);
    }

    if (Array.isArray(links)) {
      const validatedLinks = links
        .filter(link => link.url?.trim() && link.title?.trim())
        .map((link) => ({
          id: link.id,
          url: link.url.trim(),
          title: link.title.trim(),
          icon: link.icon?.trim() || ''
        }));
      
      await saveUserLinks(sessionId, validatedLinks);
    }

    if (Array.isArray(badges)) {
      // Limit to maximum 3 badges
      const validBadges = badges.slice(0, 3);
      const validatedBadges = validBadges
        .filter(badge => badge.name?.trim())
        .map((badge) => ({
          id: badge.id,
          name: badge.name.trim(),
          description: badge.description?.trim() || '',
          icon: badge.icon?.trim() || ''
        }));
      
      await saveUserBadges(sessionId, validatedBadges);
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Update error:', error);
    return Response.json({ error: error.message || 'Failed to update data' }, { status: 400 });
  }
}