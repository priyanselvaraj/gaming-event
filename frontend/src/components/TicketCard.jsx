import React from 'react';
import { Ticket, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export const TicketCard = ({ ticketType, onPurchase, loading }) => {
  if (!ticketType) return null;

  const remaining = (ticketType.quantityAvailable || 0) - (ticketType.quantitySold || 0);
  const isSoldOut = remaining <= 0;
  const isVip = ticketType.ticketName?.toLowerCase().includes('vip') || ticketType.ticketName?.toLowerCase().includes('premium');

  return (
    <div className={`relative bg-[#151D2C] rounded-xl p-5 border transition-all flex flex-col justify-between ${
      isVip 
        ? 'border-purple-500/50 hover:border-purple-400 shadow-lg shadow-purple-500/5' 
        : 'border-slate-800 hover:border-cyan-500/50 shadow-lg shadow-cyan-500/5'
    }`}>
      {isVip && (
        <div className="absolute -top-3 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3" /> VIP Pass
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-white tracking-wide">{ticketType.ticketName}</h4>
          <span className="text-xl font-extrabold text-cyan-400">
            {ticketType.price > 0 ? `$${ticketType.price}` : 'FREE'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {ticketType.description || 'Full general admission access to gaming convention hall and tournament viewing.'}
        </p>

        {/* Stock / Availability */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Availability:</span>
          <span className={`font-bold ${isSoldOut ? 'text-rose-400' : remaining < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isSoldOut ? 'SOLD OUT' : `${remaining} Passes Remaining`}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <button
          onClick={() => onPurchase && onPurchase(ticketType)}
          disabled={isSoldOut || loading}
          className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            isSoldOut
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : isVip
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-600/30'
              : 'cyber-btn-primary'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>{isSoldOut ? 'Sold Out' : 'Purchase Ticket'}</span>
        </button>
      </div>
    </div>
  );
};
