import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://vtrstudioapi.onrender.com/api',
});

export const apiAdmin = axios.create({
  baseURL: 'https://vtrstudioapi.onrender.com/admin',
});


apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});