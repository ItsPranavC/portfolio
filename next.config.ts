import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      // Expo web exports are SPAs: serve their index.html at the clean base
      // path so expo-router sees "/" after stripping its baseUrl.
      { source: "/b3vo", destination: "/b3vo/index.html" },
      { source: "/campus", destination: "/campus/index.html" },
    ];
  },
};

export default nextConfig;
