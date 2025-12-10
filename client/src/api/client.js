// src/api/client.js
import axios from 'axios';
import { showErrorToast, showLogoutToast } from '../utils/toastConfig';

const API_URL ='https://many-flannelly-shatteringly.ngrok-free.dev/api';
// const API_URL ='http://192.168.1.80:5000/api';

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Bypass ngrok warning page
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Always include ngrok bypass header
    config.headers['ngrok-skip-browser-warning'] = 'true';
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
    // Check if this is an auth or admin endpoint - skip interceptor toasts for these as they're handled by components
    const authEndpoints = ['/auth/login', '/auth/signup', '/auth/verify-otp', '/auth/resend-otp', 
                           '/auth/forgot-password', '/auth/reset-password', '/auth/google'];
    const adminEndpoints = ['/admin/create', '/admin/update', '/admin/status'];
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = authEndpoints.some(endpoint => requestUrl.includes(endpoint));
    const isAdminEndpoint = adminEndpoints.some(endpoint => requestUrl.includes(endpoint));
    const shouldSkipToast = isAuthEndpoint || isAdminEndpoint;

    if (error.response) {
      // Handle common response errors
      if (error.response.status === 401) {
        // Handle unauthorized error, e.g., redirect to login
        // Skip toast for auth/admin endpoints - handled by components
        if (!shouldSkipToast) {
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
        // Handle forbidden error - skip for auth/admin endpoints
        if (!shouldSkipToast) {
          showErrorToast('You do not have permission to access this resource.');
        }
      } else if (error.response.status === 404) {
        // Handle not found error - skip for auth/admin endpoints
        if (!shouldSkipToast) {
          const errorMessage = error.response.data?.message || error.response.data?.error || 'Resource not found';
          showErrorToast(errorMessage);
        }
      } else if (error.response.status >= 500) {
        // Handle server errors - skip for auth/admin endpoints
        if (!shouldSkipToast) {
          showErrorToast('Server error. Please try again later or contact support if the problem persists.');
        }
      } else {
        // Handle other client errors (400, etc.) - skip for auth/admin endpoints
        if (!shouldSkipToast) {
          const errorMessage = error.response.data?.message || error.response.data?.error || 'An error occurred';
          showErrorToast(errorMessage);
        }
      }
    } else {
      // Handle network errors - skip for auth/admin endpoints
      if (!shouldSkipToast) {
        showErrorToast('Network error. Please check your internet connection and try again.');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;