// src/routes.jsx
// This file is deprecated - routes are now defined in App.jsx
// Keeping this file for backward compatibility

import { Navigate } from 'react-router-dom';

// Re-export route components for backward compatibility
export { default as Login } from './pages/auth/Login';
export { default as Register } from './pages/auth/Register';
export { default as StudentDashboard } from './pages/student/Dashboard';
export { default as ExploreCourses } from './pages/student/ExploreCourses';
export { default as MyCourses } from './pages/student/MyCourses';
export { default as StudentCourseDetails } from './pages/student/CourseDetails';
export { default as TutorDashboard } from './pages/tutor/Dashboard';
export { default as TutorCourses } from './pages/tutor/Courses';
export { default as TutorCourseDetails } from './pages/tutor/CourseDetails';
export { default as ScheduleMeeting } from './pages/tutor/ScheduleMeeting';
export { default as TutorMeetingRoom } from './pages/meeting/TutorMeetingRoom';
export { default as StudentMeetingRoom } from './pages/meeting/StudentMeetingRoom';
export { default as MyMeetings } from './pages/student/MyMeetings';
export { default as Home } from './pages/Home';

// Route constants for easy reference
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT_DASHBOARD: '/student',
  STUDENT_COURSES: '/student/courses',
  STUDENT_MY_COURSES: '/student/my-courses',
  STUDENT_COURSE_DETAILS: '/student/course/:id',
  
  STUDENT_MEETINGS: '/student/meetings',
  TUTOR_DASHBOARD: '/tutor',
  TUTOR_COURSES: '/tutor/courses',
  TUTOR_COURSE_DETAILS: '/tutor/course/:id',
  TUTOR_SCHEDULE_MEETING: '/tutor/schedule-meeting',
  TUTOR_EARNINGS: '/tutor/earnings',
  TUTOR_MEETINGS: '/tutor/meetings',
  TUTOR_MEETING_ROOM: '/meeting/tutor/:meetingId',
  STUDENT_MEETING_ROOM: '/meeting/student/:meetingId',
};