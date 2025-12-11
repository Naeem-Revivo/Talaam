// src/api/profile.js
import axiosClient from './client';

const profileAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await axiosClient.get('/profile');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosClient.put('/profile', profileData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      const errorMessage = apiError?.message || error.message || 'Failed to update profile';
      throw { ...apiError, message: errorMessage };
    }
  },
};

export default profileAPI;

