'use client';
import { useEffect, useState, useCallback } from 'react';
import { Mail, Plus, RefreshCw, X, Loader2, CreditCard, Search } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('sa_token') : null);

const CREDIT_TYPES = [
  { value: 'TOPUP', label: 'Top-up' },
  { value: 'BONUS', label: 'Bonus' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
  { value: 'REFUND', label: 'Refund' },
];

function AddCreditsDialog({ tenant, onClose, onSuccess }) {
  const [credits, setCredits] = useState('');
  const [type, setType] = useState('TOPUP');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credits || isNaN(credits) || Number(credits) <= 0) {
      setError('Please enter a valid positive number of credits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API}/super-admin/email/tenants/${tenant.id}/credits`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            credits: Number(credits),
            type,
            notes: notes || undefined,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || data.message || 'Failed to add credits');
      }
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
              <Mail size={15} className="text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Add Email Credits</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Adding credits to{' '}
          <span className="text-white font-medium">{tenant.name}</span>
        </p>
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-800 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Number of Credits</label>
            <input
              type="number"
              min="1"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Credit Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
            >
              {CREDIT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for adding credits..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-sm text-white font-medium transition-colors flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Add Credits
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
          <Icon size={15} className="text-gray-400" />
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

export default function EmailCreditsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addTarget, setAddTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  // Debounce search input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ page, limit: 20 });
        if (debouncedSearch) params.set('search', debouncedSearch);
        const res = await fetch(
          `${API}/super-admin/email/tenants?${params.toString()}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error?.message || data.message || 'Failed to load tenants');
        }
        setTenants(data.data || []);
        setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => { load(1); }, [load]);

  const totalAvailable = tenants.reduce((s, t) => s + (t.emailCredits?.available || 0), 0);
  const totalUsed = tenants.reduce((s, t) => s + (t.emailCredits?.usedCredits || 0), 0);
  const lowCreditCount = tenants.filter((t) => (t.emailCredits?.available || 0) < 100).length;

  return (
    <div className="p-8 min-h-screen bg-gray-950">
      {addTarget && (
        <AddCreditsDialog
          tenant={addTarget}
          onClose={() => setAddTarget(null)}
          onSuccess={() => load(pagination.page)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-red-600/20 rounded-xl flex items-center justify-center">
              <Mail size={18} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Email Credits</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">Manage email credit balances per tenant</p>
        </div>
        <button
          onClick={() => load(pagination.page)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={CreditCard}
          label="Total Available Credits"
          value={totalAvailable.toLocaleString()}
          sub="Across tenants on this page"
        />
        <StatCard
          icon={Mail}
          label="Total Paid Credits Used"
          value={totalUsed.toLocaleString()}
          sub="Paid credits consumed"
        />
        <StatCard
          icon={RefreshCw}
          label="Low Credit Tenants"
          value={lowCreditCount}
          sub="Below 100 available credits"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <X size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug or email..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        {pagination.total > 0 && (
          <span className="text-xs text-gray-600">
            {pagination.total} tenant{pagination.total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Tenants table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Credits</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Used (Paid)</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Free This Month</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-full" />
                      <div className="space-y-1.5">
                        <div className="w-28 h-3.5 bg-gray-800 rounded" />
                        <div className="w-20 h-3 bg-gray-800 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="w-16 h-4 bg-gray-800 rounded" /></td>
                  <td className="px-6 py-4"><div className="w-16 h-4 bg-gray-800 rounded" /></td>
                  <td className="px-6 py-4"><div className="w-12 h-4 bg-gray-800 rounded" /></td>
                  <td className="px-6 py-4"><div className="w-12 h-4 bg-gray-800 rounded" /></td>
                  <td className="px-6 py-4"><div className="w-24 h-8 bg-gray-800 rounded ml-auto" /></td>
                </tr>
              ))
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <Mail size={32} className="mx-auto text-gray-700 mb-3" />
                  <p className="text-gray-600 text-sm">
                    {debouncedSearch ? 'No tenants match your search' : 'No tenants found'}
                  </p>
                </td>
              </tr>
            ) : (
              tenants.map((t) => {
                const ec = t.emailCredits || {};
                const available = ec.available || 0;
                const isLow = available < 100;
                return (
                  <tr key={t.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-semibold text-gray-400 flex-shrink-0">
                          {t.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{t.name}</div>
                          <div className="text-xs text-gray-600">{t.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard size={13} className="text-gray-600 flex-shrink-0" />
                        <span className={`text-sm font-semibold ${isLow ? 'text-red-400' : 'text-white'}`}>
                          {available.toLocaleString()}
                        </span>
                        {isLow && (
                          <span className="text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-full">Low</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{(ec.totalCredits || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{(ec.usedCredits || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{(ec.freeUsedThisMonth || 0).toLocaleString()}</span>
                      <span className="text-xs text-gray-600"> / {(ec.freeQuota || 500).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setAddTarget(t)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs text-white font-medium transition-colors"
                        >
                          <Plus size={13} />
                          Add Credits
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-xs text-gray-600">
            Page {pagination.page} of {pagination.totalPages} &mdash; {pagination.total} total tenants
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => load(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-700 rounded-lg text-xs text-gray-400 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => load(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-700 rounded-lg text-xs text-gray-400 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
