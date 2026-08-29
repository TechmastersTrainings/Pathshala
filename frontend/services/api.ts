import axios from 'axios';

const API_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000/api/v1'
    : 'https://pathshala-l1qy.onrender.com/api/v1');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login/') {
      originalRequest._retry = true;
      
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          if (res.status === 200) {
            const { access } = res.data;
            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', access);
            }
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, log out the user
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
      } else {
        // No refresh token, redirect to login
        if (typeof window !== 'undefined' && originalRequest.url !== '/auth/me/') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);
