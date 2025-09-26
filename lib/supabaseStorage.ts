// lib/supabaseStorage.ts
import { supabase } from '@/supabase/client'
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
        is_email_verified,
        links (id, created_at, user_id, url, title, icon, position)
      `)
      .eq('username', username)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return null
    }

    if (!data) return null

    // Sort links by position
    const links = (data.links as Link[] || []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

    return {
      _id: data.id,
      id: data.id,
      username: data.username,
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      background: data.background || '',
      isEmailVerified: data.is_email_verified || false,
      createdAt: data.created_at || new Date().toISOString(),
      links: links.map(link => ({
        id: link.id,
        url: link.url || '',
        title: link.title || '',
        icon: link.icon || '',
        position: link.position || 0
      }))
    }
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

export async function getUserById(id: string) {
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
        is_email_verified,
        password_hash,
        links (id, created_at, user_id, url, title, icon, position)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return null
    }

    if (!data) return null

    // Sort links by position
    const links = (data.links as Link[] || []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

    return {
      _id: data.id,
      id: data.id,
      username: data.username,
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      background: data.background || '',
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
    }
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

export async function createUser(email: string, password: string, username: string, name: string, background: string = '', ipAddress: string) {
  try {
    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmail) throw new Error('Email already registered')

    // Check if username already exists
    const { data: existingUsername } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUsername) throw new Error('Username already taken')

    const passwordHash = await bcrypt.hash(password, 12)

    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        username,
        name,
        background,
        password_hash: passwordHash,
        ip_address: ipAddress,
        is_email_verified: true
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return {
      id: data.id,
      email,
      username,
      name,
      background,
      isEmailVerified: true,
      createdAt: data.created_at
    }
  } catch (error: any) {
    console.error('Create user error:', error)
    throw new Error(error.message || 'Failed to create user')
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, name, email, avatar, bio, background, is_email_verified, created_at, password_hash')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return null
    }

    if (!data) return null

    return {
      _id: data.id,
      id: data.id,
      username: data.username,
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      background: data.background || '',
      isEmailVerified: data.is_email_verified || false,
      createdAt: data.created_at || new Date().toISOString(),
      passwordHash: data.password_hash
    }
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

export async function saveUserLinks(userId: string, links: any[]) {
  try {
    // Delete existing links for this user
    await supabase
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
        const { error } = await supabase
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
      background: updates.background?.trim() || ''
    }

    if (cleanedUpdates.username) {
      // Check if username is already taken by another user
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', cleanedUpdates.username)
        .neq('id', userId)
        .single()

      if (existing) throw new Error('Username already taken')
    }

    const { data, error } = await supabase
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
        is_email_verified,
        password_hash,
        links (id, created_at, user_id, url, title, icon, position)
      `)
      .single()

    if (error) throw new Error(error.message)

    if (!data) {
      console.error(`Failed to retrieve user after update for ID: ${userId}`)
      throw new Error('User not found after update')
    }

    // Sort links by position
    const links = (data.links as Link[] || []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

    return {
      _id: data.id,
      id: data.id,
      username: data.username,
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      background: data.background || '',
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
    }
  } catch (error: any) {
    console.error('Update profile error:', error)
    throw new Error(error.message || 'Failed to update profile')
  }
}