import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnjtpwlfaajxmhqqfomk.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuanRwd2xmYWFqeG1ocXFmb21rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg4NTE4OCwiZXhwIjoyMDc0NDYxMTg4fQ.-ZcJjpORp5h73vdkkFKZsXETaPXF_U14LVZ1yqfcGPo'

// Create Supabase client with service key for server-side operations
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)