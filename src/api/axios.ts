// src/services/api.ts (exemplo)
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // vem do Render
export const api = axios.create({ baseURL: `${API_BASE_URL}/api` });
export const apiAdmin = axios.create({ baseURL: `${API_BASE_URL}/admin` });
apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
