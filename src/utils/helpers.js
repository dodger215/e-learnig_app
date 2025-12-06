// src/utils/helpers.js
import { message } from 'antd';

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  const d = new Date(date);
  
  if (format === 'relative') {
    return getRelativeTime(d);
  }
  
  const options = {};
  
  if (format.includes('MMM')) {
    options.month = 'short';
  }
  if (format.includes('DD')) {
    options.day = 'numeric';
  }
  if (format.includes('YYYY')) {
    options.year = 'numeric';
  }
  if (format.includes('hh:mm')) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = format.includes('A');
  }
  
  return d.toLocaleDateString('en-US', options);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);
  
  if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
  if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffSec > 0) return `${diffSec} second${diffSec > 1 ? 's' : ''} ago`;
  return 'just now';
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generate random color from name
 * @param {string} name - Name to generate color from
 * @returns {string} Hex color code
 */
export const generateColorFromName = (name) => {
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d',
    '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16',
    '#a0d911', '#2f54eb', '#ad2102', '#52c41a',
  ];
  
  if (!name) return colors[0];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  const isValid = Object.values(requirements).every(Boolean);
  const score = Object.values(requirements).filter(Boolean).length;
  
  return {
    isValid,
    requirements,
    score,
    strength: score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong',
  };
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Copy to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    message.success('Copied to clipboard');
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    message.error('Failed to copy');
    return false;
  }
};

/**
 * Generate meeting link
 * @param {string} courseId - Course ID
 * @param {string} meetingId - Meeting ID
 * @returns {string} Meeting link
 */
export const generateMeetingLink = (courseId, meetingId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/meeting/${courseId}/${meetingId}`;
};

/**
 * Parse meeting link
 * @param {string} link - Meeting link
 * @returns {Object} Parsed meeting data
 */
export const parseMeetingLink = (link) => {
  const url = new URL(link);
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (pathParts.length >= 3 && pathParts[0] === 'meeting') {
    const role = pathParts[1]; // 'tutor' or 'student'
    const meetingId = pathParts[2];
    return { role, meetingId };
  }
  
  return null;
};

/**
 * Check if user is online
 * @returns {boolean} Online status
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Get user's timezone
 * @returns {string} Timezone
 */
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert UTC to local time
 * @param {string} utcDate - UTC date string
 * @returns {Date} Local date
 */
export const utcToLocal = (utcDate) => {
  return new Date(utcDate + 'Z');
};

/**
 * Generate unique ID
 * @param {number} length - Length of ID
 * @returns {string} Unique ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sleep function (delay)
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get query parameters from URL
 * @param {string} url - URL string
 * @returns {Object} Query parameters
 */
export const getQueryParams = (url = window.location.href) => {
  const params = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

/**
 * Build query string from object
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};