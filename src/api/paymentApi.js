
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Payment API
export const paymentApi = {
  // Initialize payment for a course
  initializePayment: async (courseId) => {
    try {
      const response = await api.post('/payment/initialize', { courseId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify payment
  verifyPayment: async (reference) => {
    try {
      const response = await api.get(`/payment/verify/${reference}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Enroll in free course
  enrollFree: async (courseId) => {
    try {
      const response = await api.post('/payment/enroll-free', { courseId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check subscription status
  checkSubscriptionStatus: async () => {
    try {
      const response = await api.get('/payment/status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get student's enrollments
  getEnrollments: async () => {
    try {
      const response = await api.get('/payment/enrollments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get tutor earnings
  getTutorEarnings: async () => {
    try {
      const response = await api.get('/payment/earnings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Withdraw earnings (tutor only)
  withdrawEarnings: async (amount) => {
    try {
      const response = await api.post('/payment/withdraw', { amount });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default paymentApi;