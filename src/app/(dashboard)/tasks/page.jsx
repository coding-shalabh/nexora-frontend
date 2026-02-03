'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Tag,
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
  Users,
  ListFilter,
  LayoutGrid,
  List,
  CalendarDays,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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

// Mock tasks data
const mockTasks = [
  {
    id: '1',
    title: 'Follow up with Acme Corp about proposal',
    description: 'Send the revised proposal with updated pricing',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-12-26',
    assignee: { name: 'John Doe', initials: 'JD' },
    linkedTo: { type: 'deal', name: 'Acme Corp Enterprise License', id: '1' },
    tags: ['sales', 'proposal'],
    subtasks: { completed: 2, total: 4 },
  },
  {
    id: '2',
    title: 'Review Q4 marketing campaign results',
    description: 'Analyze the performance metrics and prepare report',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-12-27',
    assignee: { name: 'Sarah Smith', initials: 'SS' },
    linkedTo: { type: 'project', name: 'Q4 Marketing Campaign', id: '2' },
    tags: ['marketing', 'analytics'],
    subtasks: { completed: 1, total: 3 },
  },
  {
    id: '3',
    title: 'Update customer portal documentation',
    description: 'Add new FAQ section and update screenshots',
    status: 'todo',
    priority: 'low',
    dueDate: '2024-12-30',
    assignee: { name: 'Mike Johnson', initials: 'MJ' },
    linkedTo: { type: 'ticket', name: 'Documentation Update Request', id: '3' },
    tags: ['documentation', 'support'],
    subtasks: { completed: 0, total: 5 },
  },
  {
    id: '4',
    title: 'Schedule product demo with Tech Solutions',
    description: 'Coordinate with sales team for demo setup',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-12-24',
    assignee: { name: 'Emily Brown', initials: 'EB' },
    linkedTo: { type: 'contact', name: 'James Wilson', id: '4' },
    tags: ['sales', 'demo'],
    subtasks: { completed: 3, total: 3 },
  },
  {
    id: '5',
    title: 'Prepare monthly financial report',
    description: 'Compile revenue and expense data for December',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2024-12-25',
    assignee: { name: 'David Lee', initials: 'DL' },
    linkedTo: null,
    tags: ['finance', 'reporting'],
    subtasks: { completed: 4, total: 6 },
  },
  {
    id: '6',
    title: 'Onboard new team member',
    description: 'Complete HR paperwork and system access setup',
    status: 'blocked',
    priority: 'high',
    dueDate: '2024-12-26',
    assignee: { name: 'HR Team', initials: 'HR' },
    linkedTo: { type: 'company', name: 'Internal', id: '6' },
    tags: ['hr', 'onboarding'],
    subtasks: { completed: 2, total: 8 },
  },
];

// Stats
const stats = [
  { label: 'Total Tasks', value: 24, icon: CheckSquare, color: 'text-primary' },
  { label: 'To Do', value: 8, icon: Circle, color: 'text-gray-500' },
  { label: 'In Progress', value: 6, icon: Clock, color: 'text-blue-500' },
  { label: 'Completed Today', value: 5, icon: CheckCircle2, color: 'text-green-500' },
];

function TaskRow({ task, onToggle }) {
  const StatusIcon = statusConfig[task.status]?.icon || Circle;
  const PriorityIcon = priorityConfig[task.priority]?.icon || ArrowRight;
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-start gap-3 p-4 border-b hover:bg-muted/50 transition-colors group',
        task.status === 'completed' && 'opacity-60'
      )}
    >
      {/* Checkbox */}
      <Checkbox
        checked={task.status === 'completed'}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-1"
      />

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'font-medium',
                task.status === 'completed' && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Task</DropdownMenuItem>
              <DropdownMenuItem>Add Subtask</DropdownMenuItem>
              <DropdownMenuItem>Change Assignee</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {/* Priority */}
          <div
            className={cn('flex items-center gap-1 text-xs', priorityConfig[task.priority]?.color)}
          >
            <PriorityIcon className="h-3 w-3" />
            <span>{priorityConfig[task.priority]?.label}</span>
          </div>

          {/* Due Date */}
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
        </div>
      </div>
    </motion.div>
  );
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');

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
    }));
  }, [tasksData]);

  // Build stats from API data
  const stats = useMemo(() => {
    const data = statsData || {};
    return [
      { label: 'Total Tasks', value: data.total || 0, icon: CheckSquare, color: 'text-primary' },
      { label: 'To Do', value: data.byStatus?.TODO || 0, icon: Circle, color: 'text-gray-500' },
      {
        label: 'In Progress',
        value: data.byStatus?.IN_PROGRESS || 0,
        icon: Clock,
        color: 'text-blue-500',
      },
      {
        label: 'Completed',
        value: data.byStatus?.COMPLETED || 0,
        icon: CheckCircle2,
        color: 'text-green-500',
      },
    ];
  }, [statsData]);

  const handleToggleTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'completed' ? 'TODO' : 'COMPLETED';
      updateTask.mutate({ id: taskId, data: { status: newStatus } });
    }
  };

  const filteredTasks = tasks.filter((task) => {
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

  // Group tasks by status for board view
  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
    completed: filteredTasks.filter((t) => t.status === 'completed'),
    blocked: filteredTasks.filter((t) => t.status === 'blocked'),
  };

  // Show loading state
  if (tasksLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-2">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage all your tasks across contacts, deals, projects, and more
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={cn('h-8 w-8', stat.color)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
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
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusConfig).map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>

          <div className="flex items-center border rounded-lg ml-auto">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-1"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'board' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
              className="gap-1"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Task List / Board */}
      {viewMode === 'list' ? (
        <Card>
          <div className="divide-y">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Create your first task to get started'}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={handleToggleTask} />
              ))
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={statusConfig[status]?.color}>
                    {statusConfig[status]?.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{statusTasks.length}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {statusTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-sm mb-2">{task.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div
                        className={cn(
                          'flex items-center gap-1',
                          priorityConfig[task.priority]?.color
                        )}
                      >
                        {(() => {
                          const PIcon = priorityConfig[task.priority]?.icon;
                          return PIcon ? <PIcon className="h-3 w-3" /> : null;
                        })()}
                      </div>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {task.assignee && (
                        <>
                          <span>•</span>
                          <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-medium">
                            {task.assignee.initials}
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
