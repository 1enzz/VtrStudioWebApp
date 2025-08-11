import React from 'react';
import { Navigate } from 'react-router-dom';

export const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const isLogged = !!localStorage.getItem('adminToken');
  return isLogged ? children : <Navigate to="/admin/login" replace />;
};
