import api from './api';

export const dashboardService = {
  // Admin Dashboard stats
  getAdminStats: async () => {
    return await api.get('/dashboard/admin');
  },

  // Organizer Dashboard stats
  getOrganizerStats: async () => {
    return await api.get('/dashboard/organizer');
  },

  // Gamer Dashboard stats
  getGamerStats: async () => {
    return await api.get('/dashboard/gamer');
  },

  // Admin: Get all users
  getUsers: async (params = {}) => {
    return await api.get('/users', { params });
  },

  // Admin: Update user status (ACTIVE, INACTIVE, SUSPENDED)
  updateUserStatus: async (userId, status) => {
    return await api.patch(`/users/${userId}/status`, { status });
  }
};
