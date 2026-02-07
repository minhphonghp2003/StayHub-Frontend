import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      // Add your API domain for base64/uploaded images if needed
      {
        protocol: process.env.NEXT_PUBLIC_API_URL?.startsWith('https') ? 'https' : 'http',
        hostname: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').hostname,
      },
    ],
  },

};

export default nextConfig;
