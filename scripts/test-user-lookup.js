// scripts/test-user-lookup.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

// Create Supabase client with service key (has higher privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUserLookup() {
  console.log('Testing user lookup...');
  
  try {
    // First, let's see what users exist in the database
    console.log('\n1. Listing all users (limited to 5):');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, email, username, name')
      .limit(5);
    
    if (allUsersError) {
      console.log('Error fetching users:', allUsersError.message);
    } else {
      console.log('Users found:', allUsers);
    }
    
    // If we have users, let's try to look up the first one by ID
    if (allUsers && allUsers.length > 0) {
      const firstUser = allUsers[0];
      console.log('\n2. Testing lookup by ID for user:', firstUser.email);
      
      const { data: userById, error: userByIdError } = await supabase
        .from('users')
        .select('id, email, username, name')
        .eq('id', firstUser.id)
        .maybeSingle();
      
      if (userByIdError) {
        console.log('Error looking up user by ID:', userByIdError.message);
      } else if (userById) {
        console.log('User found by ID:', userById);
      } else {
        console.log('No user found with ID:', firstUser.id);
      }
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testUserLookup();