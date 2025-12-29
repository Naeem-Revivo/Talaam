// src/api/client.js
import axios from 'axios';
import { showErrorToast, showLogoutToast } from '../utils/toastConfig';

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('authToken');
    if (!token) {
      token = sessionStorage.getItem('authToken');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    // Check if this is an auth, admin, or subscription endpoint - skip interceptor toasts for these
    const authEndpoints = ['/auth/login', '/auth/signup', '/auth/verify-otp', '/auth/resend-otp', 
                           '/auth/forgot-password', '/auth/reset-password', '/auth/google'];
    const adminEndpoints = ['/admin/create', '/admin/update', '/admin/status'];
    const subscriptionEndpoints = ['/subscription/me'];
    const questionEndpoints = ['/admin/questions/']; // Add this for all question endpoints
    
    const requestUrl = error.config?.url || '';
    
    const isAuthEndpoint = authEndpoints.some(endpoint => requestUrl.includes(endpoint));
    const isAdminEndpoint = adminEndpoints.some(endpoint => requestUrl.includes(endpoint));
    const isSubscriptionEndpoint = subscriptionEndpoints.some(endpoint => requestUrl.includes(endpoint));
    const isQuestionEndpoint = questionEndpoints.some(endpoint => requestUrl.includes(endpoint)); // Check for question endpoints
    
    // Skip toast for auth, admin, subscription, AND question endpoints
    const shouldSkipToast = isAuthEndpoint || isAdminEndpoint || isSubscriptionEndpoint || isQuestionEndpoint;

    const hasToken = !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));

    if (error.response) {
      // Handle common response errors
      if (error.response.status === 401) {
        if (!shouldSkipToast && hasToken) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('user');
          
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
        if (!shouldSkipToast) {
          showErrorToast('You do not have permission to access this resource.');
        }
      } else if (error.response.status === 404) {
        // IMPORTANT: Don't show toast for 404 errors on question endpoints
        // An empty result (no questions) is a valid state, not an error
        if (!shouldSkipToast) {
          const errorMessage = error.response.data?.message || error.response.data?.error || 'Resource not found';
          showErrorToast(errorMessage);
        }
      } else if (error.response.status >= 500) {
        if (!shouldSkipToast) {
          showErrorToast('Server error. Please try again later or contact support if the problem persists.');
        }
      } else {
        if (!shouldSkipToast) {
          const errorMessage = error.response.data?.message || error.response.data?.error || 'An error occurred';
          showErrorToast(errorMessage);
        }
      }
    } else {
      if (!shouldSkipToast) {
        showErrorToast('Network error. Please check your internet connection and try again.');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;