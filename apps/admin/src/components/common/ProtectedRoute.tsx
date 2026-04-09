import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('admin_token');
  let user = null;
  
  try {
    user = JSON.parse(localStorage.getItem('admin_user') || 'null');
  } catch (e) {
    console.error('Failed to parse admin user:', e);
  }

  if (!token || user?.role !== 'ADMIN') {
    // Clear storage just in case of stale/invalid data
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
