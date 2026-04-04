import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Standardized to 3001 as confirmed by server main.ts
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
