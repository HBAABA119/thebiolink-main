# LinkSpark Database Setup Guide

This guide explains how to properly set up the Supabase database for LinkSpark.

## Prerequisites

1. A Supabase account and project
2. Your Supabase project URL and API keys

## Setup Instructions

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - Project URL
   - `anon` key (public key)
   - `service_role` key (secret key)

### 2. Configure Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# Next.js Secret (generate a random string)
NEXTAUTH_SECRET=your_nextauth_secret

# Application URL
NEXTAUTH_URL=http://localhost:3000
```

### 3. Set Up Database Schema

#### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Open the SQL Editor from the left sidebar
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" to execute the schema

#### Option B: Using the Initialization Script

1. Ensure you have set the `SUPABASE_SERVICE_KEY` in your `.env.local` file
2. Run the initialization script:
   ```bash
   pnpm init-db
   ```

Note: The initialization script may not work in all environments. The SQL editor method is more reliable.

### 4. Verify Database Setup

You can test your database connection by running:

```bash
pnpm test-db
```

### 5. Manual Verification

To manually verify your database setup:

1. Go to your Supabase project dashboard
2. Open the Table Editor
3. You should see two tables:
   - `users`
   - `links`

## Troubleshooting

### Common Issues

1. **"Invalid API key" errors**: Make sure you're using the `service_role` key for admin operations, not the `anon` key.

2. **"Table doesn't exist" errors**: Ensure you've executed the schema SQL in the Supabase SQL editor.

3. **RLS (Row Level Security) issues**: Make sure RLS is enabled on both tables and policies are created.

### Testing the Setup

To verify everything is working:

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to http://localhost:3000
3. Try signing up for a new account
4. Check that data is being stored in your Supabase tables

## Schema Details

### Users Table

```sql
CREATE TABLE users (
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
```

### Links Table

```sql
CREATE TABLE links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT,
  position INTEGER DEFAULT 0
);
```

## Security Notes

1. The `service_role` key should never be exposed in client-side code
2. RLS policies ensure users can only access their own data
3. Passwords are hashed using bcrypt before storage