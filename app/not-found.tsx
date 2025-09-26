'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Log the 404 error for analytics
    console.log('404 Page Not Found');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
          <Link 
            href="/auth/login" 
            className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}