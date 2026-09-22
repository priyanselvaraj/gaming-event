import api from './api';

export const ticketService = {
  // Get all tickets for an event
  getTicketTypesByEvent: async (eventId) => {
    return await api.get(`/events/${eventId}/tickets`);
  },

  // Create ticket tier (Organizer)
  createTicketType: async (eventId, ticketData) => {
    return await api.post(`/events/${eventId}/tickets`, ticketData);
  },

  // Gamer: Get my purchased tickets
  getMyTickets: async (params = {}) => {
    return await api.get('/tickets/my-tickets', { params });
  },

  // Purchase ticket
  purchaseTicket: async (purchaseData) => {
    return await api.post('/tickets/purchase', purchaseData);
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    return await api.get(`/tickets/${id}`);
  }
};
