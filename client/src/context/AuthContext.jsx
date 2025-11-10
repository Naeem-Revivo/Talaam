import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const STATIC_CREDENTIALS = {
  admin: {
    email: 'admin@talaam.com',
    password: 'Admin@123',
    role: 'admin',
    name: 'Admin',
  },
  user: {
    email: 'user@talaam.com',
    password: 'User@123',
    role: 'user',
    name: 'John Smith',
  },
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('talaam_auth_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('talaam_auth_user');
      }
    }
  }, []);

  // Persist to localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('talaam_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('talaam_auth_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const matchAdmin =
      email.trim().toLowerCase() === STATIC_CREDENTIALS.admin.email &&
      password === STATIC_CREDENTIALS.admin.password;
    const matchUser =
      email.trim().toLowerCase() === STATIC_CREDENTIALS.user.email &&
      password === STATIC_CREDENTIALS.user.password;

    if (matchAdmin) {
      const user = {
        email: STATIC_CREDENTIALS.admin.email,
        role: STATIC_CREDENTIALS.admin.role,
        name: STATIC_CREDENTIALS.admin.name,
      };
      setCurrentUser(user);
      navigate('/admin', { replace: true });
      return { ok: true, role: 'admin' };
    }
    if (matchUser) {
      const user = {
        email: STATIC_CREDENTIALS.user.email,
        role: STATIC_CREDENTIALS.user.role,
        name: STATIC_CREDENTIALS.user.name,
      };
      setCurrentUser(user);
      navigate('/dashboard', { replace: true });
      return { ok: true, role: 'user' };
    }
    return { ok: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({
      user: currentUser,
      isAuthenticated: !!currentUser,
      role: currentUser?.role ?? null,
      login,
      logout,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};


