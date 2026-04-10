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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      globalThis.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
