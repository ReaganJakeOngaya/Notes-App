import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/auth';
import { updateProfile as apiUpdateProfile } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const userData = await loginUser(credentials);
    setUser(userData);
    navigate('/');
  };

  const register = async (credentials) => {
    const userData = await registerUser(credentials);
    setUser(userData);
    navigate('/');
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    navigate('/login');
  };

  const updateProfile = async (profileData) => {
    const updatedUser = await apiUpdateProfile(profileData);
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);