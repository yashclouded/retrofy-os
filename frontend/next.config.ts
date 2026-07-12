import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // During local development this will fallback to localhost:8000
    // On Vercel, we can set NEXT_PUBLIC_API_URL or API_URL to the Render backend URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://127.0.0.1:8000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
