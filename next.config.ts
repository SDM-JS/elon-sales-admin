import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
