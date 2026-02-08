'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Copy,
  Code,
  BarChart3,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockForms = [
  {
    id: '1',
    name: 'Contact Us Form',
    status: 'active',
    submissions: 1243,
    views: 5678,
    conversionRate: 21.9,
    lastSubmission: '2 hours ago',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Newsletter Signup',
    status: 'active',
    submissions: 3421,
    views: 15234,
    conversionRate: 22.5,
    lastSubmission: '15 minutes ago',
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Demo Request Form',
    status: 'active',
    submissions: 567,
    views: 2341,
    conversionRate: 24.2,
    lastSubmission: '1 hour ago',
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    name: 'Event Registration',
    status: 'draft',
    submissions: 0,
    views: 0,
    conversionRate: 0,
    lastSubmission: 'Never',
    createdAt: '2024-01-20',
  },
  {
    id: '5',
    name: 'Product Feedback',
    status: 'paused',
    submissions: 892,
    views: 4123,
    conversionRate: 21.6,
    lastSubmission: '3 days ago',
    createdAt: '2023-12-15',
  },
];

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
  paused: { label: 'Paused', className: 'bg-yellow-100 text-yellow-700' },
};

export default function FormsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalSubmissions = mockForms.reduce((sum, form) => sum + form.submissions, 0);
  const totalViews = mockForms.reduce((sum, form) => sum + form.views, 0);
  const avgConversionRate =
    mockForms.length > 0
      ? mockForms.reduce((sum, form) => sum + form.conversionRate, 0) / mockForms.length
      : 0;

  const layoutStats = useMemo(
    () => [
      createStat('Forms', mockForms.length, FileText, 'blue'),
      createStat('Submissions', totalSubmissions.toLocaleString(), CheckCircle2, 'green'),
      createStat('Views', totalViews.toLocaleString(), Users, 'purple'),
      createStat('Conversion', `${avgConversionRate.toFixed(1)}%`, TrendingUp, 'orange'),
    ],
    [totalSubmissions, totalViews, avgConversionRate]
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredForms = mockForms.filter((form) => {
    const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
        </SelectContent>
      </Select>
      <Button asChild>
        <Link href="/marketing/forms/builder">
          <Plus className="mr-2 h-4 w-4" />
          Create Form
        </Link>
      </Button>
    </div>
  );

  const mainContent = (
    <div className="space-y-4">
      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Forms</CardTitle>
          <CardDescription>Manage your lead capture forms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submissions</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Conversion</TableHead>
                <TableHead>Last Submission</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/marketing/forms/${form.id}`} className="hover:underline">
                      {form.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[form.status].className}>
                      {statusConfig[form.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{form.submissions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{form.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">{form.conversionRate}%</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{form.lastSubmission}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/marketing/forms/${form.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/marketing/forms/builder?id=${form.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Form
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/marketing/forms/${form.id}/analytics`}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Code className="mr-2 h-4 w-4" />
                          Embed Code
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredForms.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No forms found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Create your first form to get started'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/marketing/forms/builder">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Form
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <HubLayout
      hubId="marketing"
      showTopBar={false}
      showSidebar={false}
      title="Forms"
      description="Create and manage lead capture forms"
      stats={layoutStats}
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Search forms..."
      actions={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
