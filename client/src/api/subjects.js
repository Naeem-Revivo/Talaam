// src/api/subjects.js
import axiosClient from './client';

const subjectsAPI = {
  // Get all subjects
  getAllSubjects: async (params = {}) => {
    try {
      // Try student endpoint first, fallback to admin endpoint
      let response;
      try {
        response = await axiosClient.get('/student/subjects');
      } catch (studentError) {
        // Fallback to admin endpoint if student endpoint fails
        response = await axiosClient.get('/admin/subjects');
      }
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

      // Include examId if provided
      if (subjectData.examId) {
        apiData.examId = subjectData.examId;
      }

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

