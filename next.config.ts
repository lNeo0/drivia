import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/img/:path*',
        destination: 'https://upload.wikimedia.org/:path*',
      },
    ]
  },
};

export default nextConfig;
