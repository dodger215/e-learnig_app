// src/contexts/AuthContext.jsx (corrected imports)
import { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import * as authApi from '../api/authApi'; // This should work now

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(userData);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      setToken(response.token);
      setUser(response);
      message.success('Login successful!');
      return response;
    } catch (error) {
      message.error(error.message || 'Invalid email or password');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      setToken(response.token);
      setUser(response);
      message.success('Registration successful!');
      return response;
    } catch (error) {
      message.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    message.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isTutor: user?.role === 'tutor',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};