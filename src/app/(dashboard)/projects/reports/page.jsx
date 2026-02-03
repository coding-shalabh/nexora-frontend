'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  DollarSign,
  Users,
  FolderKanban,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useProjects, useTaskStats, useTimeEntries } from '@/hooks';

const statusConfig = {
  PLANNING: { label: 'Planning', color: 'bg-gray-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500' },
  ON_HOLD: { label: 'On Hold', color: 'bg-yellow-500' },
  COMPLETED: { label: 'Completed', color: 'bg-green-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500' },
};

function formatHours(hours) {
  if (!hours) return '0h';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatCurrency(amount, currency = 'USD') {
  if (!amount) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProjectReportsPage() {
  const [dateRange, setDateRange] = useState('month');

  const { data: projectsData, isLoading: projectsLoading } = useProjects({ limit: 100 });
  const { data: taskStats, isLoading: tasksLoading } = useTaskStats({});
  const { data: timeData, isLoading: timeLoading } = useTimeEntries({ limit: 1000 });

  const projects = projectsData?.projects || [];
  const entries = timeData?.entries || [];
  const timeMeta = timeData?.meta || {};

  const isLoading = projectsLoading || tasksLoading || timeLoading;

  // Calculate project stats
  const projectsByStatus = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
  const avgProgress =
    projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
      : 0;

  // Calculate time stats by project
  const timeByProject = entries.reduce((acc, e) => {
    if (e.project) {
      if (!acc[e.project.id]) {
        acc[e.project.id] = {
          name: e.project.name,
          color: e.project.color || '#6366f1',
          hours: 0,
          billableHours: 0,
        };
      }
      acc[e.project.id].hours += e.hours || 0;
      if (e.billable) {
        acc[e.project.id].billableHours += e.hours || 0;
      }
    }
    return acc;
  }, {});

  const sortedProjectsByTime = Object.values(timeByProject)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Reports</h1>
          <p className="text-muted-foreground">Analytics and insights for your projects</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FolderKanban className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
              <div className="text-2xl font-bold">{projects.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
              <div className="text-2xl font-bold">
                {taskStats?.completed || 0}/{taskStats?.total || 0}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Hours Tracked</div>
              <div className="text-2xl font-bold">{formatHours(timeMeta.totalHours || 0)}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
              <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Projects by Status</h3>
          <div className="space-y-4">
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = projectsByStatus[status] || 0;
              const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-3 h-3 rounded-full', config.color)} />
                      <span>{config.label}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Task Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Task Overview</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-semibold">{taskStats?.completionRate || 0}%</span>
              </div>
              <Progress value={taskStats?.completionRate || 0} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Overdue</div>
                <div className="text-2xl font-bold text-red-500">{taskStats?.overdue || 0}</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">In Progress</div>
                <div className="text-2xl font-bold text-blue-500">
                  {taskStats?.byStatus?.IN_PROGRESS || 0}
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Tasks by Priority</div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-red-100 text-red-700">
                  Urgent: {taskStats?.byPriority?.URGENT || 0}
                </Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-700">
                  High: {taskStats?.byPriority?.HIGH || 0}
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  Medium: {taskStats?.byPriority?.MEDIUM || 0}
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                  Low: {taskStats?.byPriority?.LOW || 0}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Time by Project */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Time by Project</h3>
          {sortedProjectsByTime.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No time entries yet</p>
          ) : (
            <div className="space-y-4">
              {sortedProjectsByTime.map((project, index) => {
                const maxHours = sortedProjectsByTime[0]?.hours || 1;
                const percentage = (project.hours / maxHours) * 100;

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="truncate">{project.name}</span>
                      </div>
                      <span className="font-medium">{formatHours(project.hours)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: project.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Project Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
          <div className="space-y-4">
            {projects
              .filter((p) => p.status === 'IN_PROGRESS')
              .slice(0, 5)
              .map((project) => (
                <div key={project.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="truncate">{project.name}</span>
                    </div>
                    <span className="font-medium">{project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress || 0} className="h-2" />
                </div>
              ))}
            {projects.filter((p) => p.status === 'IN_PROGRESS').length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No projects in progress
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                  Project
                </th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                  Progress
                </th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                  Tasks
                </th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                  Hours
                </th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                  Budget
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 10).map((project) => {
                const projectTime = timeByProject[project.id];
                return (
                  <tr key={project.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="font-medium">{project.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-white text-xs',
                          statusConfig[project.status]?.color
                        )}
                      >
                        {statusConfig[project.status]?.label}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress || 0} className="h-2 w-20" />
                        <span className="text-sm">{project.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="p-3">{project._count?.tasks || 0}</td>
                    <td className="p-3">{formatHours(projectTime?.hours || 0)}</td>
                    <td className="p-3">{formatCurrency(project.budget, project.currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
