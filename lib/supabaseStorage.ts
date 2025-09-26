// lib/supabaseStorage.ts
import { supabase } from '@/supabase/client'
import { supabaseServer } from '@/supabase/serverClient'
import bcrypt from 'bcryptjs'
import { User, Link } from '@/supabase/types'

// --- User Functions ---

export async function getUserByUsername(username: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        created_at,
        email,
        username,
        name,
        avatar,
        bio,
        background,
        background_video,
        background_audio,
        is_email_verified,
        links (id, created_at, user_id, url, title, icon, position)
      `)
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    if (!data) return null;

    // Sort links by position
    const links = (data.links as Link[] || []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return {
      _id: data.id,
      id: data.id,
      username: data.username,
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      background: data.background || '',
      backgroundVideo: data.background_video || '',
      backgroundAudio: data.background_audio || '',
      isEmailVerified: data.is_email_verified || false,
      createdAt: data.created_at || new Date().toISOString(),
      links: links.map(link => ({
        id: link.id,
        url: link.url || '',
        title: link.title || '',
        icon: link.icon || '',
        position: link.position || 0
      }))
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    // Use server client for user lookup during authentication
    const { data, error } = await supabaseServer
      .from('users')
      .select(`
        id,
        created_at,
        email,
        username,
        name,
        avatar,
        bio,
        background,
        background_video,
        background_audio,
        is_email_verified,
        password_hash,
        links (id, created_at, user_id, url, title, icon, position)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    if (!data) return null;

    // Sort links by position
    const links = (data.links as Link[] || []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return {
      _id: data.id,
      id: data.id,
      username: data.username,
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      background: data.background || '',
      backgroundVideo: data.background_video || '',
      backgroundAudio: data.background_audio || '',
      isEmailVerified: data.is_email_verified || false,
      createdAt: data.created_at || new Date().toISOString(),
      passwordHash: data.password_hash,
      links: links.map(link => ({
        id: link.id,
        url: link.url || '',
        title: link.title || '',
        icon: link.icon || '',
        position: link.position || 0
      }))
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function createUser(email: string, password: string, username: string, name: string, background: string = '', backgroundVideo: string = '', backgroundAudio: string = '', ipAddress: string) {
  try {
    // Check if email already exists
    const { data: existingEmail, error: emailError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (emailError) {
      console.error('Email check error:', emailError);
      throw new Error('Database error during email check');
    }

    if (existingEmail) throw new Error('Email already registered');

    // Check if username already exists
    const { data: existingUsername, error: usernameError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (usernameError) {
      console.error('Username check error:', usernameError);
      throw new Error('Database error during username check');
    }

    if (existingUsername) throw new Error('Username already taken');

    const passwordHash = await bcrypt.hash(password, 12);

    // Use server client for insert operation
    const { data, error } = await supabaseServer
      .from('users')
      .insert({
        email,
        username,
        name,
        background,
        background_video: backgroundVideo,
        background_audio: backgroundAudio,
        password_hash: passwordHash,
        ip_address: ipAddress,
        is_email_verified: true
      })
      .select()
      .single(); // This should be fine as we expect exactly one result after insert

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      email,
      username,
      name,
      background,
      backgroundVideo,
      backgroundAudio,
      isEmailVerified: true,
      createdAt: data.created_at
    };
  } catch (error: any) {
    console.error('Create user error:', error);
    throw new Error(error.message || 'Failed to create user');
  }
}

export async function getUserByEmail(email: string) {
  try {
    // Use server client for user lookup during authentication
    const { data, error } = await supabaseServer
      .from('users')
      .select('id, username, name, email, avatar, bio, background, background_video, background_audio, is_email_verified, created_at, password_hash')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    if (!data) return null;

    return {
      _id: data.id,
      id: data.id,
      username: data.username,
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      background: data.background || '',
      backgroundVideo: data.background_video || '',
      backgroundAudio: data.background_audio || '',
      isEmailVerified: data.is_email_verified || false,
      createdAt: data.created_at || new Date().toISOString(),
      passwordHash: data.password_hash
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function saveUserLinks(userId: string, links: any[]) {
  try {
    // Delete existing links for this user
    await supabaseServer
      .from('links')
      .delete()
      .eq('user_id', userId)

    if (links.length > 0) {
      const linksToInsert = links.map((link: any, index: number) => ({
        user_id: userId,
        url: link.url?.trim() || '',
        title: link.title?.trim() || '',
        icon: link.icon?.trim() || '',
        position: index
      }))

      const validLinks = linksToInsert.filter(link => link.url && link.title)

      if (validLinks.length > 0) {
        const { error } = await supabaseServer
          .from('links')
          .insert(validLinks)

        if (error) throw new Error(error.message)
      }
    }
  } catch (error: any) {
    console.error('Save links error:', error)
    throw new Error(error.message || 'Failed to save links')
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  try {
    const cleanedUpdates = {
      name: updates.name?.trim() || '',
      username: updates.username?.trim().toLowerCase() || '',
      avatar: updates.avatar?.trim() || '',
      bio: updates.bio?.trim() || '',
      background: updates.background?.trim() || '',
      background_video: updates.backgroundVideo?.trim() || '',
      background_audio: updates.backgroundAudio?.trim() || ''
    };

    if (cleanedUpdates.username) {
      // Check if username is already taken by another user
      const { data: existing, error: existingError } = await supabase
        .from('users')
        .select('id')
        .eq('username', cleanedUpdates.username)
        .neq('id', userId)
        .maybeSingle();

      if (existingError) {
        console.error('Username check error:', existingError);
        throw new Error('Database error during username check');
      }

      if (existing) throw new Error('Username already taken');
    }

    const { data, error } = await supabaseServer
      .from('users')
      .update(cleanedUpdates)
      .eq('id', userId)
      .select(`
        id,
        created_at,
        email,
        username,
        name,
        avatar,
        bio,
        background,
        background_video,
        background_audio,
        is_email_verified,
        password_hash,
        links (id, created_at, user_id, url, title, icon, position)
      `)
      .single(); // This should be fine as we expect exactly one result after update

    if (error) throw new Error(error.message);

    if (!data) {
      console.error(`Failed to retrieve user after update for ID: ${userId}`);
      throw new Error('User not found after update');
    }

    // Sort links by position
    const links = (data.links as Link[] || []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return {
      _id: data.id,
      id: data.id,
      username: data.username,
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      background: data.background || '',
      backgroundVideo: data.background_video || '',
      backgroundAudio: data.background_audio || '',
      isEmailVerified: data.is_email_verified || false,
      createdAt: data.created_at || new Date().toISOString(),
      passwordHash: data.password_hash,
      links: links.map(link => ({
        id: link.id,
        url: link.url || '',
        title: link.title || '',
        icon: link.icon || '',
        position: link.position || 0
      }))
    };
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
}
