import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function RoleBasedRoute({ roles }) {
  const { role } = useAuth();
  return roles.includes(role) ? <Outlet /> : <Navigate to="/dashboard" replace />;
}