'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Eye,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
  User,
  Mail,
  ExternalLink,
  Loader2,
  Calendar,
  RefreshCw,
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

function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
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

function getSourceBadge(source) {
  const colors = {
    direct: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    organic: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    referral: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    social: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    email: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    paid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[source?.toLowerCase()] || 'bg-gray-100 text-gray-700';
}

export default function VisitorsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [isIdentifiedOnly, setIsIdentifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['visitor-sessions', page, limit, isIdentifiedOnly],
    queryFn: () =>
      api.get('/tracking/sessions', {
        params: {
          page,
          limit,
          isIdentified: isIdentifiedOnly || undefined,
        },
      }),
  });

  const sessions = data?.data || [];
  const meta = data?.meta || { total: 0, pages: 1 };

  const filteredSessions = searchQuery
    ? sessions.filter(
        (s) =>
          s.contact?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.contact?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.contact?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.country?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sessions;

  const layoutStats = [createStat('Total Sessions', meta.total.toString(), Users, 'blue')];

  return (
    <UnifiedLayout
      hubId="analytics"
      pageTitle="Visitor Sessions"
      stats={layoutStats}
      fixedMenu={null}
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={isIdentifiedOnly ? 'identified' : 'all'}
                onValueChange={(v) => {
                  setIsIdentifiedOnly(v === 'identified');
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visitors</SelectItem>
                  <SelectItem value="identified">Identified Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">{meta.total} total sessions</div>
          </div>
        </Card>

        {/* Sessions Table */}
        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Users className="h-12 w-12 mb-4" />
              <p>No sessions found</p>
              {isIdentifiedOnly && (
                <Button variant="link" onClick={() => setIsIdentifiedOnly(false)} className="mt-2">
                  Show all visitors
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => {
                    const DeviceIcon = getDeviceIcon(session.deviceType);
                    const isIdentified = session.contactId || session.contact;

                    return (
                      <TableRow key={session.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'h-9 w-9 rounded-full flex items-center justify-center',
                                isIdentified
                                  ? 'bg-green-100 dark:bg-green-900/30'
                                  : 'bg-gray-100 dark:bg-gray-800'
                              )}
                            >
                              {isIdentified ? (
                                <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <Users className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                            <div>
                              {isIdentified ? (
                                <>
                                  <p className="font-medium">
                                    {session.contact?.firstName} {session.contact?.lastName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {session.contact?.email}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium text-muted-foreground">
                                    Anonymous Visitor
                                  </p>
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {session.visitorId?.slice(0, 8)}...
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{session.pageViewCount || session._count?.pageViews || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDuration(session.duration)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn('capitalize', getSourceBadge(session.source))}
                          >
                            {session.source || 'direct'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {session.city && session.country
                                ? `${session.city}, ${session.country}`
                                : session.country || 'Unknown'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="flex items-center gap-1"
                            title={`${session.browser || 'Unknown'} on ${session.os || 'Unknown'}`}
                          >
                            <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{session.deviceType || 'desktop'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(session.startedAt)}
                        </TableCell>
                        <TableCell>
                          <Link href={`/analytics/website/visitors/${session.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              View <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, meta.total)} of{' '}
                  {meta.total} sessions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, meta.pages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-8"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {meta.pages > 5 && (
                      <>
                        <span className="text-muted-foreground">...</span>
                        <Button
                          variant={page === meta.pages ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(meta.pages)}
                          className="w-8"
                        >
                          {meta.pages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= meta.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </UnifiedLayout>
  );
}
