// src/api/languages.js
import axiosClient from './client';

const languagesAPI = {
  // Create a new language
  // POST /api/admin/languages
  createLanguage: async (languageData) => {
    try {
      const response = await axiosClient.post('/admin/languages', languageData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to create language' };
    }
  },

  // Get all languages
  // GET /api/admin/languages
  getAllLanguages: async (params = {}) => {
    try {
      const { page, pageSize, status } = params;
      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (pageSize) queryParams.append('pageSize', pageSize);
      if (status) queryParams.append('status', status);

      const url = queryParams.toString()
        ? `/admin/languages?${queryParams.toString()}`
        : '/admin/languages';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch languages' };
    }
  },

  // Get active languages (public endpoint for student signup/profile)
  // GET /api/languages/active
  getActiveLanguages: async () => {
    try {
      const response = await axiosClient.get('/languages/active');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch active languages' };
    }
  },

  // Get language by ID
  // GET /api/admin/languages/:languageId
  getLanguageById: async (languageId) => {
    try {
      const response = await axiosClient.get(`/admin/languages/${languageId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch language' };
    }
  },

  // Update language
  // PUT /api/admin/languages/:languageId
  updateLanguage: async (languageId, languageData) => {
    try {
      const response = await axiosClient.put(`/admin/languages/${languageId}`, languageData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update language' };
    }
  },

  // Delete language
  // DELETE /api/admin/languages/:languageId
  deleteLanguage: async (languageId) => {
    try {
      const response = await axiosClient.delete(`/admin/languages/${languageId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to delete language' };
    }
  },
};

export default languagesAPI;
