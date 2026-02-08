'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  MoreHorizontal,
  FileBarChart,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/formatters';

// Mock data
const reports = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    type: 'SALES',
    description: 'Comprehensive sales performance analysis for January 2026',
    createdAt: '2026-02-01T10:30:00Z',
    generatedBy: 'System Auto-Generate',
    status: 'GENERATED',
    dateRange: 'Jan 1 - Jan 31, 2026',
    fileSize: '2.4 MB',
    downloads: 12,
  },
  {
    id: '2',
    name: 'Q1 Pipeline Analysis',
    type: 'PIPELINE',
    description: 'Quarterly pipeline health and conversion metrics',
    createdAt: '2026-01-28T14:00:00Z',
    generatedBy: 'Rajesh Kumar',
    status: 'GENERATED',
    dateRange: 'Jan 1 - Mar 31, 2026',
    fileSize: '3.1 MB',
    downloads: 24,
  },
  {
    id: '3',
    name: 'Contact Engagement Report',
    type: 'CONTACTS',
    description: 'Contact activity and engagement tracking',
    createdAt: '2026-02-03T09:15:00Z',
    generatedBy: 'System Auto-Generate',
    status: 'SCHEDULED',
    dateRange: 'Jan 15 - Feb 15, 2026',
    scheduledFor: '2026-02-15T08:00:00Z',
    downloads: 0,
  },
  {
    id: '4',
    name: 'Team Activity Dashboard',
    type: 'ACTIVITY',
    description: 'User activity and productivity metrics',
    createdAt: '2026-02-02T16:45:00Z',
    generatedBy: 'Priya Sharma',
    status: 'GENERATED',
    dateRange: 'Jan 1 - Jan 31, 2026',
    fileSize: '1.8 MB',
    downloads: 8,
  },
  {
    id: '5',
    name: 'Revenue Forecast',
    type: 'SALES',
    description: 'Revenue projections based on pipeline data',
    createdAt: '2026-01-30T11:20:00Z',
    generatedBy: 'System Auto-Generate',
    status: 'FAILED',
    dateRange: 'Feb 1 - Apr 30, 2026',
    error: 'Insufficient data for forecast model',
    downloads: 0,
  },
  {
    id: '6',
    name: 'Deal Win/Loss Analysis',
    type: 'PIPELINE',
    description: 'Analysis of closed deals and loss reasons',
    createdAt: '2026-02-01T13:00:00Z',
    generatedBy: 'Jennifer Martinez',
    status: 'GENERATED',
    dateRange: 'Oct 1 - Dec 31, 2025',
    fileSize: '4.2 MB',
    downloads: 18,
  },
];

const reportTypes = {
  SALES: {
    label: 'Sales',
    color: 'bg-green-100 text-green-700',
    bgColor: 'bg-green-100/20',
    icon: DollarSign,
  },
  PIPELINE: {
    label: 'Pipeline',
    color: 'bg-blue-100 text-blue-700',
    bgColor: 'bg-blue-100/20',
    icon: TrendingUp,
  },
  CONTACTS: {
    label: 'Contacts',
    color: 'bg-purple-100 text-purple-700',
    bgColor: 'bg-purple-100/20',
    icon: Users,
  },
  ACTIVITY: {
    label: 'Activity',
    color: 'bg-orange-100 text-orange-700',
    bgColor: 'bg-orange-100/20',
    icon: Activity,
  },
};

const statusConfig = {
  GENERATED: {
    label: 'Generated',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  SCHEDULED: {
    label: 'Scheduled',
    color: 'bg-blue-100 text-blue-700',
    icon: Clock,
  },
  FAILED: {
    label: 'Failed',
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle,
  },
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.generatedBy.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [typeFilter, statusFilter, searchQuery]);

  // Calculate stats
  const totalReports = reports.length;
  const generatedReports = reports.filter((r) => r.status === 'GENERATED').length;
  const scheduledReports = reports.filter((r) => r.status === 'SCHEDULED').length;
  const totalDownloads = reports.reduce((sum, r) => sum + r.downloads, 0);

  // Layout stats for HubLayout
  const layoutStats = useMemo(
    () => [
      createStat('Total Reports', totalReports, FileBarChart, 'blue'),
      createStat('Generated', generatedReports, CheckCircle, 'green'),
      createStat('Scheduled', scheduledReports, Clock, 'purple'),
      createStat('Downloads', totalDownloads, Download, 'orange'),
    ],
    [totalReports, generatedReports, scheduledReports, totalDownloads]
  );

  // Action buttons for HubLayout
  const actionButtons = (
    <div className="flex items-center gap-2">
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="px-3 py-1.5 text-sm border rounded-md bg-white"
      >
        <option value="ALL">All Types</option>
        <option value="SALES">Sales</option>
        <option value="PIPELINE">Pipeline</option>
        <option value="CONTACTS">Contacts</option>
        <option value="ACTIVITY">Activity</option>
      </select>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-1.5 text-sm border rounded-md bg-white"
      >
        <option value="ALL">All Status</option>
        <option value="GENERATED">Generated</option>
        <option value="SCHEDULED">Scheduled</option>
        <option value="FAILED">Failed</option>
      </select>
      <Button size="sm">
        <Plus className="h-4 w-4 mr-2" />
        New Report
      </Button>
    </div>
  );

  // Main content
  const mainContent = (
    <div className="p-6 overflow-y-auto h-full">
      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const TypeIcon = reportTypes[report.type].icon;
          const StatusIcon = statusConfig[report.status].icon;

          return (
            <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'h-12 w-12 rounded-lg flex items-center justify-center',
                      reportTypes[report.type].bgColor
                    )}
                  >
                    <TypeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn('text-xs px-3 py-1 rounded-full', reportTypes[report.type].color)}
                  >
                    {reportTypes[report.type].label}
                  </span>
                  <span
                    className={cn(
                      'text-xs px-3 py-1 rounded-full',
                      statusConfig[report.status].color
                    )}
                  >
                    {statusConfig[report.status].label}
                  </span>
                  <Button variant="ghost" size="icon" aria-label="More options">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date Range</p>
                    <p className="text-sm font-medium">{report.dateRange}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm">{formatDateTime(report.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Generated By</p>
                    <p className="text-sm">{report.generatedBy}</p>
                  </div>
                </div>
                {report.status === 'GENERATED' && (
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Downloads / Size</p>
                      <p className="text-sm">
                        {report.downloads} · {report.fileSize}
                      </p>
                    </div>
                  </div>
                )}
                {report.status === 'SCHEDULED' && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Scheduled For</p>
                      <p className="text-sm">{formatDateTime(report.scheduledFor)}</p>
                    </div>
                  </div>
                )}
                {report.status === 'FAILED' && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Error</p>
                      <p className="text-sm text-red-600">{report.error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t">
                {report.status === 'GENERATED' && (
                  <>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                  </>
                )}
                {report.status === 'SCHEDULED' && (
                  <>
                    <Button variant="outline" size="sm">
                      Edit Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button size="sm">Generate Now</Button>
                  </>
                )}
                {report.status === 'FAILED' && (
                  <>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">Retry</Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileBarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reports found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Try adjusting your filters'
              : 'Generate your first report to get started'}
          </p>
          {!searchQuery && typeFilter === 'ALL' && statusFilter === 'ALL' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <HubLayout
      hubId="pipeline"
      title="Reports"
      description="Generate and manage business intelligence reports"
      stats={layoutStats}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search reports..."
      actions={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
