import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "",
  assetPrefix: "",
  trailingSlash: !isDev,
  images: {
    unoptimized: true,
  },
  ...(isDev && {
    allowedDevOrigins: ["192.168.0.101"],
  }),
};

export default nextConfig;
