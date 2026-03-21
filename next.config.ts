import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
