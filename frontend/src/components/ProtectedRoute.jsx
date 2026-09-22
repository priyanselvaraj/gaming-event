import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
        <LoadingSpinner size="lg" message="Verifying authentication session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = typeof user.role === 'object' ? user.role?.name : user.role;
    const hasRole = allowedRoles.some(
      (role) => role === userRole || `ROLE_${role}` === userRole || role === userRole?.replace('ROLE_', '')
    );

    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
