import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { EventCard } from '../components/EventCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Trophy, 
  Gamepad2, 
  Users, 
  Ticket, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Flame
} from 'lucide-react';

export const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, catsRes] = await Promise.all([
          eventService.getEvents({ size: 6 }),
          eventService.getCategories()
        ]);
        if (eventsRes.success) {
          setFeaturedEvents(eventsRes.data?.content || eventsRes.data || []);
        }
        if (catsRes.success) {
          setCategories(catsRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Next-Gen Esports & Tournament Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-none">
            DISCOVER. REGISTER. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              COMPETE FOR GLORY.
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The premier platform for collegiate esports tournaments, local LAN clashes, and major competitive gaming events. Secure passes, register brackets, and track results instantly.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="cyber-btn-primary w-full sm:w-auto text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Explore Gaming Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register?role=ORGANIZER"
              className="cyber-btn-secondary w-full sm:w-auto text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>Host a Tournament</span>
            </Link>
          </div>

          {/* Platform Stat Counters */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">500+</p>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Tournaments</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">25,000+</p>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Gamers Enrolled</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">$150K+</p>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Prize Pools</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">100%</p>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Verified Passes</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Gaming Events</h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300"
          >
            <span>View All Competitions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" message="Loading live gaming events..." />
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
            <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-300">No events found</h4>
            <p className="text-xs text-slate-500 mt-1">Check back soon or create your own gaming tournament!</p>
          </div>
        )}
      </section>

      {/* Categories Showcase */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl font-bold text-white">Browse by Gaming Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/events?category=${cat.id}`}
                className="bg-[#121824] border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl text-center transition-all hover:-translate-y-1 group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-950/60 text-cyan-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121824] border border-slate-800 rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Engineered For Seamless Esports Tournaments
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built with enterprise reliability to handle fast ticket sales, bracket validations, and zero-loss registrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Anti-Overselling Quotas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Atomic database reservations protect tournament slots and ticket batches from race conditions and duplicate enrollments.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Collision-Free Digital Passes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unique serial passes issued instantly with verifiable ticket numbers for seamless offline and online check-in.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Instant Bracket & Roster Updates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time participant dashboards give organizers full visibility over attendees, prize pools, and revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
