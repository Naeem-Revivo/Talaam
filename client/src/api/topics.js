// src/api/topics.js
import axiosClient from './client';

const topicsAPI = {
  // Get all topics
  getAllTopics: async (params = {}) => {
    try {
      const { parentSubject } = params;
      const queryParams = new URLSearchParams();
      
      if (parentSubject) queryParams.append('parentSubject', parentSubject);
      
      const queryString = queryParams.toString();
      
      // Try student endpoint first, fallback to admin endpoint
      try {
        const url = queryString 
          ? `/student/topics?${queryString}`
          : '/student/topics';
        const response = await axiosClient.get(url);
        return response.data;
      } catch (studentError) {
        // Only fallback to admin endpoint if student endpoint fails with non-permission error
        // If it's a 403/401, don't try admin endpoint as it will also fail
        if (studentError.response?.status === 403 || studentError.response?.status === 401) {
          throw studentError;
        }
        // Fallback to admin endpoint for other errors
        const url = queryString 
          ? `/admin/topics?${queryString}`
          : '/admin/topics';
        const response = await axiosClient.get(url);
        return response.data;
      }
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch topics' };
    }
  },

  // Get topic by ID
  getTopicById: async (topicId) => {
    try {
      const response = await axiosClient.get(`/admin/topics/${topicId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch topic' };
    }
  },

  // Create topic
  createTopic: async (topicData) => {
    try {
      const apiData = {
        parentSubject: topicData.parentSubject?.trim(),
        name: topicData.name?.trim(),
        description: topicData.description?.trim() || '',
      };

      const response = await axiosClient.post('/admin/topics', apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to create topic' };
    }
  },

  // Update topic
  updateTopic: async (topicId, topicData) => {
    try {
      const apiData = {};
      if (topicData.parentSubject !== undefined) apiData.parentSubject = topicData.parentSubject?.trim();
      if (topicData.name !== undefined) apiData.name = topicData.name?.trim();
      if (topicData.description !== undefined) apiData.description = topicData.description?.trim() || '';

      const response = await axiosClient.put(`/admin/topics/${topicId}`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update topic' };
    }
  },

  // Delete topic
  deleteTopic: async (topicId) => {
    try {
      const response = await axiosClient.delete(`/admin/topics/${topicId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to delete topic' };
    }
  },
};

export default topicsAPI;

