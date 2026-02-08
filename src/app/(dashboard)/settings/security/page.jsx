'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Key,
  Lock,
  Users,
  ScrollText,
  Fingerprint,
  Smartphone,
  Globe,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Settings,
  Eye,
  FileKey,
  Network,
  Activity,
  TrendingUp,
  Search,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HubLayout } from '@/components/layout/hub-layout';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// TODO: These stats should be fetched dynamically from the API
// API endpoints: GET /settings/sessions, GET /settings/api-keys, GET /settings/security
const securityStats = {
  activeSessions: 0,
  apiKeys: 0,
  twoFactorEnabled: 0,
  securityScore: 75, // Base score
};

// Security checklist - TODO: should be computed from actual settings
const securityChecklist = [
  { label: '2FA Enabled', status: false },
  { label: 'Strong Passwords', status: true },
  { label: 'Active Sessions', status: false },
  { label: 'IP Whitelist', status: false },
];

// Quick links - TODO: stats should be fetched from API
const quickLinks = [
  {
    id: 'access-control',
    title: 'Access Control',
    description: 'Sessions, API keys & IP restrictions',
    icon: Key,
    href: '/settings/security/access',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    cardBg: 'bg-blue-50/50',
    borderColor: 'border-blue-200',
    stats: [
      { label: 'Sessions', value: '0' },
      { label: 'API Keys', value: '0' },
    ],
  },
  {
    id: 'audit-logs',
    title: 'Audit Logs',
    description: 'Track all workspace changes',
    icon: ScrollText,
    href: '/settings/audit',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    cardBg: 'bg-purple-50/50',
    borderColor: 'border-purple-200',
    stats: [
      { label: 'Today', value: '0' },
      { label: 'Alerts', value: '0' },
    ],
  },
];

// Quick settings
const quickSettings = [
  {
    id: 'two-factor',
    title: 'Require Two-Factor Authentication',
    description: 'All users must enable 2FA to access the workspace',
    icon: Smartphone,
    enabled: true,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 'ip-whitelist',
    title: 'IP Whitelist',
    description: 'Restrict access to specific IP addresses',
    icon: Network,
    enabled: false,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    id: 'sso',
    title: 'Single Sign-On (SSO)',
    description: 'Enable SAML/OAuth SSO integration',
    icon: FileKey,
    enabled: false,
    badge: 'Enterprise',
    iconBg: 'bg-primary/5',
    iconColor: 'text-primary',
  },
  {
    id: 'security-notifications',
    title: 'Security Notifications',
    description: 'Get alerts for suspicious activity',
    icon: AlertTriangle,
    enabled: true,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

// TODO: Recent activity should be fetched from audit logs API
// API endpoint: GET /settings/audit (not yet implemented)
const recentActivity = [];

const getActivityColors = (type) => {
  switch (type) {
    case 'success':
      return { bg: 'bg-green-50', color: 'text-green-600' };
    case 'warning':
      return { bg: 'bg-red-50', color: 'text-red-600' };
    default:
      return { bg: 'bg-blue-50', color: 'text-blue-600' };
  }
};

export default function SecurityPage() {
  const [settings, setSettings] = useState(
    quickSettings.reduce((acc, s) => ({ ...acc, [s.id]: s.enabled }), {})
  );
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSetting = (id) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter activity based on search
  const filteredActivity = recentActivity.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <HubLayout
      hubId="settings"
      showFixedMenu={false}
      title="Security"
      description="Manage workspace security settings and monitor activity"
      actions={
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-64 pl-10 pr-4 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>
      }
    >
      <motion.div
        className="flex-1 p-6 space-y-6 overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Security Score - Hero Card with Green Gradient */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Security Score</h3>
                <p className="text-sm text-green-100">Your workspace security is excellent</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">{securityStats.securityScore}</span>
                <span className="text-2xl text-white/80">%</span>
              </div>
              <div className="flex items-center gap-1 text-green-100 text-sm mt-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+5% this month</span>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="relative mt-6 flex flex-wrap gap-3">
            {securityChecklist.map((item) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm backdrop-blur',
                  item.status ? 'bg-white/20 text-white' : 'bg-amber-400/30 text-amber-100'
                )}
              >
                {item.status ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links - Colored Cards */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.id} href={link.href}>
              <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'rounded-2xl p-5 border-2 cursor-pointer group transition-all',
                  link.cardBg,
                  link.borderColor,
                  'hover:shadow-md'
                )}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      'h-11 w-11 rounded-xl flex items-center justify-center',
                      link.iconBg
                    )}
                  >
                    <link.icon className={cn('h-5 w-5', link.iconColor)} />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="mt-4 font-semibold text-gray-900">{link.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{link.description}</p>
                <div className="mt-4 flex gap-6">
                  {link.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Two Column Layout for Settings and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Settings - Left Column */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quick Settings</h3>
                <p className="text-sm text-gray-500">Toggle security features</p>
              </div>
            </div>

            <div className="space-y-2">
              {quickSettings.map((setting, index) => (
                <motion.div
                  key={setting.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-9 w-9 rounded-lg flex items-center justify-center',
                        setting.iconBg
                      )}
                    >
                      <setting.icon className={cn('h-4 w-4', setting.iconColor)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{setting.title}</p>
                        {setting.badge && (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-[10px] px-1.5 py-0">
                            {setting.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[setting.id]}
                    onCheckedChange={() => toggleSetting(setting.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity - Right Column */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl p-6 border border-amber-200/50"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Activity className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-500">Latest security events</p>
                </div>
              </div>
              <Link href="/settings/audit">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                >
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              {filteredActivity.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-amber-200/50">
                  <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-6 w-6 text-amber-400" />
                  </div>
                  <p className="text-sm text-gray-500">No activity found</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              ) : (
                filteredActivity.map((activity, index) => {
                  const colors = getActivityColors(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <div
                        className={cn(
                          'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                          colors.bg
                        )}
                      >
                        <activity.icon className={cn('h-4 w-4', colors.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{activity.time}</span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </HubLayout>
  );
}
