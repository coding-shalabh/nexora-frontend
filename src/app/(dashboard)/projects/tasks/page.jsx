'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  User,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { cn } from '@/lib/utils';
import {
  useTasks,
  useTaskStats,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useProjects,
} from '@/hooks';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';

const statusConfig = {
  TODO: { label: 'To Do', color: 'bg-gray-500', icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: Loader2 },
  IN_REVIEW: { label: 'In Review', color: 'bg-purple-500', icon: AlertCircle },
  BLOCKED: { label: 'Blocked', color: 'bg-red-500', icon: AlertCircle },
  COMPLETED: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-400', icon: AlertCircle },
};

const priorityConfig = {
  LOW: { label: 'Low', color: 'bg-gray-400' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-400' },
  HIGH: { label: 'High', color: 'bg-orange-400' },
  URGENT: { label: 'Urgent', color: 'bg-red-500' },
};

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TasksPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    projectId: '',
    dueDate: '',
    labels: [],
  });

  const { data, isLoading, error } = useTasks({
    search: searchQuery || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    projectId: projectFilter || undefined,
  });
  const { data: statsData } = useTaskStats({});
  const { data: projectsData } = useProjects({ limit: 100 });
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const tasks = data?.data?.tasks || [];
  const meta = data?.data?.meta || {};
  const stats = statsData || {};
  const projects = projectsData?.projects || [];

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask.mutateAsync({
        ...formData,
        projectId: formData.projectId || undefined,
        dueDate: formData.dueDate || undefined,
      });
      setIsCreateOpen(false);
      setFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: '',
        dueDate: '',
        labels: [],
      });
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      await updateTask.mutateAsync({ id: taskId, data: { status } });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  // Stats for UnifiedLayout
  const layoutStats = [
    createStat('Total Tasks', stats.total?.toString() || '0', CheckCircle2, 'blue'),
    createStat('In Progress', stats.byStatus?.IN_PROGRESS?.toString() || '0', Loader2, 'blue'),
    createStat('Completed', stats.completed?.toString() || '0', CheckCircle2, 'green'),
    createStat('Overdue', stats.overdue?.toString() || '0', AlertCircle, 'red'),
  ];

  const actions = [createAction('New Task', Plus, () => setIsCreateOpen(true), { primary: true })];

  if (error) {
    return (
      <UnifiedLayout
        hubId="projects"
        pageTitle="Tasks"
        stats={layoutStats}
        actions={actions}
        fixedMenu={null}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Failed to load tasks. Please try again.</p>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout
      hubId="projects"
      pageTitle="Tasks"
      stats={layoutStats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
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
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {Object.entries(priorityConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first task.</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>
          </Card>
        ) : viewMode === 'list' ? (
          /* List View */
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground w-10"></th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Task
                    </th>
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
                      Due Date
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Assignee
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <Checkbox
                          checked={task.status === 'COMPLETED'}
                          onCheckedChange={() =>
                            handleUpdateTaskStatus(
                              task.id,
                              task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED'
                            )
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/projects/tasks/${task.id}`}
                          className={cn(
                            'font-medium hover:underline',
                            task.status === 'COMPLETED' && 'line-through text-muted-foreground'
                          )}
                        >
                          {task.title}
                        </Link>
                        {task.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {task.project ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: task.project.color }}
                            />
                            <span className="text-sm">{task.project.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={cn('text-white', statusConfig[task.status]?.color)}
                        >
                          {statusConfig[task.status]?.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cn(priorityConfig[task.priority]?.color, 'text-white')}
                        >
                          {priorityConfig[task.priority]?.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            task.dueDate &&
                              new Date(task.dueDate) < new Date() &&
                              task.status !== 'COMPLETED' &&
                              'text-red-500'
                          )}
                        >
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td className="p-4">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-sm">
                              {task.assignee.firstName} {task.assignee.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/projects/tasks/${task.id}`)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateTaskStatus(
                                  task.id,
                                  task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED'
                                )
                              }
                            >
                              {task.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Complete'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteTask(task.id)}
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
        ) : (
          /* Kanban View */
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Object.entries(statusConfig).map(([status, config]) => {
              const statusTasks = tasks.filter((t) => t.status === status);
              const StatusIcon = config.icon;

              return (
                <div key={status} className="flex-shrink-0 w-80">
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-3 h-3 rounded-full', config.color)} />
                        <h3 className="font-semibold">{config.label}</h3>
                        <span className="text-sm text-muted-foreground">
                          ({statusTasks.length})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {statusTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => router.push(`/projects/tasks/${task.id}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4
                            className={cn(
                              'font-medium text-sm',
                              task.status === 'COMPLETED' && 'line-through text-muted-foreground'
                            )}
                          >
                            {task.title}
                          </h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateTaskStatus(
                                    task.id,
                                    task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED'
                                  );
                                }}
                              >
                                {task.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Complete'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {task.project && (
                          <div className="flex items-center gap-1 mb-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: task.project.color }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {task.project.name}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              priorityConfig[task.priority]?.color,
                              'text-white text-xs'
                            )}
                          >
                            {priorityConfig[task.priority]?.label}
                          </Badge>
                          {task.labels?.map((label) => (
                            <Badge key={label} variant="outline" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                          {task.assignee ? (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {task.assignee.firstName}
                            </div>
                          ) : (
                            <span>Unassigned</span>
                          )}
                          {task.dueDate && (
                            <div
                              className={cn(
                                'flex items-center gap-1',
                                new Date(task.dueDate) < new Date() &&
                                  task.status !== 'COMPLETED' &&
                                  'text-red-500'
                              )}
                            >
                              <Calendar className="h-3 w-3" />
                              {formatDate(task.dueDate)}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}

                    <Button
                      variant="ghost"
                      className="w-full border-2 border-dashed"
                      onClick={() => {
                        setFormData({ ...formData, status });
                        setIsCreateOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTask}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
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
                  <Label>Priority</Label>
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

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTask.isPending}>
                {createTask.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </UnifiedLayout>
  );
}
