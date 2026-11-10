import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(api.getToken());
  const [loading, setLoading] = useState(true);

  // Initialize auth state by verifying token with backend
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = api.getToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.success && response.user) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          api.setToken(null);
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('Authentication initialization failed:', err.message);
        api.setToken(null);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to 401 expired event
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success) {
      api.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.success) {
      api.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = () => {
    api.setToken(null);
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Demo Fast-Logins for effortless demonstration
  const loginAsCustomer = async () => {
    return await login('customer@banquetflow.com', 'customer123');
  };

  const loginAsAdmin = async () => {
    return await login('admin@banquetflow.com', 'admin123');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
    updateUser,
    loginAsCustomer,
    loginAsAdmin
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

