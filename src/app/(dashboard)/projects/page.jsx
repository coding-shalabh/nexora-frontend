'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Calendar,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks';

const statusConfig = {
  PLANNING: { label: 'Planning', color: 'bg-gray-500', icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: Loader2 },
  ON_HOLD: { label: 'On Hold', color: 'bg-yellow-500', icon: AlertCircle },
  COMPLETED: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: AlertCircle },
};

const priorityConfig = {
  LOW: { label: 'Low', color: 'bg-gray-400' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-400' },
  HIGH: { label: 'High', color: 'bg-orange-400' },
  URGENT: { label: 'Urgent', color: 'bg-red-500' },
};

function formatCurrency(amount, currency = 'USD') {
  if (!amount) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProjectsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    startDate: '',
    endDate: '',
    budget: '',
    color: '#6366f1',
  });

  const { data, isLoading, error } = useProjects({
    search: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const projects = data?.projects || [];
  const meta = data?.meta || {};

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject.mutateAsync({
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      });
      setIsCreateOpen(false);
      setFormData({
        name: '',
        description: '',
        status: 'PLANNING',
        priority: 'MEDIUM',
        startDate: '',
        endDate: '',
        budget: '',
        color: '#6366f1',
      });
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  // Stats
  const totalProjects = meta.total || 0;
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;
  const inProgressProjects = projects.filter((p) => p.status === 'IN_PROGRESS').length;
  const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load projects. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and track your projects</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
              <div className="text-2xl font-bold">{totalProjects}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-2xl font-bold">{inProgressProjects}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold">{completedProjects}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
              <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(statusConfig).map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first project.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const StatusIcon = statusConfig[project.status]?.icon || Clock;
            return (
              <Card
                key={project.id}
                className="p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <h3 className="font-semibold truncate">{project.name}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/projects/${project.id}`);
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/projects/${project.id}/edit`);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {project.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className={cn('text-white', statusConfig[project.status]?.color)}
                  >
                    {statusConfig[project.status]?.label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(priorityConfig[project.priority]?.color, 'text-white')}
                  >
                    {priorityConfig[project.priority]?.label}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress || 0} className="h-2" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {project._count?.tasks || 0} tasks
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {project.members?.length || 0} members
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(project.endDate)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Project
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Priority
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Progress
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Tasks</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Due Date
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Budget
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <div>
                          <span className="font-medium">{project.name}</span>
                          {project.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={cn('text-white', statusConfig[project.status]?.color)}
                      >
                        {statusConfig[project.status]?.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={cn(priorityConfig[project.priority]?.color, 'text-white')}
                      >
                        {priorityConfig[project.priority]?.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress || 0} className="h-2 w-20" />
                        <span className="text-sm">{project.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="p-4">{project._count?.tasks || 0}</td>
                    <td className="p-4">{formatDate(project.endDate)}</td>
                    <td className="p-4">{formatCurrency(project.budget, project.currency)}</td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/projects/${project.id}`);
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/projects/${project.id}/edit`);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProject}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createProject.isPending}>
                {createProject.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
