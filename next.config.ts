import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname:"res.cloudinary.com"}
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
