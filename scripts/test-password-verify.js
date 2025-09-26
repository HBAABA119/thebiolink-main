// scripts/test-password-verify.js
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

async function testPasswordVerify() {
  console.log('Testing password verification...');
  
  try {
    // Look up a user using the service key
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
      
      // Try to verify a password (you'll need to know the actual password)
      console.log('\n2. Testing password verification:');
      console.log('Note: You need to know the actual password to test this properly');
      console.log('User password hash:', user.password_hash);
      
      // If you know the password, you can test it like this:
      // const isValid = await bcrypt.compare('actual_password_here', user.password_hash);
      // console.log('Password valid:', isValid);
    } else {
      console.log('No user found with that email');
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testPasswordVerify();