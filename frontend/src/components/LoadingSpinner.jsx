import React from 'react';
import { Gamepad2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Gamepad2 className="w-3 h-3 text-cyan-400 animate-pulse" />
        </div>
      </div>
      {message && <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">{message}</p>}
    </div>
  );
};
