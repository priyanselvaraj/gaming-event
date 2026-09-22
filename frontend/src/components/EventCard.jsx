import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Globe, Trophy, ArrowRight } from 'lucide-react';

export const EventCard = ({ event }) => {
  if (!event) return null;

  const defaultBanner = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop";
  const capacityPercent = Math.min(100, Math.round(((event.currentCapacity || 0) / (event.maximumCapacity || 100)) * 100));

  return (
    <div className="cyber-card group overflow-hidden flex flex-col justify-between">
      <div>
        {/* Banner with Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={event.eventBannerUrl || defaultBanner}
            alt={event.eventName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = defaultBanner; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121824] via-transparent to-black/40" />

          {/* Top Category Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="cyber-badge bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
              {event.category?.name || 'Esports'}
            </span>
            <span className="cyber-badge bg-slate-900/80 text-slate-300 border border-slate-700 backdrop-blur-md">
              {event.eventType}
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`cyber-badge ${
              event.status === 'APPROVED' 
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                : event.status === 'PENDING'
                ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border border-slate-600'
            }`}>
              {event.status}
            </span>
          </div>

          {/* Game Title Over Banner */}
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-cyan-500/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>{event.gameName}</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {event.eventName}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.description || 'Join this exciting gaming competition and compete for glory and prizes!'}
          </p>

          {/* Details Row */}
          <div className="pt-2 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{event.eventDate} at {event.startTime?.substring(0, 5)}</span>
            </div>

            <div className="flex items-center gap-2">
              {event.eventType === 'ONLINE' ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">Online Match Tournament</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{event.location || 'Esports Arena'}</span>
                </>
              )}
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-semibold">
                <Users className="w-3 h-3 text-cyan-400" />
                Capacity
              </span>
              <span>{event.currentCapacity || 0} / {event.maximumCapacity} Registered</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  capacityPercent >= 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0">
        <Link
          to={`/events/${event.id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-slate-700/80 hover:border-cyan-400"
        >
          <span>View Details & Register</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
