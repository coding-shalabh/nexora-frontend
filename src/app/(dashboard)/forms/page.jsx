'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  BarChart3,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Filter,
  ArrowUpDown,
  Globe,
  Lock,
  Pause,
  Play,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock forms data
const mockForms = [
  {
    id: '1',
    name: 'Contact Us Form',
    description: 'Main website contact form',
    status: 'active',
    visibility: 'public',
    submissions: 245,
    views: 1250,
    conversionRate: 19.6,
    lastSubmission: '2024-12-22T10:30:00Z',
    createdAt: '2024-11-15T09:00:00Z',
    fields: 5,
  },
  {
    id: '2',
    name: 'Newsletter Signup',
    description: 'Email newsletter subscription form',
    status: 'active',
    visibility: 'public',
    submissions: 892,
    views: 3200,
    conversionRate: 27.9,
    lastSubmission: '2024-12-23T08:15:00Z',
    createdAt: '2024-10-01T14:00:00Z',
    fields: 3,
  },
  {
    id: '3',
    name: 'Demo Request',
    description: 'Product demo scheduling form',
    status: 'active',
    visibility: 'public',
    submissions: 67,
    views: 450,
    conversionRate: 14.9,
    lastSubmission: '2024-12-21T16:45:00Z',
    createdAt: '2024-12-01T11:00:00Z',
    fields: 8,
  },
  {
    id: '4',
    name: 'Support Ticket Form',
    description: 'Customer support request form',
    status: 'active',
    visibility: 'private',
    submissions: 156,
    views: 890,
    conversionRate: 17.5,
    lastSubmission: '2024-12-22T19:20:00Z',
    createdAt: '2024-09-20T10:00:00Z',
    fields: 6,
  },
  {
    id: '5',
    name: 'Event Registration',
    description: 'Webinar registration form',
    status: 'paused',
    visibility: 'public',
    submissions: 234,
    views: 1100,
    conversionRate: 21.3,
    lastSubmission: '2024-12-15T12:00:00Z',
    createdAt: '2024-11-25T08:00:00Z',
    fields: 7,
  },
  {
    id: '6',
    name: 'Feedback Survey',
    description: 'Customer satisfaction feedback',
    status: 'draft',
    visibility: 'private',
    submissions: 0,
    views: 0,
    conversionRate: 0,
    lastSubmission: null,
    createdAt: '2024-12-20T15:00:00Z',
    fields: 10,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700 border-green-200';
    case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'active': return <Play className="h-3 w-3" />;
    case 'paused': return <Pause className="h-3 w-3" />;
    case 'draft': return <Clock className="h-3 w-3" />;
    default: return null;
  }
};

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredForms = mockForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    const matchesTab = activeTab === 'all' || form.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const totalSubmissions = mockForms.reduce((acc, form) => acc + form.submissions, 0);
  const totalViews = mockForms.reduce((acc, form) => acc + form.views, 0);
  const avgConversion = mockForms.filter(f => f.views > 0).reduce((acc, form) => acc + form.conversionRate, 0) / mockForms.filter(f => f.views > 0).length;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Web Forms</h1>
          <p className="text-muted-foreground">
            Create and manage lead capture forms for your website
          </p>
        </div>
        <Link href="/forms/builder">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Forms</p>
                <p className="text-2xl font-bold">{mockForms.length}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{totalSubmissions.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-2">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Conversion</p>
                <p className="text-2xl font-bold">{avgConversion.toFixed(1)}%</p>
              </div>
              <div className="rounded-lg bg-orange-100 p-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Forms ({mockForms.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({mockForms.filter(f => f.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="paused">
            Paused ({mockForms.filter(f => f.status === 'paused').length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({mockForms.filter(f => f.status === 'draft').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Forms Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredForms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(form.status)}>
                        {getStatusIcon(form.status)}
                        <span className="ml-1 capitalize">{form.status}</span>
                      </Badge>
                      {form.visibility === 'public' ? (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Form
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Live
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-lg mt-2">{form.name}</CardTitle>
                  <CardDescription>{form.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                    <div>
                      <p className="text-2xl font-semibold">{form.submissions}</p>
                      <p className="text-xs text-muted-foreground">Submissions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{form.views}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{form.conversionRate}%</p>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {form.lastSubmission
                        ? `Last: ${new Date(form.lastSubmission).toLocaleDateString()}`
                        : 'No submissions yet'}
                    </div>
                    <Link href={`/forms/${form.id}/submissions`}>
                      <Button variant="outline" size="sm">
                        View Submissions
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredForms.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No forms found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search' : 'Create your first form to get started'}
              </p>
              <Link href="/forms/builder">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Form
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
