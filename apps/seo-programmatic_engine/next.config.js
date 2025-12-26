/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization to avoid SSR issues with client components
  experimental: {
    // Disable static optimization for all pages
  },

  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Disable static export for this app
  output: undefined,
};

module.exports = nextConfig;