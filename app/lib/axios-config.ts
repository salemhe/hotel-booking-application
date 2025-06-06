import axios from 'axios';

const BASE_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // If we're already on the login page, don't trigger a redirect
      if (
        typeof window !== "undefined" &&
        !["/user-login", "/user-signup", "/forgot-password"].includes(window.location.pathname)
      ) {
        // We'll let the SessionManager handle the redirect
        // Just trigger a custom event that the SessionManager can listen to
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth-error"));
        }
      }
    }
    return Promise.reject(error);
  }
);


export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};


// Initialize token from localStorage if available
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
if (storedToken) {
  setAuthToken(storedToken);
}

