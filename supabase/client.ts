import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnjtpwlfaajxmhqqfomk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuanRwd2xmYWFqeG1ocXFmb21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODUxODgsImV4cCI6MjA3NDQ2MTE4OH0.fxRzn3zt-RW6VQFHmAZ6l7Dyj4TDWsGe05hjOnZXZkU'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)