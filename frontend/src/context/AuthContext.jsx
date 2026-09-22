import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session validation failed:', err);
          authService.clearSession();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    authService.setSession(token, userData);
    setUser(userData);
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
    window.location.href = '/login';
  };

  const isRole = (roleName) => {
    if (!user) return false;
    const role = typeof user.role === 'object' ? user.role?.name : user.role;
    return role === roleName || role === `ROLE_${roleName}`;
  };

  const isAdmin = () => isRole('ROLE_ADMIN') || isRole('ADMIN');
  const isOrganizer = () => isRole('ROLE_ORGANIZER') || isRole('ORGANIZER');
  const isGamer = () => isRole('ROLE_GAMER') || isRole('GAMER');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin,
        isOrganizer,
        isGamer,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
