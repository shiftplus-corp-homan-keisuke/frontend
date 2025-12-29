import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // For Electron: use relative paths
  assetPrefix: './',
  trailingSlash: true,
};

export default nextConfig;
