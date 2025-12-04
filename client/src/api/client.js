// src/api/client.js
import axios from 'axios';
import { showErrorToast, showLogoutToast } from '../utils/toastConfig';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.80:5000/api';

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if this is an auth endpoint - skip interceptor toasts for these as they're handled by components
    const authEndpoints = ['/auth/login', '/auth/signup', '/auth/verify-otp', '/auth/resend-otp', 
                           '/auth/forgot-password', '/auth/reset-password', '/auth/google'];
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = authEndpoints.some(endpoint => requestUrl.includes(endpoint));

    if (error.response) {
      // Handle common response errors
      if (error.response.status === 401) {
        // Handle unauthorized error, e.g., redirect to login
        // Skip toast for auth endpoints (login, signup, etc.) - handled by components
        if (!isAuthEndpoint) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          
          showLogoutToast('Your session has expired. Please login again.');
          
          const currentPath = window.location.pathname;
          const authPaths = ['/login', '/signup', '/create-account', '/forgot-password', '/reset-password'];
          const isOnAuthPage = authPaths.some(path => currentPath.includes(path));

          if (!isOnAuthPage) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
        }
      } else if (error.response.status === 403) {
        // Handle forbidden error - skip for auth endpoints
        if (!isAuthEndpoint) {
          showErrorToast('You do not have permission to access this resource.');
        }
      } else if (error.response.status === 404) {
        // Handle not found error - skip for auth endpoints
        if (!isAuthEndpoint) {
          const errorMessage = error.response.data?.message || error.response.data?.error || 'Resource not found';
          showErrorToast(errorMessage);
        }
      } else if (error.response.status >= 500) {
        // Handle server errors - skip for auth endpoints
        if (!isAuthEndpoint) {
          showErrorToast('Server error. Please try again later or contact support if the problem persists.');
        }
      } else {
        // Handle other client errors - skip for auth endpoints
        if (!isAuthEndpoint) {
          const errorMessage = error.response.data?.message || error.response.data?.error || 'An error occurred';
          showErrorToast(errorMessage);
        }
      }
    } else {
      // Handle network errors - skip for auth endpoints
      if (!isAuthEndpoint) {
        showErrorToast('Network error. Please check your internet connection and try again.');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;