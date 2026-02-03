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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Eye,
  Users,
  Clock,
  ChevronLeft,
  Calendar,
  RefreshCw,
  FileText,
  ArrowUpDown,
  TrendingUp,
  LogIn,
  LogOut,
  Loader2,
} from 'lucide-react';

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

function formatPercent(value) {
  if (!value && value !== 0) return '0%';
  return `${Math.round(value * 10) / 10}%`;
}

export default function PagesReportPage() {
  const [period, setPeriod] = useState('7d');
  const [sortBy, setSortBy] = useState('views');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pages-report', period],
    queryFn: () => api.get('/tracking/analytics/pages', { params: { period, limit: 50 } }),
  });

  const pages = data?.data || [];

  // Sort pages
  const sortedPages = [...pages].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'visitors':
        return (b.uniqueVisitors || b.visitors || 0) - (a.uniqueVisitors || a.visitors || 0);
      case 'time':
        return (b.avgTime || b.avgDuration || 0) - (a.avgTime || a.avgDuration || 0);
      case 'bounce':
        return (b.bounceRate || 0) - (a.bounceRate || 0);
      default:
        return 0;
    }
  });

  const maxViews = Math.max(...pages.map((p) => p.views || 0), 1);

  // Summary stats
  const totalViews = pages.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalVisitors = pages.reduce((sum, p) => sum + (p.uniqueVisitors || p.visitors || 0), 0);
  const avgTime =
    pages.length > 0
      ? pages.reduce((sum, p) => sum + (p.avgTime || p.avgDuration || 0), 0) / pages.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/analytics/website">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Top Pages</h1>
            <p className="text-muted-foreground">See which pages get the most traffic</p>
          </div>
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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total Pages</span>
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{pages.length}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total Views</span>
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{formatNumber(totalViews)}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total Visitors</span>
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{formatNumber(totalVisitors)}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Avg. Time on Page</span>
            <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{formatDuration(avgTime)}</p>
        </Card>
      </div>

      {/* Sort options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="views">Page Views</SelectItem>
            <SelectItem value="visitors">Unique Visitors</SelectItem>
            <SelectItem value="time">Avg. Time</SelectItem>
            <SelectItem value="bounce">Bounce Rate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pages Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : sortedPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4" />
            <p>No page data available</p>
            <p className="text-sm">Start tracking to see your top pages</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Page</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Visitors</TableHead>
                <TableHead className="text-right">Avg. Time</TableHead>
                <TableHead className="text-right">Bounce Rate</TableHead>
                <TableHead className="w-[15%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPages.map((page, index) => {
                const views = page.views || 0;
                const visitors = page.uniqueVisitors || page.visitors || 0;
                const avgTimeOnPage = page.avgTime || page.avgDuration || 0;
                const bounceRate = page.bounceRate || 0;
                const barWidth = (views / maxViews) * 100;

                return (
                  <TableRow key={page.path || page.url || index}>
                    <TableCell>
                      <div className="space-y-1">
                        <p
                          className="font-medium truncate max-w-[300px]"
                          title={page.path || page.url}
                        >
                          {page.path || page.url || 'Unknown'}
                        </p>
                        {page.title && (
                          <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {page.title}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium">{formatNumber(views)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatNumber(visitors)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatDuration(avgTimeOnPage)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'font-medium',
                          bounceRate > 70
                            ? 'text-red-500'
                            : bounceRate > 50
                              ? 'text-orange-500'
                              : 'text-green-500'
                        )}
                      >
                        {formatPercent(bounceRate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="w-full">
                        <Progress value={barWidth} className="h-2" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Entry/Exit Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <LogIn className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Top Entry Pages</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Pages where visitors start their session
          </p>
          <div className="space-y-3">
            {sortedPages.slice(0, 5).map((page, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-sm truncate max-w-[200px]">{page.path || page.url}</span>
                <span className="text-sm font-medium">{formatNumber(page.views || 0)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <LogOut className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold">Top Exit Pages</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Pages where visitors leave your site</p>
          <div className="space-y-3">
            {sortedPages
              .filter((p) => p.bounceRate)
              .sort((a, b) => (b.bounceRate || 0) - (a.bounceRate || 0))
              .slice(0, 5)
              .map((page, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm truncate max-w-[200px]">{page.path || page.url}</span>
                  <span className="text-sm font-medium text-red-500">
                    {formatPercent(page.bounceRate || 0)} exit
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
