'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Globe,
  ChevronLeft,
  Calendar,
  RefreshCw,
  Search,
  Share2,
  Mail,
  DollarSign,
  Link as LinkIcon,
  MousePointerClick,
  Loader2,
  TrendingUp,
  ExternalLink,
  Hash,
} from 'lucide-react';

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatPercent(value, total) {
  if (!total || total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

const sourceConfig = {
  direct: {
    label: 'Direct',
    icon: Globe,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  organic: {
    label: 'Organic Search',
    icon: Search,
    color: 'bg-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-600 dark:text-green-400',
  },
  referral: {
    label: 'Referral',
    icon: LinkIcon,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
  social: {
    label: 'Social',
    icon: Share2,
    color: 'bg-pink-500',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    textColor: 'text-pink-600 dark:text-pink-400',
  },
  email: {
    label: 'Email',
    icon: Mail,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-600 dark:text-orange-400',
  },
  paid: {
    label: 'Paid',
    icon: DollarSign,
    color: 'bg-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-600 dark:text-red-400',
  },
};

export default function SourcesReportPage() {
  const [period, setPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sources-report', period],
    queryFn: () => api.get('/tracking/analytics/sources', { params: { period } }),
  });

  const sources = data?.data || {};
  const total = Object.values(sources).reduce((sum, val) => sum + (val || 0), 0);

  // Create sorted source list
  const sourceList = Object.entries(sourceConfig)
    .map(([key, config]) => ({
      key,
      ...config,
      count: sources[key] || 0,
      percentage: total > 0 ? ((sources[key] || 0) / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

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
            <h1 className="text-2xl font-bold">Traffic Sources</h1>
            <p className="text-muted-foreground">Understand where your visitors come from</p>
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

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Total Visitors */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-3xl font-bold">{formatNumber(total)}</p>
              </div>
              <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
            </div>
          </Card>

          {/* Source Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sourceList.map((source) => {
              const Icon = source.icon;
              return (
                <Card key={source.key} className="p-4">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-lg flex items-center justify-center mb-3',
                      source.bgColor
                    )}
                  >
                    <Icon className={cn('h-5 w-5', source.textColor)} />
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(source.count)}</p>
                  <p className="text-sm text-muted-foreground">{source.label}</p>
                  <p className={cn('text-xs font-medium mt-1', source.textColor)}>
                    {Math.round(source.percentage)}% of traffic
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Source Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Traffic Distribution</h3>
              {total === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No traffic data available
                </div>
              ) : (
                <div className="space-y-4">
                  {sourceList
                    .filter((s) => s.count > 0)
                    .map((source) => {
                      const Icon = source.icon;
                      return (
                        <div key={source.key}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  'h-8 w-8 rounded flex items-center justify-center',
                                  source.bgColor
                                )}
                              >
                                <Icon className={cn('h-4 w-4', source.textColor)} />
                              </div>
                              <span className="font-medium">{source.label}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">{formatNumber(source.count)}</span>
                              <span className="text-muted-foreground ml-2">
                                ({Math.round(source.percentage)}%)
                              </span>
                            </div>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all', source.color)}
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </Card>

            {/* Pie Chart Alternative - Simple visual */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Source Summary</h3>
              {total === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No traffic data available
                </div>
              ) : (
                <>
                  {/* Simple donut representation */}
                  <div className="flex justify-center mb-6">
                    <div className="relative h-48 w-48">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {(() => {
                          let currentAngle = 0;
                          return sourceList
                            .filter((s) => s.count > 0)
                            .map((source, i) => {
                              const angle = (source.count / total) * 360;
                              const startAngle = currentAngle;
                              currentAngle += angle;

                              // Calculate arc path
                              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                              const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                              const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
                              const largeArc = angle > 180 ? 1 : 0;

                              const colorMap = {
                                'bg-blue-500': '#3b82f6',
                                'bg-green-500': '#22c55e',
                                'bg-purple-500': '#a855f7',
                                'bg-pink-500': '#ec4899',
                                'bg-orange-500': '#f97316',
                                'bg-red-500': '#ef4444',
                              };

                              return (
                                <path
                                  key={source.key}
                                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                  fill={colorMap[source.color]}
                                  className="transition-all hover:opacity-80"
                                />
                              );
                            });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-24 w-24 bg-background rounded-full flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold">{formatNumber(total)}</p>
                          <p className="text-xs text-muted-foreground">total</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2">
                    {sourceList
                      .filter((s) => s.count > 0)
                      .map((source) => (
                        <div key={source.key} className="flex items-center gap-2 text-sm">
                          <div className={cn('h-3 w-3 rounded-full', source.color)} />
                          <span className="text-muted-foreground">{source.label}</span>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* UTM Campaigns */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Hash className="h-5 w-5" />
                UTM Campaigns
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Track the performance of your marketing campaigns using UTM parameters
            </p>
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              <Hash className="h-12 w-12 mx-auto mb-4" />
              <p className="font-medium">No campaign data yet</p>
              <p className="text-sm mt-1">
                UTM parameters like utm_source, utm_medium, and utm_campaign will appear here
              </p>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-4 bg-muted/30">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Understanding Traffic Sources</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>
                    <strong>Direct:</strong> Visitors who typed your URL directly
                  </li>
                  <li>
                    <strong>Organic:</strong> Visitors from search engines (Google, Bing, etc.)
                  </li>
                  <li>
                    <strong>Referral:</strong> Visitors from other websites linking to you
                  </li>
                  <li>
                    <strong>Social:</strong> Visitors from social media platforms
                  </li>
                  <li>
                    <strong>Email:</strong> Visitors from email campaigns
                  </li>
                  <li>
                    <strong>Paid:</strong> Visitors from paid advertising
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
