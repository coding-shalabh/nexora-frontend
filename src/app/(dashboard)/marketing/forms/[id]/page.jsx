'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Code,
  Eye,
  Play,
  Pause,
  Download,
  Users,
  TrendingUp,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDateTime } from '@/lib/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock form data
const mockForms = {
  1: {
    id: '1',
    name: 'Contact Us Form',
    status: 'active',
    submissions: 1243,
    views: 5678,
    conversionRate: 21.9,
    lastSubmission: '2 hours ago',
    createdAt: '2024-01-15',
    fields: [
      { id: 'f1', name: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'f2', name: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'f3', name: 'phone', label: 'Phone Number', type: 'tel', required: false },
      { id: 'f4', name: 'message', label: 'Message', type: 'textarea', required: true },
    ],
  },
  2: {
    id: '2',
    name: 'Newsletter Signup',
    status: 'active',
    submissions: 3421,
    views: 15234,
    conversionRate: 22.5,
    lastSubmission: '15 minutes ago',
    createdAt: '2024-01-10',
    fields: [
      { id: 'f1', name: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'f2', name: 'name', label: 'Name', type: 'text', required: false },
    ],
  },
  3: {
    id: '3',
    name: 'Demo Request Form',
    status: 'active',
    submissions: 567,
    views: 2341,
    conversionRate: 24.2,
    lastSubmission: '1 hour ago',
    createdAt: '2024-01-08',
    fields: [
      { id: 'f1', name: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'f2', name: 'email', label: 'Work Email', type: 'email', required: true },
      { id: 'f3', name: 'company', label: 'Company Name', type: 'text', required: true },
      { id: 'f4', name: 'phone', label: 'Phone', type: 'tel', required: false },
    ],
  },
  4: {
    id: '4',
    name: 'Event Registration',
    status: 'draft',
    submissions: 0,
    views: 0,
    conversionRate: 0,
    lastSubmission: 'Never',
    createdAt: '2024-01-20',
    fields: [
      { id: 'f1', name: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'f2', name: 'email', label: 'Email', type: 'email', required: true },
    ],
  },
  5: {
    id: '5',
    name: 'Product Feedback',
    status: 'paused',
    submissions: 892,
    views: 4123,
    conversionRate: 21.6,
    lastSubmission: '3 days ago',
    createdAt: '2023-12-15',
    fields: [
      { id: 'f1', name: 'name', label: 'Name', type: 'text', required: false },
      { id: 'f2', name: 'email', label: 'Email', type: 'email', required: true },
      { id: 'f3', name: 'rating', label: 'Rating', type: 'number', required: true },
      { id: 'f4', name: 'feedback', label: 'Feedback', type: 'textarea', required: true },
    ],
  },
};

// Mock submissions
const mockSubmissions = [
  {
    id: 's1',
    submittedAt: '2024-01-20T14:32:00Z',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 555-0123',
      message: 'Interested in your services',
    },
    source: 'Website',
    ipAddress: '192.168.1.1',
  },
  {
    id: 's2',
    submittedAt: '2024-01-20T12:15:00Z',
    data: {
      name: 'Jane Smith',
      email: 'jane@company.com',
      phone: '+1 555-0124',
      message: 'Need more information about pricing',
    },
    source: 'Landing Page',
    ipAddress: '192.168.1.2',
  },
  {
    id: 's3',
    submittedAt: '2024-01-19T18:45:00Z',
    data: {
      name: 'Bob Johnson',
      email: 'bob@startup.io',
      message: 'When can we schedule a demo?',
    },
    source: 'Website',
    ipAddress: '192.168.1.3',
  },
];

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
  paused: { label: 'Paused', className: 'bg-yellow-100 text-yellow-700' },
};

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('submissions');

  const form = mockForms[params.id];

  if (!form) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Form not found</h2>
          <p className="text-muted-foreground mb-4">The form you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/marketing/forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forms
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const layoutStats = useMemo(
    () => [
      createStat('Submissions', form.submissions.toLocaleString(), CheckCircle2, 'green'),
      createStat('Views', form.views.toLocaleString(), Users, 'blue'),
      createStat('Conversion', `${form.conversionRate}%`, TrendingUp, 'purple'),
      createStat('Fields', form.fields.length, Edit, 'orange'),
    ],
    [form]
  );

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/marketing/forms">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      <Button variant="outline" size="sm">
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </Button>
      <Button variant="outline" size="sm">
        <Code className="mr-2 h-4 w-4" />
        Embed Code
      </Button>
      <Button variant="outline" size="sm">
        <Copy className="mr-2 h-4 w-4" />
        Duplicate
      </Button>
      {form.status === 'active' ? (
        <Button variant="outline" size="sm">
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </Button>
      ) : (
        <Button size="sm">
          <Play className="mr-2 h-4 w-4" />
          Activate
        </Button>
      )}
      <Button size="sm" asChild>
        <Link href={`/marketing/forms/${form.id}/edit`}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </Button>
    </div>
  );

  const mainContent = (
    <div className="space-y-6">
      {/* Form Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{form.name}</CardTitle>
              <CardDescription>
                Created on {formatDateTime(form.createdAt)} · Last submission {form.lastSubmission}
              </CardDescription>
            </div>
            <Badge className={statusConfig[form.status].className}>
              {statusConfig[form.status].label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Submissions</h3>
              <p className="text-sm text-muted-foreground">
                Showing {mockSubmissions.length} of {form.submissions} total submissions
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="text-sm">
                        {formatDateTime(submission.submittedAt)}
                      </TableCell>
                      <TableCell className="font-medium">{submission.data.name}</TableCell>
                      <TableCell>{submission.data.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{submission.source}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {submission.ipAddress}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fields Tab */}
        <TabsContent value="fields" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
            <div className="space-y-3">
              {form.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">#{index + 1}</span>
                        <div>
                          <div className="font-medium">{field.label}</div>
                          <div className="text-sm text-muted-foreground">
                            Type: {field.type} · Name: {field.name}
                            {field.required && (
                              <Badge variant="secondary" className="ml-2">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" aria-label="Edit field">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Form Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{form.views.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">All-time views</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{form.submissions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">All-time submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{form.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Views to submissions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>Configure form behavior and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Send email notifications when form is submitted
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Redirect URL</h4>
                <p className="text-sm text-muted-foreground">
                  Redirect users after successful submission
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">CAPTCHA</h4>
                <p className="text-sm text-muted-foreground">Enable reCAPTCHA to prevent spam</p>
              </div>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Form
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <UnifiedLayout hubId="marketing" pageTitle={form.name} stats={layoutStats} fixedMenu={null}>
      {mainContent}
    </UnifiedLayout>
  );
}
