import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/auth';
import { updateProfile as apiUpdateProfile } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setAuthError(null);
    } catch (error) {
      setUser(null);
      setAuthError(error.message || 'Failed to check authentication');
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkAuth, 300);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      setAuthError(null);
      const userData = await loginUser(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      const errorMsg = error.message || 'Login failed';
      setAuthError(errorMsg);
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials) => {
    try {
      setAuthError(null);
      const userData = await registerUser(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      const errorMsg = error.message || 'Registration failed';
      setAuthError(errorMsg);
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setAuthError(null);
      navigate('/login');
    } catch (error) {
      setAuthError(error.message || 'Logout failed');
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await apiUpdateProfile(profileData);
      setUser(updatedUser);
      setAuthError(null);
      return updatedUser;
    } catch (error) {
      setAuthError(error.message || 'Profile update failed');
      throw error;
    }
  };

  const value = {
    user,
    authChecked,
    authError,
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};