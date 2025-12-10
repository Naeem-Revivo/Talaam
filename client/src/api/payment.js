// src/api/payment.js
import axiosClient from './client';

const paymentAPI = {
  // Initiate Moyassar payment for a subscription
  // POST /api/payment/moyassar/initiate
  initiateMoyassarPayment: async (subscriptionId) => {
    try {
      const response = await axiosClient.post('/payment/moyassar/initiate', {
        subscriptionId,
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to initiate payment' };
    }
  },

  // Verify Moyassar payment
  // POST /api/payment/moyassar/verify
  verifyMoyassarPayment: async (paymentId, subscriptionId) => {
    try {
      const response = await axiosClient.post('/payment/moyassar/verify', {
        paymentId,
        subscriptionId,
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to verify payment' };
    }
  },

  // Get payment status
  // GET /api/payment/moyassar/status/:subscriptionId
  getPaymentStatus: async (subscriptionId, sync = false) => {
    try {
      const url = sync 
        ? `/payment/moyassar/status/${subscriptionId}?sync=true`
        : `/payment/moyassar/status/${subscriptionId}`;
      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to get payment status' };
    }
  },

  // Sync payment status from Moyassar
  // This is an alias for getPaymentStatus with sync=true
  syncPaymentStatus: async (subscriptionId) => {
    try {
      const response = await axiosClient.get(`/payment/moyassar/status/${subscriptionId}?sync=true`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to sync payment status' };
    }
  },
};

export default paymentAPI;

