import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/boutique",
        destination: "/shop",
      },
      {
        source: "/boutique/:slug*",
        destination: "/shop/:slug*",
      },
    ];
  },
};

export default nextConfig;
