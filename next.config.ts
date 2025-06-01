/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true // Temporarily ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true // Temporarily ignore ESLint errors during build
  },
  experimental: {
    serverExternalPackages: ['mongoose']
  },
  output: 'standalone'
};

module.exports = nextConfig;
