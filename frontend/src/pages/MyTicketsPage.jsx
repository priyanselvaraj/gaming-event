import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await ticketService.getMyTickets();
        if (res.success) {
          setTickets(res.data?.content || res.data || []);
        }
      } catch (err) {
        console.error('Failed to load tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your digital tickets..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">My Digital Passes</h1>
          <p className="text-xs text-slate-400">View and present your unique admission tickets for tournament check-in</p>
        </div>

        <Link to="/events" className="cyber-btn-primary text-xs uppercase font-bold tracking-wider self-start sm:self-auto">
          + Buy More Passes
        </Link>
      </div>

      {/* Tickets List */}
      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-gradient-to-br from-[#121824] via-[#162032] to-[#0E131F] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-cyan-400 transition-all duration-300"
            >
              {/* Glowing Corner Indicator */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4">
                {/* Top Row: Event Name & Pass Tier */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="cyber-badge bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] mb-1">
                      {ticket.ticketType?.ticketName || 'General Pass'}
                    </span>
                    <h3 className="text-base font-bold text-white line-clamp-1">{ticket.event?.eventName}</h3>
                  </div>
                  <span className="cyber-badge bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px]">
                    {ticket.status}
                  </span>
                </div>

                {/* Event Schedule Info */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{ticket.event?.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{ticket.event?.startTime?.substring(0, 5)}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{ticket.event?.location || 'Online Esports Arena'}</span>
                  </div>
                </div>

                {/* Simulated Barcode / QR Section */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pass Serial Number</p>
                    <p className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
                      {ticket.ticketNumber}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Purchased {new Date(ticket.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-950 border border-cyan-500/40 rounded-xl flex items-center justify-center text-cyan-400 shrink-0">
                    <QrCode className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 mt-4">
                <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Pass
                </span>
                <Link
                  to={`/events/${ticket.event?.id}`}
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-xs font-bold"
                >
                  <span>Event Info</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cyber-card p-12 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Tickets Purchased</h3>
          <p className="text-xs text-slate-400">
            You don't have any digital passes yet. Check out upcoming events and secure your admission!
          </p>
          <Link to="/events" className="cyber-btn-primary inline-block text-xs uppercase font-bold mt-2">
            Explore Events & Passes
          </Link>
        </div>
      )}

    </div>
  );
};
