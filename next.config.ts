import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@revarta/shared", "three"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
