import React, { createContext, useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from './AuthContext';

export const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/api/complaints');
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  return (
    <ComplaintContext.Provider value={{ complaints, loading, fetchComplaints, setComplaints }}>
      {children}
    </ComplaintContext.Provider>
  );
};
