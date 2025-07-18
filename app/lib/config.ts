export const API_BASE_URL = {
  development: "https://hotel-booking-app-backend-30q1.onrender.com/api",
  production:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://hotel-booking-app-backend-30q1.onrender.com/api",
};
export const FRONTEND_URL = {
  development: "http://localhost:3000",
  production:
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    "https://hotel-booking-application-omega.vercel.app",
};
export const getBaseUrl = () => {
  const env = process.env.NODE_ENV || "development";
  return API_BASE_URL[env as keyof typeof API_BASE_URL];
};
export const getFrontendUrl = () => {
  // For client-side, use current window location
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // For server-side, try environment variables first
  if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
    return process.env.NEXT_PUBLIC_FRONTEND_URL;
  }

  // Fallback to config based on NODE_ENV
  const env = process.env.NODE_ENV || "development";
  return FRONTEND_URL[env as keyof typeof FRONTEND_URL];
};
