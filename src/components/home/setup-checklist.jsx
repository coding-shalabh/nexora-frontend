'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  MessageSquare,
  Users,
  Shield,
  Kanban,
  FileText,
  Wallet,
  Upload,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedProgress } from '@/components/motion';
import { useState } from 'react';

// Checklist items for Phase 1
const checklistItems = [
  {
    id: 'connect_whatsapp',
    title: 'Connect WhatsApp Number',
    description: 'Set up your WABA for messaging',
    icon: MessageSquare,
    route: '/settings/whatsapp',
    status: 'done',
  },
  {
    id: 'invite_team',
    title: 'Invite Team Members',
    description: 'Add your team to collaborate',
    icon: Users,
    route: '/settings/users',
    status: 'done',
  },
  {
    id: 'configure_roles',
    title: 'Configure Roles & Permissions',
    description: 'Set up access controls',
    icon: Shield,
    route: '/settings/roles',
    status: 'done',
  },
  {
    id: 'create_pipeline',
    title: 'Create Pipeline Stages',
    description: 'Define your sales process',
    icon: Kanban,
    route: '/settings/pipeline',
    status: 'in_progress',
  },
  {
    id: 'add_templates',
    title: 'Add WhatsApp Templates',
    description: 'Create message templates',
    icon: FileText,
    route: '/settings/templates',
    status: 'not_started',
  },
  {
    id: 'topup_wallet',
    title: 'Top up Wallet',
    description: 'Add credits for messaging',
    icon: Wallet,
    route: '/wallet?tab=topup',
    status: 'not_started',
  },
  {
    id: 'import_leads',
    title: 'Import Leads/Contacts',
    description: 'Upload your existing data',
    icon: Upload,
    route: '/crm/contacts/import',
    status: 'not_started',
  },
];

const statusConfig = {
  done: {
    icon: CheckCircle2,
    className: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    label: 'Completed',
  },
  in_progress: {
    icon: Circle,
    className: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 animate-pulse',
    label: 'In Progress',
  },
  not_started: {
    icon: Circle,
    className: 'text-muted-foreground bg-muted',
    label: 'Not Started',
  },
};

export function SetupChecklist({ progress = 3, total = 7, isFirstTimeUser = false }) {
  const [isVisible, setIsVisible] = useState(true);
  const progressPercent = Math.round((progress / total) * 100);
  const isComplete = progress >= total;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <GlassCard
        className={cn('relative overflow-hidden', isComplete && 'border-green-500/50')}
        glow={isComplete}
      >
        {/* Close button */}
        {!isFirstTimeUser && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <motion.div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg',
              isComplete
                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                : 'bg-gradient-to-br from-primary to-purple-600'
            )}
            animate={isComplete ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {isComplete ? (
              <CheckCircle2 className="h-7 w-7 text-white" />
            ) : (
              <Sparkles className="h-7 w-7 text-white" />
            )}
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">
              {isComplete ? (
                <span className="text-green-600">You're ready to sell!</span>
              ) : (
                'Complete Your Setup'
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isComplete
                ? 'All setup tasks completed. Your workspace is ready.'
                : `${progress} of ${total} tasks completed`}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <AnimatedProgress value={progressPercent} className="flex-1" />
              <span className="text-sm font-medium text-primary">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Checklist Grid */}
        {!isComplete && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {checklistItems.map((item, index) => {
              const StatusIcon = statusConfig[item.status].icon;
              const isDone = item.status === 'done';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={item.route}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer',
                        isDone
                          ? 'border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                          statusConfig[item.status].className
                        )}
                      >
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'text-sm font-medium truncate',
                            isDone && 'text-green-700 dark:text-green-400 line-through'
                          )}
                        >
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      </div>
                      {!isDone && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Decorative gradient */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </GlassCard>
    </motion.div>
  );
}
