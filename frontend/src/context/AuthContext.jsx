import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { login as loginRequest } from '../services/authService.js';

export const AuthContext = createContext(null);

function readUser() {
  try { return JSON.parse(sessionStorage.getItem('peopleos_user') || 'null'); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(() => sessionStorage.getItem('peopleos_token'));

  const logout = useCallback(() => {
    sessionStorage.removeItem('peopleos_token');
    sessionStorage.removeItem('peopleos_user');
    setToken(null);
    setUser(null);
  }, []);

  const acceptLoginResponse = useCallback((response) => {
    const sessionUser = { username: response.username, role: response.role };
    sessionStorage.setItem('peopleos_token', response.token);
    sessionStorage.setItem('peopleos_user', JSON.stringify(sessionUser));
    setToken(response.token);
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);
    return acceptLoginResponse(response);
  }, [acceptLoginResponse]);

  useEffect(() => {
    window.addEventListener('peopleos:unauthorized', logout);
    return () => window.removeEventListener('peopleos:unauthorized', logout);
  }, [logout]);

  return <AuthContext.Provider value={{ user, token, role: user?.role || null, isAuthenticated: Boolean(user && token), login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}