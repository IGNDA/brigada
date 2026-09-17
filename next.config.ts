import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/brigada",
  assetPrefix: "/brigada",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
