// Test script to verify user lookup using the same approach as getUserByUsername
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials - using the same as in the client files
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnjtpwlfaajxmhqqfomk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuanRwd2xmYWFqeG1ocXFmb21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODUxODgsImV4cCI6MjA3NDQ2MTE4OH0.fxRzn3zt-RW6VQFHmAZ6l7Dyj4TDWsGe05hjOnZXZkU';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugUserLookup(username) {
  try {
    console.log(`Debugging user lookup for: ${username}`);
    
    // First, let's try a simple select without joins
    console.log('Trying simple select without joins...');
    const { data: simpleData, error: simpleError } = await supabase
      .from('users')
      .select('id, username, name, email')
      .eq('username', username);

    if (simpleError) {
      console.error('Simple select error:', simpleError);
    } else {
      console.log('Simple select results:', simpleData);
    }
    
    // Now try with maybeSingle
    console.log('Trying maybeSingle...');
    const { data: singleData, error: singleError } = await supabase
      .from('users')
      .select('id, username, name, email')
      .eq('username', username)
      .maybeSingle();

    if (singleError) {
      console.error('MaybeSingle error:', singleError);
    } else {
      console.log('MaybeSingle result:', singleData);
    }
    
    // Try case-insensitive search
    console.log('Trying case-insensitive search...');
    const { data: ilikeData, error: ilikeError } = await supabase
      .from('users')
      .select('id, username, name, email')
      .ilike('username', username);

    if (ilikeError) {
      console.error('ILIKE error:', ilikeError);
    } else {
      console.log('ILIKE results:', ilikeData);
    }
    
    // Try with service key
    console.log('Trying with service key...');
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuanRwd2xmYWFqeG1ocXFmb21rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg4NTE4OCwiZXhwIjoyMDc0NDYxMTg4fQ.-ZcJjpORp5h73vdkkFKZsXETaPXF_U14LVZ1yqfcGPo';
    const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: serviceData, error: serviceError } = await supabaseServer
      .from('users')
      .select('id, username, name, email')
      .eq('username', username)
      .maybeSingle();

    if (serviceError) {
      console.error('Service key error:', serviceError);
    } else {
      console.log('Service key result:', serviceData);
    }
  } catch (error) {
    console.error('Debug error:', error);
  }
}

// Test with the username we know exists
debugUserLookup('alexander');