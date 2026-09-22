import api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  // Authenticate user credentials
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  // Fetch logged in user profile
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  // Store auth tokens and user data in local storage
  setSession: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear auth session
  clearSession: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from storage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
