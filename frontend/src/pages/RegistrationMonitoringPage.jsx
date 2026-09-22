import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Trophy, Calendar, Users, Ticket, ArrowUpRight } from 'lucide-react';

export const RegistrationMonitoringPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Registration & Ticketing Stream</h1>
        <p className="text-xs text-slate-400">Live platform-wide transaction feed and player enrollment monitoring</p>
      </div>

      {/* Feed Card */}
      <div className="cyber-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-cyan-400" />
          <span>Real-Time Player Registrations</span>
        </h3>

        <div className="space-y-3">
          {[
            { id: 1, gamer: 'Alex Mercer (shadow_ninja)', event: 'Valorant Champions Arena 2026', type: 'Tournament Bracket (5v5 Tactical)', time: '10 mins ago', status: 'CONFIRMED' },
            { id: 2, gamer: 'Samantha Ray (pixel_queen)', event: 'Valorant Champions Arena 2026', type: 'General Admission Pass ($15.00)', time: '25 mins ago', status: 'CONFIRMED' },
            { id: 3, gamer: 'Marcus Vance (vance_fps)', event: 'Apex Legends Global LAN Clash', type: 'Trios Sudden Death Bracket', time: '1 hour ago', status: 'CONFIRMED' },
            { id: 4, gamer: 'Elena Rostova (cyber_valk)', event: 'Apex Legends Global LAN Clash', type: 'VIP Player Pass ($50.00)', time: '2 hours ago', status: 'CONFIRMED' },
          ].map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">{item.gamer}</p>
                <p className="text-xs text-cyan-400">{item.event}</p>
                <p className="text-[10px] text-slate-500">{item.type} • {item.time}</p>
              </div>

              <span className="cyber-badge bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] self-start sm:self-auto">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
