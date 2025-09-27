// scripts/check-db-schema.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Use the service key to get full access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkSchema() {
  console.log('Checking database schema...');
  
  try {
    // Get table info
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('Error querying users table:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Users table columns:');
      Object.keys(data[0]).forEach(key => {
        console.log(`  - ${key}`);
      });
    } else {
      console.log('Users table is empty or does not exist');
    }
  } catch (error) {
    console.error('Schema check error:', error.message);
  }
}

checkSchema();