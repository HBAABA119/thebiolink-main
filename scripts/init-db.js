// scripts/init-db.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key available:', !!process.env.SUPABASE_SERVICE_KEY);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local file');
  console.log('\nPlease ensure you have set SUPABASE_SERVICE_KEY in your .env.local file');
  console.log('The service key is needed for admin operations');
  console.log('\nTo get your service key:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Go to Settings > API');
  console.log('3. Copy the service_role key (not the anon key)');
  console.log('4. Add it to your .env.local file as SUPABASE_SERVICE_KEY=your_service_key');
  process.exit(1);
}

// Create Supabase client with service key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeDatabase() {
  console.log('Initializing database...');
  console.log('Note: This script requires a Supabase service key for admin operations.');
  console.log('If you get "Invalid API key" errors, please check your service key.\n');
  
  try {
    // Inform user about manual setup
    console.log('=== DATABASE SETUP INSTRUCTIONS ===');
    console.log('The recommended way to set up the database is to manually execute the SQL schema in the Supabase SQL editor.');
    console.log('\nSteps:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Open the SQL Editor');
    console.log('3. Copy and paste the contents of supabase/schema.sql');
    console.log('4. Run the SQL commands');
    console.log('\nThis script is provided as a convenience but may not work in all environments.');
    console.log('===============================\n');
    
    // Try to create users table
    console.log('Attempting to create users table...');
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          email TEXT UNIQUE NOT NULL,
          username TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          avatar TEXT,
          bio TEXT,
          background TEXT,
          is_email_verified BOOLEAN DEFAULT false,
          password_hash TEXT NOT NULL,
          ip_address TEXT
        );
      `
    });
    
    if (usersError) {
      console.log('Note: Users table creation must be done in Supabase SQL editor');
      console.log('Error details:', usersError.message);
    } else {
      console.log('Users table created successfully');
    }
    
    // Try to create links table
    console.log('\nAttempting to create links table...');
    const { error: linksError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS links (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
          url TEXT NOT NULL,
          title TEXT NOT NULL,
          icon TEXT,
          position INTEGER DEFAULT 0
        );
      `
    });
    
    if (linksError) {
      console.log('Note: Links table creation must be done in Supabase SQL editor');
      console.log('Error details:', linksError.message);
    } else {
      console.log('Links table created successfully');
    }
    
    console.log('\nDatabase initialization completed!');
    console.log('\nIMPORTANT: Please manually execute the SQL schema in the Supabase SQL editor for complete setup.');
    console.log('File: supabase/schema.sql');
    
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.log('\nIMPORTANT: Please manually execute the SQL schema in the Supabase SQL editor for complete setup.');
    console.log('File: supabase/schema.sql');
    process.exit(1);
  }
}

// Check if we're running this script directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };