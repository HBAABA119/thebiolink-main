// scripts/test-user-insert.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

// Create Supabase client with service key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUserInsert() {
  console.log('Testing user insertion...');
  
  try {
    // Try to insert a test user
    const testUser = {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      password_hash: 'test_hash_value',
      is_email_verified: true
    };
    
    console.log('Inserting test user:', testUser);
    
    const { data, error } = await supabase
      .from('users')
      .insert(testUser)
      .select()
      .single();
    
    if (error) {
      console.log('Insert error:', error);
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
    } else {
      console.log('Insert successful:', data);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testUserInsert();