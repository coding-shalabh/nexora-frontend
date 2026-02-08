'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  MoreHorizontal,
  Globe,
  Eye,
  MousePointerClick,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit2,
  Copy,
  Trash2,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDate, formatNumber } from '@/lib/formatters';

// Mock data
const landingPages = [
  {
    id: '1',
    name: 'Product Launch 2026',
    url: 'https://nexoraos.pro/landing/product-launch',
    status: 'PUBLISHED',
    template: 'Product Showcase',
    createdAt: '2026-01-15T10:00:00Z',
    publishedAt: '2026-01-20T14:00:00Z',
    visits: 2543,
    conversions: 189,
    conversionRate: 7.43,
    formSubmissions: 189,
  },
  {
    id: '2',
    name: 'Free Trial Sign Up',
    url: 'https://nexoraos.pro/landing/free-trial',
    status: 'PUBLISHED',
    template: 'Lead Capture',
    createdAt: '2026-01-10T09:00:00Z',
    publishedAt: '2026-01-12T11:00:00Z',
    visits: 5234,
    conversions: 523,
    conversionRate: 9.99,
    formSubmissions: 523,
  },
  {
    id: '3',
    name: 'Webinar Registration',
    url: 'https://nexoraos.pro/landing/webinar-feb',
    status: 'DRAFT',
    template: 'Event Registration',
    createdAt: '2026-02-01T15:30:00Z',
    visits: 0,
    conversions: 0,
    conversionRate: 0,
    formSubmissions: 0,
  },
  {
    id: '4',
    name: 'eBook Download',
    url: 'https://nexoraos.pro/landing/ebook-guide',
    status: 'PUBLISHED',
    template: 'Content Download',
    createdAt: '2025-12-20T08:00:00Z',
    publishedAt: '2025-12-25T10:00:00Z',
    visits: 3421,
    conversions: 412,
    conversionRate: 12.04,
    formSubmissions: 412,
  },
  {
    id: '5',
    name: 'Contact Sales',
    url: 'https://nexoraos.pro/landing/contact-sales',
    status: 'PUBLISHED',
    template: 'Contact Form',
    createdAt: '2026-01-05T12:00:00Z',
    publishedAt: '2026-01-08T09:00:00Z',
    visits: 1823,
    conversions: 145,
    conversionRate: 7.95,
    formSubmissions: 145,
  },
  {
    id: '6',
    name: 'Early Access Program',
    url: 'https://nexoraos.pro/landing/early-access',
    status: 'ARCHIVED',
    template: 'Waitlist',
    createdAt: '2025-11-15T10:00:00Z',
    publishedAt: '2025-11-20T10:00:00Z',
    archivedAt: '2026-01-30T10:00:00Z',
    visits: 892,
    conversions: 234,
    conversionRate: 26.23,
    formSubmissions: 234,
  },
];

const statusConfig = {
  PUBLISHED: {
    label: 'Published',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-700',
    icon: Clock,
  },
  ARCHIVED: {
    label: 'Archived',
    color: 'bg-orange-100 text-orange-700',
    icon: AlertCircle,
  },
};

const templateTypes = [
  'Product Showcase',
  'Lead Capture',
  'Event Registration',
  'Content Download',
  'Contact Form',
  'Waitlist',
  'Newsletter Signup',
  'Demo Request',
];

export default function LandingPagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [templateFilter, setTemplateFilter] = useState('ALL');

  const filteredPages = useMemo(() => {
    return landingPages.filter((page) => {
      if (statusFilter !== 'ALL' && page.status !== statusFilter) return false;
      if (templateFilter !== 'ALL' && page.template !== templateFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          page.name.toLowerCase().includes(query) ||
          page.url.toLowerCase().includes(query) ||
          page.template.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [statusFilter, templateFilter, searchQuery]);

  // Calculate stats
  const totalPages = landingPages.length;
  const publishedPages = landingPages.filter((p) => p.status === 'PUBLISHED').length;
  const totalVisits = landingPages.reduce((sum, p) => sum + p.visits, 0);
  const totalConversions = landingPages.reduce((sum, p) => sum + p.conversions, 0);
  const avgConversionRate =
    publishedPages > 0
      ? (
          landingPages
            .filter((p) => p.status === 'PUBLISHED')
            .reduce((sum, p) => sum + p.conversionRate, 0) / publishedPages
        ).toFixed(2)
      : 0;

  // Layout stats for HubLayout
  const layoutStats = useMemo(
    () => [
      createStat('Total Pages', totalPages, Globe, 'blue'),
      createStat('Published', publishedPages, CheckCircle, 'green'),
      createStat('Total Visits', formatNumber(totalVisits), Eye, 'purple'),
      createStat('Avg Conv. Rate', `${avgConversionRate}%`, TrendingUp, 'orange'),
    ],
    [totalPages, publishedPages, totalVisits, avgConversionRate]
  );

  // Action buttons for HubLayout
  const actionButtons = (
    <div className="flex items-center gap-2">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-1.5 text-sm border rounded-md bg-white"
      >
        <option value="ALL">All Status</option>
        <option value="PUBLISHED">Published</option>
        <option value="DRAFT">Draft</option>
        <option value="ARCHIVED">Archived</option>
      </select>
      <select
        value={templateFilter}
        onChange={(e) => setTemplateFilter(e.target.value)}
        className="px-3 py-1.5 text-sm border rounded-md bg-white"
      >
        <option value="ALL">All Templates</option>
        {templateTypes.map((template) => (
          <option key={template} value={template}>
            {template}
          </option>
        ))}
      </select>
      <Button size="sm">
        <Plus className="h-4 w-4 mr-2" />
        New Landing Page
      </Button>
    </div>
  );

  // Main content
  const mainContent = (
    <div className="p-6 overflow-y-auto h-full">
      {/* Landing Pages List */}
      <div className="space-y-4">
        {filteredPages.map((page) => {
          const StatusIcon = statusConfig[page.status].icon;

          return (
            <Card key={page.id} className="p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{page.name}</h3>
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {page.url}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs px-3 py-1 rounded-full',
                      statusConfig[page.status].color
                    )}
                  >
                    {statusConfig[page.status].label}
                  </span>
                  <Button variant="ghost" size="icon" aria-label="More options">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Template</p>
                    <p className="text-sm font-medium">{page.template}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Visits</p>
                    <p className="text-sm font-semibold">{formatNumber(page.visits)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                    <p className="text-sm font-semibold">{formatNumber(page.conversions)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Conv. Rate</p>
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        page.conversionRate >= 10
                          ? 'text-green-600'
                          : page.conversionRate >= 5
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                      )}
                    >
                      {page.conversionRate.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {page.status === 'PUBLISHED' ? 'Published' : 'Created'}
                    </p>
                    <p className="text-sm">
                      {formatDate(page.status === 'PUBLISHED' ? page.publishedAt : page.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t">
                {page.status === 'PUBLISHED' && (
                  <>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                  </>
                )}
                {page.status === 'DRAFT' && (
                  <>
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
                {page.status === 'ARCHIVED' && (
                  <>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button size="sm">Restore</Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No landing pages found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'ALL' || templateFilter !== 'ALL'
              ? 'Try adjusting your filters'
              : 'Create your first landing page to start capturing leads'}
          </p>
          {!searchQuery && statusFilter === 'ALL' && templateFilter === 'ALL' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Landing Page
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <HubLayout
      hubId="marketing"
      showTopBar={false}
      showSidebar={false}
      title="Landing Pages"
      description="Create and manage high-converting landing pages"
      stats={layoutStats}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search landing pages..."
      actions={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
