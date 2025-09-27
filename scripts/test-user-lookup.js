// Test script to verify user lookup by username
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials - using the same as in the client files
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnjtpwlfaajxmhqqfomk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuanRwd2xmYWFqeG1ocXFmb21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODUxODgsImV4cCI6MjA3NDQ2MTE4OH0.fxRzn3zt-RW6VQFHmAZ6l7Dyj4TDWsGe05hjOnZXZkU';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugUserLookup() {
  try {
    console.log('Debugging user lookup...');
    
    // First, let's see all users with case-insensitive search
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        name,
        email
      `);

    if (allUsersError) {
      console.error('Supabase error fetching all users:', allUsersError);
      return;
    }

    console.log('All users in database:');
    if (allUsers && allUsers.length > 0) {
      allUsers.forEach(user => {
        console.log(`- ID: ${user.id}`);
        console.log(`  Username: "${user.username}"`);
        console.log(`  Name: "${user.name}"`);
        console.log(`  Email: "${user.email}"`);
        console.log('');
      });
    } else {
      console.log('No users found in database');
    }

    // Now let's try exact match for "alexander"
    console.log('Trying exact match for "alexander":');
    const { data: exactMatch, error: exactMatchError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        name,
        avatar,
        bio,
        background,
        background_video,
        background_audio
      `)
      .eq('username', 'alexander')
      .maybeSingle();

    if (exactMatchError) {
      console.error('Exact match error:', exactMatchError);
    } else if (exactMatch) {
      console.log('Exact match found:', exactMatch);
    } else {
      console.log('No exact match found');
    }

    // Try case-insensitive match
    console.log('Trying case-insensitive match for "alexander":');
    const { data: caseInsensitiveMatch, error: caseError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        name,
        avatar,
        bio,
        background,
        background_video,
        background_audio
      `)
      .ilike('username', 'alexander');

    if (caseError) {
      console.error('Case-insensitive match error:', caseError);
    } else if (caseInsensitiveMatch && caseInsensitiveMatch.length > 0) {
      console.log('Case-insensitive matches found:');
      caseInsensitiveMatch.forEach(user => {
        console.log(`- ${user.username} (${user.name})`);
      });
    } else {
      console.log('No case-insensitive matches found');
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

debugUserLookup();