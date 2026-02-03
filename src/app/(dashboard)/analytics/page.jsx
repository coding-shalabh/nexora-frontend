'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  MessageSquare,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  Clock,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Timer,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function useAnalytics(endpoint, params = {}) {
  return useQuery({
    queryKey: ['analytics', endpoint, params],
    queryFn: () => api.get(`/analytics/${endpoint}`, { params }),
  });
}

function formatCurrency(value) {
  if (!value) return '$0';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
}

function formatHours(hours) {
  if (!hours) return '0h';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function StatCard({ title, value, icon: Icon, trend, formatter = (v) => v, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold">{formatter(value)}</p>
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          {trend >= 0 ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={cn('text-sm font-medium', trend >= 0 ? 'text-green-500' : 'text-red-500')}>
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      )}
    </Card>
  );
}

function ProgressCard({ title, current, total, color = 'primary' }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <span className="font-semibold">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="mt-2 text-xs text-muted-foreground">
        {current} of {total}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: overview, isLoading: overviewLoading, refetch } = useAnalytics('overview');
  const { data: projectMetrics } = useAnalytics('projects');
  const { data: taskMetrics } = useAnalytics('tasks');
  const { data: timeMetrics } = useAnalytics('time-tracking');
  const { data: teamData } = useAnalytics('team');

  const dashboardData = overview?.data || {};
  const projectData = projectMetrics?.data || {};
  const taskData = taskMetrics?.data || {};
  const timeData = timeMetrics?.data || {};
  const teamPerformance = teamData?.data || [];

  const isLoading = overviewLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights across all your business operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* CRM Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Contacts"
                  value={dashboardData.contacts?.total || 0}
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="New Contacts"
                  value={dashboardData.contacts?.new || 0}
                  icon={Users}
                  color="green"
                />
                <StatCard
                  title="Open Deals"
                  value={dashboardData.deals?.open || 0}
                  icon={Target}
                  color="purple"
                />
                <StatCard
                  title="Won Revenue"
                  value={dashboardData.deals?.wonValue || 0}
                  icon={DollarSign}
                  formatter={formatCurrency}
                  color="green"
                />
              </div>

              {/* Project & Task Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FolderKanban className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Projects Overview</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">
                        {dashboardData.projects?.total || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Projects</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-500">
                        {dashboardData.projects?.byStatus?.IN_PROGRESS || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-500">
                        {dashboardData.projects?.completed || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-3xl font-bold">
                        {dashboardData.projects?.avgProgress || 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Progress</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ListTodo className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Tasks Overview</h3>
                  </div>
                  <div className="space-y-4">
                    <ProgressCard
                      title="Task Completion"
                      current={dashboardData.tasks?.completed || 0}
                      total={dashboardData.tasks?.total || 0}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {dashboardData.tasks?.byStatus?.IN_PROGRESS || 0}
                        </div>
                        <div className="text-xs text-blue-600">In Progress</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg text-center">
                        <div className="text-xl font-bold text-red-600">
                          {dashboardData.tasks?.overdue || 0}
                        </div>
                        <div className="text-xs text-red-600">Overdue</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg text-center">
                        <div className="text-xl font-bold text-green-600">
                          {dashboardData.tasks?.completionRate || 0}%
                        </div>
                        <div className="text-xs text-green-600">Rate</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Time Tracking */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Timer className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Time Tracking</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {formatHours(dashboardData.timeTracking?.totalHours || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Hours</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatHours(dashboardData.timeTracking?.billableHours || 0)}
                    </div>
                    <div className="text-sm text-green-600">Billable</div>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {formatHours(dashboardData.timeTracking?.nonBillableHours || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Non-billable</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {dashboardData.timeTracking?.totalEntries || 0}
                    </div>
                    <div className="text-sm text-purple-600">Entries</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Projects"
                  value={projectData.total || 0}
                  icon={FolderKanban}
                  color="primary"
                />
                <StatCard
                  title="New This Period"
                  value={projectData.new || 0}
                  icon={FolderKanban}
                  color="blue"
                />
                <StatCard
                  title="Completed"
                  value={projectData.completed || 0}
                  icon={CheckCircle2}
                  color="green"
                />
                <StatCard
                  title="On-Time Rate"
                  value={projectData.onTimeCompletionRate || 0}
                  icon={Clock}
                  formatter={(v) => `${v}%`}
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Projects by Status</h3>
                  <div className="space-y-4">
                    {Object.entries(projectData.byStatus || {}).map(([status, count]) => (
                      <div key={status}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{status.replace('_', ' ')}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <Progress
                          value={projectData.total > 0 ? (count / projectData.total) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Projects by Priority</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(projectData.byPriority || {}).map(([priority, count]) => {
                      const colors = {
                        URGENT: 'bg-red-100 text-red-700',
                        HIGH: 'bg-orange-100 text-orange-700',
                        MEDIUM: 'bg-blue-100 text-blue-700',
                        LOW: 'bg-gray-100 text-gray-700',
                      };
                      return (
                        <div key={priority} className={cn('p-4 rounded-lg', colors[priority])}>
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-sm">{priority}</div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {formatCurrency(projectData.totalBudget || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Budget</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {formatCurrency(projectData.totalActualCost || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Actual Cost</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {formatCurrency((projectData.totalBudget || 0) - (projectData.totalActualCost || 0))}
                    </div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <StatCard
                  title="Total Tasks"
                  value={taskData.total || 0}
                  icon={ListTodo}
                  color="primary"
                />
                <StatCard
                  title="Completed"
                  value={taskData.completed || 0}
                  icon={CheckCircle2}
                  color="green"
                />
                <StatCard
                  title="Overdue"
                  value={taskData.overdue || 0}
                  icon={AlertCircle}
                  color="red"
                />
                <StatCard
                  title="Completion Rate"
                  value={taskData.completionRate || 0}
                  icon={Activity}
                  formatter={(v) => `${v}%`}
                  color="blue"
                />
                <StatCard
                  title="Hours Logged"
                  value={taskData.actualHours || 0}
                  icon={Clock}
                  formatter={formatHours}
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
                  <div className="space-y-3">
                    {Object.entries(taskData.byStatus || {}).map(([status, count]) => {
                      const colors = {
                        TODO: 'bg-gray-500',
                        IN_PROGRESS: 'bg-blue-500',
                        IN_REVIEW: 'bg-purple-500',
                        BLOCKED: 'bg-red-500',
                        COMPLETED: 'bg-green-500',
                        CANCELLED: 'bg-gray-400',
                      };
                      const percentage = taskData.total > 0 ? (count / taskData.total) * 100 : 0;
                      return (
                        <div key={status}>
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className={cn('w-3 h-3 rounded-full', colors[status])} />
                              <span className="text-sm">{status.replace('_', ' ')}</span>
                            </div>
                            <span className="font-medium">{count}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(taskData.byPriority || {}).map(([priority, count]) => {
                      const colors = {
                        URGENT: 'border-red-500 bg-red-50',
                        HIGH: 'border-orange-500 bg-orange-50',
                        MEDIUM: 'border-blue-500 bg-blue-50',
                        LOW: 'border-gray-500 bg-gray-50',
                      };
                      return (
                        <div
                          key={priority}
                          className={cn('p-4 rounded-lg border-l-4', colors[priority])}
                        >
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-sm text-muted-foreground">{priority}</div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Time Estimates vs Actual</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{formatHours(taskData.estimatedHours || 0)}</div>
                    <div className="text-sm text-muted-foreground">Estimated Hours</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{formatHours(taskData.actualHours || 0)}</div>
                    <div className="text-sm text-muted-foreground">Actual Hours</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Time Tracking Tab */}
            <TabsContent value="time" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Hours"
                  value={timeData.totalHours || 0}
                  icon={Timer}
                  formatter={formatHours}
                  color="primary"
                />
                <StatCard
                  title="Billable Hours"
                  value={timeData.billableHours || 0}
                  icon={DollarSign}
                  formatter={formatHours}
                  color="green"
                />
                <StatCard
                  title="Non-Billable"
                  value={timeData.nonBillableHours || 0}
                  icon={Clock}
                  formatter={formatHours}
                  color="orange"
                />
                <StatCard
                  title="Total Entries"
                  value={timeData.totalEntries || 0}
                  icon={BarChart3}
                  color="blue"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Hours by Project</h3>
                  {(timeData.byProject || []).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No time entries yet</p>
                  ) : (
                    <div className="space-y-4">
                      {(timeData.byProject || []).slice(0, 5).map((project, i) => {
                        const maxHours = timeData.byProject[0]?.hours || 1;
                        return (
                          <div key={project.projectId || i}>
                            <div className="flex justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: project.color }}
                                />
                                <span className="text-sm truncate">{project.name}</span>
                              </div>
                              <span className="font-medium">{formatHours(project.hours)}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(project.hours / maxHours) * 100}%`,
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

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Hours by Team Member</h3>
                  {(timeData.byUser || []).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No time entries yet</p>
                  ) : (
                    <div className="space-y-4">
                      {(timeData.byUser || []).slice(0, 5).map((user, i) => {
                        const maxHours = timeData.byUser[0]?.hours || 1;
                        return (
                          <div key={user.userId || i}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{user.name}</span>
                              <span className="font-medium">{formatHours(user.hours)}</span>
                            </div>
                            <Progress value={(user.hours / maxHours) * 100} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>

              {/* Daily Trend */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Daily Hours (Last 7 Days)</h3>
                {(timeData.dailyTrend || []).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No data available</p>
                ) : (
                  <div className="flex items-end gap-2 h-32">
                    {(timeData.dailyTrend || []).map((day, i) => {
                      const maxHours = Math.max(...(timeData.dailyTrend || []).map(d => d.hours)) || 1;
                      const height = (day.hours / maxHours) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-primary rounded-t transition-all"
                            style={{ height: `${height}%`, minHeight: day.hours > 0 ? '4px' : '0' }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
                {teamPerformance.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No team performance data available for this period
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-muted-foreground">
                          <th className="p-4">Team Member</th>
                          <th className="p-4 text-right">Deals Won</th>
                          <th className="p-4 text-right">Deal Value</th>
                          <th className="p-4 text-right">Conversations</th>
                          <th className="p-4 text-right">Tickets Resolved</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {teamPerformance.map((member) => (
                          <tr key={member.userId} className="hover:bg-muted/50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                                  {member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </div>
                                <span className="font-medium">{member.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-right font-medium">{member.dealsWon}</td>
                            <td className="p-4 text-right font-medium text-green-500">
                              {formatCurrency(member.dealsValue)}
                            </td>
                            <td className="p-4 text-right font-medium">{member.conversationsHandled}</td>
                            <td className="p-4 text-right font-medium">{member.ticketsResolved}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
