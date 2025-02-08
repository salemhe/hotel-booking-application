import axios from 'axios';

const BASE_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    console.log("Setting Auth Token:", token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    console.log("Removing Auth Token")
    delete api.defaults.headers.common["Authorization"]
  }
}
