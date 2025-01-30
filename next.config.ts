import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  env: {
    NEXT_APP_API_URL: process.env.NEXT_APP_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  },
};

export default nextConfig;
