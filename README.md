# LinkSpark

Create your perfect link-in-bio page in seconds. Free, open-source, and privacy-focused.

## Features

- 🔥 Lightning Fast - Built with Next.js for optimal performance
- 🔒 Secure & Private - Your data is encrypted and never shared
- 💸 Free Forever - No hidden fees or premium features
- 🎨 Customizable - Add your own background GIFs and styling
- 📱 Mobile Responsive - Looks great on all devices

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env.local` and fill in your values
4. Run the development server: `pnpm dev`

## Deployment

### Vercel

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy!

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXTAUTH_SECRET` - A random string for NextAuth.js
- `NEXTAUTH_URL` - Your application URL (e.g., https://linkspark.vercel.app)

## Database Setup

This project uses Supabase as its database. To set up the database:

1. Create the tables by running the SQL commands in `supabase/schema.sql`
2. The schema includes:
   - `users` table for storing user information
   - `links` table for storing user links
   - Indexes for better performance
   - Row Level Security (RLS) policies

## Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)

## License

MIT