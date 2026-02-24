'use client';
import { useEffect, useState } from 'react';
import {
  Building2,
  Users,
  Layers,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('sa_token') : null;
}

async function fetchOverview() {
  const res = await fetch(`${API}/super-admin/analytics/overview`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message);
  return data.data;
}

function StatCard({ icon: Icon, label, value, sub, color = 'blue' }) {
  const colors = {
    blue: 'text-blue-400 bg-blue-400/10',
    green: 'text-green-400 bg-green-400/10',
    yellow: 'text-yellow-400 bg-yellow-400/10',
    red: 'text-red-400 bg-red-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
  };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className={`inline-flex p-2 rounded-lg ${colors[color]} mb-3`}>
        <Icon size={18} />
      </div>
      <div className="text-2xl font-bold text-white">{value ?? '—'}</div>
      <div className="text-sm text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

const statusConfig = {
  ACTIVE: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Active' },
  SUSPENDED: {
    icon: AlertCircle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    label: 'Suspended',
  },
  INACTIVE: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Inactive' },
  ONBOARDING: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Onboarding' },
  CANCELLED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.INACTIVE;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color} ${cfg.bg}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fetchOverview());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time stats across all tenants</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse"
            >
              <div className="w-10 h-10 bg-gray-800 rounded-lg mb-3" />
              <div className="w-16 h-7 bg-gray-800 rounded mb-2" />
              <div className="w-24 h-4 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Building2}
            label="Total Tenants"
            value={data.tenants?.total}
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            label="Active Tenants"
            value={data.tenants?.active}
            sub={`${data.tenants?.inactive || 0} inactive`}
            color="green"
          />
          <StatCard icon={Users} label="Total Users" value={data.users?.total} color="purple" />
          <StatCard
            icon={Layers}
            label="Workspaces"
            value={data.workspaces?.total}
            color="yellow"
          />
        </div>
      ) : null}

      {/* Recent Tenants */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">Recent Tenants</h2>
          <a
            href="/super-admin/tenants"
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            View all →
          </a>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-800 rounded-full" />
                <div className="flex-1">
                  <div className="w-32 h-4 bg-gray-800 rounded mb-1" />
                  <div className="w-20 h-3 bg-gray-800 rounded" />
                </div>
                <div className="w-16 h-6 bg-gray-800 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {data?.recentTenants?.length === 0 ? (
              <div className="p-8 text-center text-gray-600 text-sm">No tenants yet</div>
            ) : (
              data?.recentTenants?.map((tenant) => (
                <a
                  key={tenant.id}
                  href={`/super-admin/tenants/${tenant.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-sm font-semibold text-gray-400 shrink-0">
                    {tenant.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{tenant.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {new Date(tenant.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <StatusBadge status={tenant.status} />
                </a>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
