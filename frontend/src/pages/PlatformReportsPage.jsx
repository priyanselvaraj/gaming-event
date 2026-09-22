import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, Users, ShieldCheck, Download } from 'lucide-react';

export const PlatformReportsPage = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Platform Analytics & Reports</h1>
          <p className="text-xs text-slate-400">Financial summaries, conversion rates, and participant growth trends</p>
        </div>

        <button
          onClick={() => window.print()}
          className="cyber-btn-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* Analytics Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Average Ticket Price</span>
          <p className="text-3xl font-extrabold text-white font-display">$28.50</p>
          <p className="text-[10px] text-emerald-400 font-semibold">+14% vs last quarter</p>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Tournament Sell-Out Rate</span>
          <p className="text-3xl font-extrabold text-cyan-400 font-display">86.4%</p>
          <p className="text-[10px] text-cyan-500 font-semibold">High attendee engagement</p>
        </div>

        <div className="bg-[#121824] border border-slate-800 p-5 rounded-xl space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Moderation SLA</span>
          <p className="text-3xl font-extrabold text-purple-400 font-display">&lt; 3.2 hrs</p>
          <p className="text-[10px] text-purple-300 font-semibold">Fast event approval turnaround</p>
        </div>
      </div>

      {/* Report Breakdown */}
      <div className="cyber-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>Category Breakdown & Demand Distribution</span>
        </h3>

        <div className="space-y-3">
          {[
            { name: 'FPS (Tactical & Hero Shooters)', share: '45%', count: '22 Events', revenue: '$14,200' },
            { name: 'Battle Royale', share: '30%', count: '14 Events', revenue: '$9,800' },
            { name: 'MOBA (LoL, Dota 2)', share: '15%', count: '8 Events', revenue: '$4,500' },
            { name: 'Fighting Games (FGC)', share: '10%', count: '6 Events', revenue: '$2,100' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">{item.name}</span>
                <span className="font-bold text-cyan-400">{item.revenue}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: item.share }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{item.count}</span>
                <span>{item.share} market volume</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
