import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import { registrationService } from '../services/registrationService';
import { ticketService } from '../services/ticketService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Trophy, 
  Ticket, 
  Calendar, 
  Gamepad2, 
  ArrowRight, 
  Clock, 
  MapPin, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export const GamerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    registeredEventsCount: 0,
    activeTournamentsCount: 0,
    purchasedTicketsCount: 0,
  });
  const [registrations, setRegistrations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, regRes, tickRes] = await Promise.all([
          dashboardService.getGamerStats(),
          registrationService.getMyRegistrations({ size: 5 }),
          ticketService.getMyTickets({ size: 3 })
        ]);

        if (statsRes.success) setStats(statsRes.data || {});
        if (regRes.success) setRegistrations(regRes.data?.content || regRes.data || []);
        if (tickRes.success) setTickets(tickRes.data?.content || tickRes.data || []);
      } catch (err) {
        console.error('Failed to load gamer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading gamer dashboard..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#121824] via-[#162032] to-[#121824] border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="cyber-badge bg-cyan-950 text-cyan-400 border border-cyan-500/30">Player Portal</span>
            <span className="text-xs text-slate-400">Welcome,</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            {user?.fullName || user?.username}
          </h1>
          <p className="text-xs text-slate-400">
            Track your esports registrations, active match schedules, and digital admission passes.
          </p>
        </div>

        <Link
          to="/events"
          className="cyber-btn-primary text-xs uppercase font-bold tracking-wider shrink-0 flex items-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Discover New Events</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Registered Events</span>
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats.registeredEventsCount || registrations.filter(r => !r.tournament).length}
          </p>
          <Link to="/gamer/registrations" className="text-[11px] text-cyan-400 font-semibold hover:underline flex items-center gap-1">
            <span>View Registrations</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Tournament Brackets</span>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats.activeTournamentsCount || registrations.filter(r => r.tournament).length}
          </p>
          <Link to="/gamer/registrations" className="text-[11px] text-cyan-400 font-semibold hover:underline flex items-center gap-1">
            <span>View Active Brackets</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider">Purchased Passes</span>
            <Ticket className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats.purchasedTicketsCount || tickets.length}
          </p>
          <Link to="/gamer/tickets" className="text-[11px] text-cyan-400 font-semibold hover:underline flex items-center gap-1">
            <span>View Ticket Passes</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>

      {/* Content Grid: Recent Registrations & Active Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Registrations */}
        <div className="cyber-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <span>Recent Registrations</span>
            </h3>
            <Link to="/gamer/registrations" className="text-xs text-cyan-400 hover:underline">
              View All
            </Link>
          </div>

          {registrations.length > 0 ? (
            <div className="space-y-3">
              {registrations.slice(0, 4).map((reg) => (
                <div
                  key={reg.id}
                  className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white line-clamp-1">
                      {reg.event?.eventName}
                    </p>
                    <p className="text-[11px] text-cyan-400 font-medium">
                      {reg.tournament ? `Bracket: ${reg.tournament.tournamentName}` : `Game: ${reg.event?.gameName}`}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Enrolled on {new Date(reg.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`cyber-badge text-[10px] ${
                    reg.status === 'CONFIRMED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  }`}>
                    {reg.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <Gamepad2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p>You have not registered for any events or tournaments yet.</p>
              <Link to="/events" className="cyber-btn-secondary inline-block text-[11px] font-bold mt-2">
                Browse Events
              </Link>
            </div>
          )}
        </div>

        {/* Active Passes / Tickets */}
        <div className="cyber-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-purple-400" />
              <span>Digital Passes</span>
            </h3>
            <Link to="/gamer/tickets" className="text-xs text-cyan-400 hover:underline">
              View All
            </Link>
          </div>

          {tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.slice(0, 3).map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-gradient-to-r from-slate-900 to-[#171f2e] border border-purple-500/30 p-4 rounded-xl space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                        {ticket.ticketType?.ticketName || 'Admission Pass'}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{ticket.event?.eventName}</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-950 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">
                      {ticket.ticketNumber}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>Date: {ticket.event?.eventDate}</span>
                    <span className="text-emerald-400 font-bold uppercase">{ticket.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <Ticket className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No admission passes purchased yet.</p>
              <Link to="/events" className="cyber-btn-secondary inline-block text-[11px] font-bold mt-2">
                Get Passes
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
