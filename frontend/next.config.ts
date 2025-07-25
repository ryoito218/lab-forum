import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites () {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development'
        ? 'http://backend:8000/:path*'
        : 'http://ipaddress:8000/:path*'
      }
    ]
  }
};

export default nextConfig;
