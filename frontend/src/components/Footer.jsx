import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Shield, Heart, Github, Twitter, Disc as Discord } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#07090E] border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <span className="text-xl font-display font-bold tracking-wider text-white">
                NEXUS<span className="text-cyan-400">ARENA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier competitive gaming and esports event management platform. Discover tournaments, buy verified tickets, and compete with champions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/events" className="hover:text-white transition-colors">Upcoming Events</Link></li>
              <li><Link to="/events?category=FPS" className="hover:text-white transition-colors">FPS Tournaments</Link></li>
              <li><Link to="/events?category=MOBA" className="hover:text-white transition-colors">MOBA Championships</Link></li>
              <li><Link to="/events?type=LAN" className="hover:text-white transition-colors">LAN Competitions</Link></li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/gamer/dashboard" className="hover:text-white transition-colors">Gamer Dashboard</Link></li>
              <li><Link to="/organizer/dashboard" className="hover:text-white transition-colors">Organizer Hub</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Governance</Link></li>
              <li><a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">OpenAPI Swagger UI</a></li>
            </ul>
          </div>

          {/* Community & Security */}
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">Security & Trust</h4>
            <p className="text-xs text-slate-400 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              End-to-end anti-overselling & verified passes.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-cyan-400 transition-colors"><Discord className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-cyan-400 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-cyan-400 transition-colors"><Github className="w-4 h-4" /></a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 NexusArena Platform. Semester 5 Capstone Project.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Gamers & Esports Organizers
          </p>
        </div>
      </div>
    </footer>
  );
};
