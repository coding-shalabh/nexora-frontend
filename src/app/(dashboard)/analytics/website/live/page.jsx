'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  User,
  Eye,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  ChevronLeft,
  Radio,
  RefreshCw,
  ExternalLink,
  Loader2,
  Globe,
} from 'lucide-react';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

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

function getDeviceIcon(deviceType) {
  switch (deviceType?.toLowerCase()) {
    case 'mobile':
      return Smartphone;
    case 'tablet':
      return Tablet;
    default:
      return Monitor;
  }
}

export default function LiveVisitorsPage() {
  const { data, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['live-visitors'],
    queryFn: () => api.get('/tracking/analytics/live'),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const liveData = data?.data || { count: 0, sessions: [] };
  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '-';

  const layoutStats = [
    createStat('Live Visitors', liveData.count.toString(), Radio, 'green'),
    createStat('Active Sessions', liveData.sessions.length.toString(), Users, 'blue'),
  ];

  return (
    <UnifiedLayout hubId="analytics" pageTitle="Live Visitors" stats={layoutStats} fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/analytics/website">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Live Visitors
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </h1>
              <p className="text-muted-foreground">Real-time visitor activity on your websites</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Last updated: {lastUpdate}</span>
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Live Count Banner */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Radio className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {liveData.count}
                </p>
                <p className="text-green-700 dark:text-green-300">
                  {liveData.count === 1 ? 'visitor' : 'visitors'} online right now
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600/80 dark:text-green-400/80">
                Auto-refreshing every 10 seconds
              </p>
            </div>
          </div>
        </Card>

        {/* Live Sessions */}
        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : liveData.sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Users className="h-12 w-12 mb-4" />
              <p className="font-medium">No visitors online right now</p>
              <p className="text-sm">Check back soon or verify your tracking script is installed</p>
            </div>
          ) : (
            <div className="divide-y">
              {liveData.sessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.deviceType);
                const isIdentified = session.contactId || session.contact;
                const timeOnSite =
                  session.duration ||
                  Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);

                return (
                  <div key={session.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Status indicator */}
                      <div className="relative">
                        <div
                          className={cn(
                            'h-10 w-10 rounded-full flex items-center justify-center',
                            isIdentified
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-gray-100 dark:bg-gray-800'
                          )}
                        >
                          {isIdentified ? (
                            <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Users className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                      </div>

                      {/* Visitor info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {isIdentified ? (
                            <p className="font-medium truncate">
                              {session.contact?.firstName} {session.contact?.lastName}
                            </p>
                          ) : (
                            <p className="font-medium text-muted-foreground">Anonymous Visitor</p>
                          )}
                          {isIdentified && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            >
                              Identified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {session.currentPage && (
                            <span className="flex items-center gap-1 truncate max-w-[200px]">
                              <Eye className="h-3 w-3" />
                              {session.currentPage}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {session.city && session.country
                            ? `${session.city}, ${session.country}`
                            : session.country || 'Unknown'}
                        </span>
                      </div>

                      {/* Device */}
                      <div
                        className="flex items-center gap-1 text-sm text-muted-foreground"
                        title={session.browser}
                      >
                        <DeviceIcon className="h-4 w-4" />
                        <span className="capitalize">{session.deviceType || 'desktop'}</span>
                      </div>

                      {/* Time on site */}
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatDuration(timeOnSite)}</span>
                      </div>

                      {/* View button */}
                      <Link href={`/analytics/website/visitors/${session.id}`}>
                        <Button variant="ghost" size="sm">
                          View <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Tips */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-sm">
                Tip: Visitors are considered "live" if they've had activity in the last 5 minutes
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                The list auto-refreshes every 10 seconds. Click on any session to view detailed
                activity.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
