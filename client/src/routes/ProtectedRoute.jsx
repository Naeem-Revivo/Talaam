import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export const RoleRoute = ({ allow = [] }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allow.length > 0 && !allow.includes(role)) {
    // If user is logged in but not allowed, redirect them to their home
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return <Outlet />;
};
