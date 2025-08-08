import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時のESLintを無効化（開発時は有効）
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
