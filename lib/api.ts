import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Don't redirect on login endpoint itself (avoid redirect loop)
        const url = (error.config?.url || '');
        if (!url.includes('/auth/login')) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth-store');
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const earlyAccess = {
  signup: (data: { name: string; email: string; instagram_handle?: string; message?: string }) =>
    axiosInstance.post('/early_access', data),
};

export default axiosInstance;
