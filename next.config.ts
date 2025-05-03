import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hotel-booking-app-backend-30q1.onrender.com",
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'http',
        hostname:'http://localhost:5000/uploads/'
      }
    ],
  },
};

export default nextConfig;
