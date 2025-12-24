// src/api/plans.js
import axiosClient from './client';

const plansAPI = {
  // Create a new plan
  // POST /api/admin/plans
  createPlan: async (planData) => {
    try {
      const response = await axiosClient.post('/admin/plans', planData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to create plan' };
    }
  },

  // Get all plans (public first, fallback to admin)
  // Public: GET /api/public/plans (active plans only)
  // Authenticated: GET /api/admin/plans
  getAllPlans: async (params = {}) => {
    try {
      const { status } = params;
      const queryParams = new URLSearchParams();
      
      if (status) queryParams.append('status', status);

      // Try public endpoint first (works without auth)
      try {
        const publicUrl = queryParams.toString()
          ? `/public/plans?${queryParams.toString()}`
          : '/public/plans';
        const response = await axiosClient.get(publicUrl);
        return response.data;
      } catch (publicErr) {
        // Fallback to authenticated admin endpoint
        const url = queryParams.toString()
          ? `/admin/plans?${queryParams.toString()}`
          : '/admin/plans';
        const response = await axiosClient.get(url);
        return response.data;
      }
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch plans' };
    }
  },

  // Get plan by ID
  // GET /api/admin/plans/:planId
  getPlanById: async (planId) => {
    try {
      const response = await axiosClient.get(`/admin/plans/${planId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch plan' };
    }
  },

  // Update plan
  // PUT /api/admin/plans/:planId
  updatePlan: async (planId, planData) => {
    try {
      const response = await axiosClient.put(`/admin/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update plan' };
    }
  },

  // Update plan status
  // PUT /api/admin/plans/:planId/status
  updatePlanStatus: async (planId, status) => {
    try {
      const response = await axiosClient.put(`/admin/plans/${planId}/status`, { status });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update plan status' };
    }
  },

  // Delete plan
  // DELETE /api/admin/plans/:planId
  deletePlan: async (planId) => {
    try {
      const response = await axiosClient.delete(`/admin/plans/${planId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to delete plan' };
    }
  },
};

export default plansAPI;

