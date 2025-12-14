// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Alert } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LayoutComponent from './components/common/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import ExploreCourses from './pages/student/ExploreCourses';
import MyCourses from './pages/student/MyCourses';
import StudentCourseDetails from './pages/student/CourseDetails';
import { MyMeetings } from './routes';

// Tutor Pages
import TutorDashboard from './pages/tutor/Dashboard';
import TutorCourses from './pages/tutor/Courses';
import TutorCourseDetails from './pages/tutor/CourseDetails';
import ScheduleMeeting from './pages/tutor/ScheduleMeeting';

// Meeting Pages
import TutorMeetingRoom from './pages/meeting/TutorMeetingRoom';
import StudentMeetingRoom from './pages/meeting/StudentMeetingRoom';

// Common
import Home from './pages/Home';

// Meeting Context Provider
import { MeetingProvider } from './contexts/MeetingContext';

import './styles/antd-theme.css';
import './styles/custom.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f0f2f5',
          colorText: '#262626',
          colorTextSecondary: '#8c8c8c',
          colorBorder: '#d9d9d9',
          colorBorderSecondary: '#f0f0f0',
          colorFillSecondary: '#fafafa',
          colorBgElevated: '#ffffff',
          fontSize: 14,
          fontSizeLG: 16,
          fontSizeXL: 20,
          fontSizeHeading1: 38,
          fontSizeHeading2: 30,
          fontSizeHeading3: 24,
          fontSizeHeading4: 20,
          fontSizeHeading5: 16,
          lineHeight: 1.5715,
          controlHeight: 32,
          controlHeightLG: 40,
          controlHeightSM: 24,
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            headerPadding: '0 16px',
            headerHeight: 64,
            siderBg: '#001529',
            bodyBg: '#ffffff',
            footerBg: '#f0f2f5',
            footerPadding: '24px 50px',
          },
          Menu: {
            darkItemBg: '#001529',
            darkItemColor: 'rgba(255, 255, 255, 0.65)',
            darkItemSelectedBg: '#1890ff',
            darkItemSelectedColor: '#ffffff',
            darkItemHoverBg: 'rgba(255, 255, 255, 0.1)',
            darkItemHoverColor: '#ffffff',
            itemHeight: 40,
            itemMarginBlock: 4,
            itemMarginInline: 4,
            itemBorderRadius: 6,
          },
          Card: {
            paddingLG: 24,
            borderRadiusLG: 12,
            boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          Button: {
            borderRadius: 8,
            borderRadiusLG: 8,
            borderRadiusSM: 6,
            controlHeight: 36,
            controlHeightLG: 44,
            controlHeightSM: 28,
            fontSize: 14,
            fontSizeLG: 16,
            fontSizeSM: 12,
          },
          Input: {
            borderRadius: 8,
            borderRadiusLG: 8,
            borderRadiusSM: 6,
            controlHeight: 36,
            controlHeightLG: 44,
            controlHeightSM: 28,
          },
          Select: {
            borderRadius: 8,
            borderRadiusLG: 8,
            borderRadiusSM: 6,
            controlHeight: 36,
            controlHeightLG: 44,
            controlHeightSM: 28,
          },
          Table: {
            borderRadius: 8,
            headerBg: '#fafafa',
            headerColor: '#262626',
            headerBorderRadius: 8,
            cellPaddingBlock: 12,
            cellPaddingInline: 16,
          },
          Modal: {
            borderRadiusLG: 12,
            contentPadding: 24,
            headerMarginBottom: 16,
          },
        },
      }}
    >
      <ErrorBoundary>
        <AuthProvider>
          <SocketProvider>
            <MeetingProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Student Routes */}
                  <Route path="/student" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <LayoutComponent>
                        <StudentDashboard />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  <Route path="/student/courses" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <LayoutComponent>
                        <ExploreCourses />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  <Route path="/student/my-courses" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <LayoutComponent>
                        <MyCourses />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  <Route path="/student/course/:id" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <LayoutComponent>
                        <StudentCourseDetails />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />

                  <Route path="/student/meetings" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <LayoutComponent>
                        <MyMeetings />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  
                  {/* Student Meetings Route (Optional) */}
                  <Route path="/student/meetings" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <LayoutComponent>
                        <Alert
                          message="My Meetings"
                          description="This page would show all your upcoming meetings. For now, meetings are accessible from the course details page."
                          type="info"
                          showIcon
                          style={{ margin: 24 }}
                        />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  
                  {/* Tutor Routes */}
                  <Route path="/tutor" element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                      <LayoutComponent>
                        <TutorDashboard />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  <Route path="/tutor/courses" element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                      <LayoutComponent>
                        <TutorCourses />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  <Route path="/tutor/course/:id" element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                      <LayoutComponent>
                        <TutorCourseDetails />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  <Route path="/tutor/schedule-meeting" element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                      <LayoutComponent>
                        <ScheduleMeeting />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  
                  {/* Tutor Earnings Route (Optional) */}
                  <Route path="/tutor/earnings" element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                      <LayoutComponent>
                        <Alert
                          message="Earnings Dashboard"
                          description="This page would show detailed earnings reports and analytics. For now, earnings are displayed on the main dashboard."
                          type="info"
                          showIcon
                          style={{ margin: 24 }}
                        />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  
                  {/* Tutor Meetings Route (Optional) */}
                  <Route path="/tutor/meetings" element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                      <LayoutComponent>
                        <Alert
                          message="All Meetings"
                          description="This page would show all your scheduled meetings. For now, meetings are managed from the Schedule Meeting page."
                          type="info"
                          showIcon
                          style={{ margin: 24 }}
                        />
                      </LayoutComponent>
                    </ProtectedRoute>
                  } />
                  
                  {/* Meeting Routes */}
                  <Route path="/meeting/tutor/:meetingId" element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                      <TutorMeetingRoom />
                    </ProtectedRoute>
                  } />
                  <Route path="/meeting/student/:meetingId" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentMeetingRoom />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 Route */}
                  <Route path="*" element={
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '100vh',
                      flexDirection: 'column',
                      textAlign: 'center',
                      padding: 20
                    }}>
                      <h1 style={{ fontSize: 48, marginBottom: 16 }}>404</h1>
                      <p style={{ fontSize: 18, marginBottom: 24 }}>Page not found</p>
                      <a href="/" style={{ color: '#1890ff', textDecoration: 'none' }}>
                        Go back to Home
                      </a>
                    </div>
                  } />
                </Routes>
              </Router>
            </MeetingProvider>
          </SocketProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App;