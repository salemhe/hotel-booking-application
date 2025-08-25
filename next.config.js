/** @type {import('next').NextConfig} */
const nextConfig = {
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
  experimental: {
    useLightningcss: false
  },
};

module.exports = nextConfig;
