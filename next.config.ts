import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/brigada-ignda",
  assetPrefix: "/brigada-ignda",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
