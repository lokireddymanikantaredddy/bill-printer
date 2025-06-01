/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true // Temporarily ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true // Temporarily ignore ESLint errors during build
  },
  output: 'standalone',
  webpack: (config: any) => {
    config.externals.push({
      'mongodb-client-encryption': 'mongodb-client-encryption',
      'mongoose': 'mongoose'
    });
    return config;
  },
  // Add proper handling for static pages
  trailingSlash: false,
  skipTrailingSlashRedirect: true
};

module.exports = nextConfig;
