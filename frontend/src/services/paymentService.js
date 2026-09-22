import api from './api';

export const paymentService = {
  // Process Mock Payment
  processMockPayment: async (paymentData) => {
    return await api.post('/payments/mock', paymentData);
  },

  // Get user payments
  getMyPayments: async (params = {}) => {
    return await api.get('/payments/my-payments', { params });
  },

  // Get payment details
  getPaymentById: async (id) => {
    return await api.get(`/payments/${id}`);
  }
};
