'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Phone,
  MessageSquare,
  Clock,
  AlertTriangle,
  Zap,
  FileWarning,
  Wallet,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BentoCard } from '@/components/ui/glass-card';

// Mock action items - replace with API data
const actionItems = [
  {
    id: '1',
    type: 'followup',
    title: 'Follow up with Acme Corp',
    context: 'Deal: Enterprise License - Negotiation',
    contactId: 'c1',
    dealId: 'd1',
    dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    urgency: 'medium',
    icon: Phone,
    route: '/pipeline/deals/d1',
  },
  {
    id: '2',
    type: 'unreplied',
    title: 'New WhatsApp message from +91 98765...',
    context: 'Waiting 1h 23m',
    contactId: 'c2',
    dueAt: null,
    urgency: 'high',
    icon: MessageSquare,
    route: '/inbox/conv-123',
  },
  {
    id: '3',
    type: 'sla',
    title: 'Ticket #128 - Payment Issue',
    context: 'SLA due in 30 mins',
    ticketId: 't1',
    dueAt: new Date(Date.now() + 30 * 60 * 1000),
    urgency: 'critical',
    icon: Clock,
    route: '/tickets/t1',
  },
  {
    id: '4',
    type: 'followup',
    title: 'Send proposal to XYZ Ltd',
    context: 'Deal: Annual Subscription - Proposal',
    dealId: 'd2',
    dueAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    urgency: 'low',
    icon: Phone,
    route: '/pipeline/deals/d2',
  },
  {
    id: '5',
    type: 'unreplied',
    title: 'Message from Mike Chen',
    context: 'Waiting 45m',
    contactId: 'c3',
    dueAt: null,
    urgency: 'medium',
    icon: MessageSquare,
    route: '/inbox/conv-456',
  },
];

const criticalAlerts = [
  {
    id: 'a1',
    type: 'workflow_failure',
    title: 'Automation Failed',
    description: 'Lead Routing workflow failed 3 times',
    icon: Zap,
    route: '/automation?filter=failed',
    severity: 'critical',
  },
  {
    id: 'a2',
    type: 'template_issue',
    title: 'Template Variables Missing',
    description: '2 templates have unmapped variables',
    icon: FileWarning,
    route: '/settings/templates',
    severity: 'warn',
  },
  {
    id: 'a3',
    type: 'wallet',
    title: 'Low Balance Warning',
    description: 'Balance below ₹500, auto-topup disabled',
    icon: Wallet,
    route: '/wallet?tab=topup',
    severity: 'warn',
  },
];

const urgencyStyles = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-orange-500',
  critical: 'border-l-red-500',
};

const urgencyBadge = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const severityStyles = {
  critical: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900/50',
  warn: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900/50',
};

function formatTimeLeft(dueAt) {
  if (!dueAt) return null;
  const diff = dueAt.getTime() - Date.now();
  if (diff < 0) return 'Overdue';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `Due in ${hours}h ${mins}m`;
  return `Due in ${mins}m`;
}

export function ActionCenter() {
  return (
    <BentoCard className="p-0 overflow-hidden">
      <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Action Items - 3 columns */}
        <div className="lg:col-span-3 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Action Center
              </h3>
              <p className="text-sm text-muted-foreground">Tasks requiring your attention</p>
            </div>
            <Link
              href="/tasks"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {actionItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={item.route}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border-l-4 bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer',
                      urgencyStyles[item.urgency]
                    )}
                  >
                    <div className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
                      item.urgency === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                      item.urgency === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                      'bg-primary/10 text-primary'
                    )}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.context}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {item.dueAt && (
                        <p className={cn(
                          'text-xs font-medium',
                          item.urgency === 'critical' ? 'text-red-600' :
                          item.urgency === 'high' ? 'text-orange-600' :
                          'text-muted-foreground'
                        )}>
                          {formatTimeLeft(item.dueAt)}
                        </p>
                      )}
                      <span className={cn(
                        'inline-flex text-[10px] px-1.5 py-0.5 rounded-full mt-1',
                        urgencyBadge[item.urgency]
                      )}>
                        {item.urgency}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Critical Alerts - 2 columns */}
        <div className="lg:col-span-2 p-6 bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Critical Alerts
            </h3>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {criticalAlerts.length}
            </span>
          </div>

          <div className="space-y-3">
            {criticalAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={alert.route}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-all',
                      severityStyles[alert.severity]
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full shrink-0',
                        alert.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                      )}>
                        <alert.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}

            {criticalAlerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No critical alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
