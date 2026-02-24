'use client';
import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Plus, X, Loader2, Shield } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('sa_token') : null;

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'BILLING', 'ANALYST'];

const ROLE_COLORS = {
  SUPER_ADMIN: 'text-red-400 bg-red-400/10',
  ADMIN: 'text-orange-400 bg-orange-400/10',
  SUPPORT: 'text-blue-400 bg-blue-400/10',
  BILLING: 'text-green-400 bg-green-400/10',
  ANALYST: 'text-purple-400 bg-purple-400/10',
};

function CreateAdminDialog({ onClose, onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'SUPPORT' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API + '/super-admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message || 'Failed to create admin');
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">Add Super Admin</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>
        {error && <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-800 px-3 py-2 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">First Name</label>
              <input required value={form.firstName} onChange={e => set("firstName", e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Last Name</label>
              <input required value={form.lastName} onChange={e => set("lastName", e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Email</label>
            <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Password</label>
            <input required type="password" value={form.password} onChange={e => set("password", e.target.value)} minLength={8} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Role</label>
            <select value={form.role} onChange={e => set("role", e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-sm text-white font-medium flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API + '/super-admin/admins', {
        headers: { Authorization: 'Bearer ' + getToken() },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'Failed to load');
      setAdmins(data.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-8">
      {showCreate && <CreateAdminDialog onClose={() => setShowCreate(false)} onSuccess={load} />}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Super Admins</h1>
          <p className="text-gray-500 text-sm mt-1">Manage platform administrator accounts</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Refresh</button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white font-medium transition-colors"><Plus size={14} />Add Admin</button>
        </div>
      </div>
      {error && <div className="mb-6 bg-red-900/30 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-800">
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? ([...Array(4)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-gray-800 rounded-full" /><div><div className="w-28 h-4 bg-gray-800 rounded mb-1" /><div className="w-36 h-3 bg-gray-800 rounded" /></div></div></td>
                <td className="px-6 py-4"><div className="w-20 h-6 bg-gray-800 rounded-full" /></td>
                <td className="px-6 py-4"><div className="w-16 h-6 bg-gray-800 rounded-full" /></td>
                <td className="px-6 py-4"><div className="w-24 h-4 bg-gray-800 rounded" /></td>
              </tr>
            ))) : admins.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-600 text-sm">No admins found</td></tr>
            ) : (
              admins.map(admin => (
                <tr key={admin.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-sm font-semibold text-gray-400">
                        {admin.firstName && admin.firstName[0]}{admin.lastName && admin.lastName[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{admin.firstName} {admin.lastName}</div>
                        <div className="text-xs text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium " + (ROLE_COLORS[admin.role] || "text-gray-400 bg-gray-400/10")}><Shield size={10} />{admin.role}</span></td>
                  <td className="px-6 py-4"><span className={"text-xs px-2 py-0.5 rounded-full " + (admin.isActive ? "text-green-400 bg-green-400/10" : "text-gray-400 bg-gray-400/10")}>{admin.isActive ? "Active" : "Inactive"}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(admin.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
