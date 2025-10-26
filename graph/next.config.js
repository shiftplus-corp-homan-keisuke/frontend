/** @type {import('next').NextConfig} */
const nextConfig = {
  // WSL環境でのファイル監視問題を解決
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // Next.js 15の開発インジケーター設定
  devIndicators: {
    position: 'bottom-right',
  },
  // 追加の開発設定
  env: {
    NEXT_SHOW_BUILD_ACTIVITY: 'true',
  },
};

module.exports = nextConfig;