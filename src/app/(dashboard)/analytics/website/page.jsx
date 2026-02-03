'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Eye,
  Clock,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Calendar,
  RefreshCw,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  ExternalLink,
  FileText,
  Radio,
  Settings,
  Loader2,
  Activity,
} from 'lucide-react';

function useWebsiteAnalytics(endpoint, params = {}) {
  return useQuery({
    queryKey: ['website-analytics', endpoint, params],
    queryFn: () => api.get(`/tracking/analytics/${endpoint}`, { params }),
    refetchInterval: endpoint === 'live' ? 30000 : false, // Auto-refresh live data
  });
}

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatPercent(value) {
  if (!value && value !== 0) return '0%';
  return `${Math.round(value * 100) / 100}%`;
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  formatter = (v) => v,
  color = 'primary',
  href,
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  const content = (
    <Card className={cn('p-5 transition-colors', href && 'hover:bg-muted/50 cursor-pointer')}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div
          className={cn(
            'h-10 w-10 rounded-lg flex items-center justify-center',
            colorClasses[color]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold">{formatter(value)}</p>
      {trend !== undefined && trend !== null && (
        <div className="mt-2 flex items-center gap-1">
          {trend >= 0 ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span
            className={cn('text-sm font-medium', trend >= 0 ? 'text-green-500' : 'text-red-500')}
          >
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      )}
      {href && (
        <div className="mt-2 flex items-center text-xs text-primary">
          View details <ExternalLink className="h-3 w-3 ml-1" />
        </div>
      )}
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function VisitorsChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const maxVisitors = Math.max(...data.map((d) => d.visitors || 0), 1);

  return (
    <div className="h-48">
      <div className="flex items-end justify-between h-40 gap-1">
        {data.map((item, i) => {
          const height = ((item.visitors || 0) / maxVisitors) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all cursor-pointer"
                style={{ height: `${height}%`, minHeight: item.visitors > 0 ? '4px' : '0' }}
                title={`${item.visitors || 0} visitors`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        {data.length > 0 && (
          <>
            <span>
              {new Date(data[0].date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span>
              {new Date(data[data.length - 1].date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function TopPagesTable({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No page data available</div>;
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((page, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{page.path || page.url || 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">{page.title || 'No title'}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right">
              <p className="font-medium">{formatNumber(page.views)}</p>
              <p className="text-xs text-muted-foreground">views</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatNumber(page.uniqueVisitors || page.visitors)}</p>
              <p className="text-xs text-muted-foreground">visitors</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrafficSourcesChart({ data = {} }) {
  const sources = [
    { key: 'direct', label: 'Direct', color: 'bg-blue-500' },
    { key: 'organic', label: 'Organic Search', color: 'bg-green-500' },
    { key: 'referral', label: 'Referral', color: 'bg-purple-500' },
    { key: 'social', label: 'Social', color: 'bg-pink-500' },
    { key: 'email', label: 'Email', color: 'bg-orange-500' },
    { key: 'paid', label: 'Paid', color: 'bg-red-500' },
  ];

  const total = sources.reduce((sum, s) => sum + (data[s.key] || 0), 0);

  if (total === 0) {
    return <div className="py-8 text-center text-muted-foreground">No traffic data available</div>;
  }

  return (
    <div className="space-y-3">
      {sources.map((source) => {
        const value = data[source.key] || 0;
        const percentage = total > 0 ? (value / total) * 100 : 0;
        if (value === 0) return null;
        return (
          <div key={source.key}>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', source.color)} />
                <span className="text-sm">{source.label}</span>
              </div>
              <span className="text-sm font-medium">
                {formatNumber(value)} ({Math.round(percentage)}%)
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}
    </div>
  );
}

function DeviceBreakdown({ data = {} }) {
  const devices = [
    { key: 'desktop', label: 'Desktop', icon: Monitor, color: 'text-blue-500' },
    { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-green-500' },
    { key: 'tablet', label: 'Tablet', icon: Tablet, color: 'text-purple-500' },
  ];

  const total = devices.reduce((sum, d) => sum + (data[d.key] || 0), 0);

  if (total === 0) {
    return <div className="py-8 text-center text-muted-foreground">No device data available</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {devices.map((device) => {
        const value = data[device.key] || 0;
        const percentage = total > 0 ? (value / total) * 100 : 0;
        const Icon = device.icon;
        return (
          <div key={device.key} className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon className={cn('h-6 w-6 mx-auto mb-2', device.color)} />
            <p className="text-lg font-bold">{Math.round(percentage)}%</p>
            <p className="text-xs text-muted-foreground">{device.label}</p>
            <p className="text-xs text-muted-foreground">{formatNumber(value)} sessions</p>
          </div>
        );
      })}
    </div>
  );
}

function LiveVisitorsWidget({ count = 0 }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <div className="relative">
        <Radio className="h-5 w-5 text-green-500" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
      </div>
      <div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{count}</p>
        <p className="text-xs text-green-600/80 dark:text-green-400/80">visitors online now</p>
      </div>
      <Link href="/analytics/website/live" className="ml-auto">
        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
          View <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </Link>
    </div>
  );
}

export default function WebsiteAnalyticsPage() {
  const [period, setPeriod] = useState('7d');

  const {
    data: overviewData,
    isLoading: overviewLoading,
    refetch,
  } = useWebsiteAnalytics('overview', { period });
  const { data: visitorsData, isLoading: visitorsLoading } = useWebsiteAnalytics('visitors', {
    period,
  });
  const { data: pagesData } = useWebsiteAnalytics('pages', { period, limit: 5 });
  const { data: sourcesData } = useWebsiteAnalytics('sources', { period });
  const { data: devicesData } = useWebsiteAnalytics('devices', { period });
  const { data: liveData } = useWebsiteAnalytics('live');

  const overview = overviewData?.data || {};
  const visitors = visitorsData?.data || [];
  const pages = pagesData?.data || [];
  const sources = sourcesData?.data || {};
  const devices = devicesData?.data || {};
  const liveCount = liveData?.data?.count || 0;

  const isLoading = overviewLoading || visitorsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Website Analytics</h1>
          <p className="text-muted-foreground">
            Track visitor behavior and engagement on your websites
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/analytics/tracking">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Manage Scripts
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Live Visitors */}
          <LiveVisitorsWidget count={liveCount} />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Unique Visitors"
              value={overview.uniqueVisitors || 0}
              icon={Users}
              color="blue"
              trend={overview.visitorsTrend}
              formatter={formatNumber}
              href="/analytics/website/visitors"
            />
            <StatCard
              title="Total Sessions"
              value={overview.totalSessions || 0}
              icon={Activity}
              color="purple"
              trend={overview.sessionsTrend}
              formatter={formatNumber}
            />
            <StatCard
              title="Page Views"
              value={overview.pageViews || 0}
              icon={Eye}
              color="green"
              trend={overview.pageViewsTrend}
              formatter={formatNumber}
              href="/analytics/website/pages"
            />
            <StatCard
              title="Avg. Duration"
              value={overview.avgDuration || 0}
              icon={Clock}
              color="orange"
              formatter={formatDuration}
            />
            <StatCard
              title="Bounce Rate"
              value={overview.bounceRate || 0}
              icon={MousePointerClick}
              color="red"
              formatter={formatPercent}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visitors Over Time */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Visitors Over Time</h3>
                <Link
                  href="/analytics/website/visitors"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <VisitorsChart data={visitors} />
            </Card>

            {/* Traffic Sources */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Traffic Sources</h3>
                <Link
                  href="/analytics/website/sources"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <TrafficSourcesChart data={sources} />
            </Card>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Pages</h3>
                <Link
                  href="/analytics/website/pages"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <TopPagesTable data={pages} />
            </Card>

            {/* Device Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Devices</h3>
              <DeviceBreakdown data={devices} />
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/analytics/website/visitors">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Visitor Sessions</p>
                    <p className="text-xs text-muted-foreground">View all sessions</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/analytics/website/live">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Radio className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Live Visitors</p>
                    <p className="text-xs text-muted-foreground">Real-time view</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/analytics/website/forms">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Form Analytics</p>
                    <p className="text-xs text-muted-foreground">Submissions & conversions</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/analytics/website/sources">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Traffic Sources</p>
                    <p className="text-xs text-muted-foreground">Where visitors come from</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
