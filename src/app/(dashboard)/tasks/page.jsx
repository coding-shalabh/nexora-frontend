'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Link2,
  Building2,
  Target,
  FolderKanban,
  Ticket,
  Calendar,
  Clock,
  User,
  Tag,
  Loader2,
  Edit,
  Trash2,
  Eye,
  Send,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';
import { useTasks, useTaskStats, useUpdateTask } from '@/hooks/use-tasks';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

// Task status config
const statusConfig = {
  todo: { label: 'To Do', color: 'bg-gray-100 text-gray-700', icon: Circle },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  blocked: { label: 'Blocked', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

// Priority config
const priorityConfig = {
  low: { label: 'Low', color: 'text-gray-500', icon: ArrowDown },
  medium: { label: 'Medium', color: 'text-blue-500', icon: ArrowRight },
  high: { label: 'High', color: 'text-orange-500', icon: ArrowUp },
  urgent: { label: 'Urgent', color: 'text-red-500', icon: AlertCircle },
};

// Link type config
const linkTypeConfig = {
  contact: { label: 'Contact', icon: User, color: 'bg-blue-100 text-blue-700' },
  company: { label: 'Company', icon: Building2, color: 'bg-purple-100 text-purple-700' },
  deal: { label: 'Deal', icon: Target, color: 'bg-green-100 text-green-700' },
  project: { label: 'Project', icon: FolderKanban, color: 'bg-violet-100 text-violet-700' },
  ticket: { label: 'Ticket', icon: Ticket, color: 'bg-orange-100 text-orange-700' },
};

function formatTimeAgo(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  // Fetch tasks from API
  const { data: tasksData, isLoading: tasksLoading } = useTasks({
    status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
    search: searchQuery || undefined,
  });
  const { data: statsData, isLoading: statsLoading } = useTaskStats();
  const updateTask = useUpdateTask();

  // Transform API data to component format
  const tasks = useMemo(() => {
    if (!tasksData?.tasks) return [];
    return tasksData.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status?.toLowerCase() || 'todo',
      priority: task.priority?.toLowerCase() || 'medium',
      dueDate: task.dueDate,
      assignee: task.assignee
        ? {
            name: `${task.assignee.firstName} ${task.assignee.lastName}`,
            initials: `${task.assignee.firstName?.[0] || ''}${task.assignee.lastName?.[0] || ''}`,
          }
        : null,
      linkedTo: task.project
        ? { type: 'project', name: task.project.name, id: task.project.id }
        : null,
      tags: task.labels || [],
      subtasks: {
        completed: task._count?.checklists || 0,
        total: (task._count?.checklists || 0) + (task._count?.subtasks || 0),
      },
      createdAt: task.createdAt,
    }));
  }, [tasksData]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [tasks, statusFilter, searchQuery]);

  // Build stats from API data
  const stats = useMemo(() => {
    const data = statsData || {};
    return [
      createStat('Total', data.total || 0, CheckSquare, 'primary'),
      createStat('To Do', data.byStatus?.TODO || 0, Circle, 'blue'),
      createStat('In Progress', data.byStatus?.IN_PROGRESS || 0, Clock, 'amber'),
      createStat('Completed', data.byStatus?.COMPLETED || 0, CheckCircle2, 'green'),
    ];
  }, [statsData]);

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'create', label: 'New Task', icon: Plus, variant: 'default' }],
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'todo', label: 'To Do' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'completed', label: 'Completed' },
        { id: 'blocked', label: 'Blocked' },
      ],
    },
  };

  const handleToggleTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'completed' ? 'TODO' : 'COMPLETED';
      updateTask.mutate({ id: taskId, data: { status: newStatus } });
    }
  };

  const handleView = (task) => {
    setSelectedTask(task);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || '',
    });
    setIsEditOpen(true);
  };

  const handleCreate = async () => {
    // TODO: Implement create task API call
    console.log('Create task:', formData);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleUpdate = async () => {
    // TODO: Implement update task API call
    console.log('Update task:', selectedTask?.id, formData);
    setIsEditOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    });
  };

  // Empty state component
  const EmptyState = () => (
    <div className="p-12 text-center">
      <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No tasks found</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery || statusFilter !== 'all'
          ? 'Try adjusting your filters'
          : 'Create your first task to get started'}
      </p>
      {!searchQuery && statusFilter === 'all' && (
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      )}
    </div>
  );

  // Task card component
  const TaskCard = ({ task }) => {
    const status = statusConfig[task.status] || statusConfig.todo;
    const priority = priorityConfig[task.priority] || priorityConfig.medium;
    const StatusIcon = status.icon;
    const PriorityIcon = priority.icon;
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

    return (
      <Card
        className={cn(
          'p-4 hover:shadow-md transition-shadow cursor-pointer',
          task.status === 'completed' && 'opacity-60',
          isOverdue && 'border-destructive'
        )}
        onClick={() => handleView(task)}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <Checkbox
            checked={task.status === 'completed'}
            onCheckedChange={(e) => {
              e.stopPropagation();
              handleToggleTask(task.id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  className={cn(
                    'font-medium',
                    task.status === 'completed' && 'line-through text-muted-foreground'
                  )}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {task.description}
                  </p>
                )}
              </div>
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
                      handleView(task);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(task);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
              {/* Priority */}
              <div className={cn('flex items-center gap-1 text-xs', priority.color)}>
                <PriorityIcon className="h-3 w-3" />
                <span>{priority.label}</span>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-xs',
                    isOverdue ? 'text-red-500' : 'text-muted-foreground'
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {/* Assignee */}
              {task.assignee && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium">
                    {task.assignee.initials}
                  </div>
                  <span>{task.assignee.name}</span>
                </div>
              )}

              {/* Linked Entity */}
              {task.linkedTo && (
                <Badge
                  variant="secondary"
                  className={cn('text-xs gap-1', linkTypeConfig[task.linkedTo.type]?.color)}
                >
                  {(() => {
                    const LinkIcon = linkTypeConfig[task.linkedTo.type]?.icon || Link2;
                    return <LinkIcon className="h-3 w-3" />;
                  })()}
                  {task.linkedTo.name}
                </Badge>
              )}

              {/* Subtasks */}
              {task.subtasks && task.subtasks.total > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckSquare className="h-3 w-3" />
                  <span>
                    {task.subtasks.completed}/{task.subtasks.total}
                  </span>
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {task.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {task.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{task.tags.length - 2}</span>
                  )}
                </div>
              )}

              <span className="text-xs text-muted-foreground ml-auto">
                {formatTimeAgo(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <HubLayout
        hubId="productivity"
        title="Tasks"
        description="Manage all your tasks across contacts, deals, projects, and more"
        stats={stats}
        showFixedMenu={true}
        fixedMenuFilters={
          <FixedMenuPanel
            config={fixedMenuConfig}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
            onAction={(id) => id === 'create' && setIsCreateOpen(true)}
            className="p-4"
          />
        }
        fixedMenuList={
          <div className="space-y-2 p-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tasks List */}
            {tasksLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <EmptyState />
            ) : (
              filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        }
      >
        {/* Task Detail View in Content Area */}
        {selectedTask ? (
          <div className="h-full overflow-y-auto p-6">
            {/* Task Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={selectedTask.status === 'completed'}
                  onCheckedChange={() => handleToggleTask(selectedTask.id)}
                />
                <h2 className="text-2xl font-bold">{selectedTask.title}</h2>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    statusConfig[selectedTask.status]?.color
                  )}
                >
                  {statusConfig[selectedTask.status]?.label}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1 text-sm',
                    priorityConfig[selectedTask.priority]?.color
                  )}
                >
                  {(() => {
                    const Icon = priorityConfig[selectedTask.priority]?.icon;
                    return Icon ? <Icon className="h-4 w-4" /> : null;
                  })()}
                  {priorityConfig[selectedTask.priority]?.label} Priority
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedTask.description && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                <p className="text-sm bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedTask.description}
                </p>
              </div>
            )}

            {/* Details */}
            <div className="space-y-3 mb-6">
              {selectedTask.assignee && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Assigned To</span>
                  <span className="font-medium">{selectedTask.assignee.name}</span>
                </div>
              )}
              {selectedTask.dueDate && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span
                    className={cn(
                      new Date(selectedTask.dueDate) < new Date() &&
                        selectedTask.status !== 'completed' &&
                        'text-destructive'
                    )}
                  >
                    {formatDateTime(selectedTask.dueDate)}
                  </span>
                </div>
              )}
              {selectedTask.linkedTo && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Linked To</span>
                  <Badge
                    variant="secondary"
                    className={cn('gap-1', linkTypeConfig[selectedTask.linkedTo.type]?.color)}
                  >
                    {(() => {
                      const LinkIcon = linkTypeConfig[selectedTask.linkedTo.type]?.icon || Link2;
                      return <LinkIcon className="h-3 w-3" />;
                    })()}
                    {selectedTask.linkedTo.name}
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Created</span>
                <span>{formatDateTime(selectedTask.createdAt)}</span>
              </div>
              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Tags</span>
                  <div className="flex gap-1">
                    {selectedTask.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Subtasks */}
            {selectedTask.subtasks && selectedTask.subtasks.total > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Subtasks ({selectedTask.subtasks.completed}/{selectedTask.subtasks.total})
                </h4>
                <div className="space-y-2">
                  {/* TODO: Render actual subtasks from API */}
                  <p className="text-sm text-muted-foreground">Subtasks will be displayed here</p>
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedTask.status !== 'completed' && (
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => handleEdit(selectedTask)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-green-600 hover:text-green-700"
                  onClick={() => handleToggleTask(selectedTask.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a task to view details</p>
            </div>
          </div>
        )}
      </HubLayout>

      {/* Create Task Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className={cn('flex items-center gap-2', config.color)}>
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className={cn('flex items-center gap-2', config.color)}>
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
