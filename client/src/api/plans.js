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
      
      // Always use public endpoint for active plans or when no status is specified
      // Public endpoint only returns active plans, so status filter is not needed
      if (!status || status === 'active') {
        try {
          const response = await axiosClient.get('/public/plans');
          return response.data;
        } catch (publicErr) {
          // If public endpoint fails and we need active plans, try admin endpoint
          console.warn('Public plans endpoint failed, trying admin endpoint:', publicErr);
          const response = await axiosClient.get('/admin/plans?status=active');
          return response.data;
        }
      } else {
        // For non-active status, use admin endpoint (requires auth)
        const response = await axiosClient.get(`/admin/plans?status=${status}`);
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

