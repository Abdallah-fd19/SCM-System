import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Log every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  // Skip auth header for login/register
  if (token && !config.url.includes("/users/login/") && !config.url.includes("/users/register/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
