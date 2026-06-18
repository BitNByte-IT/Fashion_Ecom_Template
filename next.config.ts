import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allow Google Drive images
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      // Allow Cloudinary if needed
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Allow any HTTPS image (useful during development)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
