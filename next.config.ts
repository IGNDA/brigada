import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isDev ? "" : "/brigada",
  assetPrefix: isDev ? "" : "/brigada",
  trailingSlash: !isDev,
  images: {
    unoptimized: true,
  },
  ...(isDev && {
    allowedDevOrigins: ["192.168.0.101"],
  }),
};

export default nextConfig;
