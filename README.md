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
4. Set up the database (see [DATABASE_SETUP.md](DATABASE_SETUP.md))
5. Run the development server: `pnpm dev`

## Database Setup

See the detailed [DATABASE_SETUP.md](DATABASE_SETUP.md) guide for complete instructions.

Quick summary:
1. Create a Supabase project
2. Get your API keys from the Supabase dashboard
3. Update your `.env.local` file with the credentials
4. Execute the SQL schema in the Supabase SQL editor

## Deployment

### Vercel

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy!

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Your Supabase service key (for admin operations)
- `NEXTAUTH_SECRET` - A random string for NextAuth.js
- `NEXTAUTH_URL` - Your application URL (e.g., https://linkspark-seven.vercel.app)

## Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)

## License

MIT