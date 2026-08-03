import { startTransition, useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContextValue';

const persistUser = (setUser, nextUser) => {
  startTransition(() => {
    setUser(nextUser);
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem('token');
    persistUser(setUser, null);
  };

  const refreshUser = async () => {
    const res = await api.get('/auth/me');
    persistUser(setUser, res.data.data);
    return res.data.data;
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    persistUser(setUser, res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      persistUser(setUser, res.data.user);
    }
    return res.data;
  };

  const verifyEmail = async (email, code) => {
    const res = await api.post('/auth/verify-email', { email, code });
    localStorage.setItem('token', res.data.token);
    persistUser(setUser, res.data.user);
    return res.data;
  };

  const resendCode = async (email) => {
    const res = await api.post('/auth/resend-code', { email });
    return res.data;
  };

  const googleLogin = async (idToken, role = 'student') => {
    const res = await api.post('/auth/google-login', { idToken, role });
    localStorage.setItem('token', res.data.token);
    persistUser(setUser, res.data.user);
    return res.data;
  };

  const updateProfile = async (payload) => {
    const res = await api.put('/auth/profile', payload);
    persistUser(setUser, res.data.data);
    return res.data;
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyEmail,
        resendCode,
        googleLogin,
        updateProfile,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
