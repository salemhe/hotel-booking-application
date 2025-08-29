import axios from "axios";
import { AuthService } from "./services/auth.service";

// const NEXT_PUBLIC_BASE_URL =
//   "https://hotel-booking-app-backend-30q1.onrender.com/api/";


const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

API.defaults.headers.common["x-api-secret"] = "diys684iyu2hpre87u386";

// Attach token dynamically
API.interceptors.request.use(async (config) => {
  let token = await AuthService.getToken();
  if (typeof window !== "undefined" && (!token || token.length < 10)) {
    token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("vendor-token") ||
      null;
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Ensure cookies and secret header are present on every request
  config.withCredentials = true;
  config.headers["x-api-secret"] = "diys684iyu2hpre87u386";
  return config;
});

export default API;
