// src/api/students.js
import axiosClient from './client';

const studentsAPI = {
  // Get all students with filtering and pagination
  getAllStudents: async (params = {}) => {
    try {
      const { page = 1, limit = 5, status, plan, date, search, studentId } = params;
      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (status) queryParams.append('status', status);
      if (plan) queryParams.append('plan', plan);
      if (date) queryParams.append('date', date);
      if (search) queryParams.append('search', search);
      if (studentId) queryParams.append('studentId', studentId);
      
      const response = await axiosClient.get(`/admin/students?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch students' };
    }
  },

  // Get student management statistics
  getStudentManagementStatistics: async () => {
    try {
      const response = await axiosClient.get('/admin/students/management');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch student management statistics' };
    }
  },

  // Get student details by ID
  getStudentById: async (studentId) => {
    try {
      const response = await axiosClient.get(`/admin/students/${studentId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch student details' };
    }
  },

  // Update student status (suspend/activate)
  updateStudentStatus: async (studentId, status) => {
    try {
      const response = await axiosClient.put(`/admin/students/${studentId}/status`, {
        status: status.toLowerCase(),
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update student status' };
    }
  },
};

export default studentsAPI;

