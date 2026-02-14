'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { StatCard, BentoCard, GlassCard } from '@/components/ui/glass-card';
import {
  AnimatedListItem,
  AnimatedProgress,
  PulseDot,
  staggerContainer,
  staggerItem,
} from '@/components/motion';
import {
  MessageSquare,
  Users,
  Kanban,
  Ticket,
  Clock,
  DollarSign,
  Zap,
  Calendar,
  Phone,
  FileText,
  CheckCircle2,
  MoreHorizontal,
  Sparkles,
  Activity,
  Target,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useDashboardStats,
  usePipelineMetrics,
  useRecentConversations,
  useRecentActivities,
} from '@/hooks/use-dashboard';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400',
};

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

function formatCurrency(value) {
  if (!value) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTimeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// Container animation - background appears first
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.15,
    },
  },
};

// Card animation - cards appear one by one
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function HomePage() {
  // Fetch data from API
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats();
  const { data: pipeline, isLoading: pipelineLoading } = usePipelineMetrics();
  const { data: conversationsData, isLoading: conversationsLoading } = useRecentConversations(5);
  const { data: activitiesData, isLoading: activitiesLoading } = useRecentActivities(5);

  const conversations = conversationsData || [];
  const activities = activitiesData || [];

  // Error state (still show error if API fails)
  if (statsError && !statsLoading) {
    return (
      <UnifiedLayout hubId="home" pageTitle="Dashboard" fixedMenu={null}>
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-lg font-medium">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground">{statsError.message}</p>
          <Button onClick={() => refetchStats()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </UnifiedLayout>
    );
  }

  // Build stats for HubLayout using createStat helper
  const hubStats = [
    createStat(
      'Open Conversations',
      stats?.conversations?.toString() || '0',
      MessageSquare,
      'green'
    ),
    createStat('Total Contacts', stats?.contacts?.total?.toLocaleString() || '0', Users, 'blue'),
    createStat('Active Deals', stats?.deals?.open?.toString() || '0', Kanban, 'purple'),
    createStat('Open Tickets', stats?.tickets?.toString() || '0', Ticket, 'amber'),
  ];

  const actions = (
    <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 dark:bg-green-900/30">
      <PulseDot color="bg-green-500" />
      <span className="text-sm font-medium text-green-700 dark:text-green-400">
        All systems operational
      </span>
    </div>
  );

  return (
    <UnifiedLayout hubId="home" pageTitle="Dashboard" stats={hubStats} fixedMenu={null}>
      <motion.div
        className="space-y-6 p-6 h-full overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Bento Grid */}
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" variants={cardVariants}>
          {/* Recent Conversations - Spans 1 column */}
          <BentoCard className="lg:row-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent Conversations
                </h3>
                <p className="text-sm text-muted-foreground">Latest messages from your inbox</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-lg p-2 hover:bg-muted transition-colors"
              >
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            </div>
            <div className="space-y-3">
              {conversationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent conversations
                </p>
              ) : (
                conversations.map((conv, index) => (
                  <AnimatedListItem key={conv.id} index={index}>
                    <motion.div
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer group"
                      whileHover={{ x: 4 }}
                    >
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-900 to-brand-700 shadow-md">
                          <span className="text-sm font-medium text-white">
                            {conv.contactName
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2) || '?'}
                          </span>
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${statusColors.online}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                            {conv.contactName || 'Unknown'}
                            {conv.unreadCount > 0 && (
                              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-primary" />
                            )}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage || 'No messages'}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatedListItem>
                ))
              )}
            </div>
          </BentoCard>

          {/* Pipeline Overview - Spans 2 columns */}
          <BentoCard span={2} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Pipeline Overview
                </h3>
                <p className="text-sm text-muted-foreground">Track your active deals</p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-right"
              >
                <p className="text-3xl font-bold gradient-text">
                  {formatCurrency(pipeline?.totalValue || stats?.deals?.openValue || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total pipeline value</p>
              </motion.div>
            </div>
            <div className="space-y-4">
              {pipelineLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : pipeline?.byStage?.length > 0 ? (
                pipeline.byStage.slice(0, 3).map((stage, index) => (
                  <motion.div
                    key={stage.stageId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">Stage {index + 1}</p>
                        <p className="text-sm text-muted-foreground">{stage.count} deals</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(stage.value)}
                        </p>
                      </div>
                    </div>
                    <AnimatedProgress
                      value={Math.min(100, (stage.value / (pipeline.totalValue || 1)) * 100)}
                      className="mt-3"
                    />
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Kanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active deals in pipeline</p>
                </div>
              )}
            </div>
          </BentoCard>

          {/* Recent Activities */}
          <BentoCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Recent Activities
                </h3>
                <p className="text-sm text-muted-foreground">Your latest actions</p>
              </div>
            </div>
            <div className="space-y-3">
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activities
                </p>
              ) : (
                activities.map((activity, index) => {
                  const IconComponent =
                    activity.type === 'CALL'
                      ? Phone
                      : activity.type === 'MEETING'
                        ? Calendar
                        : activity.type === 'TASK'
                          ? CheckCircle2
                          : FileText;

                  return (
                    <AnimatedListItem key={activity.id} index={index}>
                      <motion.div
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer"
                        whileHover={{ x: 4 }}
                      >
                        <motion.div
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md"
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconComponent className="h-4 w-4 text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[activity.priority?.toLowerCase()] || priorityColors.medium}`}
                            >
                              {activity.type?.toLowerCase() || 'task'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(activity.createdAt)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatedListItem>
                  );
                })
              )}
            </div>
          </BentoCard>

          {/* Quick Stats */}
          <BentoCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Stats
                </h3>
                <p className="text-sm text-muted-foreground">Key metrics</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Deals Won</span>
                </div>
                <span className="text-lg font-bold">
                  {formatCurrency(stats?.deals?.wonValue || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">New Contacts</span>
                </div>
                <span className="text-lg font-bold">{stats?.contacts?.new || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Kanban className="h-4 w-4 text-brand-700" />
                  </div>
                  <span className="text-sm font-medium">Win Rate</span>
                </div>
                <span className="text-lg font-bold">{pipeline?.winRate || 0}%</span>
              </div>
            </div>
          </BentoCard>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div className="grid gap-4 md:grid-cols-3" variants={cardVariants}>
          <GlassCard glow>
            <div className="flex items-center gap-4">
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-pink-500 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <DollarSign className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.deals?.openValue || 0)}</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.deals?.open || 0} deals in pipeline
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Clock className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold">{stats?.tickets || 0}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Awaiting response
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <MessageSquare className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">Conversations</p>
                <p className="text-2xl font-bold">{stats?.conversations || 0}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  Active this month
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </UnifiedLayout>
  );
}
