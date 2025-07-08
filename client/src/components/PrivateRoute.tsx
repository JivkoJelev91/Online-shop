import React from 'react';
import { useAppSelector } from '../store/hooks';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactElement;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

interface AdminRouteProps {
  children: React.ReactElement;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  // You may want to decode the token and check for admin role here
  // For now, fallback to previous logic if needed
  if (!token) return <Navigate to="/login" replace />;
  // Optionally, add role check here
  return children;
};
