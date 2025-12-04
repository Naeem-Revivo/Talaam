// src/api/auth.js
import { isAxiosError } from 'axios';
import axiosClient from './client';

export const LoginUser = async (body, setError) => {
  try {
    const response = await axiosClient.post('/auth/login', body);
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      setError(error.response.statusText);
      return error.response;
    }
    setError('Unexpected error occurred');
    return undefined;
  }
};

export const ForgotPassword = async (body, setError) => {
  try {
    const response = await axiosClient.post('/auth/forgot-password', body);
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      setError(error.response.statusText);
      return error.response;
    }
    setError('Unexpected error occurred');
    return undefined;
  }
};

export const ResetPassword = async (body, setError) => {
  try {
    const response = await axiosClient.post('/auth/reset-password', body);
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      setError(error.response.statusText);
      return error.response;
    }
    setError('Unexpected error occurred');
    return undefined;
  }
};

// Additional auth methods for backward compatibility
const authAPI = {
  // Signup
  signup: async (userData) => {
    try {
      const response = await axiosClient.post('/auth/signup', userData);
      const payload = response.data;
      const token = payload?.data?.token;
      const user = payload?.data?.user;

      if (token) {
        localStorage.setItem('authToken', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return payload;
    } catch (error) {
      const apiError = error.response?.data;
      // Extract message from API response
      const errorMessage = apiError?.message || error.message || 'Signup failed';
      throw { ...apiError, message: errorMessage };
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      const payload = response.data;
      const token = payload?.data?.token;
      const user = payload?.data?.user;

      if (token) {
        localStorage.setItem('authToken', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return payload;
    } catch (error) {
      const apiError = error.response?.data;
      // Extract message from API response
      const errorMessage = apiError?.message || error.message || 'Login failed';
      throw { ...apiError, message: errorMessage };
    }
  },

  // Get current user using stored token
  getCurrentUser: async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch user' };
    }
  },

  // Verify OTP
  verifyOTP: async (payload) => {
    try {
      const response = await axiosClient.post('/auth/verify-otp', payload);
      const data = response.data;
      const token = data?.data?.token;
      const user = data?.data?.user;

      if (token) {
        localStorage.setItem('authToken', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return data;
    } catch (error) {
      const apiError = error.response?.data;
      // Extract message from API response
      const errorMessage = apiError?.message || error.message || 'OTP verification failed';
      throw { ...apiError, message: errorMessage };
    }
  },

  // Resend OTP
  resendOTP: async (payload) => {
    try {
      const response = await axiosClient.post('/auth/resend-otp', payload);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      // Extract message from API response
      const errorMessage = apiError?.message || error.message || 'Failed to resend OTP';
      throw { ...apiError, message: errorMessage };
    }
  },

  // Forgot password
  forgotPassword: async (payload) => {
    try {
      const response = await axiosClient.post('/auth/forgot-password', payload);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      // Extract message from API response
      const errorMessage = apiError?.message || error.message || 'Forgot password request failed';
      throw { ...apiError, message: errorMessage };
    }
  },

  // Reset password
  resetPassword: async (payload) => {
    try {
      const response = await axiosClient.post('/auth/reset-password', payload);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      // Extract message from API response
      const errorMessage = apiError?.message || error.message || 'Reset password failed';
      throw { ...apiError, message: errorMessage };
    }
  },

  // Google OAuth URL (for backward compatibility)
  getGoogleAuthUrl: async () => {
    try {
      const response = await axiosClient.get('/auth/google/url');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to get Google auth URL' };
    }
  },

  // LinkedIn OAuth URL (for backward compatibility)
  getLinkedInAuthUrl: async () => {
    try {
      const response = await axiosClient.get('/auth/linkedin/url');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to get LinkedIn auth URL' };
    }
  },

  // Complete profile (initial setup)
  completeProfile: async (profileData) => {
    try {
      const response = await axiosClient.post('/profile/complete', profileData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Complete profile failed' };
    }
  },

  // Simple logout (remove from localStorage)
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

export default authAPI;