import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5270/api',
});

export const apiAdmin = axios.create({
  baseURL: 'http://localhost:5270/admin',
});


apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});