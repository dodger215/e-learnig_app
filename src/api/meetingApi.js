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

// Meeting API
export const meetingApi = {
  // Schedule a meeting (tutor only)
  scheduleMeeting: async (meetingData) => {
    try {
      const response = await api.post('/meetings', meetingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get meetings for a course
  getMeetingsByCourse: async (courseId) => {
    try {
      const response = await api.get(`/meetings/course/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get meeting by ID
  getMeetingById: async (meetingId) => {
    try {
      const response = await api.get(`/meetings/${meetingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update meeting
  updateMeeting: async (meetingId, meetingData) => {
    try {
      const response = await api.put(`/meetings/${meetingId}`, meetingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete meeting
  deleteMeeting: async (meetingId) => {
    try {
      const response = await api.delete(`/meetings/${meetingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get tutor's meetings
  getTutorMeetings: async () => {
    try {
      const response = await api.get('/meetings/tutor');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get student's upcoming meetings
  getStudentMeetings: async () => {
    try {
      const response = await api.get('/meetings/student');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default meetingApi;