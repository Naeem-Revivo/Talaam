// src/api/subjects.js
import axiosClient from './client';

const subjectsAPI = {
  // Get all subjects
  getAllSubjects: async (params = {}) => {
    try {
      const response = await axiosClient.get('/admin/subjects');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch subjects' };
    }
  },

  // Get subject by ID
  getSubjectById: async (subjectId) => {
    try {
      const response = await axiosClient.get(`/admin/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch subject' };
    }
  },

  // Create subject
  createSubject: async (subjectData) => {
    try {
      const apiData = {
        name: subjectData.name?.trim(),
        description: subjectData.description?.trim() || '',
      };

      const response = await axiosClient.post('/admin/subjects', apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to create subject' };
    }
  },

  // Update subject
  updateSubject: async (subjectId, subjectData) => {
    try {
      const apiData = {};
      if (subjectData.name !== undefined) apiData.name = subjectData.name?.trim();
      if (subjectData.description !== undefined) apiData.description = subjectData.description?.trim() || '';

      const response = await axiosClient.put(`/admin/subjects/${subjectId}`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update subject' };
    }
  },

  // Delete subject
  deleteSubject: async (subjectId) => {
    try {
      const response = await axiosClient.delete(`/admin/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to delete subject' };
    }
  },
};

export default subjectsAPI;

