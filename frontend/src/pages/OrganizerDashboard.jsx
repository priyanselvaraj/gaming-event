import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import { eventService } from '../services/eventService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Calendar,
  Users,
  Ticket,
  DollarSign,
  PlusCircle,
  Trophy,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    totalTicketsSold: 0,
    totalRevenue: '0.00'
  });
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          dashboardService.getOrganizerStats(),
          eventService.getMyEvents({ size: 5 })
        ]);

        if (statsRes.success) setStats(statsRes.data || {});
        if (eventsRes.success) setMyEvents(eventsRes.data?.content || eventsRes.data || []);
      } catch (err) {
        console.error('Failed to load organizer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading organizer metrics..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#121824] via-[#1A182F] to-[#121824] border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="cyber-badge bg-purple-950 text-purple-300 border border-purple-500/30">
            Organizer Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            {user?.fullName || user?.username}
          </h1>
          <p className="text-xs text-slate-400">
            Manage your tournaments, monitor registrations, and track ticket revenue.
          </p>
        </div>

        <Link
          to="/organizer/events/create"
          className="cyber-btn-primary text-xs uppercase font-bold tracking-wider shrink-0 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Host New Event</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">My Events</span>
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats.totalEvents || myEvents.length}
          </p>
          <Link to="/organizer/events" className="text-[11px] text-cyan-400 font-semibold hover:underline flex items-center gap-1">
            <span>Manage Events</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Enrolled Players</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats.totalParticipants || 0}
          </p>
          <Link to="/organizer/participants" className="text-[11px] text-purple-400 font-semibold hover:underline flex items-center gap-1">
            <span>View Roster</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Passes Sold</span>
            <Ticket className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats.totalTicketsSold || 0}
          </p>
          <Link to="/organizer/tickets" className="text-[11px] text-emerald-400 font-semibold hover:underline flex items-center gap-1">
            <span>Ticket Quotas</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-300 font-display">
            ${stats.totalRevenue || '0.00'}
          </p>
          <span className="text-[10px] text-slate-500 block">Settled via Mock / Gateways</span>
        </div>

      </div>

      {/* Events Table / Feed */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>My Gaming Events</span>
          </h3>
          <Link to="/organizer/events" className="text-xs text-cyan-400 hover:underline">
            View All
          </Link>
        </div>

        {myEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Event Name</th>
                  <th className="p-3">Game Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {myEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-bold text-white">{event.eventName}</td>
                    <td className="p-3 text-cyan-400">{event.gameName}</td>
                    <td className="p-3">{event.eventDate}</td>
                    <td className="p-3">{event.currentCapacity || 0} / {event.maximumCapacity}</td>
                    <td className="p-3">
                      <span className={`cyber-badge text-[10px] ${
                        event.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : event.status === 'PENDING'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        to={`/events/${event.id}`}
                        className="text-cyan-400 hover:underline font-bold"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <p>You haven't created any events yet.</p>
            <Link to="/organizer/events/create" className="cyber-btn-primary inline-block text-xs font-bold mt-2">
              Create First Event
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};
