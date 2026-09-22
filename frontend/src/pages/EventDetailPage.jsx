import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { ticketService } from '../services/ticketService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { TournamentCard } from '../components/TournamentCard';
import { TicketCard } from '../components/TicketCard';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  Trophy,
  Ticket,
  Share2,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isGamer } = useAuth();
  const { success, error, info } = useNotification();

  const [event, setEvent] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Payment Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('MOCK');

  const defaultBanner = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop";

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const [eventRes, tournRes, ticketsRes] = await Promise.all([
          eventService.getEventById(id),
          eventService.getTournamentsByEvent(id),
          ticketService.getTicketTypesByEvent(id)
        ]);

        if (eventRes.success) setEvent(eventRes.data);
        if (tournRes.success) setTournaments(tournRes.data || []);
        if (ticketsRes.success) setTicketTypes(ticketsRes.data || []);

        if (isAuthenticated && isGamer()) {
          const regRes = await registrationService.getMyRegistrations();
          if (regRes.success) setMyRegistrations(regRes.data?.content || regRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load event details:', err);
        error('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [id, isAuthenticated]);

  const isEventRegistered = myRegistrations.some(
    (reg) => reg.event?.id === Number(id) && !reg.tournament && reg.status !== 'CANCELLED'
  );

  const isTournamentRegistered = (tournamentId) =>
    myRegistrations.some(
      (reg) => reg.tournament?.id === tournamentId && reg.status !== 'CANCELLED'
    );

  // Handle Event General Registration
  const handleEventRegistration = async () => {
    if (!isAuthenticated) {
      info('Please sign in to register for this event.');
      navigate(`/login?redirect=/events/${id}`);
      return;
    }

    if (!isGamer()) {
      error('Only Gamer accounts can register for competitions.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await registrationService.registerForEvent(id);
      if (res.success) {
        success('Successfully registered for event!');
        // Refresh registrations
        const regRes = await registrationService.getMyRegistrations();
        if (regRes.success) setMyRegistrations(regRes.data?.content || regRes.data || []);
        // Refresh event capacity count
        const eventRes = await eventService.getEventById(id);
        if (eventRes.success) setEvent(eventRes.data);
      }
    } catch (err) {
      error(err.message || 'Registration failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Tournament Bracket Registration
  const handleTournamentRegistration = async (tournament) => {
    if (!isAuthenticated) {
      info('Please sign in to register for this tournament bracket.');
      navigate(`/login?redirect=/events/${id}`);
      return;
    }

    setActionLoading(true);
    try {
      const res = await registrationService.registerForTournament(tournament.id);
      if (res.success) {
        success(`Successfully registered for ${tournament.tournamentName}!`);
        // Refresh
        const [regRes, tournRes] = await Promise.all([
          registrationService.getMyRegistrations(),
          eventService.getTournamentsByEvent(id)
        ]);
        if (regRes.success) setMyRegistrations(regRes.data?.content || regRes.data || []);
        if (tournRes.success) setTournaments(tournRes.data || []);
      }
    } catch (err) {
      error(err.message || 'Tournament registration failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Ticket Purchase Modal
  const openPurchaseModal = (ticketType) => {
    if (!isAuthenticated) {
      info('Please sign in to purchase event tickets.');
      navigate(`/login?redirect=/events/${id}`);
      return;
    }
    setSelectedTicket(ticketType);
    setIsPaymentModalOpen(true);
  };

  // Process Mock Payment
  const handleProcessPayment = async () => {
    if (!selectedTicket) return;
    setActionLoading(true);

    try {
      const payload = {
        eventId: Number(id),
        ticketTypeId: selectedTicket.id,
        amount: selectedTicket.price,
        paymentMethod: paymentMethod
      };

      const res = await paymentService.processMockPayment(payload);
      if (res.success) {
        setIsPaymentModalOpen(false);
        success('Payment confirmed! Your ticket pass has been generated.');
        navigate('/gamer/tickets');
      }
    } catch (err) {
      error(err.message || 'Payment processing failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading event and tournament details..." />;
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-slate-400">The event you are looking for may have been removed or is pending approval.</p>
        <Link to="/events" className="cyber-btn-secondary inline-block text-xs uppercase font-bold">
          Back to Events
        </Link>
      </div>
    );
  }

  const capacityPercent = Math.min(100, Math.round(((event.currentCapacity || 0) / (event.maximumCapacity || 100)) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Event Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="h-72 sm:h-96 w-full relative">
          <img
            src={event.eventBannerUrl || defaultBanner}
            alt={event.eventName}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = defaultBanner; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/60 to-transparent" />
        </div>

        {/* Content Over Banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="cyber-badge bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
              {event.category?.name || 'Esports'}
            </span>
            <span className="cyber-badge bg-slate-900/90 text-slate-300 border border-slate-700 backdrop-blur-md">
              {event.eventType}
            </span>
            <span className="cyber-badge bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold">
              {event.gameName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {event.eventName}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{event.eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{event.startTime?.substring(0, 5)} {event.endTime ? `- ${event.endTime?.substring(0, 5)}` : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              {event.eventType === 'ONLINE' ? (
                <>
                  <Globe className="w-4 h-4 text-sky-400" />
                  <a href={event.onlineEventLink} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                    Online Stream / Lobby
                  </a>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{event.location || 'Esports Venue'}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Description / Side Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Description, Tournaments, Tickets */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* About Section */}
          <div className="cyber-card p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">About the Event</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description || 'Welcome to this competitive gaming event. Join with your team or attend as a spectator to experience high-tier matches.'}
            </p>
          </div>

          {/* Tournaments & Brackets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-cyan-400" />
                <span>Tournament Brackets ({tournaments.length})</span>
              </h3>
            </div>

            {tournaments.length > 0 ? (
              <div className="space-y-4">
                {tournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    isRegistered={isTournamentRegistered(tournament.id)}
                    onRegister={handleTournamentRegistration}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#121824] border border-slate-800 p-8 rounded-xl text-center text-xs text-slate-400">
                No tournament stages configured for this event yet.
              </div>
            )}
          </div>

          {/* Ticket Tiers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-cyan-400" />
                <span>Admission & Passes ({ticketTypes.length})</span>
              </h3>
            </div>

            {ticketTypes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ticketTypes.map((type) => (
                  <TicketCard
                    key={type.id}
                    ticketType={type}
                    onPurchase={openPurchaseModal}
                    loading={actionLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#121824] border border-slate-800 p-8 rounded-xl text-center text-xs text-slate-400">
                General admission passes are open for registration via the registration card.
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Quick Register & Host Card */}
        <div className="space-y-6">
          
          {/* Registration Card */}
          <div className="cyber-card p-6 space-y-6 sticky top-28">
            <h3 className="text-lg font-bold text-white">Event Registration</h3>

            {/* Capacity Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Attendee Capacity
                </span>
                <span className="font-bold text-white">
                  {event.currentCapacity || 0} / {event.maximumCapacity}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    capacityPercent >= 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 text-right">
                {event.maximumCapacity - (event.currentCapacity || 0)} slots available
              </p>
            </div>

            {/* Action */}
            {isEventRegistered ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-400" />
                <p>You are registered for this event!</p>
                <Link to="/gamer/registrations" className="text-cyan-400 underline block text-[11px]">
                  View in My Registrations
                </Link>
              </div>
            ) : (
              <button
                onClick={handleEventRegistration}
                disabled={actionLoading || (event.currentCapacity >= event.maximumCapacity)}
                className="w-full py-3 cyber-btn-primary text-xs uppercase font-bold tracking-wider"
              >
                {event.currentCapacity >= event.maximumCapacity ? 'Capacity Reached' : 'Register for Event'}
              </button>
            )}

            {/* Organizer Info */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400">Hosted by</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center">
                  {event.organizer?.fullName?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="font-bold text-slate-200">{event.organizer?.fullName || event.organizer?.username}</p>
                  <p className="text-[10px] text-slate-500">Verified Organizer</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Mock Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Complete Ticket Purchase"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white">{selectedTicket.ticketName}</span>
                <span className="text-lg font-extrabold text-cyan-400">${selectedTicket.price}</span>
              </div>
              <p className="text-xs text-slate-400">{event.eventName}</p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['MOCK', 'CARD', 'UPI'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      paymentMethod === method
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {method === 'MOCK' ? 'Mock Pay' : method}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-lg text-[11px] text-cyan-300">
              ⚡ <strong>Mock Payment System</strong>: Simulates instant transaction settlement without requiring actual banking credentials.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-1/2 cyber-btn-secondary text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={actionLoading}
                className="w-1/2 cyber-btn-primary text-xs font-bold uppercase tracking-wider"
              >
                {actionLoading ? 'Processing...' : `Pay $${selectedTicket.price}`}
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
