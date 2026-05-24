import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(normalizeUser(data.user));
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const normalizeUser = (userData) => {
    if (!userData) return null;
    return { _id: userData.id || userData._id, name: userData.name, email: userData.email, role: userData.role };
  };

  const login = async (credentials) => {
    const { data } = await api.post('/api/auth/login', credentials);
    localStorage.setItem('token', data.token);
    setUser(normalizeUser(data.user));
  };

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);
    localStorage.setItem('token', data.token);
    setUser(normalizeUser(data.user));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
