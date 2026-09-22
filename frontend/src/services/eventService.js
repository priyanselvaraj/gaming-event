import api from './api';

export const eventService = {
  // Public event browsing with search and filters
  getEvents: async (params = {}) => {
    return await api.get('/events', { params });
  },

  // Get event details by ID
  getEventById: async (id) => {
    return await api.get(`/events/${id}`);
  },

  // Organizer: Get my created events
  getMyEvents: async (params = {}) => {
    return await api.get('/events/my-events', { params });
  },

  // Create new event
  createEvent: async (eventData) => {
    return await api.post('/events', eventData);
  },

  // Update event
  updateEvent: async (id, eventData) => {
    return await api.put(`/events/${id}`, eventData);
  },

  // Delete event
  deleteEvent: async (id) => {
    return await api.delete(`/events/${id}`);
  },

  // Submit draft event for admin review
  submitEvent: async (id) => {
    return await api.post(`/events/${id}/submit`);
  },

  // Admin: Approve event
  approveEvent: async (id) => {
    return await api.post(`/events/${id}/approve`);
  },

  // Admin: Reject event
  rejectEvent: async (id, reason) => {
    return await api.post(`/events/${id}/reject`, { reason });
  },

  // Categories
  getCategories: async () => {
    return await api.get('/categories');
  },

  createCategory: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  // Tournaments
  getTournaments: async (params = {}) => {
    return await api.get('/tournaments', { params });
  },

  getTournamentsByEvent: async (eventId) => {
    return await api.get(`/tournaments?eventId=${eventId}`);
  },

  createTournament: async (tournamentData) => {
    return await api.post('/tournaments', tournamentData);
  },

  updateTournament: async (id, tournamentData) => {
    return await api.put(`/tournaments/${id}`, tournamentData);
  },

  deleteTournament: async (id) => {
    return await api.delete(`/tournaments/${id}`);
  }
};
