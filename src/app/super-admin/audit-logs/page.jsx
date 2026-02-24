'use client';
import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('sa_token') : null;

const ACTION_COLORS = {
  CREATE: 'text-green-400 bg-green-400/10',
  UPDATE: 'text-blue-400 bg-blue-400/10',
  DELETE: 'text-red-400 bg-red-400/10',
  SUSPEND: 'text-yellow-400 bg-yellow-400/10',
  ACTIVATE: 'text-green-400 bg-green-400/10',
  LOGIN: 'text-purple-400 bg-purple-400/10',
  LOGOUT: 'text-gray-400 bg-gray-400/10',
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('action', search.toUpperCase());
      const res = await fetch(`${API}/super-admin/audit-logs?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'Failed to load');
      setLogs(data.data.logs || []);
      setPagination(data.data.pagination || { page: 1, total: 0, totalPages: 1 });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(1); }, [load]);

  const formatDate = (d) => new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-gray-500 text-sm mt-1">Track all super admin actions</p>
        </div>
        <button onClick={() => load(1)} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by action..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
          />
        </div>
      </div>

      {error && <div className="mb-6 bg-red-900/30 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="w-20 h-6 bg-gray-800 rounded-full" /></td>
                  <td className="px-6 py-4"><div className="w-28 h-4 bg-gray-800 rounded" /></td>
                  <td className="px-6 py-4"><div className="w-32 h-4 bg-gray-800 rounded" /></td>
                  <td className="px-6 py-4"><div className="w-36 h-4 bg-gray-800 rounded" /></td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-600 text-sm">No audit logs found</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] || 'text-gray-400 bg-gray-400/10'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{log.entity}</div>
                    {log.entityId && <div className="text-xs text-gray-600 font-mono">{log.entityId.slice(0, 8)}...</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{log.superAdmin?.email || log.superAdminId || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(log.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
            <span className="text-xs text-gray-500">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} entries
            </span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)} className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 border border-gray-700 rounded-lg text-gray-400">
                <ChevronLeft size={16} />
              </button>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => load(pagination.page + 1)} className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 border border-gray-700 rounded-lg text-gray-400">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
