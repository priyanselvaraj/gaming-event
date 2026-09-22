import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Gamepad2, 
  Search, 
  Calendar, 
  Trophy, 
  Ticket, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isOrganizer, isGamer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (isAdmin()) return '/admin/dashboard';
    if (isOrganizer()) return '/organizer/dashboard';
    return '/gamer/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#0B0E14]/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <Gamepad2 className="w-6 h-6 text-slate-950 font-extrabold" />
            </div>
            <div>
              <span className="text-2xl font-display font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
                NEXUS<span className="text-cyan-400">ARENA</span>
              </span>
              <span className="block text-[10px] tracking-widest text-cyan-500/80 uppercase font-semibold">Esports Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/events" 
              className={`text-sm font-medium tracking-wide flex items-center gap-2 transition-colors ${
                isActive('/events') ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-cyan-300'
              }`}
            >
              <Calendar className="w-4 h-4 text-cyan-500" />
              Discover Events
            </Link>

            {isAuthenticated && (
              <Link 
                to={getDashboardPath()} 
                className={`text-sm font-medium tracking-wide flex items-center gap-2 transition-colors ${
                  location.pathname.includes('/dashboard') ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-cyan-300'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-500" />
                Dashboard
              </Link>
            )}

            {isGamer() && (
              <Link 
                to="/gamer/tickets" 
                className={`text-sm font-medium tracking-wide flex items-center gap-2 transition-colors ${
                  isActive('/gamer/tickets') ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-cyan-300'
                }`}
              >
                <Ticket className="w-4 h-4 text-cyan-500" />
                My Tickets
              </Link>
            )}

            {isOrganizer() && (
              <Link 
                to="/organizer/events/create" 
                className="text-xs uppercase tracking-wider font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 transition-all"
              >
                + Create Event
              </Link>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2.5 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl hover:border-cyan-500/50 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                    {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200">{user?.fullName || user?.username}</p>
                    <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-medium">
                      {typeof user?.role === 'object' ? user?.role?.name?.replace('ROLE_', '') : user?.role?.replace('ROLE_', '')}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="cyber-btn-primary text-xs uppercase tracking-wider"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121824] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium"
          >
            Discover Events
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium"
              >
                My Profile ({user?.username})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 text-sm font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 bg-slate-800 rounded-lg text-sm font-medium text-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg text-sm uppercase tracking-wider"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
