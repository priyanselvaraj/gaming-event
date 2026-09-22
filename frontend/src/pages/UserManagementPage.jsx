import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { UserCheck, ShieldAlert, CheckCircle2, Search, Filter } from 'lucide-react';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useNotification();

  const fetchUsers = async () => {
    try {
      const res = await dashboardService.getUsers();
      if (res.success) {
        setUsers(res.data?.content || res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setActionLoading(true);
    try {
      const res = await dashboardService.updateUserStatus(userId, nextStatus);
      if (res.success) {
        success(`User status changed to ${nextStatus}`);
        fetchUsers();
      }
    } catch (err) {
      error(err.message || 'Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const role = typeof u.role === 'object' ? u.role?.name : u.role;
    const matchesRole = !selectedRole || role === selectedRole || role === `ROLE_${selectedRole}`;
    const matchesSearch =
      !searchTerm ||
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">User Account Governance</h1>
        <p className="text-xs text-slate-400">Inspect user profiles, permissions, and toggle active/suspended statuses</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#121824] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Roles</option>
            <option value="ROLE_GAMER">Gamers</option>
            <option value="ROLE_ORGANIZER">Organizers</option>
            <option value="ROLE_ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="cyber-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((u) => {
                const role = typeof u.role === 'object' ? u.role?.name : u.role;
                const isAdminUser = role === 'ROLE_ADMIN' || role === 'ADMIN';

                return (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                        {u.fullName?.charAt(0) || u.username?.charAt(0)}
                      </div>
                      <span>{u.fullName || 'Anonymous'}</span>
                    </td>
                    <td className="p-3 text-cyan-400 font-mono">@{u.username}</td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3">
                      <span className="cyber-badge bg-slate-900 text-slate-300 border border-slate-700 text-[10px]">
                        {role?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`cyber-badge text-[10px] ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {!isAdminUser && (
                        <button
                          onClick={() => handleStatusToggle(u.id, u.status)}
                          disabled={actionLoading}
                          className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
