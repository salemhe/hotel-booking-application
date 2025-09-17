import axios from "axios";

const NEXT_PUBLIC_BASE_URL =
  "https://hotel-booking-app-backend-30q1.onrender.com/api";

const API = axios.create({
  baseURL: NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default API;
