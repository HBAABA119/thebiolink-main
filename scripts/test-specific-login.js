// scripts/test-specific-login.js
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
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

async function testSpecificLogin() {
  console.log('Testing specific login for aayan.b.asim@gmail.com...');
  
  try {
    // Look up the user using the service key
    console.log('\n1. Looking up user with email: aayan.b.asim@gmail.com');
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, name, password_hash')
      .eq('email', 'aayan.b.asim@gmail.com')
      .maybeSingle();
    
    if (error) {
      console.log('Error looking up user:', error.message);
      return;
    } else if (user) {
      console.log('User found:', user);
      console.log('Password hash:', user.password_hash);
      
      // Let's also check what the login route would see
      console.log('\n2. Testing what the login route would see (using anon key):');
      
      const { createClient } = require('@supabase/supabase-js');
      const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      
      const { data: anonUser, error: anonError } = await supabaseAnon
        .from('users')
        .select('id, email, username, name, password_hash')
        .eq('email', 'aayan.b.asim@gmail.com')
        .maybeSingle();
      
      if (anonError) {
        console.log('Anon key error:', anonError.message);
      } else if (anonUser) {
        console.log('Anon key found user:', anonUser);
      } else {
        console.log('Anon key: No user found (this is expected due to RLS)');
      }
      
    } else {
      console.log('No user found with that email');
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testSpecificLogin();