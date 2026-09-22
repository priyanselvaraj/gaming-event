import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { authService } from '../services/authService';
import { Lock, User, Mail, Phone, Shield, Check, X, UserPlus } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') === 'ORGANIZER' ? 'ROLE_ORGANIZER' : 'ROLE_GAMER',
  });

  const [loading, setLoading] = useState(false);

  // Password rules evaluation
  const pass = formData.password;
  const validations = {
    length: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    lowercase: /[a-z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(pass),
  };

  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      error('Password does not meet all security complexity requirements.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role
      };

      const res = await authService.register(payload);
      if (res.success) {
        success('Registration successful! Please sign in with your credentials.');
        navigate('/login');
      }
    } catch (err) {
      error(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-white tracking-wide">Create Player Account</h2>
        <p className="text-xs text-slate-400">Join NexusArena to discover tournaments and secure passes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Role Selection Tabs */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Account Type</label>
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'ROLE_GAMER' })}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                formData.role === 'ROLE_GAMER'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎮 Gamer / Attendee
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'ROLE_ORGANIZER' })}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                formData.role === 'ROLE_ORGANIZER'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏆 Event Organizer
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Alex Mercer"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Username & Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="shadow_ninja"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@gamer.io"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1-555-0199"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Password & Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Confirm</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Password Complexity Checklist */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5 text-[10px]">
          <p className="font-bold text-slate-400 uppercase tracking-wider">Password Requirements:</p>
          <div className="grid grid-cols-2 gap-1 text-slate-400">
            <span className={`flex items-center gap-1.5 ${validations.length ? 'text-emerald-400 font-semibold' : ''}`}>
              {validations.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 8+ Characters
            </span>
            <span className={`flex items-center gap-1.5 ${validations.uppercase ? 'text-emerald-400 font-semibold' : ''}`}>
              {validations.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 1 Uppercase Letter
            </span>
            <span className={`flex items-center gap-1.5 ${validations.lowercase ? 'text-emerald-400 font-semibold' : ''}`}>
              {validations.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 1 Lowercase Letter
            </span>
            <span className={`flex items-center gap-1.5 ${validations.number ? 'text-emerald-400 font-semibold' : ''}`}>
              {validations.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 1 Number
            </span>
            <span className={`flex items-center gap-1.5 col-span-2 ${validations.special ? 'text-emerald-400 font-semibold' : ''}`}>
              {validations.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-rose-500" />} 1 Special Character (!@#$%^&*)
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !isPasswordValid}
          className="w-full py-3 cyber-btn-primary text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 mt-4"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
        </button>
      </form>

      <div className="text-center pt-2 text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
