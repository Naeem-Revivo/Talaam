// src/api/users.js
import axiosClient from './client';

const usersAPI = {
  // Get all admin users with filtering and pagination
  getAllUsers: async (params = {}) => {
    try {
      const { page = 1, limit = 5, status, adminRole, search } = params;
      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (status) queryParams.append('status', status);
      if (adminRole) queryParams.append('adminRole', adminRole);
      if (search) queryParams.append('search', search);
      
      const response = await axiosClient.get(`/admin/users?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch users' };
    }
  },

  // Get user management statistics
  getUserManagementStatistics: async () => {
    try {
      const response = await axiosClient.get('/admin/users/management');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch user management statistics' };
    }
  },

  // Create admin user
  createUser: async (userData) => {
    try {
      // Map frontend format to API format
      const roleMap = {
        "Question Gatherer": "gatherer",
        "Question Creator": "creator",
        Processor: "processor",
        "Question Explainer": "explainer",
      };
      
      const apiData = {
        name: userData.name?.trim(),
        email: userData.email?.trim(),
        password: userData.password?.trim() || undefined,
        status: userData.status?.toLowerCase() || 'active',
        adminRole: userData.workflowRole ? (roleMap[userData.workflowRole] || userData.workflowRole.toLowerCase().replace(/\s+/g, '')) : undefined,
      };

      const response = await axiosClient.post('/admin/create', apiData);
      return response.data;
    } catch (error) {
      // Preserve the full error response structure
      const apiError = error.response?.data;
      // Create error object that preserves the response structure
      const errorObj = apiError || { message: 'Failed to create user' };
      // Attach response for proper error handling
      const err = new Error(errorObj.message || 'Failed to create user');
      err.response = { data: errorObj };
      throw err;
    }
  },

  // Update admin user
  updateUser: async (userId, userData) => {
    try {
      // Map frontend format to API format
      const apiData = {};
      if (userData.name !== undefined) apiData.name = userData.name;
      if (userData.email !== undefined) apiData.email = userData.email;
      if (userData.status !== undefined) apiData.status = userData.status.toLowerCase();
      if (userData.workflowRole !== undefined) {
        // Map frontend workflow role to API adminRole format
        const roleMap = {
          "Question Gatherer": "gatherer",
          "Question Creator": "creator",
          Processor: "processor",
          "Question Explainer": "explainer",
        };
        apiData.adminRole = roleMap[userData.workflowRole] || userData.workflowRole.toLowerCase().replace(/\s+/g, '');
      }

      const response = await axiosClient.put(`/admin/${userId}`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update user' };
    }
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    try {
      const response = await axiosClient.put(`/admin/status/${userId}`, {
        status: status.toLowerCase(),
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update user status' };
    }
  },

  // Delete admin user
  deleteUser: async (userId) => {
    try {
      const response = await axiosClient.delete(`/admin/${userId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to delete user' };
    }
  },
};

export default usersAPI;

