import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { 
  CheckSquare, 
  Check, 
  X, 
  Eye, 
  Calendar, 
  MapPin, 
  Globe, 
  Users, 
  Trophy,
  AlertCircle
} from 'lucide-react';

export const EventApprovalPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [inspectEvent, setInspectEvent] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const { success, error } = useNotification();

  const fetchPendingEvents = async () => {
    try {
      const res = await eventService.getEvents({ status: 'PENDING' });
      if (res.success) {
        setEvents(res.data?.content || res.data || []);
      }
    } catch (err) {
      console.error('Failed to load pending events:', err);
      error('Failed to load pending events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const handleApprove = async (eventId) => {
    setActionLoading(true);
    try {
      const res = await eventService.approveEvent(eventId);
      if (res.success) {
        success('Event has been APPROVED and is now live to the public!');
        setInspectEvent(null);
        fetchPendingEvents();
      }
    } catch (err) {
      error(err.message || 'Failed to approve event.');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (eventId) => {
    setSelectedEventId(eventId);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!selectedEventId) return;
    setActionLoading(true);
    try {
      const res = await eventService.rejectEvent(selectedEventId, rejectReason);
      if (res.success) {
        success('Event has been REJECTED.');
        setRejectModalOpen(false);
        setInspectEvent(null);
        fetchPendingEvents();
      }
    } catch (err) {
      error(err.message || 'Failed to reject event.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading pending events for moderation..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Event Moderation & Approvals</h1>
        <p className="text-xs text-slate-400">Review organizer event submissions before they become publicly indexed</p>
      </div>

      {/* Events Feed */}
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#121824] border border-slate-800 p-5 rounded-2xl space-y-4 hover:border-amber-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="cyber-badge bg-amber-950 text-amber-400 border border-amber-500/30">
                      Pending Review
                    </span>
                    <span className="cyber-badge bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {event.category?.name || 'Category'}
                    </span>
                    <span className="cyber-badge bg-slate-900 text-slate-300 border border-slate-700">
                      {event.eventType}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{event.eventName}</h3>
                  <p className="text-xs text-slate-400">
                    Organizer: <strong className="text-slate-200">{event.organizer?.fullName || event.organizer?.username}</strong> ({event.organizer?.email})
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectEvent(event)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                    title="Inspect Full Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openRejectModal(event.id)}
                    disabled={actionLoading}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(event.id)}
                    disabled={actionLoading}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-emerald-600/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Event</span>
                  </button>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Game</span>
                  <span className="font-bold text-cyan-400">{event.gameName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Event Date</span>
                  <span className="font-bold">{event.eventDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Capacity</span>
                  <span className="font-bold">{event.maximumCapacity} Slots</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Venue / Link</span>
                  <span className="font-bold truncate block">{event.location || event.onlineEventLink || 'Online'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cyber-card p-12 text-center space-y-3">
          <CheckSquare className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Pending Events</h3>
          <p className="text-xs text-slate-400">
            All submitted tournaments and events have been reviewed.
          </p>
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Event Submission"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Please provide optional feedback or reason for rejecting this event submission:
          </p>
          <textarea
            rows="3"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Missing tournament rules or incorrect venue details..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="cyber-btn-secondary text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Inspect Event Modal */}
      <Modal
        isOpen={!!inspectEvent}
        onClose={() => setInspectEvent(null)}
        title="Event Inspection Details"
        maxWidth="max-w-2xl"
      >
        {inspectEvent && (
          <div className="space-y-4 text-xs text-slate-300">
            <div>
              <h3 className="text-base font-bold text-white">{inspectEvent.eventName}</h3>
              <p className="text-cyan-400">Game: {inspectEvent.gameName} ({inspectEvent.category?.name})</p>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Event Description</span>
              <p className="leading-relaxed whitespace-pre-line">{inspectEvent.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Date & Time</span>
                <span className="font-bold text-white">{inspectEvent.eventDate} at {inspectEvent.startTime}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Capacity</span>
                <span className="font-bold text-white">{inspectEvent.maximumCapacity} Attendees</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Location / URL</span>
                <span className="font-bold text-white">{inspectEvent.location || inspectEvent.onlineEventLink || 'None provided'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => openRejectModal(inspectEvent.id)}
                className="py-2 px-4 bg-rose-950 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold uppercase"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(inspectEvent.id)}
                disabled={actionLoading}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
