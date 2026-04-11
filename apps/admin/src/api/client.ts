import axios from 'axios';

type EnvImportMeta = ImportMeta & {
  env?: {
    VITE_API_URL?: string;
  };
};

const baseURL = (import.meta as EnvImportMeta).env?.VITE_API_URL;

if (!baseURL) {
  throw new Error('VITE_API_URL is not configured');
}

const api = axios.create({
  baseURL,
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
