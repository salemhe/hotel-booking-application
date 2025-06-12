import axios from "axios";
import { AuthService } from "./services/auth.service";

const NEXT_PUBLIC_BASE_URL =
  "https://hotel-booking-app-backend-30q1.onrender.com/api/";

const API = axios.create({
  baseURL: NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token dynamically
API.interceptors.request.use(async (config) => {
  const token = await AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    API.defaults.headers.common["x-api-secret"] = "diys684iyu2hpre87u386";
  }
  return config;
});

export default API;
