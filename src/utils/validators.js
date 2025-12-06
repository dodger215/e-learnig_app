// src/utils/validators.js
import { VALIDATION_PATTERNS } from './constants';

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) return 'Please enter a valid email address';
  return null;
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
  if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character (@$!%*?&)';
  return null;
};

/**
 * Validate confirm password
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {string|null} Error message or null if valid
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters long';
  if (name.length > 50) return 'Name cannot exceed 50 characters';
  return null;
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional
  if (!VALIDATION_PATTERNS.PHONE.test(phone)) return 'Please enter a valid phone number';
  return null;
};

/**
 * Validate course title
 * @param {string} title - Course title to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateCourseTitle = (title) => {
  if (!title) return 'Course title is required';
  if (title.length < 5) return 'Course title must be at least 5 characters long';
  if (title.length > 200) return 'Course title cannot exceed 200 characters';
  return null;
};

/**
 * Validate course description
 * @param {string} description - Course description to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateCourseDescription = (description) => {
  if (!description) return 'Course description is required';
  if (description.length < 20) return 'Course description must be at least 20 characters long';
  if (description.length > 5000) return 'Course description cannot exceed 5000 characters';
  return null;
};

/**
 * Validate course price
 * @param {number} price - Course price to validate
 * @param {boolean} isFree - Whether course is free
 * @returns {string|null} Error message or null if valid
 */
export const validateCoursePrice = (price, isFree = false) => {
  if (isFree) return null;
  
  if (price === undefined || price === null) return 'Price is required for paid courses';
  if (typeof price !== 'number') return 'Price must be a number';
  if (price < 0) return 'Price cannot be negative';
  if (price > 10000) return 'Price cannot exceed $10,000';
  return null;
};

/**
 * Validate course duration
 * @param {number} duration - Course duration in days
 * @returns {string|null} Error message or null if valid
 */
export const validateCourseDuration = (duration) => {
  if (!duration && duration !== 0) return 'Duration is required';
  if (typeof duration !== 'number') return 'Duration must be a number';
  if (duration < 1) return 'Duration must be at least 1 day';
  if (duration > 365) return 'Duration cannot exceed 365 days';
  return null;
};

/**
 * Validate meeting title
 * @param {string} title - Meeting title to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateMeetingTitle = (title) => {
  if (!title) return 'Meeting title is required';
  if (title.length < 5) return 'Meeting title must be at least 5 characters long';
  if (title.length > 200) return 'Meeting title cannot exceed 200 characters';
  return null;
};

/**
 * Validate meeting description
 * @param {string} description - Meeting description to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateMeetingDescription = (description) => {
  if (!description) return null; // Optional
  if (description.length > 1000) return 'Meeting description cannot exceed 1000 characters';
  return null;
};

/**
 * Validate meeting date and time
 * @param {Date} dateTime - Meeting date and time
 * @returns {string|null} Error message or null if valid
 */
export const validateMeetingDateTime = (dateTime) => {
  if (!dateTime) return 'Date and time are required';
  
  const now = new Date();
  const selectedDate = new Date(dateTime);
  
  if (selectedDate <= now) return 'Meeting must be scheduled in the future';
  
  // Check if it's more than 1 year in the future
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);
  if (selectedDate > oneYearFromNow) return 'Meeting cannot be scheduled more than 1 year in advance';
  
  return null;
};

/**
 * Validate meeting duration
 * @param {number} duration - Meeting duration in minutes
 * @returns {string|null} Error message or null if valid
 */
export const validateMeetingDuration = (duration) => {
  if (!duration) return 'Duration is required';
  if (typeof duration !== 'number') return 'Duration must be a number';
  if (duration < 15) return 'Meeting must be at least 15 minutes long';
  if (duration > 480) return 'Meeting cannot exceed 8 hours';
  return null;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateURL = (url) => {
  if (!url) return null; // Optional
  if (!VALIDATION_PATTERNS.URL.test(url)) return 'Please enter a valid URL';
  return null;
};

/**
 * Validate file
 * @param {File} file - File to validate
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {string|null} Error message or null if valid
 */
export const validateFile = (file, allowedTypes = [], maxSize = 50 * 1024 * 1024) => {
  if (!file) return 'File is required';
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1]).join(', ');
    return `Invalid file type. Allowed types: ${allowedExtensions}`;
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return `File size exceeds ${maxSizeMB}MB limit`;
  }
  
  return null;
};

/**
 * Validate rating
 * @param {number} rating - Rating to validate (1-5)
 * @returns {string|null} Error message or null if valid
 */
export const validateRating = (rating) => {
  if (!rating && rating !== 0) return 'Rating is required';
  if (typeof rating !== 'number') return 'Rating must be a number';
  if (rating < 1) return 'Rating must be at least 1';
  if (rating > 5) return 'Rating cannot exceed 5';
  if (!Number.isInteger(rating)) return 'Rating must be a whole number';
  return null;
};

/**
 * Validate review text
 * @param {string} text - Review text to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateReviewText = (text) => {
  if (!text) return 'Review text is required';
  if (text.length < 10) return 'Review must be at least 10 characters long';
  if (text.length > 2000) return 'Review cannot exceed 2000 characters';
  return null;
};

/**
 * Validate withdrawal amount
 * @param {number} amount - Amount to withdraw
 * @param {number} balance - Current balance
 * @returns {string|null} Error message or null if valid
 */
export const validateWithdrawalAmount = (amount, balance) => {
  if (!amount && amount !== 0) return 'Amount is required';
  if (typeof amount !== 'number') return 'Amount must be a number';
  if (amount <= 0) return 'Amount must be greater than 0';
  if (amount < 10) return 'Minimum withdrawal amount is $10';
  if (amount > balance) return 'Insufficient balance';
  return null;
};

/**
 * Create validation rule for Ant Design Form
 * @param {Function} validator - Validation function
 * @param {*} value - Value to validate
 * @returns {Object} Ant Design validation rule
 */
export const createValidationRule = (validator, fieldName) => {
  return {
    validator: (_, value) => {
      const error = validator(value);
      if (error) {
        return Promise.reject(new Error(error));
      }
      return Promise.resolve();
    },
  };
};

/**
 * Validate entire form
 * @param {Object} values - Form values
 * @param {Object} validators - Validators object
 * @returns {Object} Validation errors
 */
export const validateForm = (values, validators) => {
  const errors = {};
  
  Object.keys(validators).forEach(field => {
    const validator = validators[field];
    if (typeof validator === 'function') {
      const error = validator(values[field]);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};