'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  Play,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('sa_token') : null);

const statusConfig = {
  ACTIVE: {
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
    icon: CheckCircle,
    label: 'Active',
  },
  SUSPENDED: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
    icon: AlertCircle,
    label: 'Suspended',
  },
  INACTIVE: {
    color: 'text-gray-400',
    bg: 'bg-gray-400/10 border-gray-400/20',
    icon: XCircle,
    label: 'Inactive',
  },
  ONBOARDING: {
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
    icon: Clock,
    label: 'Onboarding',
  },
  CANCELLED: {
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/20',
    icon: XCircle,
    label: 'Cancelled',
  },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.INACTIVE;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color} ${cfg.bg}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function SuspendDialog({ tenant, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-white font-semibold mb-1">Suspend Tenant</h3>
        <p className="text-gray-400 text-sm mb-4">
          Suspend <span className="text-white">{tenant.name}</span>? Provide a reason.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for suspension..."
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 resize-none mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim() || loading}
            onClick={async () => {
              setLoading(true);
              await onConfirm(reason);
              setLoading(false);
            }}
            className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 rounded-lg text-sm text-white font-medium transition-colors"
          >
            {loading ? 'Suspending...' : 'Suspend'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ page, limit: 20 });
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`${API}/super-admin/tenants?${params}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error?.message);
        setTenants(data.data);
        setPagination(data.pagination);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const handleActivate = async (id) => {
    setActionLoading(id);
    try {
      await fetch(`${API}/super-admin/tenants/${id}/activate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      load(pagination.page);
    } finally {
      setActionLoading('');
    }
  };

  const handleSuspend = async (id, reason) => {
    try {
      await fetch(`${API}/super-admin/tenants/${id}/suspend`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      setSuspendTarget(null);
      load(pagination.page);
    } catch {}
  };

  return (
    <div className="p-8">
      {suspendTarget && (
        <SuspendDialog
          tenant={suspendTarget}
          onConfirm={(r) => handleSuspend(suspendTarget.id, r)}
          onCancel={() => setSuspendTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tenants</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total businesses</p>
        </div>
        <button
          onClick={() => load(1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenants..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-gray-600"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="ONBOARDING">Onboarding</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Users
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-800 rounded-full" />
                      <div>
                        <div className="w-28 h-4 bg-gray-800 rounded mb-1" />
                        <div className="w-20 h-3 bg-gray-800 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-6 bg-gray-800 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-8 h-4 bg-gray-800 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-4 bg-gray-800 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20 h-8 bg-gray-800 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-600 text-sm">
                  No tenants found
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-sm font-semibold text-gray-400 shrink-0">
                        {tenant.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{tenant.name}</div>
                        <div className="text-xs text-gray-500">{tenant.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tenant.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{tenant._count?.users ?? 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(tenant.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/super-admin/tenants/${tenant.id}`}
                        className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye size={15} />
                      </a>
                      {tenant.status === 'SUSPENDED' ? (
                        <button
                          onClick={() => handleActivate(tenant.id)}
                          disabled={actionLoading === tenant.id}
                          className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                          title="Activate"
                        >
                          <Play size={15} />
                        </button>
                      ) : tenant.status === 'ACTIVE' ? (
                        <button
                          onClick={() => setSuspendTarget(tenant)}
                          className="p-1.5 text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                          title="Suspend"
                        >
                          <Ban size={15} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
            <span className="text-xs text-gray-500">
              Showing {(pagination.page - 1) * 20 + 1}–
              {Math.min(pagination.page * 20, pagination.total)} of {pagination.total}
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => load(pagination.page - 1)}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 border border-gray-700 rounded-lg text-gray-400 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => load(pagination.page + 1)}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 border border-gray-700 rounded-lg text-gray-400 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
