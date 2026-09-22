import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Gamepad2, ShieldCheck, Zap, Trophy } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Cyber Glowing Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <Gamepad2 className="w-7 h-7 text-slate-950 font-extrabold" />
          </div>
          <span className="text-3xl font-display font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
            NEXUS<span className="text-cyan-400">ARENA</span>
          </span>
        </Link>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#121824]/90 border border-slate-800 rounded-2xl py-8 px-6 sm:px-10 shadow-2xl backdrop-blur-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
