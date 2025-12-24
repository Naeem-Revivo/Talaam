// src/api/subscription.js
import axiosClient from './client';

const subscriptionAPI = {
  // Subscribe to a plan
  // POST /api/subscription/subscribe
  subscribeToPlan: async (planId) => {
    try {
      const response = await axiosClient.post('/subscription/subscribe', {
        planId,
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to subscribe to plan' };
    }
  },

  // Confirm payment
  // POST /api/subscription/payment/confirm
  confirmPayment: async (subscriptionId, transactionId) => {
    try {
      const response = await axiosClient.post('/subscription/payment/confirm', {
        subscriptionId,
        transactionId,
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to confirm payment' };
    }
  },

  // Get my subscription
  // GET /api/subscription/me
  getMySubscription: async () => {
    try {
      const response = await axiosClient.get('/subscription/me');
      return response.data;
    } catch (error) {
      // If 404 (not found), return a structured response instead of throwing
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'No subscription found',
          data: { subscription: null }
        };
      }
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to get subscription' };
    }
  },

  // Get my billing history
  // GET /api/subscription/billing-history
  getMyBillingHistory: async () => {
    try {
      const response = await axiosClient.get('/subscription/billing-history');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch billing history' };
    }
  },

  // Cancel subscription
  // POST /api/subscription/cancel/:subscriptionId
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await axiosClient.post(`/subscription/cancel/${subscriptionId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to cancel subscription' };
    }
  },

  // Renew subscription
  // POST /api/subscription/renew/:subscriptionId
  renewSubscription: async (subscriptionId) => {
    try {
      const response = await axiosClient.post(`/subscription/renew/${subscriptionId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to renew subscription' };
    }
  },
};

export default subscriptionAPI;

