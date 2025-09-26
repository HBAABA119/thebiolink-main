// scripts/test-login.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

// Create Supabase client with anon key (like the client-side code)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('Testing login process...');
  
  try {
    // Try to look up the user by email using the anon key
    console.log('\n1. Looking up user with email: aayan.b.asim@gmail.com');
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, name, password_hash')
      .eq('email', 'aayan.b.asim@gmail.com')
      .maybeSingle();
    
    if (error) {
      console.log('Error looking up user:', error.message);
    } else if (user) {
      console.log('User found:', user);
    } else {
      console.log('No user found with that email');
    }
    
    // Try with the test user
    console.log('\n2. Looking up test user with email: test@example.com');
    
    const { data: testUser, error: testUserError } = await supabase
      .from('users')
      .select('id, email, username, name, password_hash')
      .eq('email', 'test@example.com')
      .maybeSingle();
    
    if (testUserError) {
      console.log('Error looking up test user:', testUserError.message);
    } else if (testUser) {
      console.log('Test user found:', testUser);
    } else {
      console.log('No test user found with that email');
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testLogin();