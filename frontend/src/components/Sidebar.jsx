import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Trophy,
  Ticket,
  Users,
  CheckSquare,
  Tags,
  BarChart3,
  UserCheck,
  CreditCard,
  Settings
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isAdmin, isOrganizer, isGamer } = useAuth();

  const gamerLinks = [
    { to: '/gamer/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/gamer/registrations', label: 'My Registrations', icon: Trophy },
    { to: '/gamer/tickets', label: 'My Tickets', icon: Ticket },
    { to: '/profile', label: 'Profile Settings', icon: Settings },
  ];

  const organizerLinks = [
    { to: '/organizer/dashboard', label: 'Organizer Hub', icon: LayoutDashboard },
    { to: '/organizer/events', label: 'My Events', icon: Calendar },
    { to: '/organizer/events/create', label: 'Host New Event', icon: PlusCircle },
    { to: '/organizer/tournaments', label: 'Tournaments & Brackets', icon: Trophy },
    { to: '/organizer/tickets', label: 'Ticket Tiers', icon: Ticket },
    { to: '/organizer/participants', label: 'Participants', icon: Users },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Command', icon: LayoutDashboard },
    { to: '/admin/approvals', label: 'Event Moderation', icon: CheckSquare },
    { to: '/admin/users', label: 'User Management', icon: UserCheck },
    { to: '/admin/categories', label: 'Game Categories', icon: Tags },
    { to: '/admin/monitoring', label: 'Registrations & Sales', icon: Trophy },
    { to: '/admin/reports', label: 'Platform Analytics', icon: BarChart3 },
  ];

  let links = [];
  let roleTitle = 'Gamer Dashboard';

  if (isAdmin()) {
    links = adminLinks;
    roleTitle = 'Admin Portal';
  } else if (isOrganizer()) {
    links = organizerLinks;
    roleTitle = 'Organizer Portal';
  } else {
    links = gamerLinks;
  }

  return (
    <aside className="w-64 bg-[#0E131F] border-r border-slate-800/80 min-h-[calc(100vh-80px)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        
        {/* Role Header */}
        <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Access Scope</p>
          <h3 className="text-sm font-bold text-white tracking-wide">{roleTitle}</h3>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to.endsWith('dashboard')}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Mini Widget */}
      <div className="pt-4 border-t border-slate-800/60 px-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div className="truncate">
          <p className="text-xs font-bold text-slate-200 truncate">{user?.username}</p>
          <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
};
