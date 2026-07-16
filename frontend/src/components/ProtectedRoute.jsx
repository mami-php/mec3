import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export const ProtectedRoute = ({ roles, children }) => {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink text-white">
        <div className="animate-pulse text-gold font-semibold">Yükleniyor…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const path = user.role === 'admin' ? '/admin' : user.role === 'mentor' ? '/mentor' : '/student';
    return <Navigate to={path} replace />;
  }

  return children;
};
