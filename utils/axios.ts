import { AuthService } from '@/services/auth.services';
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Attach token dynamically
API.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = AuthService.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          API.defaults.headers.common["x-api-secret"] = "diys684iyu2hpre87u386"
        }
      }
    return config;
});

export default API;
