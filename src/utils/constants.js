// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Application Constants
export const APP_NAME = 'E-Learning Platform';
export const APP_DESCRIPTION = 'Interactive online learning platform for students and tutors';

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  TUTOR: 'tutor',
  ADMIN: 'admin',
};

// Course Types
export const COURSE_TYPES = {
  FREE: 'free',
  PAID: 'paid',
};

// Meeting Status
export const MEETING_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Enrollment Status
export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Duration Options (in minutes)
export const MEETING_DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
];

// Course Difficulty Levels
export const COURSE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

// Categories
export const COURSE_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'UI/UX Design',
  'Digital Marketing',
  'Business',
  'Photography',
  'Music',
  'Health & Fitness',
  'Language',
  'Test Preparation',
];

// Price Ranges
export const PRICE_RANGES = [
  { min: 0, max: 0, label: 'Free' },
  { min: 1, max: 50, label: 'Under $50' },
  { min: 51, max: 100, label: '$51 - $100' },
  { min: 101, max: 200, label: '$101 - $200' },
  { min: 201, max: 500, label: '$201 - $500' },
  { min: 501, max: null, label: 'Over $500' },
];

// Timezones (common ones)
export const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
];

// File Upload
export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s-()]{10,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY hh:mm A',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const COURSE_PAGE_SIZE = 9;
export const MEETING_PAGE_SIZE = 10;
export const STUDENT_PAGE_SIZE = 10;

// Colors
export const COLORS = {
  PRIMARY: '#1890ff',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  INFO: '#1890ff',
  TEXT_PRIMARY: '#262626',
  TEXT_SECONDARY: '#8c8c8c',
  BORDER: '#f0f0f0',
  BACKGROUND: '#fafafa',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  RECENT_COURSES: 'recent_courses',
  PREFERENCES: 'preferences',
};

// WebRTC Configuration
export const WEBRTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // Meetings
  JOIN_MEETING: 'join_meeting',
  LEAVE_MEETING: 'leave_meeting',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  
  // WebRTC Signaling
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice_candidate',
  
  // Chat
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  JOIN_COURSE: 'join_course',
  LEAVE_COURSE: 'leave_course',
  
  // Dashboard
  DASHBOARD_SUBSCRIBE: 'dashboard_subscribe',
  DASHBOARD_UNSUBSCRIBE: 'dashboard_unsubscribe',
  DASHBOARD_UPDATE: 'dashboard_update',
  
  // Earnings
  EARNING_UPDATE: 'earning_update',
  
  // Personal
  JOIN_PERSONAL: 'join_personal',
  LEAVE_PERSONAL: 'leave_personal',
  
  // Notifications
  NOTIFICATION: 'notification',
};

// Feature Flags
export const FEATURES = {
  ENABLE_PAYMENTS: true,
  ENABLE_VIDEO_CONFERENCING: true,
  ENABLE_CHAT: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_CERTIFICATES: true,
  ENABLE_ASSIGNMENTS: true,
  ENABLE_QUIZZES: true,
  ENABLE_DISCUSSIONS: true,
  ENABLE_RATINGS: true,
  ENABLE_REVIEWS: true,
};