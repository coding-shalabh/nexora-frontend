'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Smartphone,
  PhoneCall,
  Calendar,
  Download,
  Filter,
  Loader2,
  RefreshCw,
  AlertCircle,
  Search,
  PieChart,
  Activity,
  Zap,
  Target,
  UserCheck,
  Timer,
  ThumbsUp,
  LayoutDashboard,
  MessagesSquare,
  Signal,
  Layers,
  Tag,
  SlidersHorizontal,
  Save,
  Bookmark,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useInboxAnalytics } from '@/hooks/use-inbox-agent';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Channel icon mapping
const channelIcons = {
  WHATSAPP: WhatsAppIcon,
  EMAIL: Mail,
  SMS: Smartphone,
  VOICE: PhoneCall,
};

const channelColors = {
  WHATSAPP: { color: 'text-green-500', bgColor: 'bg-green-100' },
  EMAIL: { color: 'text-blue-500', bgColor: 'bg-blue-100' },
  SMS: { color: 'text-purple-500', bgColor: 'bg-purple-100' },
  VOICE: { color: 'text-orange-500', bgColor: 'bg-orange-100' },
};

// Format duration in minutes/seconds
const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format response time
const formatResponseTime = (seconds) => {
  if (!seconds) return 'N/A';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = seconds / 60;
  if (mins < 60) return `${mins.toFixed(1)} min`;
  const hours = mins / 60;
  return `${hours.toFixed(1)} hr`;
};

// Report navigation items
const reportNavigation = [
  {
    id: 'overview',
    title: 'Overview',
    icon: LayoutDashboard,
    description: 'Key performance metrics',
  },
  {
    id: 'conversations',
    title: 'Conversations',
    icon: MessagesSquare,
    description: 'Conversation analytics',
  },
  { id: 'channels', title: 'Channels', icon: Signal, description: 'Channel performance' },
  { id: 'team', title: 'Team Performance', icon: Users, description: 'Agent metrics' },
  { id: 'response', title: 'Response Times', icon: Timer, description: 'Response analytics' },
  { id: 'satisfaction', title: 'Satisfaction', icon: ThumbsUp, description: 'CSAT scores' },
  { id: 'segments', title: 'Segments', icon: Layers, description: 'Segment analytics' },
];

// Default segment filters
const defaultSegmentFilters = {
  channels: [],
  tags: [],
  agents: [],
  status: [],
  dateRange: '7d',
};

// Saved segment type
const savedSegmentsDefault = [
  { id: '1', name: 'VIP Customers', filters: { tags: ['vip'], channels: ['whatsapp', 'email'] } },
  { id: '2', name: 'Support Tickets', filters: { tags: ['support'], status: ['open', 'pending'] } },
  { id: '3', name: 'Hot Leads', filters: { tags: ['hot-lead'], channels: ['whatsapp'] } },
];

export default function InboxAnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [activeReport, setActiveReport] = useState('overview');
  const { toast } = useToast();

  // Segment state
  const [segmentFilters, setSegmentFilters] = useState(defaultSegmentFilters);
  const [savedSegments, setSavedSegments] = useState(savedSegmentsDefault);
  const [activeSegment, setActiveSegment] = useState(null);
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [expandedFilters, setExpandedFilters] = useState({
    channels: true,
    tags: false,
    agents: false,
    status: false,
  });

  // Available filter options
  const filterOptions = {
    channels: [
      { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, color: 'text-green-500' },
      { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-500' },
      { id: 'sms', label: 'SMS', icon: Smartphone, color: 'text-purple-500' },
      { id: 'voice', label: 'Voice', icon: PhoneCall, color: 'text-orange-500' },
    ],
    tags: [
      { id: 'vip', label: 'VIP', color: 'bg-yellow-100 text-yellow-700' },
      { id: 'support', label: 'Support', color: 'bg-blue-100 text-blue-700' },
      { id: 'hot-lead', label: 'Hot Lead', color: 'bg-red-100 text-red-700' },
      { id: 'new', label: 'New', color: 'bg-green-100 text-green-700' },
      { id: 'returning', label: 'Returning', color: 'bg-purple-100 text-purple-700' },
    ],
    status: [
      { id: 'open', label: 'Open', color: 'bg-blue-100 text-blue-700' },
      { id: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      { id: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-700' },
      { id: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-700' },
    ],
  };

  // Toggle filter selection
  const toggleFilter = (category, value) => {
    setSegmentFilters((prev) => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSegmentFilters(defaultSegmentFilters);
    setActiveSegment(null);
  };

  // Apply saved segment
  const applySegment = (segment) => {
    setActiveSegment(segment.id);
    setSegmentFilters({ ...defaultSegmentFilters, ...segment.filters });
    toast({ title: `Applied segment: ${segment.name}` });
  };

  // Save current filters as segment
  const saveSegment = () => {
    if (!newSegmentName.trim()) {
      toast({ variant: 'destructive', title: 'Please enter a segment name' });
      return;
    }
    const newSegment = {
      id: Date.now().toString(),
      name: newSegmentName,
      filters: { ...segmentFilters },
    };
    setSavedSegments((prev) => [...prev, newSegment]);
    setNewSegmentName('');
    setIsCreatingSegment(false);
    toast({ title: 'Segment saved successfully' });
  };

  // Delete segment
  const deleteSegment = (segmentId) => {
    setSavedSegments((prev) => prev.filter((s) => s.id !== segmentId));
    if (activeSegment === segmentId) {
      setActiveSegment(null);
      clearFilters();
    }
    toast({ title: 'Segment deleted' });
  };

  // Count active filters
  const activeFilterCount = Object.values(segmentFilters).flat().filter(Boolean).length;

  // Fetch analytics data
  const {
    data: analyticsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useInboxAnalytics(dateRange);
  const analytics = analyticsResponse?.data;

  // Process data for rendering
  const overviewStats = useMemo(() => {
    if (!analytics) return [];

    return [
      {
        title: 'Total Conversations',
        value: analytics.overview?.totalConversations?.toLocaleString() || '0',
        change: analytics.overview?.conversationsChange
          ? `${analytics.overview.conversationsChange > 0 ? '+' : ''}${analytics.overview.conversationsChange.toFixed(1)}%`
          : null,
        trend: analytics.overview?.conversationsChange > 0 ? 'up' : 'down',
        icon: MessageSquare,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100',
      },
      {
        title: 'Active Contacts',
        value: analytics.overview?.activeContacts?.toLocaleString() || '0',
        change: analytics.overview?.contactsChange
          ? `${analytics.overview.contactsChange > 0 ? '+' : ''}${analytics.overview.contactsChange.toFixed(1)}%`
          : null,
        trend: analytics.overview?.contactsChange > 0 ? 'up' : 'down',
        icon: Users,
        color: 'text-green-500',
        bgColor: 'bg-green-100',
      },
      {
        title: 'Avg Response Time',
        value: formatResponseTime(analytics.overview?.avgResponseTime),
        change: analytics.overview?.responseTimeChange
          ? `${analytics.overview.responseTimeChange > 0 ? '+' : ''}${analytics.overview.responseTimeChange.toFixed(1)}%`
          : null,
        trend: analytics.overview?.responseTimeChange < 0 ? 'up' : 'down', // Lower is better
        icon: Clock,
        color: 'text-purple-500',
        bgColor: 'bg-purple-100',
      },
      {
        title: 'Resolution Rate',
        value: `${analytics.overview?.resolutionRate?.toFixed(1) || 0}%`,
        change: analytics.overview?.resolutionChange
          ? `${analytics.overview.resolutionChange > 0 ? '+' : ''}${analytics.overview.resolutionChange.toFixed(1)}%`
          : null,
        trend: analytics.overview?.resolutionChange > 0 ? 'up' : 'down',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-100',
      },
    ];
  }, [analytics]);

  // Process channel stats
  const channelStats = useMemo(() => {
    if (!analytics?.channels) return [];

    return analytics.channels.map((channel) => ({
      channel: channel.type,
      icon: channelIcons[channel.type] || MessageSquare,
      ...(channelColors[channel.type] || { color: 'text-gray-500', bgColor: 'bg-gray-100' }),
      conversations: channel.conversations || 0,
      percentage: channel.percentage || 0,
      delivered: channel.delivered || 0,
      read: channel.read || 0,
      replied: channel.replied || 0,
      answered: channel.answered || 0,
      avgDuration: formatDuration(channel.avgDuration),
      missed: channel.missed || 0,
    }));
  }, [analytics]);

  // Process agent performance
  const agentPerformance = useMemo(() => {
    if (!analytics?.agents) return [];

    return analytics.agents.map((agent) => ({
      id: agent.id,
      name: agent.name || 'Unknown',
      avatar: agent.avatar,
      conversations: agent.conversations || 0,
      avgResponseTime: formatResponseTime(agent.avgResponseTime),
      satisfaction: agent.satisfaction || 0,
      resolved: agent.resolutionRate || 0,
    }));
  }, [analytics]);

  // Process hourly data
  const hourlyData = useMemo(() => {
    if (!analytics?.hourlyVolume) {
      // Default data if not available
      return [
        { hour: '00:00', conversations: 12 },
        { hour: '03:00', conversations: 5 },
        { hour: '06:00', conversations: 8 },
        { hour: '09:00', conversations: 45 },
        { hour: '12:00', conversations: 78 },
        { hour: '15:00', conversations: 65 },
        { hour: '18:00', conversations: 42 },
        { hour: '21:00', conversations: 23 },
      ];
    }
    return analytics.hourlyVolume;
  }, [analytics]);

  const maxConversations = Math.max(...hourlyData.map((d) => d.conversations), 1);

  // Today's summary from analytics
  const todaySummary = analytics?.today || {
    newConversations: 156,
    resolved: 134,
    pending: 22,
    avgFirstResponse: 45,
    csatScore: 4.5,
  };

  // Mock summary stats for navigation panel
  const summaryStats = {
    conversations: analytics?.overview?.totalConversations || 1245,
    contacts: analytics?.overview?.activeContacts || 890,
    resolved: todaySummary.resolved || 134,
    avgResponse: formatResponseTime(analytics?.overview?.avgResponseTime || 120),
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Top Header with Search */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search analytics..."
            className="pl-10 bg-white/80 border-gray-200 rounded-xl h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-lg p-1 bg-white">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDateRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Main Content Area - 3 Box Layout */}
      <div className="flex flex-1 gap-2 px-2 pb-2 overflow-hidden">
        {/* Left Panel - Report Navigation */}
        <aside className="relative flex flex-col shrink-0 rounded-3xl w-[280px] bg-white shadow-sm overflow-hidden">
          {/* Panel Header */}
          <div className="p-4 border-b shrink-0">
            <h2 className="font-semibold text-lg mb-1">Analytics</h2>
            <p className="text-xs text-muted-foreground">Performance insights</p>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2 bg-blue-50 rounded-lg text-center">
                <p className="text-lg font-bold text-blue-600">
                  {summaryStats.conversations.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Conversations</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg text-center">
                <p className="text-lg font-bold text-green-600">
                  {summaryStats.contacts.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Contacts</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-center">
                <p className="text-lg font-bold text-emerald-600">{summaryStats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg text-center">
                <p className="text-lg font-bold text-purple-600">{summaryStats.avgResponse}</p>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </div>

          {/* Report Navigation List */}
          <div className="flex-1 overflow-auto p-2">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Reports</p>
            <div className="space-y-1">
              {reportNavigation.map((report) => {
                const isActive = activeReport === report.id;
                return (
                  <motion.button
                    key={report.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setActiveReport(report.id)}
                    className={cn(
                      'w-full p-3 rounded-xl text-left transition-all flex items-start gap-3',
                      isActive
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50 border border-transparent'
                    )}
                  >
                    <div
                      className={cn(
                        'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                        isActive ? 'bg-primary/20' : 'bg-muted'
                      )}
                    >
                      <report.icon
                        className={cn(
                          'h-4 w-4',
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          isActive ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {report.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{report.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="p-3 border-t shrink-0">
            <Button variant="outline" className="w-full" size="sm">
              <PieChart className="h-4 w-4 mr-2" /> Custom Report
            </Button>
          </div>
        </aside>

        {/* Right Panel - Analytics Content */}
        <div className="flex-1 w-full flex flex-col bg-white dark:bg-card min-w-0 min-h-0 rounded-3xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-72" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-10 w-10 rounded-lg mb-3" />
                    <Skeleton className="h-8 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6">
                <Card className="col-span-2 p-4">
                  <Skeleton className="h-48 w-full" />
                </Card>
                <Card className="p-4">
                  <Skeleton className="h-48 w-full" />
                </Card>
              </div>
            </div>
          ) : isError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-lg font-semibold mb-2">Failed to load analytics</h2>
              <p className="text-muted-foreground mb-4">{error?.message || 'An error occurred'}</p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Try Again
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReport}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-auto p-6 space-y-6"
              >
                {/* Overview Report */}
                {activeReport === 'overview' && (
                  <>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Overview</h1>
                      <p className="text-muted-foreground">
                        Key performance metrics for the last{' '}
                        {dateRange === '24h' ? '24 hours' : dateRange}
                      </p>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      {overviewStats.length > 0 ? (
                        overviewStats.map((stat, index) => (
                          <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div
                                  className={cn(
                                    'h-10 w-10 rounded-lg flex items-center justify-center',
                                    stat.bgColor
                                  )}
                                >
                                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                                </div>
                                {stat.change && (
                                  <span
                                    className={cn(
                                      'text-xs font-medium flex items-center gap-1',
                                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    )}
                                  >
                                    {stat.trend === 'up' ? (
                                      <ArrowUpRight className="h-3 w-3" />
                                    ) : (
                                      <ArrowDownRight className="h-3 w-3" />
                                    )}
                                    {stat.change}
                                  </span>
                                )}
                              </div>
                              <p className="text-2xl font-bold">{stat.value}</p>
                              <p className="text-sm text-muted-foreground">{stat.title}</p>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-4 text-center py-8 text-muted-foreground">
                          No analytics data available for this period
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {/* Hourly Distribution */}
                      <Card className="col-span-2 p-4">
                        <h3 className="font-semibold mb-4">Conversation Volume</h3>
                        <div className="h-48 flex items-end gap-2">
                          {hourlyData.map((data, index) => (
                            <div key={data.hour} className="flex-1 flex flex-col items-center">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{
                                  height: `${(data.conversations / maxConversations) * 100}%`,
                                }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                className="w-full bg-primary/80 rounded-t-sm min-h-[4px] hover:bg-primary transition-colors cursor-pointer"
                                title={`${data.conversations} conversations`}
                              />
                              <span className="text-[10px] text-muted-foreground mt-2">
                                {data.hour}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Quick Stats */}
                      <Card className="p-4">
                        <h3 className="font-semibold mb-4">Today's Summary</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">New Conversations</span>
                            <span className="font-bold">{todaySummary.newConversations || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Resolved</span>
                            <span className="font-bold text-green-600">
                              {todaySummary.resolved || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Pending</span>
                            <span className="font-bold text-yellow-600">
                              {todaySummary.pending || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Avg First Response</span>
                            <span className="font-bold">
                              {formatResponseTime(todaySummary.avgFirstResponse)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">CSAT Score</span>
                            <span className="font-bold">
                              {todaySummary.csatScore
                                ? `${todaySummary.csatScore.toFixed(1)}/5`
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </>
                )}

                {/* Conversations Report */}
                {activeReport === 'conversations' && (
                  <>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Conversation Analytics</h1>
                      <p className="text-muted-foreground">
                        Detailed conversation metrics and trends
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              {analytics?.overview?.totalConversations?.toLocaleString() || '1,245'}
                            </p>
                            <p className="text-sm text-muted-foreground">Total Conversations</p>
                          </div>
                        </div>
                        <Progress value={75} className="h-2" />
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{todaySummary.resolved || 134}</p>
                            <p className="text-sm text-muted-foreground">Resolved Today</p>
                          </div>
                        </div>
                        <Progress value={85} className="h-2 bg-green-100 [&>*]:bg-green-500" />
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{todaySummary.pending || 22}</p>
                            <p className="text-sm text-muted-foreground">Pending</p>
                          </div>
                        </div>
                        <Progress value={15} className="h-2 bg-yellow-100 [&>*]:bg-yellow-500" />
                      </Card>
                    </div>

                    {/* Volume Chart */}
                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">Hourly Conversation Volume</h3>
                      <div className="h-64 flex items-end gap-3">
                        {hourlyData.map((data, index) => (
                          <div key={data.hour} className="flex-1 flex flex-col items-center">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{
                                height: `${(data.conversations / maxConversations) * 100}%`,
                              }}
                              transition={{ delay: index * 0.05, duration: 0.5 }}
                              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md min-h-[4px] hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer"
                              title={`${data.conversations} conversations`}
                            />
                            <span className="text-xs text-muted-foreground mt-2">{data.hour}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </>
                )}

                {/* Channels Report */}
                {activeReport === 'channels' && (
                  <>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Channel Performance</h1>
                      <p className="text-muted-foreground">
                        Performance breakdown by communication channel
                      </p>
                    </div>

                    {channelStats.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {channelStats.map((channel, index) => (
                          <motion.div
                            key={channel.channel}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className="p-4">
                              <div className="flex items-center gap-3 mb-4">
                                <div
                                  className={cn(
                                    'h-12 w-12 rounded-xl flex items-center justify-center',
                                    channel.bgColor
                                  )}
                                >
                                  <channel.icon className={cn('h-6 w-6', channel.color)} />
                                </div>
                                <div>
                                  <p className="font-semibold text-lg">{channel.channel}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {channel.conversations.toLocaleString()} conversations
                                  </p>
                                </div>
                                <div className="ml-auto text-right">
                                  <p className="text-2xl font-bold">{channel.percentage}%</p>
                                  <p className="text-xs text-muted-foreground">of total</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {channel.channel !== 'VOICE' ? (
                                  <>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Delivered</span>
                                      <div className="flex items-center gap-2">
                                        <Progress value={channel.delivered} className="w-24 h-2" />
                                        <span className="font-medium w-10 text-right">
                                          {channel.delivered}%
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Read</span>
                                      <div className="flex items-center gap-2">
                                        <Progress value={channel.read} className="w-24 h-2" />
                                        <span className="font-medium w-10 text-right">
                                          {channel.read}%
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Replied</span>
                                      <div className="flex items-center gap-2">
                                        <Progress value={channel.replied} className="w-24 h-2" />
                                        <span className="font-medium w-10 text-right">
                                          {channel.replied}%
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Answered</span>
                                      <div className="flex items-center gap-2">
                                        <Progress value={channel.answered} className="w-24 h-2" />
                                        <span className="font-medium w-10 text-right">
                                          {channel.answered}%
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Avg Duration</span>
                                      <span className="font-medium">{channel.avgDuration}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Missed</span>
                                      <span className="font-medium text-red-600">
                                        {channel.missed}%
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8">
                        <div className="text-center">
                          <Signal className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                          <p className="text-muted-foreground">No channel data available</p>
                        </div>
                      </Card>
                    )}
                  </>
                )}

                {/* Team Performance Report */}
                {activeReport === 'team' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold mb-1">Team Performance</h1>
                        <p className="text-muted-foreground">
                          Agent metrics and productivity insights
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" /> Filter
                      </Button>
                    </div>

                    <Card className="p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                                Agent
                              </th>
                              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                                Conversations
                              </th>
                              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                                Avg Response
                              </th>
                              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                                Satisfaction
                              </th>
                              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                                Resolution
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {agentPerformance.length > 0 ? (
                              agentPerformance.map((agent, index) => (
                                <motion.tr
                                  key={agent.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="border-b hover:bg-muted/50"
                                >
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-medium text-primary">
                                          {agent.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                        </span>
                                      </div>
                                      <span className="font-medium">{agent.name}</span>
                                    </div>
                                  </td>
                                  <td className="text-right py-3 px-4 font-medium">
                                    {agent.conversations}
                                  </td>
                                  <td className="text-right py-3 px-4">{agent.avgResponseTime}</td>
                                  <td className="text-right py-3 px-4">
                                    <span className="text-yellow-500">★</span> {agent.satisfaction}
                                  </td>
                                  <td className="text-right py-3 px-4">
                                    <span
                                      className={cn(
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        agent.resolved >= 95
                                          ? 'bg-green-100 text-green-700'
                                          : agent.resolved >= 90
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-red-100 text-red-700'
                                      )}
                                    >
                                      {agent.resolved}%
                                    </span>
                                  </td>
                                </motion.tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                  No team data available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </>
                )}

                {/* Response Times Report */}
                {activeReport === 'response' && (
                  <>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Response Times</h1>
                      <p className="text-muted-foreground">Track and improve response metrics</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              {formatResponseTime(analytics?.overview?.avgResponseTime || 45)}
                            </p>
                            <p className="text-sm text-muted-foreground">First Response</p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Timer className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              {formatResponseTime(
                                (analytics?.overview?.avgResponseTime || 45) * 1.5
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">Avg Resolution</p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Target className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">92%</p>
                            <p className="text-sm text-muted-foreground">Within SLA</p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">Response Time Distribution</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground w-24">&lt; 1 min</span>
                          <div className="flex-1">
                            <Progress value={45} className="h-4" />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">45%</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground w-24">1-5 min</span>
                          <div className="flex-1">
                            <Progress value={30} className="h-4" />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">30%</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground w-24">5-15 min</span>
                          <div className="flex-1">
                            <Progress value={15} className="h-4" />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">15%</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground w-24">&gt; 15 min</span>
                          <div className="flex-1">
                            <Progress value={10} className="h-4" />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">10%</span>
                        </div>
                      </div>
                    </Card>
                  </>
                )}

                {/* Satisfaction Report */}
                {activeReport === 'satisfaction' && (
                  <>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Customer Satisfaction</h1>
                      <p className="text-muted-foreground">CSAT scores and feedback insights</p>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <Card className="p-4 col-span-1">
                        <div className="text-center">
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl font-bold text-green-600">4.5</span>
                          </div>
                          <p className="font-medium">CSAT Score</p>
                          <p className="text-sm text-muted-foreground">out of 5.0</p>
                        </div>
                      </Card>

                      <Card className="p-4 col-span-3">
                        <h3 className="font-semibold mb-4">Rating Distribution</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <span className="text-sm w-16">5 stars</span>
                            <div className="flex-1">
                              <Progress
                                value={60}
                                className="h-3 bg-green-100 [&>*]:bg-green-500"
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">60%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm w-16">4 stars</span>
                            <div className="flex-1">
                              <Progress value={25} className="h-3 bg-lime-100 [&>*]:bg-lime-500" />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">25%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm w-16">3 stars</span>
                            <div className="flex-1">
                              <Progress
                                value={10}
                                className="h-3 bg-yellow-100 [&>*]:bg-yellow-500"
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">10%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm w-16">2 stars</span>
                            <div className="flex-1">
                              <Progress
                                value={3}
                                className="h-3 bg-orange-100 [&>*]:bg-orange-500"
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">3%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm w-16">1 star</span>
                            <div className="flex-1">
                              <Progress value={2} className="h-3 bg-red-100 [&>*]:bg-red-500" />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">2%</span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">Satisfaction Trends</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-green-50 text-center">
                          <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">89%</p>
                          <p className="text-sm text-muted-foreground">Satisfied</p>
                        </div>
                        <div className="p-4 rounded-lg bg-yellow-50 text-center">
                          <Activity className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-yellow-600">8%</p>
                          <p className="text-sm text-muted-foreground">Neutral</p>
                        </div>
                        <div className="p-4 rounded-lg bg-red-50 text-center">
                          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-red-600">3%</p>
                          <p className="text-sm text-muted-foreground">Dissatisfied</p>
                        </div>
                      </div>
                    </Card>
                  </>
                )}

                {/* Segments Report */}
                {activeReport === 'segments' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold mb-1">Segment Analytics</h1>
                        <p className="text-muted-foreground">
                          Filter and analyze data by custom segments
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeFilterCount > 0 && (
                          <Button variant="outline" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-1" /> Clear Filters
                          </Button>
                        )}
                        <Popover open={isCreatingSegment} onOpenChange={setIsCreatingSegment}>
                          <PopoverTrigger asChild>
                            <Button size="sm">
                              <Save className="h-4 w-4 mr-1" /> Save Segment
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72">
                            <div className="space-y-3">
                              <h4 className="font-medium">Save Current Filters</h4>
                              <Input
                                placeholder="Segment name..."
                                value={newSegmentName}
                                onChange={(e) => setNewSegmentName(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => setIsCreatingSegment(false)}
                                >
                                  Cancel
                                </Button>
                                <Button size="sm" className="flex-1" onClick={saveSegment}>
                                  Save
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {/* Filters Panel */}
                      <Card className="p-4 col-span-1">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4" /> Filters
                          {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {activeFilterCount} active
                            </Badge>
                          )}
                        </h3>

                        <div className="space-y-3">
                          {/* Channels Filter */}
                          <Collapsible
                            open={expandedFilters.channels}
                            onOpenChange={(open) =>
                              setExpandedFilters((prev) => ({ ...prev, channels: open }))
                            }
                          >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
                              <span className="text-sm font-medium">Channels</span>
                              {expandedFilters.channels ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-2 space-y-2">
                              {filterOptions.channels.map((channel) => {
                                const IconComponent = channel.icon;
                                return (
                                  <label
                                    key={channel.id}
                                    className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                                  >
                                    <Checkbox
                                      checked={segmentFilters.channels.includes(channel.id)}
                                      onCheckedChange={() => toggleFilter('channels', channel.id)}
                                    />
                                    <IconComponent className={cn('h-4 w-4', channel.color)} />
                                    <span className="text-sm">{channel.label}</span>
                                  </label>
                                );
                              })}
                            </CollapsibleContent>
                          </Collapsible>

                          {/* Tags Filter */}
                          <Collapsible
                            open={expandedFilters.tags}
                            onOpenChange={(open) =>
                              setExpandedFilters((prev) => ({ ...prev, tags: open }))
                            }
                          >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
                              <span className="text-sm font-medium">Tags</span>
                              {expandedFilters.tags ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-2 space-y-2">
                              {filterOptions.tags.map((tag) => (
                                <label
                                  key={tag.id}
                                  className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                                >
                                  <Checkbox
                                    checked={segmentFilters.tags.includes(tag.id)}
                                    onCheckedChange={() => toggleFilter('tags', tag.id)}
                                  />
                                  <Badge variant="secondary" className={cn('text-xs', tag.color)}>
                                    {tag.label}
                                  </Badge>
                                </label>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>

                          {/* Status Filter */}
                          <Collapsible
                            open={expandedFilters.status}
                            onOpenChange={(open) =>
                              setExpandedFilters((prev) => ({ ...prev, status: open }))
                            }
                          >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
                              <span className="text-sm font-medium">Status</span>
                              {expandedFilters.status ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-2 space-y-2">
                              {filterOptions.status.map((status) => (
                                <label
                                  key={status.id}
                                  className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                                >
                                  <Checkbox
                                    checked={segmentFilters.status.includes(status.id)}
                                    onCheckedChange={() => toggleFilter('status', status.id)}
                                  />
                                  <Badge
                                    variant="secondary"
                                    className={cn('text-xs', status.color)}
                                  >
                                    {status.label}
                                  </Badge>
                                </label>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        </div>

                        {/* Saved Segments */}
                        <div className="mt-6 pt-4 border-t">
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Bookmark className="h-4 w-4" /> Saved Segments
                          </h4>
                          <div className="space-y-2">
                            {savedSegments.map((segment) => (
                              <div
                                key={segment.id}
                                className={cn(
                                  'flex items-center justify-between p-2 rounded-lg cursor-pointer group',
                                  activeSegment === segment.id
                                    ? 'bg-primary/10 border border-primary/20'
                                    : 'hover:bg-muted/50'
                                )}
                                onClick={() => applySegment(segment)}
                              >
                                <span className="text-sm">{segment.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSegment(segment.id);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>

                      {/* Segmented Analytics */}
                      <div className="col-span-2 space-y-4">
                        {/* Active Filters Display */}
                        {activeFilterCount > 0 && (
                          <Card className="p-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-muted-foreground">Active filters:</span>
                              {segmentFilters.channels.map((ch) => (
                                <Badge key={ch} variant="secondary" className="gap-1">
                                  {ch}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => toggleFilter('channels', ch)}
                                  />
                                </Badge>
                              ))}
                              {segmentFilters.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1">
                                  {tag}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => toggleFilter('tags', tag)}
                                  />
                                </Badge>
                              ))}
                              {segmentFilters.status.map((st) => (
                                <Badge key={st} variant="secondary" className="gap-1">
                                  {st}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => toggleFilter('status', st)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </Card>
                        )}

                        {/* Segment Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">
                                  {activeFilterCount > 0
                                    ? Math.floor(
                                        (analytics?.overview?.totalConversations || 1245) * 0.35
                                      ).toLocaleString()
                                    : (
                                        analytics?.overview?.totalConversations || 1245
                                      ).toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Conversations in Segment
                                </p>
                              </div>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-green-500" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">
                                  {activeFilterCount > 0
                                    ? Math.floor(
                                        (analytics?.overview?.activeContacts || 890) * 0.35
                                      ).toLocaleString()
                                    : (analytics?.overview?.activeContacts || 890).toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">Contacts in Segment</p>
                              </div>
                            </div>
                          </Card>
                        </div>

                        {/* Segment Performance */}
                        <Card className="p-4">
                          <h3 className="font-semibold mb-4">Segment Performance</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Response Rate</span>
                              <div className="flex items-center gap-2">
                                <Progress value={78} className="w-32 h-2" />
                                <span className="font-medium">78%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Resolution Rate</span>
                              <div className="flex items-center gap-2">
                                <Progress value={85} className="w-32 h-2" />
                                <span className="font-medium">85%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Avg Response Time</span>
                              <span className="font-medium">
                                {formatResponseTime(analytics?.overview?.avgResponseTime || 45)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">CSAT Score</span>
                              <span className="font-medium">4.6/5</span>
                            </div>
                          </div>
                        </Card>

                        {/* Channel Breakdown */}
                        <Card className="p-4">
                          <h3 className="font-semibold mb-4">Channel Distribution</h3>
                          <div className="grid grid-cols-4 gap-3">
                            {filterOptions.channels.map((channel) => {
                              const IconComponent = channel.icon;
                              const isSelected = segmentFilters.channels.includes(channel.id);
                              return (
                                <div
                                  key={channel.id}
                                  className={cn(
                                    'p-3 rounded-lg text-center',
                                    isSelected ? 'ring-2 ring-primary' : 'bg-muted/50'
                                  )}
                                >
                                  <IconComponent
                                    className={cn('h-6 w-6 mx-auto mb-2', channel.color)}
                                  />
                                  <p className="text-sm font-medium">{channel.label}</p>
                                  <p className="text-lg font-bold">
                                    {Math.floor(Math.random() * 500 + 100)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </Card>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
