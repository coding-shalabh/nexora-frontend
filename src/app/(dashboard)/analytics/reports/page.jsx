'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  MoreHorizontal,
  FileText,
  Download,
  Calendar,
  Clock,
  Play,
  Pause,
  Trash2,
  Edit,
  Copy,
  Mail,
  BarChart3,
  PieChart,
  Table,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Ticket,
  Filter,
  Star,
  Eye,
} from 'lucide-react';

// Mock data for reports
const mockReports = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    description: 'Overview of sales performance for the month',
    type: 'sales',
    format: 'table',
    schedule: 'monthly',
    lastRun: '2024-01-20T08:00:00',
    nextRun: '2024-02-01T08:00:00',
    status: 'active',
    starred: true,
    createdBy: 'Sales Manager',
  },
  {
    id: '2',
    name: 'Lead Conversion Funnel',
    description: 'Track leads through the sales funnel stages',
    type: 'marketing',
    format: 'chart',
    schedule: 'weekly',
    lastRun: '2024-01-19T09:00:00',
    nextRun: '2024-01-26T09:00:00',
    status: 'active',
    starred: true,
    createdBy: 'Marketing Lead',
  },
  {
    id: '3',
    name: 'Support Ticket Analysis',
    description: 'Analyze support tickets by category and resolution time',
    type: 'support',
    format: 'mixed',
    schedule: 'daily',
    lastRun: '2024-01-20T06:00:00',
    nextRun: '2024-01-21T06:00:00',
    status: 'active',
    starred: false,
    createdBy: 'Support Lead',
  },
  {
    id: '4',
    name: 'Revenue by Product',
    description: 'Revenue breakdown by product and category',
    type: 'finance',
    format: 'pie',
    schedule: 'none',
    lastRun: '2024-01-15T10:00:00',
    nextRun: null,
    status: 'paused',
    starred: false,
    createdBy: 'Finance Team',
  },
  {
    id: '5',
    name: 'Team Performance Dashboard',
    description: 'Individual and team performance metrics',
    type: 'hr',
    format: 'table',
    schedule: 'weekly',
    lastRun: '2024-01-14T08:00:00',
    nextRun: '2024-01-21T08:00:00',
    status: 'active',
    starred: false,
    createdBy: 'HR Manager',
  },
];

const reportTemplates = [
  { id: '1', name: 'Sales Pipeline Report', icon: TrendingUp, category: 'Sales' },
  { id: '2', name: 'Contact Activity Report', icon: Users, category: 'CRM' },
  { id: '3', name: 'Deal Won/Lost Analysis', icon: Target, category: 'Sales' },
  { id: '4', name: 'Revenue by Source', icon: DollarSign, category: 'Finance' },
  { id: '5', name: 'Support Metrics Report', icon: Ticket, category: 'Support' },
  { id: '6', name: 'Campaign Performance', icon: BarChart3, category: 'Marketing' },
];

const typeConfig = {
  sales: { label: 'Sales', color: 'bg-blue-100 text-blue-700' },
  marketing: { label: 'Marketing', color: 'bg-purple-100 text-purple-700' },
  support: { label: 'Support', color: 'bg-orange-100 text-orange-700' },
  finance: { label: 'Finance', color: 'bg-green-100 text-green-700' },
  hr: { label: 'HR', color: 'bg-pink-100 text-pink-700' },
};

const formatIcons = {
  table: Table,
  chart: BarChart3,
  pie: PieChart,
  mixed: BarChart3,
};

function CreateReportDialog({ open, onOpenChange, onSubmit, editReport }) {
  const [formData, setFormData] = useState({
    name: editReport?.name || '',
    description: editReport?.description || '',
    type: editReport?.type || 'sales',
    format: editReport?.format || 'table',
    schedule: editReport?.schedule || 'none',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '', type: 'sales', format: 'table', schedule: 'none' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editReport ? 'Edit Report' : 'Create New Report'}</DialogTitle>
          <DialogDescription>
            {editReport
              ? 'Update your report configuration'
              : 'Build a custom report to analyze your data'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Report Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Monthly Sales Report"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What does this report track?"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={formData.format}
                onValueChange={(value) => setFormData({ ...formData, format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="chart">Bar Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Schedule</Label>
            <Select
              value={formData.schedule}
              onValueChange={(value) => setFormData({ ...formData, schedule: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Manual Only</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editReport ? 'Save Changes' : 'Create Report'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('my-reports');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [reports, setReports] = useState(mockReports);

  const filteredReports = reports.filter((report) => {
    if (filterType !== 'all' && report.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.name.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCreateReport = (formData) => {
    if (editReport) {
      setReports(reports.map((r) =>
        r.id === editReport.id ? { ...r, ...formData } : r
      ));
    } else {
      const newReport = {
        id: Date.now().toString(),
        ...formData,
        lastRun: null,
        nextRun: formData.schedule !== 'none' ? new Date().toISOString() : null,
        status: 'active',
        starred: false,
        createdBy: 'Current User',
      };
      setReports([newReport, ...reports]);
    }
    setCreateDialogOpen(false);
    setEditReport(null);
  };

  const handleToggleStar = (id) => {
    setReports(reports.map((r) =>
      r.id === id ? { ...r, starred: !r.starred } : r
    ));
  };

  const handleToggleStatus = (id) => {
    setReports(reports.map((r) =>
      r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r
    ));
  };

  const handleDelete = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const handleDuplicate = (report) => {
    const duplicate = {
      ...report,
      id: Date.now().toString(),
      name: `${report.name} (Copy)`,
      starred: false,
    };
    setReports([duplicate, ...reports]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Build and schedule custom reports</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Report
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="my-reports" className="space-y-4 mt-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const FormatIcon = formatIcons[report.format] || Table;
              return (
                <Card key={report.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{report.name}</h3>
                          <Badge className={typeConfig[report.type].color}>
                            {typeConfig[report.type].label}
                          </Badge>
                          <button
                            onClick={() => handleToggleStar(report.id)}
                            className="text-muted-foreground hover:text-yellow-500"
                          >
                            <Star
                              className={cn(
                                'h-4 w-4',
                                report.starred && 'fill-yellow-400 text-yellow-400'
                              )}
                            />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{report.description}</p>

                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FormatIcon className="h-4 w-4" />
                            <span className="capitalize">{report.format}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span className="capitalize">{report.schedule === 'none' ? 'Manual' : report.schedule}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Last run: {formatDate(report.lastRun)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Play className="h-3 w-3" />
                        Run
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3 w-3" />
                        Export
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditReport(report);
                              setCreateDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(report)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Email Report
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(report.id)}>
                            {report.status === 'active' ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause Schedule
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Resume Schedule
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(report.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredReports.length === 0 && (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first report to start analyzing data
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Use Template
                  </Button>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Scheduled Reports</h3>
            <div className="space-y-4">
              {reports
                .filter((r) => r.schedule !== 'none' && r.status === 'active')
                .map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          Runs {report.schedule}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Next run: {formatDate(report.nextRun)}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <CreateReportDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditReport(null);
        }}
        onSubmit={handleCreateReport}
        editReport={editReport}
      />
    </div>
  );
}
