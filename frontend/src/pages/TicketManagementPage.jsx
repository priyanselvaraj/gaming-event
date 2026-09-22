import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { ticketService } from '../services/ticketService';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { Ticket, PlusCircle, DollarSign, Users, Sparkles } from 'lucide-react';

export const TicketManagementPage = () => {
  const [searchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [myEvents, setMyEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    ticketName: '',
    description: '',
    price: 15.00,
    quantityAvailable: 100,
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await eventService.getMyEvents();
        if (res.success) {
          const list = res.data?.content || res.data || [];
          setMyEvents(list);
          if (!selectedEventId && list.length > 0) {
            setSelectedEventId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    const loadTickets = async () => {
      setLoading(true);
      try {
        const res = await ticketService.getTicketTypesByEvent(selectedEventId);
        if (res.success) {
          setTicketTypes(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, [selectedEventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      error('Please select an event.');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        ticketName: formData.ticketName,
        description: formData.description,
        price: Number(formData.price),
        quantityAvailable: Number(formData.quantityAvailable),
        status: 'ACTIVE'
      };

      const res = await ticketService.createTicketType(selectedEventId, payload);
      if (res.success) {
        success('Ticket tier created successfully!');
        setIsModalOpen(false);
        const refresh = await ticketService.getTicketTypesByEvent(selectedEventId);
        if (refresh.success) setTicketTypes(refresh.data || []);
      }
    } catch (err) {
      error(err.message || 'Failed to create ticket tier.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Ticket Tiers & Quotas</h1>
          <p className="text-xs text-slate-400">Configure VIP passes, general admission tickets, and stock limits</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedEventId}
          className="cyber-btn-primary text-xs uppercase font-bold tracking-wider flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Ticket Tier</span>
        </button>
      </div>

      {/* Target Event Filter */}
      <div className="bg-[#121824] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Target Event:
        </label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full sm:w-80 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
        >
          {myEvents.map((event) => (
            <option key={event.id} value={event.id}>
              {event.eventName}
            </option>
          ))}
        </select>
      </div>

      {/* Ticket Types Grid */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading ticket quotas..." />
      ) : ticketTypes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ticketTypes.map((tier) => {
            const sold = tier.quantitySold || 0;
            const available = tier.quantityAvailable || 0;
            const remaining = Math.max(0, available - sold);

            return (
              <div
                key={tier.id}
                className="bg-[#121824] border border-slate-800 p-5 rounded-2xl space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-white">{tier.ticketName}</h3>
                    <span className="text-lg font-extrabold text-cyan-400 font-display">
                      {tier.price > 0 ? `$${tier.price}` : 'FREE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{tier.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Sold / Allocated:</span>
                    <span className="font-bold text-white">{sold} / {available}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Remaining Inventory:</span>
                    <span className={`font-bold ${remaining === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {remaining} Passes
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="cyber-card p-12 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Ticket Tiers Configured</h3>
          <p className="text-xs text-slate-400">
            Add tiered passes (General, VIP, Early Bird) to start selling admissions.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="cyber-btn-primary text-xs uppercase font-bold mt-2"
          >
            Create Ticket Tier
          </button>
        </div>
      )}

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Ticket Tier"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Ticket Tier Name *</label>
            <input
              type="text"
              name="ticketName"
              required
              value={formData.ticketName}
              onChange={handleChange}
              placeholder="e.g. VIP Player Pass"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Quantity Available *</label>
              <input
                type="number"
                min="1"
                name="quantityAvailable"
                required
                value={formData.quantityAvailable}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Perks included: front-row seats, player lounge access..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="cyber-btn-secondary text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="cyber-btn-primary text-xs font-bold uppercase tracking-wider"
            >
              {actionLoading ? 'Saving...' : 'Add Tier'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
