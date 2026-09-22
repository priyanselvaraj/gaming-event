import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { 
  Trophy, 
  PlusCircle, 
  Calendar, 
  DollarSign, 
  Users, 
  Trash2, 
  ShieldCheck,
  ArrowLeft 
} from 'lucide-react';

export const TournamentManagementPage = () => {
  const [searchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [myEvents, setMyEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    tournamentName: '',
    description: '',
    gameName: '',
    maxParticipants: 32,
    registrationStartDate: '',
    registrationDeadline: '',
    entryFee: 0,
    prizePool: 1000,
    rules: '',
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
        console.error('Failed to load organizer events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    const loadTournaments = async () => {
      setLoading(true);
      try {
        const res = await eventService.getTournamentsByEvent(selectedEventId);
        if (res.success) {
          setTournaments(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load tournaments:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTournaments();
  }, [selectedEventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      error('Please select a target event first.');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        tournamentName: formData.tournamentName,
        description: formData.description,
        gameName: formData.gameName,
        eventId: Number(selectedEventId),
        maxParticipants: Number(formData.maxParticipants),
        registrationStartDate: `${formData.registrationStartDate}T00:00:00`,
        registrationDeadline: `${formData.registrationDeadline}T23:59:59`,
        entryFee: Number(formData.entryFee),
        prizePool: Number(formData.prizePool),
        rules: formData.rules,
        status: 'REGISTRATION_OPEN'
      };

      const res = await eventService.createTournament(payload);
      if (res.success) {
        success('Tournament bracket created successfully!');
        setIsModalOpen(false);
        // Refresh tournaments
        const refresh = await eventService.getTournamentsByEvent(selectedEventId);
        if (refresh.success) setTournaments(refresh.data || []);
      }
    } catch (err) {
      error(err.message || 'Failed to create tournament.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    try {
      const res = await eventService.deleteTournament(id);
      if (res.success) {
        success('Tournament deleted.');
        setTournaments((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      error(err.message || 'Failed to delete tournament.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Tournaments & Brackets</h1>
          <p className="text-xs text-slate-400">Configure competition brackets, prize pools, and entry rules</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedEventId}
          className="cyber-btn-primary text-xs uppercase font-bold tracking-wider flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Tournament Stage</span>
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
              {event.eventName} ({event.gameName})
            </option>
          ))}
        </select>
      </div>

      {/* Tournaments List */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading tournament brackets..." />
      ) : tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-[#121824] border border-slate-800 p-5 rounded-2xl space-y-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="cyber-badge bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {tournament.gameName}
                    </span>
                    <span className="cyber-badge bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {tournament.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{tournament.tournamentName}</h3>
                </div>

                <button
                  onClick={() => handleDelete(tournament.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{tournament.description}</p>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Prize Pool</span>
                  <span className="font-extrabold text-cyan-400">${tournament.prizePool}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Slots</span>
                  <span className="font-bold">{tournament.currentParticipants || 0} / {tournament.maxParticipants}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Fee</span>
                  <span className="font-bold">{tournament.entryFee > 0 ? `$${tournament.entryFee}` : 'Free'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cyber-card p-12 text-center space-y-3">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Tournaments Configured</h3>
          <p className="text-xs text-slate-400">
            Create tournament brackets under this event to allow competitive registrations.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="cyber-btn-primary text-xs uppercase font-bold mt-2"
          >
            Create Tournament Stage
          </button>
        </div>
      )}

      {/* Create Tournament Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Tournament Bracket"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateTournament} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Tournament Name *</label>
            <input
              type="text"
              name="tournamentName"
              required
              value={formData.tournamentName}
              onChange={handleChange}
              placeholder="e.g. 5v5 Tactical Championship"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Game Name *</label>
              <input
                type="text"
                name="gameName"
                required
                value={formData.gameName}
                onChange={handleChange}
                placeholder="Valorant"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Max Slots *</label>
              <input
                type="number"
                name="maxParticipants"
                min="2"
                required
                value={formData.maxParticipants}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Entry Fee ($)</label>
              <input
                type="number"
                step="0.01"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Prize Pool ($)</label>
              <input
                type="number"
                step="0.01"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Reg Start Date *</label>
              <input
                type="date"
                name="registrationStartDate"
                required
                value={formData.registrationStartDate}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Deadline *</label>
              <input
                type="date"
                name="registrationDeadline"
                required
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Rules & Guidelines</label>
            <textarea
              name="rules"
              rows="3"
              value={formData.rules}
              onChange={handleChange}
              placeholder="Bracket format, player rank requirements, check-in instructions..."
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
              {actionLoading ? 'Saving...' : 'Add Bracket'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
