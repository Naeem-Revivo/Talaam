// src/api/exams.js
import axiosClient from './client';

const examsAPI = {
  // Get all exams
  getAllExams: async (params = {}) => {
    try {
      const { status } = params;
      const queryParams = new URLSearchParams();
      
      if (status) queryParams.append('status', status);
      
      const url = queryParams.toString() 
        ? `/admin/exams?${queryParams.toString()}`
        : '/admin/exams';
      
      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch exams' };
    }
  },

  // Get exam by ID
  getExamById: async (examId) => {
    try {
      const response = await axiosClient.get(`/admin/exams/${examId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch exam' };
    }
  },

  // Create exam
  createExam: async (examData) => {
    try {
      const apiData = {
        name: examData.name?.trim(),
        description: examData.description?.trim() || null,
        status: examData.status || 'active',
      };

      const response = await axiosClient.post('/admin/exams', apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to create exam' };
    }
  },

  // Update exam
  updateExam: async (examId, examData) => {
    try {
      const apiData = {};
      if (examData.name !== undefined) apiData.name = examData.name?.trim();
      if (examData.description !== undefined) apiData.description = examData.description?.trim() || null;
      if (examData.status !== undefined) apiData.status = examData.status;

      const response = await axiosClient.put(`/admin/exams/${examId}`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update exam' };
    }
  },

  // Delete exam
  deleteExam: async (examId) => {
    try {
      const response = await axiosClient.delete(`/admin/exams/${examId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to delete exam' };
    }
  },
};

export default examsAPI;

