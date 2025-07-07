import React from 'react';
import { useAppSelector } from '../store/hooks';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactElement;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAppSelector((state: any) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

interface AdminRouteProps {
  children: React.ReactElement;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAppSelector((state: any) => state.auth);
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};
