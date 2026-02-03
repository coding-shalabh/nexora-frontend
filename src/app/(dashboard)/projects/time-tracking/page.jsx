'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Clock,
  Calendar,
  DollarSign,
  Loader2,
  Timer,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  useTimeEntries,
  useCreateTimeEntry,
  useUpdateTimeEntry,
  useDeleteTimeEntry,
  useProjects,
  useTasks,
} from '@/hooks';

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatHours(hours) {
  if (!hours) return '0h';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function TimeTrackingPage() {
  const [projectFilter, setProjectFilter] = useState('');
  const [billableFilter, setBillableFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    taskId: '',
    description: '',
    hours: '',
    date: new Date().toISOString().split('T')[0],
    billable: true,
    hourlyRate: '',
  });

  const { data, isLoading, error } = useTimeEntries({
    projectId: projectFilter || undefined,
    billable: billableFilter === 'true' ? true : billableFilter === 'false' ? false : undefined,
  });
  const { data: projectsData } = useProjects({ limit: 100 });
  const { data: tasksData } = useTasks({
    projectId: formData.projectId || undefined,
    limit: 100,
  });
  const createTimeEntry = useCreateTimeEntry();
  const deleteTimeEntry = useDeleteTimeEntry();

  const entries = data?.entries || [];
  const meta = data?.meta || {};
  const projects = projectsData?.projects || [];
  const tasks = tasksData?.tasks || [];

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    try {
      await createTimeEntry.mutateAsync({
        projectId: formData.projectId,
        taskId: formData.taskId || undefined,
        description: formData.description,
        hours: parseFloat(formData.hours),
        date: new Date(formData.date).toISOString(),
        billable: formData.billable,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      });
      setIsCreateOpen(false);
      setFormData({
        projectId: '',
        taskId: '',
        description: '',
        hours: '',
        date: new Date().toISOString().split('T')[0],
        billable: true,
        hourlyRate: '',
      });
    } catch (err) {
      console.error('Failed to create time entry:', err);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      try {
        await deleteTimeEntry.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete time entry:', err);
      }
    }
  };

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load time entries. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground">Track time spent on projects and tasks</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Time
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Timer className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
              <div className="text-2xl font-bold">{formatHours(meta.totalHours || 0)}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Entries</div>
              <div className="text-2xl font-bold">{meta.total || 0}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Billable Hours</div>
              <div className="text-2xl font-bold">
                {formatHours(
                  entries.filter((e) => e.billable).reduce((sum, e) => sum + (e.hours || 0), 0)
                )}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">This Week</div>
              <div className="text-2xl font-bold">
                {formatHours(
                  entries
                    .filter((e) => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(e.date) > weekAgo;
                    })
                    .reduce((sum, e) => sum + (e.hours || 0), 0)
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
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
          <Select value={billableFilter} onValueChange={setBillableFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Entries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entries</SelectItem>
              <SelectItem value="true">Billable</SelectItem>
              <SelectItem value="false">Non-billable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Timer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No time entries yet</h3>
            <p className="text-muted-foreground mb-4">Start tracking time on your projects.</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log Time
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(entriesByDate).map(([date, dateEntries]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{formatDate(date)}</h3>
                <span className="text-sm text-muted-foreground">
                  {formatHours(dateEntries.reduce((sum, e) => sum + (e.hours || 0), 0))}
                </span>
              </div>
              <Card>
                <div className="divide-y">
                  {dateEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {entry.project && (
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.project.color || '#6366f1' }}
                              />
                              <span className="font-medium">{entry.project.name}</span>
                            </div>
                          )}
                          {entry.task && (
                            <>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-sm">{entry.task.title}</span>
                            </>
                          )}
                        </div>
                        {entry.description && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {entry.billable ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            Billable
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600">
                            Non-billable
                          </Badge>
                        )}
                        <span className="font-semibold">{formatHours(entry.hours)}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Create Time Entry Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Time</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateEntry}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Project *</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectId: value, taskId: '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
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

              {formData.projectId && tasks.length > 0 && (
                <div className="space-y-2">
                  <Label>Task (Optional)</Label>
                  <Select
                    value={formData.taskId}
                    onValueChange={(value) => setFormData({ ...formData, taskId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No task</SelectItem>
                      {tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What did you work on?"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours *</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="0.00"
                    min="0.25"
                    step="0.25"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="billable"
                    checked={formData.billable}
                    onCheckedChange={(checked) => setFormData({ ...formData, billable: checked })}
                  />
                  <Label htmlFor="billable" className="cursor-pointer">
                    Billable
                  </Label>
                </div>
                {formData.billable && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-24"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTimeEntry.isPending || !formData.projectId}>
                {createTimeEntry.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging...
                  </>
                ) : (
                  'Log Time'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
