'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  FileText,
  ChevronLeft,
  Calendar,
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  Loader2,
  Eye,
  ExternalLink,
  Percent,
  FormInput,
} from 'lucide-react';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatPercent(value) {
  if (!value && value !== 0) return '0%';
  return `${Math.round(value * 10) / 10}%`;
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

export default function FormsReportPage() {
  const [period, setPeriod] = useState('7d');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['forms-report', period],
    queryFn: () => api.get('/tracking/analytics/forms', { params: { period } }),
  });

  const safeForms = Array.isArray(data?.data) ? data.data : [];

  // Summary stats
  const totalForms = safeForms.length;
  const totalSubmissions = safeForms.reduce((sum, f) => sum + (f.submissions || 0), 0);
  const totalViews = safeForms.reduce((sum, f) => sum + (f.views || 0), 0);
  const avgConversion = totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;

  const layoutStats = [
    createStat('Forms Tracked', totalForms.toString(), FormInput, 'blue'),
    createStat('Total Submissions', totalSubmissions.toString(), CheckCircle2, 'green'),
    createStat('Form Views', totalViews.toString(), Eye, 'purple'),
    createStat('Avg. Conversion', `${Math.round(avgConversion)}%`, Percent, 'amber'),
  ];

  return (
    <UnifiedLayout
      hubId="analytics"
      pageTitle="Form Analytics"
      stats={layoutStats}
      fixedMenu={null}
    >
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
              <h1 className="text-2xl font-bold">Form Analytics</h1>
              <p className="text-muted-foreground">Track form submissions and conversion rates</p>
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Forms Tracked</span>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FormInput className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{totalForms}</p>
              </Card>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Total Submissions</span>
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{formatNumber(totalSubmissions)}</p>
              </Card>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Form Views</span>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{formatNumber(totalViews)}</p>
              </Card>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Avg. Conversion</span>
                  <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Percent className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{formatPercent(avgConversion)}</p>
              </Card>
            </div>

            {/* Forms Table */}
            <Card>
              {safeForms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4" />
                  <p className="font-medium">No form submissions yet</p>
                  <p className="text-sm mt-1">
                    Form submissions will appear here when visitors submit forms on your tracked
                    websites
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form</TableHead>
                      <TableHead className="text-right">Submissions</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Conversion Rate</TableHead>
                      <TableHead className="text-right">Last Submission</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeForms.map((form, index) => {
                      const conversionRate =
                        form.views > 0 ? (form.submissions / form.views) * 100 : 0;

                      return (
                        <TableRow key={form.formId || form.id || index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {form.name || form.formId || `Form ${index + 1}`}
                              </p>
                              {form.url && (
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {form.url}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium">
                              {formatNumber(form.submissions || 0)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-muted-foreground">
                              {formatNumber(form.views || 0)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Progress value={conversionRate} className="w-16 h-2" />
                              <span
                                className={cn(
                                  'font-medium',
                                  conversionRate > 10
                                    ? 'text-green-500'
                                    : conversionRate > 5
                                      ? 'text-orange-500'
                                      : 'text-red-500'
                                )}
                              >
                                {formatPercent(conversionRate)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatDate(form.lastSubmission)}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Card>

            {/* Recent Submissions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Recent Submissions
              </h3>
              <div className="rounded-lg border p-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p className="font-medium">No recent submissions</p>
                <p className="text-sm mt-1">
                  Recent form submissions from your tracked websites will appear here
                </p>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <FormInput className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Form Tracking Tips</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>
                      Forms are automatically detected when visitors submit them on your tracked
                      pages
                    </li>
                    <li>Conversion rate = Submissions / Form Views × 100</li>
                    <li>Higher conversion rates indicate more effective forms</li>
                    <li>Consider A/B testing forms with low conversion rates</li>
                  </ul>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </UnifiedLayout>
  );
}
