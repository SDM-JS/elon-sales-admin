import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
=======
>>>>>>> b538eb3dcfd2330639bce82ed1cc4940d5f95cf2
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
