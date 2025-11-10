import type { NextConfig } from "next";

const config: NextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/AppData/**', '**/*.sock'],
    };
    return config;
  },
};

export default config;
