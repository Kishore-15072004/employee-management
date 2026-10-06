import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}