import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Calendar,
  PlusCircle,
  Trophy,
  Ticket,
  Send,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

export const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useNotification();

  const fetchMyEvents = async () => {
    try {
      const res = await eventService.getMyEvents();
      if (res.success) {
        setEvents(res.data?.content || res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      error('Failed to load your events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleSubmitForApproval = async (eventId) => {
    setActionLoading(true);
    try {
      const res = await eventService.submitEvent(eventId);
      if (res.success) {
        success('Event submitted for administrator review!');
        fetchMyEvents();
      }
    } catch (err) {
      error(err.message || 'Failed to submit event.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setActionLoading(true);
    try {
      const res = await eventService.deleteEvent(eventId);
      if (res.success) {
        success('Event deleted successfully.');
        fetchMyEvents();
      }
    } catch (err) {
      error(err.message || 'Failed to delete event.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your events..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">My Hosted Events</h1>
          <p className="text-xs text-slate-400">Manage event drafts, submit for review, and configure tournaments</p>
        </div>

        <Link
          to="/organizer/events/create"
          className="cyber-btn-primary text-xs uppercase font-bold tracking-wider self-start sm:self-auto flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Events Table / Card Feed */}
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#121824] border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="cyber-badge bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {event.category?.name || 'Esports'}
                    </span>
                    <span className="cyber-badge bg-slate-900 text-slate-300 border border-slate-700">
                      {event.eventType}
                    </span>
                    <span className={`cyber-badge ${
                      event.status === 'APPROVED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : event.status === 'PENDING'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{event.eventName}</h3>
                  <p className="text-xs text-cyan-400">Game: {event.gameName}</p>
                </div>

                {/* Status-Aware Action Controls */}
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {event.status === 'DRAFT' && (
                    <button
                      onClick={() => handleSubmitForApproval(event.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Review</span>
                    </button>
                  )}

                  <Link
                    to={`/events/${event.id}`}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                    title="Preview Public Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  {event.status === 'DRAFT' && (
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg text-xs"
                      title="Delete Draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Event Schedule & Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date</span>
                  <span className="font-bold">{event.eventDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Time</span>
                  <span className="font-bold">{event.startTime?.substring(0, 5)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Registrations</span>
                  <span className="font-bold text-cyan-400">{event.currentCapacity || 0} / {event.maximumCapacity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Location</span>
                  <span className="font-bold truncate block">{event.location || 'Online'}</span>
                </div>
              </div>

              {/* Management Quick Sub-Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={`/organizer/tournaments?eventId=${event.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:underline"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Configure Tournaments</span>
                </Link>
                <span className="text-slate-700">•</span>
                <Link
                  to={`/organizer/tickets?eventId=${event.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-bold hover:underline"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Manage Ticket Tiers</span>
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="cyber-card p-12 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Events Created Yet</h3>
          <p className="text-xs text-slate-400">
            Create an event draft, configure tournament stages, and submit it for review.
          </p>
          <Link to="/organizer/events/create" className="cyber-btn-primary inline-block text-xs uppercase font-bold mt-2">
            Host New Event
          </Link>
        </div>
      )}

    </div>
  );
};
