'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MessageSquare,
  Users,
  Kanban,
  Ticket,
  Wallet,
  Zap,
  BarChart3,
  Settings,
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/components/motion';

// App tile definitions
const apps = [
  {
    id: 'inbox',
    title: 'Inbox',
    description: 'WhatsApp & messaging',
    icon: MessageSquare,
    route: '/inbox',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    kpis: [
      { label: 'Open chats', value: 24 },
      { label: 'Unassigned', value: 8 },
    ],
    quickActions: [
      { label: 'Open Unassigned', route: '/inbox?filter=unassigned' },
      { label: 'Templates', route: '/settings/templates' },
    ],
    status: 'ready',
    roles: ['owner', 'admin', 'sales_rep', 'support_agent'],
  },
  {
    id: 'crm',
    title: 'CRM',
    description: 'Contacts & companies',
    icon: Users,
    route: '/crm/contacts',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    kpis: [
      { label: 'Total contacts', value: '1,234' },
      { label: 'New today', value: 12 },
    ],
    quickActions: [
      { label: 'Add Contact', route: '/crm/contacts/new' },
      { label: 'Import CSV', route: '/crm/contacts/import' },
    ],
    status: 'ready',
    roles: ['owner', 'admin', 'sales_rep'],
  },
  {
    id: 'pipeline',
    title: 'Pipeline',
    description: 'Deals & opportunities',
    icon: Kanban,
    route: '/pipeline/deals',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    kpis: [
      { label: 'At risk', value: 3, severity: 'critical' },
      { label: 'Follow-ups', value: 12 },
    ],
    quickActions: [
      { label: 'My Deals', route: '/pipeline/deals?filter=mine' },
      { label: 'Add Deal', route: '/pipeline/deals/new' },
    ],
    status: 'ready',
    roles: ['owner', 'admin', 'sales_rep'],
  },
  {
    id: 'tickets',
    title: 'Tickets',
    description: 'Support & helpdesk',
    icon: Ticket,
    route: '/tickets',
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-500/10 to-amber-500/10',
    kpis: [
      { label: 'SLA breaches', value: 2, severity: 'critical' },
      { label: 'Open tickets', value: 7 },
    ],
    quickActions: [
      { label: 'My Tickets', route: '/tickets?filter=mine' },
      { label: 'Create Ticket', route: '/tickets/new' },
    ],
    status: 'ready',
    roles: ['owner', 'admin', 'support_agent'],
  },
  {
    id: 'wallet',
    title: 'Wallet',
    description: 'Balance & usage',
    icon: Wallet,
    route: '/wallet',
    gradient: 'from-indigo-500 to-violet-500',
    bgGradient: 'from-indigo-500/10 to-violet-500/10',
    kpis: [
      { label: 'Balance', value: '₹12,450' },
      { label: 'Burn/day', value: '₹2,100' },
    ],
    quickActions: [
      { label: 'Top up', route: '/wallet?tab=topup' },
      { label: 'Usage', route: '/wallet?tab=usage' },
    ],
    status: 'ready',
    roles: ['owner', 'admin'],
  },
  {
    id: 'automation',
    title: 'Automations',
    description: 'Workflows & triggers',
    icon: Zap,
    route: '/automation',
    gradient: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-500/10 to-orange-500/10',
    kpis: [
      { label: 'Active flows', value: 8 },
      { label: 'Runs today', value: 156 },
    ],
    quickActions: [
      { label: 'Create Flow', route: '/automation/new' },
      { label: 'View Logs', route: '/automation/logs' },
    ],
    status: 'ready',
    roles: ['owner', 'admin'],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Reports & insights',
    icon: BarChart3,
    route: '/analytics',
    gradient: 'from-rose-500 to-pink-500',
    bgGradient: 'from-rose-500/10 to-pink-500/10',
    kpis: [
      { label: 'Reports', value: 12 },
      { label: 'Dashboards', value: 4 },
    ],
    quickActions: [
      { label: 'Sales Report', route: '/analytics/sales' },
      { label: 'Performance', route: '/analytics/performance' },
    ],
    status: 'ready',
    roles: ['owner', 'admin', 'sales_rep'],
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Settings & users',
    icon: Settings,
    route: '/settings',
    gradient: 'from-gray-500 to-slate-500',
    bgGradient: 'from-gray-500/10 to-slate-500/10',
    kpis: [
      { label: 'Team members', value: 8 },
      { label: 'Roles', value: 4 },
    ],
    quickActions: [
      { label: 'Add Users', route: '/settings/users' },
      { label: 'Connect WhatsApp', route: '/settings/channels' },
    ],
    status: 'setup_required',
    roles: ['owner', 'admin'],
  },
];

const statusConfig = {
  ready: {
    label: 'Ready',
    icon: CheckCircle,
    className: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  },
  setup_required: {
    label: 'Setup Required',
    icon: AlertCircle,
    className: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
  },
  locked: {
    label: 'Locked',
    icon: Lock,
    className: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30',
  },
};

export function AppLauncherGrid({ userRole = 'owner' }) {
  const visibleApps = apps.filter((app) => app.roles.includes(userRole));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-muted-foreground">Apps</h2>
        <Link
          href="/settings/apps"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Manage apps
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {visibleApps.map((app) => (
          <motion.div key={app.id} variants={staggerItem}>
            <AppTile app={app} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function AppTile({ app }) {
  const StatusIcon = statusConfig[app.status].icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-soft transition-all hover:shadow-soft-lg hover:border-primary/20'
      )}
    >
      {/* Header with gradient */}
      <div className={cn('p-4 bg-gradient-to-br', app.bgGradient)}>
        <div className="flex items-start justify-between">
          <motion.div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg',
              app.gradient
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <app.icon className="h-6 w-6 text-white" />
          </motion.div>
          <span className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium',
            statusConfig[app.status].className
          )}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig[app.status].label}
          </span>
        </div>
        <Link href={app.route}>
          <h3 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">
            {app.title}
          </h3>
          <p className="text-sm text-muted-foreground">{app.description}</p>
        </Link>
      </div>

      {/* KPIs */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-4">
          {app.kpis.map((kpi, index) => (
            <div key={index} className="flex-1">
              <p className={cn(
                'text-lg font-bold',
                kpi.severity === 'critical' && 'text-red-600'
              )}>
                {kpi.value}
              </p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 pt-0 flex gap-2">
        {app.quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.route}
            className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
