import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { eventService } from '../services/eventService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Users,
  Calendar,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Shield,
  ArrowRight,
  UserCheck,
  Trophy,
  Ticket
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGamers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    pendingEventsCount: 0,
    approvedEventsCount: 0,
    totalRegistrations: 0,
    totalTicketsSold: 0,
    totalRevenue: '0.00'
  });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          dashboardService.getAdminStats(),
          eventService.getEvents({ status: 'PENDING', size: 5 })
        ]);

        if (statsRes.success) setStats(statsRes.data || {});
        if (eventsRes.success) setPendingEvents(eventsRes.data?.content || eventsRes.data || []);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading admin control console..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#121824] via-[#1A261E] to-[#121824] border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="cyber-badge bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            Platform Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Admin Command Center
          </h1>
          <p className="text-xs text-slate-400">
            System overview, tournament approvals, user moderation, and platform revenue metrics.
          </p>
        </div>

        <Link
          to="/admin/approvals"
          className="cyber-btn-primary text-xs uppercase font-bold tracking-wider shrink-0 flex items-center gap-2"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Review Pending Events ({stats.pendingEventsCount || pendingEvents.length})</span>
        </Link>
      </div>

      {/* Global Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats.totalUsers || 0}
          </p>
          <p className="text-[10px] text-slate-500">
            {stats.totalGamers || 0} Gamers • {stats.totalOrganizers || 0} Organizers
          </p>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Pending Approvals</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 font-display">
            {stats.pendingEventsCount || pendingEvents.length}
          </p>
          <Link to="/admin/approvals" className="text-[11px] text-amber-400 font-semibold hover:underline flex items-center gap-1">
            <span>Moderate Now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Tickets Sold</span>
            <Ticket className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats.totalTicketsSold || 0}
          </p>
          <p className="text-[10px] text-slate-500">Across all platform events</p>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-300 font-display">
            ${stats.totalRevenue || '0.00'}
          </p>
          <span className="text-[10px] text-slate-500 block">Gross Platform Volume</span>
        </div>

      </div>

      {/* Pending Events Moderation Feed */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            <span>Pending Events Awaiting Review</span>
          </h3>
          <Link to="/admin/approvals" className="text-xs text-cyan-400 hover:underline">
            View All Pending
          </Link>
        </div>

        {pendingEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Event Name</th>
                  <th className="p-3">Game Title</th>
                  <th className="p-3">Organizer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {pendingEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-bold text-white">{event.eventName}</td>
                    <td className="p-3 text-cyan-400">{event.gameName}</td>
                    <td className="p-3">{event.organizer?.fullName || event.organizer?.username}</td>
                    <td className="p-3">{event.eventDate}</td>
                    <td className="p-3 text-right">
                      <Link
                        to="/admin/approvals"
                        className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold hover:bg-amber-500/30 transition-colors"
                      >
                        Inspect & Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <Shield className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-semibold text-slate-300">All caught up!</p>
            <p>No events currently pending review.</p>
          </div>
        )}
      </div>

    </div>
  );
};
