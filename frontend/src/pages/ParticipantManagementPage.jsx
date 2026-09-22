import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Users, Calendar, Trophy, Mail, Phone, Search } from 'lucide-react';

export const ParticipantManagementPage = () => {
  const [searchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [myEvents, setMyEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await eventService.getMyEvents();
        if (res.success) {
          const list = res.data?.content || res.data || [];
          setMyEvents(list);
          if (!selectedEventId && list.length > 0) {
            setSelectedEventId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    const loadParticipants = async () => {
      setLoading(true);
      try {
        const res = await registrationService.getEventParticipants(selectedEventId);
        if (res.success) {
          setParticipants(res.data?.content || res.data || []);
        }
      } catch (err) {
        console.error('Failed to load participants:', err);
      } finally {
        setLoading(false);
      }
    };
    loadParticipants();
  }, [selectedEventId]);

  const filtered = participants.filter((p) => {
    const gamer = p.gamer;
    if (!gamer) return true;
    const q = searchTerm.toLowerCase();
    return (
      gamer.fullName?.toLowerCase().includes(q) ||
      gamer.username?.toLowerCase().includes(q) ||
      gamer.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Participant Rosters</h1>
        <p className="text-xs text-slate-400">View and verify enrolled tournament players and general attendees</p>
      </div>

      {/* Target Event Filter & Search */}
      <div className="bg-[#121824] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 shrink-0">
            Event:
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full sm:w-72 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {myEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventName}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by gamer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Participants Table */}
      <div className="cyber-card p-6 space-y-4">
        {loading ? (
          <LoadingSpinner size="lg" message="Loading participant roster..." />
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Gamer Details</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Tournament / Tier</th>
                  <th className="p-3">Registration Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-bold text-white">
                      <div>
                        <p>{reg.gamer?.fullName || 'Anonymous Gamer'}</p>
                        <p className="text-[10px] text-slate-500 font-normal">{reg.gamer?.email}</p>
                      </div>
                    </td>
                    <td className="p-3 text-cyan-400 font-mono">@{reg.gamer?.username}</td>
                    <td className="p-3">
                      {reg.tournament ? (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" />
                          {reg.tournament.tournamentName}
                        </span>
                      ) : (
                        <span className="text-slate-400">General Event Pass</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(reg.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className={`cyber-badge text-[10px] ${
                        reg.status === 'CONFIRMED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Participants Enrolled Yet</h3>
            <p className="text-xs text-slate-400">
              When players register for this event, they will appear here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
