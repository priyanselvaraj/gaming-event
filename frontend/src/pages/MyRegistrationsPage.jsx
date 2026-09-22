import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Clock, 
  Trash2, 
  Gamepad2, 
  ArrowRight,
  AlertTriangle 
} from 'lucide-react';

export const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useNotification();

  const fetchRegistrations = async () => {
    try {
      const res = await registrationService.getMyRegistrations();
      if (res.success) {
        setRegistrations(res.data?.content || res.data || []);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
      error('Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const openCancelConfirm = (reg) => {
    setSelectedReg(reg);
    setCancelModalOpen(true);
  };

  const handleCancelRegistration = async () => {
    if (!selectedReg) return;
    setActionLoading(true);
    try {
      const res = await registrationService.cancelRegistration(selectedReg.id);
      if (res.success) {
        success('Registration cancelled successfully.');
        setCancelModalOpen(false);
        fetchRegistrations();
      }
    } catch (err) {
      error(err.message || 'Failed to cancel registration.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your event registrations..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">My Registrations</h1>
          <p className="text-xs text-slate-400">Manage your active esports tournaments and event entries</p>
        </div>

        <Link to="/events" className="cyber-btn-primary text-xs uppercase font-bold tracking-wider self-start sm:self-auto">
          + Explore More Events
        </Link>
      </div>

      {/* Registrations List */}
      {registrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-[#121824] border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl space-y-4 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="cyber-badge bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {reg.event?.gameName || 'Game Match'}
                    </span>
                    <span className={`cyber-badge ${
                      reg.status === 'CONFIRMED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}>
                      {reg.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{reg.event?.eventName}</h3>
                </div>

                {reg.status === 'CONFIRMED' && (
                  <button
                    onClick={() => openCancelConfirm(reg)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Cancel Registration"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Tournament Stage Details if present */}
              {reg.tournament && (
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{reg.tournament.tournamentName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Prize Pool: <strong className="text-slate-200">${reg.tournament.prizePool || '0.00'}</strong>
                  </p>
                </div>
              )}

              {/* Date & Location */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{reg.event?.eventDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{reg.event?.startTime?.substring(0, 5)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/events/${reg.event?.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 text-xs font-bold text-slate-200 hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                >
                  <span>View Event Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cyber-card p-12 text-center space-y-3">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Active Registrations</h3>
          <p className="text-xs text-slate-400">
            Browse upcoming tournaments and sign up to participate.
          </p>
          <Link to="/events" className="cyber-btn-primary inline-block text-xs uppercase font-bold mt-2">
            Explore Events
          </Link>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Event Registration"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-bold">Are you sure you want to cancel this registration?</p>
              <p className="text-slate-400 mt-1">
                Your reserved spot will be released to other players.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="w-1/2 cyber-btn-secondary text-xs font-bold"
            >
              Keep Registration
            </button>
            <button
              onClick={handleCancelRegistration}
              disabled={actionLoading}
              className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              {actionLoading ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
