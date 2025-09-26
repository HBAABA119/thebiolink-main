/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for static sites
  output: 'standalone',
  
  // Ensure proper asset handling
  webpack: (config) => {
    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Image optimization (if you add images later)
  images: {
    domains: ['media.giphy.com', 'example.com'], // Add any domains you use for images
  },
  
  // Ensure proper trailing slashes
  trailingSlash: false,
};

module.exports = nextConfig;