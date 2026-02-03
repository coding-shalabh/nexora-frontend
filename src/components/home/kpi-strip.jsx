'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MessageSquare,
  Users,
  Calendar,
  AlertTriangle,
  Clock,
  Wallet,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// KPI definitions based on user role
const getKPIsForRole = (role) => {
  const baseKPIs = [
    {
      id: 'open_conversations',
      label: 'Open Conversations',
      value: 24,
      trend: '+12%',
      trendType: 'up',
      severity: 'normal',
      icon: MessageSquare,
      route: '/inbox?status=open',
      gradient: 'from-green-500 to-emerald-500',
      roles: ['owner', 'admin', 'sales_rep', 'support_agent'],
    },
    {
      id: 'unassigned_chats',
      label: 'Unassigned Chats',
      value: 8,
      trend: '+3',
      trendType: 'up',
      severity: 'warn',
      icon: Users,
      route: '/inbox?filter=unassigned',
      gradient: 'from-orange-500 to-amber-500',
      roles: ['owner', 'admin'],
    },
    {
      id: 'followups_due',
      label: 'Follow-ups Due Today',
      value: 12,
      trend: '-2',
      trendType: 'down',
      severity: 'normal',
      icon: Calendar,
      route: '/pipeline?filter=followups_due_today',
      gradient: 'from-blue-500 to-cyan-500',
      roles: ['owner', 'admin', 'sales_rep'],
    },
    {
      id: 'deals_at_risk',
      label: 'Deals At Risk',
      value: 3,
      trend: '+1',
      trendType: 'up',
      severity: 'critical',
      icon: AlertTriangle,
      route: '/pipeline?filter=at_risk',
      gradient: 'from-red-500 to-rose-500',
      roles: ['owner', 'admin', 'sales_rep'],
    },
    {
      id: 'sla_breaches',
      label: 'SLA Breaches',
      value: 2,
      trend: '0',
      trendType: 'neutral',
      severity: 'critical',
      icon: Clock,
      route: '/tickets?filter=sla_breached',
      gradient: 'from-purple-500 to-pink-500',
      roles: ['owner', 'admin', 'support_agent'],
    },
    {
      id: 'wallet_balance',
      label: 'Wallet Balance',
      value: '₹12,450',
      trend: '₹2,100/day',
      trendType: 'neutral',
      severity: 'normal',
      icon: Wallet,
      route: '/wallet',
      gradient: 'from-indigo-500 to-violet-500',
      roles: ['owner', 'admin'],
    },
  ];

  return baseKPIs.filter((kpi) => kpi.roles.includes(role));
};

const severityStyles = {
  normal: 'border-border/50',
  warn: 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20',
  critical: 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20',
};

const trendStyles = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
  neutral: 'text-muted-foreground',
};

export function KPIStrip({ userRole = 'owner' }) {
  const kpis = getKPIsForRole(userRole);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-muted-foreground">Today's Snapshot</h2>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={kpi.route}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative overflow-hidden rounded-xl border bg-card p-4 shadow-soft transition-all hover:shadow-soft-lg cursor-pointer',
                  severityStyles[kpi.severity]
                )}
              >
                {/* Gradient overlay on hover */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-5',
                  kpi.gradient
                )} />

                {/* Icon */}
                <motion.div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br shadow-md mb-3',
                    kpi.gradient
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <kpi.icon className="h-5 w-5 text-white" />
                </motion.div>

                {/* Value */}
                <motion.p
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                >
                  {kpi.value}
                </motion.p>

                {/* Label */}
                <p className="text-sm text-muted-foreground line-clamp-1">{kpi.label}</p>

                {/* Trend */}
                <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', trendStyles[kpi.trendType])}>
                  {kpi.trendType === 'up' && <TrendingUp className="h-3 w-3" />}
                  {kpi.trendType === 'down' && <TrendingDown className="h-3 w-3" />}
                  <span>{kpi.trend}</span>
                </div>

                {/* Severity indicator */}
                {kpi.severity !== 'normal' && (
                  <div className={cn(
                    'absolute top-2 right-2 h-2 w-2 rounded-full',
                    kpi.severity === 'warn' && 'bg-orange-500 animate-pulse',
                    kpi.severity === 'critical' && 'bg-red-500 animate-pulse'
                  )} />
                )}
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
