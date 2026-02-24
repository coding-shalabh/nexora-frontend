'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Users,
  Wallet,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Ban,
  Play,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('sa_token') : null);

const statusConfig = {
  ACTIVE: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
  SUSPENDED: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: AlertCircle },
  INACTIVE: { color: 'text-gray-400', bg: 'bg-gray-400/10', icon: XCircle },
  ONBOARDING: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Clock },
  CANCELLED: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
};

export default function TenantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/super-admin/tenants/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTenant(d.data);
        else setError(d.error?.message);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleActivate = async () => {
    setActionLoading(true);
    await fetch(`${API}/super-admin/tenants/${id}/activate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const res = await fetch(`${API}/super-admin/tenants/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const d = await res.json();
    if (d.success) setTenant(d.data);
    setActionLoading(false);
  };

  if (loading)
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="w-32 h-8 bg-gray-800 rounded" />
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
            <div className="w-48 h-6 bg-gray-800 rounded" />
            <div className="w-32 h-4 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-8">
        <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      </div>
    );

  if (!tenant) return null;

  const StatusIcon = statusConfig[tenant.status]?.icon || XCircle;
  const statusCfg = statusConfig[tenant.status] || statusConfig.INACTIVE;

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Tenants
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-xl font-bold text-gray-300">
            {tenant.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{tenant.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-500 text-sm">{tenant.slug}</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.color} ${statusCfg.bg}`}
              >
                <StatusIcon size={11} />
                {tenant.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {tenant.status === 'SUSPENDED' && (
            <button
              onClick={handleActivate}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-sm text-white font-medium transition-colors"
            >
              <Play size={14} />
              {actionLoading ? 'Activating...' : 'Activate'}
            </button>
          )}
          {tenant.status === 'ACTIVE' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm text-white font-medium transition-colors">
              <Ban size={14} />
              Suspend
            </button>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { icon: Mail, label: 'Email', value: tenant.email || '—' },
          { icon: Phone, label: 'Phone', value: tenant.phone || '—' },
          { icon: Globe, label: 'Domain', value: tenant.domain || '—' },
          {
            icon: Building2,
            label: 'Created',
            value: new Date(tenant.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Icon size={13} />
              {label}
            </div>
            <div className="text-sm text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{tenant._count?.users ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Users size={11} />
            Users
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{tenant._count?.workspaces ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">Workspaces</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">
            ₹{(tenant.wallets?.[0]?.balance ?? 0).toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Wallet size={11} />
            Wallet
          </div>
        </div>
      </div>

      {/* Users table */}
      {tenant.users?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Team Members</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {tenant.users.slice(0, 10).map((user) => (
              <div key={user.id} className="flex items-center gap-4 px-6 py-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium text-gray-400">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${user.status === 'ACTIVE' ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10'}`}
                >
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
