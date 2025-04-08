import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  swcMinify: false,
  transpilePackages: [
    "@electric-sql/pglite-react", // Optional
    "@electric-sql/pglite",
  ],
};

export default nextConfig;
