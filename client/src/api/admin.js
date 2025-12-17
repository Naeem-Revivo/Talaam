// src/api/admin.js
import axiosClient from './client';

const adminAPI = {
  // Get dashboard statistics
  // GET /api/admin/dashboard/statistics
  getDashboardStatistics: async () => {
    try {
      const response = await axiosClient.get('/admin/dashboard/statistics');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch dashboard statistics' };
    }
  },

  // Get all user subscriptions
  // GET /api/admin/subscriptions
  getAllUserSubscriptions: async (params = {}) => {
    try {
      const { plan, status, search, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();
      
      if (plan) queryParams.append('plan', plan);
      if (status) queryParams.append('status', status);
      if (search) queryParams.append('search', search);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const url = queryParams.toString()
        ? `/admin/subscriptions?${queryParams.toString()}`
        : '/admin/subscriptions';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch subscriptions' };
    }
  },

  // Get subscription details
  // GET /api/admin/subscriptions/:subscriptionId
  getSubscriptionDetails: async (subscriptionId) => {
    try {
      const response = await axiosClient.get(`/admin/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch subscription details' };
    }
  },

  // Sync payment status for a subscription
  // POST /api/admin/subscriptions/:subscriptionId/sync-payment
  syncSubscriptionPayment: async (subscriptionId) => {
    try {
      const response = await axiosClient.post(`/admin/subscriptions/${subscriptionId}/sync-payment`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to sync payment status' };
    }
  },

  // Get user analytics hero metrics
  // GET /api/admin/analytics/user/hero
  getUserAnalyticsHero: async () => {
    try {
      const response = await axiosClient.get('/admin/analytics/user/hero');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch user analytics hero' };
    }
  },

  // Get user growth chart data
  // GET /api/admin/analytics/user/growth
  getUserGrowthChart: async () => {
    try {
      const response = await axiosClient.get('/admin/analytics/user/growth');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch user growth chart' };
    }
  },

  // Get top performance users
  // GET /api/admin/analytics/user/performance
  getTopPerformanceUsers: async (params = {}) => {
    try {
      const { page = 1, limit = 5 } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const url = queryParams.toString()
        ? `/admin/analytics/user/performance?${queryParams.toString()}`
        : '/admin/analytics/user/performance';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch top performance users' };
    }
  },

  // Get practice distribution by subject
  // GET /api/admin/analytics/practice-distribution
  getPracticeDistribution: async () => {
    try {
      const response = await axiosClient.get('/admin/analytics/practice-distribution');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch practice distribution' };
    }
  },

  // Get subscription trend metrics
  // GET /api/admin/analytics/subscription/trend
  getSubscriptionTrendMetrics: async () => {
    try {
      const response = await axiosClient.get('/admin/analytics/subscription/trend');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch subscription trend metrics' };
    }
  },

  // Get revenue trend chart
  // GET /api/admin/analytics/subscription/revenue-trend
  getRevenueTrendChart: async () => {
    try {
      const response = await axiosClient.get('/admin/analytics/subscription/revenue-trend');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch revenue trend chart' };
    }
  },

  // Get all questions for superadmin
  // GET /api/admin/questions/all
  getAllQuestions: async (params = {}) => {
    try {
      const { tab, search, exam, subject, topic, status, page = 1, limit = 5 } = params;
      const queryParams = new URLSearchParams();
      
      if (tab) queryParams.append('tab', tab);
      if (search) queryParams.append('search', search);
      if (exam) queryParams.append('exam', exam);
      if (subject) queryParams.append('subject', subject);
      if (topic) queryParams.append('topic', topic);
      if (status) queryParams.append('status', status);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const url = queryParams.toString()
        ? `/admin/questions/all?${queryParams.toString()}`
        : '/admin/questions/all';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch questions' };
    }
  },

  // Get plan distribution
  // GET /api/admin/analytics/subscription/plan-distribution
  getPlanDistribution: async () => {
    try {
      const response = await axiosClient.get('/admin/analytics/subscription/plan-distribution');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch plan distribution' };
    }
  },

  // Get plan-wise breakdown
  // GET /api/admin/analytics/subscription/plan-breakdown
  getPlanWiseBreakdown: async (params = {}) => {
    try {
      const { page = 1, limit = 3 } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const url = queryParams.toString()
        ? `/admin/analytics/subscription/plan-breakdown?${queryParams.toString()}`
        : '/admin/analytics/subscription/plan-breakdown';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch plan-wise breakdown' };
    }
  },

  // Get payment history
  // GET /api/admin/payments/history
  getPaymentHistory: async (params = {}) => {
    try {
      const { dateRange, plan, status, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();
      
      if (dateRange) queryParams.append('dateRange', dateRange);
      if (plan) queryParams.append('plan', plan);
      if (status) queryParams.append('status', status);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const url = queryParams.toString()
        ? `/admin/payments/history?${queryParams.toString()}`
        : '/admin/payments/history';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch payment history' };
    }
  },
};

export default adminAPI;

