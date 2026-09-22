import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { authService } from '../services/authService';
import { Lock, User, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.usernameOrEmail || !formData.password) {
      error('Please enter both username/email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(formData);
      if (res.success && res.data) {
        const { token, user } = res.data;
        login(token, user);
        success(`Welcome back, ${user.fullName || user.username}!`);

        if (redirectUrl) {
          navigate(redirectUrl);
          return;
        }

        const role = typeof user.role === 'object' ? user.role?.name : user.role;
        if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (role === 'ROLE_ORGANIZER' || role === 'ORGANIZER') {
          navigate('/organizer/dashboard');
        } else {
          navigate('/gamer/dashboard');
        }
      }
    } catch (err) {
      error(err.message || 'Invalid username/email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for quick testing with seed credentials
  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({ usernameOrEmail: 'admin', password: 'admin123' });
    } else if (role === 'organizer') {
      setFormData({ usernameOrEmail: 'apex_organizer', password: 'Organizer@123' });
    } else {
      setFormData({ usernameOrEmail: 'shadow_ninja', password: 'Gamer@123' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-wide">Sign In to NexusArena</h2>
        <p className="text-xs text-slate-400">Enter your credentials to access your tournaments and passes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username / Email */}
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Username or Email
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="usernameOrEmail"
              required
              value={formData.usernameOrEmail}
              onChange={handleChange}
              placeholder="e.g. shadow_ninja or alex@gamer.io"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 cyber-btn-primary text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 mt-4"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
        </button>
      </form>

      {/* Demo Quick Fill */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
          Quick Demo Accounts
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('gamer')}
            className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-cyan-400"
          >
            🎮 Gamer
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('organizer')}
            className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-purple-400"
          >
            🏆 Organizer
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('admin')}
            className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-emerald-400"
          >
            🛡️ Admin
          </button>
        </div>
      </div>

      <div className="text-center pt-2 text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-cyan-400 font-bold hover:underline">
          Create an Account
        </Link>
      </div>
    </div>
  );
};
