// Script to create a test user
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Supabase credentials - using the same as in the client files
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnjtpwlfaajxmhqqfomk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuanRwd2xmYWFqeG1ocXFmb21rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg4NTE4OCwiZXhwIjoyMDc0NDYxMTg4fQ.-ZcJjpORp5h73vdkkFKZsXETaPXF_U14LVZ1yqfcGPo';

// Create Supabase client with service key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugDatabase() {
  try {
    console.log('Debugging database connection...');
    
    // Test database connection by getting table info
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('count()', { count: 'exact' });

    if (tablesError) {
      console.error('Database connection error:', tablesError);
      return;
    }

    console.log('Database connection successful');
    console.log('Users table count query result:', tables);
  } catch (error) {
    console.error('Debug error:', error);
  }
}

async function createTestUser() {
  try {
    const email = 'alexander@example.com';
    const username = 'alexander';
    const name = 'Alexander Tester';
    const password = 'password123';
    
    console.log(`Creating test user: ${username}`);
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing user:', checkError);
      return;
    }

    if (existingUser) {
      console.log('User already exists with ID:', existingUser.id);
      
      // Let's try to get the full user data
      const { data: fullUserData, error: fullUserError } = await supabase
        .from('users')
        .select('*')
        .eq('id', existingUser.id)
        .maybeSingle();
        
      if (fullUserError) {
        console.error('Error getting full user data:', fullUserError);
      } else {
        console.log('Full user data:', fullUserData);
      }
      
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        username,
        name,
        password_hash: passwordHash,
        is_email_verified: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return;
    }

    console.log('User created successfully:', {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email
    });
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run debug first, then create user
debugDatabase().then(() => {
  createTestUser();
});