import api from './api';

export const registrationService = {
  // Register for an event
  registerForEvent: async (eventId) => {
    return await api.post(`/registrations/event/${eventId}`);
  },

  // Register for a tournament
  registerForTournament: async (tournamentId) => {
    return await api.post(`/registrations/tournament/${tournamentId}`);
  },

  // Gamer: Get my registrations
  getMyRegistrations: async (params = {}) => {
    return await api.get('/registrations/my-registrations', { params });
  },

  // Cancel registration
  cancelRegistration: async (id) => {
    return await api.delete(`/registrations/${id}`);
  },

  // Organizer: Get participants for an event
  getEventParticipants: async (eventId, params = {}) => {
    return await api.get(`/registrations?eventId=${eventId}`, { params });
  }
};
