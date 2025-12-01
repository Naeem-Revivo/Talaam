// src/api/auth.js
import axiosClient from './client';

// Helper to persist auth payload in localStorage
const persistAuth = (payload) => {
  const token = payload?.data?.token;
  const user = payload?.data?.user;

  if (token) {
    localStorage.setItem('token', token);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

const authAPI = {
  // Signup
  signup: async (userData) => {
    try {
      const response = await axiosClient.post('/auth/signup', userData);
      const payload = response.data; // { success, message, data: { token, user } }
      persistAuth(payload);
      return payload;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Signup failed' };
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      const payload = response.data; // { success, message, data: { token, user } }
      persistAuth(payload);
      return payload;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Login failed' };
    }
  },

  // Get current user using stored token
  getCurrentUser: async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      return response.data; // { success, data: { user } }
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch user' };
    }
  },

  // Verify OTP
  verifyOTP: async (payload) => {
    try {
      const response = await axiosClient.post('/auth/verify-otp', payload);
      const data = response.data; // { success, message, data: { token, user } }
      persistAuth(data);
      return data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'OTP verification failed' };
    }
  },

  // Resend OTP
  resendOTP: async (payload) => {
    try {
      const response = await axiosClient.post('/auth/resend-otp', payload);
      return response.data; // { success, message }
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to resend OTP' };
    }
  },

  // Forgot password
  forgotPassword: async (payload) => {
    try {
      const response = await axiosClient.post('/auth/forgot-password', payload);
      return response.data; // { success, message }
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Forgot password request failed' };
    }
  },

  // Reset password
  resetPassword: async (payload) => {
    try {
      const response = await axiosClient.post('/auth/reset-password', payload);
      return response.data; // { success, message }
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Reset password failed' };
    }
  },

  // Google OAuth URL
  getGoogleAuthUrl: async () => {
    try {
      const response = await axiosClient.get('/auth/google/url');
      return response.data; // { success, data: { url } }
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to get Google auth URL' };
    }
  },

  // Complete profile (initial setup)
  completeProfile: async (profileData) => {
    try {
      const response = await axiosClient.post('/profile/complete', profileData);
      return response.data; // { success, message, data: { profile } }
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Complete profile failed' };
    }
  },

  // Simple logout (remove from localStorage)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authAPI;