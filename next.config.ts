import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow loading product images from Unsplash securely
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
