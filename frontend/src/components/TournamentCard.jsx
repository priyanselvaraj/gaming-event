import React from 'react';
import { Trophy, DollarSign, Clock, Users, ShieldCheck } from 'lucide-react';

export const TournamentCard = ({ tournament, onRegister, isRegistered }) => {
  if (!tournament) return null;

  const isFull = (tournament.currentParticipants || 0) >= (tournament.maxParticipants || 1);
  const isOpen = tournament.status === 'REGISTRATION_OPEN' && !isFull;

  return (
    <div className="bg-[#151D2C] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-5 space-y-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="cyber-badge bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              {tournament.gameName}
            </span>
            <span className={`cyber-badge ${
              tournament.status === 'REGISTRATION_OPEN'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {tournament.status?.replace('_', ' ')}
            </span>
          </div>
          <h4 className="text-base font-bold text-white">{tournament.tournamentName}</h4>
        </div>

        {/* Prize Pool Display */}
        <div className="bg-slate-900/90 border border-cyan-500/30 px-3.5 py-1.5 rounded-lg flex items-center gap-2 self-start sm:self-auto">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Prize Pool</p>
            <p className="text-sm font-extrabold text-cyan-300">${tournament.prizePool || '0.00'}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        {tournament.description}
      </p>

      {/* Rules / Specs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Entry Fee</span>
          <span className="font-bold text-slate-200">
            {tournament.entryFee > 0 ? `$${tournament.entryFee}` : 'Free Entry'}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Participants</span>
          <span className="font-bold text-slate-200">
            {tournament.currentParticipants || 0} / {tournament.maxParticipants} Slots
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Deadline</span>
          <span className="font-bold text-amber-400/90">
            {tournament.registrationDeadline ? new Date(tournament.registrationDeadline).toLocaleDateString() : 'TBD'}
          </span>
        </div>
      </div>

      {tournament.rules && (
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 text-xs text-slate-300">
          <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Rules & Format
          </span>
          <p className="line-clamp-2">{tournament.rules}</p>
        </div>
      )}

      {/* Register / Action */}
      <div className="pt-2">
        {isRegistered ? (
          <button
            disabled
            className="w-full py-2.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-lg"
          >
            ✓ Already Enrolled
          </button>
        ) : (
          <button
            onClick={() => onRegister && onRegister(tournament)}
            disabled={!isOpen}
            className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              isOpen
                ? 'cyber-btn-primary'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isFull ? 'Tournament Full' : isOpen ? 'Register for Bracket' : 'Registration Closed'}
          </button>
        )}
      </div>
    </div>
  );
};
