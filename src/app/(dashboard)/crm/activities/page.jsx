'use client';

import { useState, useDeferredValue } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Phone,
  Video,
  CheckSquare,
  StickyNote,
  Mail,
  Calendar,
  Clock,
  User,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Building2,
  Briefcase,
  LayoutList,
  LayoutGrid,
  Timer,
  Flag,
  UserCircle,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  useActivities,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from '@/hooks/use-activities';
import { useContacts } from '@/hooks/use-contacts';
import { useCompanies } from '@/hooks/use-companies';
import { useDeals } from '@/hooks/use-deals';
import { useToast } from '@/hooks/use-toast';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

const activityIcons = {
  CALL: Phone,
  MEETING: Video,
  TASK: CheckSquare,
  NOTE: StickyNote,
  EMAIL: Mail,
};

const activityColors = {
  CALL: 'bg-green-100 text-green-700',
  MEETING: 'bg-blue-100 text-blue-700',
  TASK: 'bg-purple-100 text-purple-700',
  NOTE: 'bg-yellow-100 text-yellow-700',
  EMAIL: 'bg-pink-100 text-pink-700',
};

const activityTypes = [
  { value: 'CALL', label: 'Call', icon: Phone },
  { value: 'MEETING', label: 'Meeting', icon: Video },
  { value: 'TASK', label: 'Task', icon: CheckSquare },
  { value: 'NOTE', label: 'Note', icon: StickyNote },
  { value: 'EMAIL', label: 'Email', icon: Mail },
];

const priorityOptions = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-700' },
];

const emptyActivity = {
  type: 'TASK',
  title: '',
  description: '',
  dueAt: '',
  completed: false,
  contactId: '',
  companyId: '',
  dealId: '',
  priority: 'MEDIUM',
  callDuration: '',
  callOutcome: '',
  meetingLocation: '',
  meetingUrl: '',
};

function formatDate(dateStr) {
  if (!dateStr) return 'No due date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDuration(minutes) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 25;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewSheet, setShowViewSheet] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [formData, setFormData] = useState(emptyActivity);

  const { toast } = useToast();

  // Fetch contacts for linking
  const { data: contactsData } = useContacts({ page: 1, limit: 100 });
  const contacts = contactsData?.data || [];

  // Fetch companies for linking
  const { data: companiesData } = useCompanies({ page: 1, limit: 100 });
  const companies = companiesData?.data || [];

  // Fetch deals for linking
  const { data: dealsData } = useDeals({ page: 1, limit: 100 });
  const deals = dealsData?.data || [];

  // Fetch activities from API
  const { data, isLoading, error, refetch } = useActivities({
    page,
    limit,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    completed: showCompleted ? undefined : false,
    search: deferredSearch || undefined,
  });

  // Mutations
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  const activities = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1 };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData(emptyActivity);
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (activity) => {
    setCurrentActivity(activity);
    setFormData({
      type: activity.type || 'TASK',
      title: activity.title || activity.subject || '',
      description: activity.description || '',
      dueAt: activity.dueAt ? new Date(activity.dueAt).toISOString().slice(0, 16) : '',
      completed: activity.completed || false,
      contactId: activity.contactId || '',
      companyId: activity.companyId || '',
      dealId: activity.dealId || '',
      priority: activity.priority || 'MEDIUM',
      callDuration: activity.callDuration || '',
      callOutcome: activity.callOutcome || '',
      meetingLocation: activity.meetingLocation || '',
      meetingUrl: activity.meetingUrl || '',
    });
    setShowEditModal(true);
  };

  // Open View Sheet
  const handleOpenView = (activity) => {
    setCurrentActivity(activity);
    setShowViewSheet(true);
  };

  // Create Activity
  const handleCreate = async () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createActivity.mutateAsync({
        ...formData,
        dueAt: formData.dueAt ? new Date(formData.dueAt).toISOString() : null,
      });
      setShowAddModal(false);
      setFormData(emptyActivity);
      toast({
        title: 'Activity Created',
        description: 'The activity has been created successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create activity',
        variant: 'destructive',
      });
    }
  };

  // Update Activity
  const handleUpdate = async () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateActivity.mutateAsync({
        id: currentActivity.id,
        data: {
          ...formData,
          dueAt: formData.dueAt ? new Date(formData.dueAt).toISOString() : null,
        },
      });
      setShowEditModal(false);
      setCurrentActivity(null);
      toast({
        title: 'Activity Updated',
        description: 'The activity has been updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update activity',
        variant: 'destructive',
      });
    }
  };

  // Toggle Complete
  const handleToggleComplete = async (activity) => {
    try {
      await updateActivity.mutateAsync({
        id: activity.id,
        data: { completed: !activity.completed },
      });
      toast({
        title: activity.completed ? 'Marked Incomplete' : 'Marked Complete',
        description: `Activity has been marked as ${activity.completed ? 'incomplete' : 'complete'}`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update activity',
        variant: 'destructive',
      });
    }
  };

  // Delete Activity
  const handleDelete = async (activity) => {
    if (!confirm(`Delete "${activity.title}"?`)) return;

    try {
      await deleteActivity.mutateAsync(activity.id);
      toast({
        title: 'Activity Deleted',
        description: 'The activity has been deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete activity',
        variant: 'destructive',
      });
    }
  };

  // Compute stats for the layout
  const completedCount = activities.filter((a) => a.completed).length;
  const pendingCount = activities.filter((a) => !a.completed).length;
  const callsCount = activities.filter((a) => a.type === 'CALL').length;
  const tasksCount = activities.filter((a) => a.type === 'TASK').length;

  const layoutStats = [
    createStat('Total', meta.total, CheckSquare, 'blue'),
    createStat('Pending', pendingCount, Clock, 'amber'),
    createStat('Completed', completedCount, Check, 'green'),
    createStat('Calls', callsCount, Phone, 'purple'),
  ];

  // Action buttons for the top bar
  const actionButtons = (
    <Button size="sm" onClick={handleOpenAdd} className="h-8">
      <Plus className="h-4 w-4 mr-1" />
      Add Activity
    </Button>
  );

  // Loading state
  if (isLoading) {
    return (
      <HubLayout
        hubId="crm"
        title="Activities"
        description="Track calls, meetings, tasks, and notes"
        stats={layoutStats}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search activities..."
        actions={actionButtons}
        showFixedMenu={false}
      >
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </HubLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <HubLayout
        hubId="crm"
        title="Activities"
        description="Track calls, meetings, tasks, and notes"
        stats={layoutStats}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search activities..."
        actions={actionButtons}
        showFixedMenu={false}
      >
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-lg font-medium">Failed to load activities</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </HubLayout>
    );
  }

  // Main content
  const mainContent = (
    <div className="space-y-6 p-6 overflow-y-auto h-full">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Activity Type Filter */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={typeFilter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                setTypeFilter('all');
                setPage(1);
              }}
            >
              All
            </Button>
            {activityTypes.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={typeFilter === value ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => {
                  setTypeFilter(value);
                  setPage(1);
                }}
              >
                <Icon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{label}s</span>
              </Button>
            ))}
          </div>

          {/* More Filters Popover */}
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={priorityFilter !== 'all' ? 'border-primary' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {priorityFilter !== 'all' && (
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                    1
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-4">
                <div className="font-medium">Filter Activities</div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={priorityFilter}
                    onValueChange={(v) => {
                      setPriorityFilter(v);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      {priorityOptions.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPriorityFilter('all');
                      setShowFilters(false);
                    }}
                  >
                    Clear
                  </Button>
                  <Button size="sm" onClick={() => setShowFilters(false)}>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Show/Hide Completed */}
          <Button
            variant={showCompleted ? 'outline' : 'secondary'}
            size="sm"
            onClick={() => {
              setShowCompleted(!showCompleted);
              setPage(1);
            }}
          >
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </Button>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1 ml-auto">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {priorityFilter !== 'all' && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Badge
              variant="outline"
              className="cursor-pointer"
              onClick={() => setPriorityFilter('all')}
            >
              Priority: {priorityFilter} <X className="h-3 w-3 ml-1" />
            </Badge>
          </div>
        )}
      </Card>

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
          <CheckSquare className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No activities found</p>
          <Button onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add your first activity
          </Button>
        </div>
      )}

      {/* Activities List */}
      {activities.length > 0 && viewMode === 'list' && (
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type] || CheckSquare;
            const colorClass = activityColors[activity.type] || 'bg-gray-100 text-gray-700';
            const priorityConfig = priorityOptions.find((p) => p.value === activity.priority);

            return (
              <Card
                key={activity.id}
                className={cn(
                  'p-4 hover:shadow-md transition-shadow cursor-pointer',
                  activity.completed && 'opacity-60'
                )}
                onClick={() => handleOpenView(activity)}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(activity);
                    }}
                    className={cn(
                      'h-12 w-12 rounded-lg flex items-center justify-center transition-colors shrink-0',
                      colorClass
                    )}
                  >
                    {activity.completed ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className={cn(
                              'font-semibold text-base',
                              activity.completed && 'line-through'
                            )}
                          >
                            {activity.title || activity.subject || 'Untitled Activity'}
                          </h3>
                          {activity.priority && priorityConfig && (
                            <Badge
                              variant="outline"
                              className={cn('text-xs', priorityConfig.color)}
                            >
                              <Flag className="h-3 w-3 mr-1" />
                              {priorityConfig.label}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {activity.type?.toLowerCase() || 'task'}
                          </Badge>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                        )}

                        {/* Linked Entities Row */}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {activity.contact && (
                            <Link
                              href={`/crm/contacts/${activity.contact.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <User className="h-3.5 w-3.5" />
                              <span>
                                {activity.contact.displayName ||
                                  `${activity.contact.firstName || ''} ${activity.contact.lastName || ''}`.trim()}
                              </span>
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          )}
                          {activity.company && (
                            <Link
                              href={`/crm/companies/${activity.company.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <Building2 className="h-3.5 w-3.5" />
                              <span>{activity.company.name}</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          )}
                          {activity.deal && (
                            <Link
                              href={`/pipeline/deals/${activity.deal.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <Briefcase className="h-3.5 w-3.5" />
                              <span>{activity.deal.name}</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
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
                              handleOpenView(activity);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(activity);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleComplete(activity);
                            }}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {activity.completed ? 'Mark Incomplete' : 'Mark Complete'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(activity);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Meta Information Row */}
                    <div className="flex items-center gap-4 mt-3 text-sm flex-wrap border-t pt-3">
                      {/* Created/Logged Time */}
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Logged {formatRelativeTime(activity.createdAt)}</span>
                      </div>

                      {/* Call Duration */}
                      {activity.callDuration && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Timer className="h-4 w-4" />
                          <span>Duration: {formatDuration(activity.callDuration)}</span>
                        </div>
                      )}

                      {/* Due Date */}
                      {activity.dueAt && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {formatDate(activity.dueAt)}</span>
                        </div>
                      )}

                      {/* Created By */}
                      {activity.createdBy && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <UserCircle className="h-4 w-4" />
                          <span>by {activity.createdBy.firstName || activity.createdBy.email}</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs ml-auto',
                          activity.completed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        )}
                      >
                        {activity.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Pagination */}
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-muted-foreground">
              Showing {activities.length} of {meta.total} activities
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activities Grid View */}
      {activities.length > 0 && viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type] || CheckSquare;
              const colorClass = activityColors[activity.type] || 'bg-gray-100 text-gray-700';
              const priorityConfig = priorityOptions.find((p) => p.value === activity.priority);

              return (
                <Card
                  key={activity.id}
                  className={cn(
                    'p-4 hover:shadow-md transition-shadow cursor-pointer',
                    activity.completed && 'opacity-60'
                  )}
                  onClick={() => handleOpenView(activity)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(activity);
                      }}
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center transition-colors',
                        colorClass
                      )}
                    >
                      {activity.completed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </button>
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
                            handleOpenView(activity);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(activity);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(activity);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3
                    className={cn(
                      'font-semibold mb-1 line-clamp-2',
                      activity.completed && 'line-through'
                    )}
                  >
                    {activity.title || activity.subject || 'Untitled'}
                  </h3>

                  {activity.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {activity.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {activity.priority && priorityConfig && (
                      <Badge variant="outline" className={cn('text-xs', priorityConfig.color)}>
                        {priorityConfig.label}
                      </Badge>
                    )}
                    <Badge
                      variant={activity.completed ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.completed ? 'Done' : 'Pending'}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    {activity.contact && (
                      <div className="flex items-center gap-1 truncate">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {activity.contact.displayName ||
                            `${activity.contact.firstName || ''} ${activity.contact.lastName || ''}`}
                        </span>
                      </div>
                    )}
                    {activity.company && (
                      <div className="flex items-center gap-1 truncate">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{activity.company.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{formatRelativeTime(activity.createdAt)}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-muted-foreground">
              Showing {activities.length} of {meta.total} activities
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <HubLayout
        hubId="crm"
        title="Activities"
        description="Track calls, meetings, tasks, and notes"
        stats={layoutStats}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search activities..."
        actions={actionButtons}
        showFixedMenu={false}
      >
        {mainContent}
      </HubLayout>

      {/* Add Activity Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>Create a new activity to track your work</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Activity Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map(({ value, label, icon: Icon }) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </span>
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
                    {priorityOptions.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          {p.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Activity title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Activity description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueAt">Due Date</Label>
              <Input
                id="dueAt"
                type="datetime-local"
                value={formData.dueAt}
                onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
              />
            </div>

            {/* Link to entities */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                Link to
              </Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="contactId" className="text-xs">
                    Contact
                  </Label>
                  <Select
                    value={formData.contactId || 'none'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, contactId: value === 'none' ? '' : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No contact</SelectItem>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.displayName ||
                            `${c.firstName || ''} ${c.lastName || ''}`.trim() ||
                            c.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyId" className="text-xs">
                    Company
                  </Label>
                  <Select
                    value={formData.companyId || 'none'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, companyId: value === 'none' ? '' : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No company</SelectItem>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealId" className="text-xs">
                    Deal
                  </Label>
                  <Select
                    value={formData.dealId || 'none'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, dealId: value === 'none' ? '' : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No deal</SelectItem>
                      {deals.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name || d.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Call-specific fields */}
            {formData.type === 'CALL' && (
              <div className="border-t pt-4 space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Call Details</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="callDuration" className="text-xs">
                      Duration (minutes)
                    </Label>
                    <Input
                      id="callDuration"
                      type="number"
                      value={formData.callDuration}
                      onChange={(e) => setFormData({ ...formData, callDuration: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="callOutcome" className="text-xs">
                      Outcome
                    </Label>
                    <Select
                      value={formData.callOutcome || 'none'}
                      onValueChange={(value) =>
                        setFormData({ ...formData, callOutcome: value === 'none' ? '' : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="CONNECTED">Connected</SelectItem>
                        <SelectItem value="NO_ANSWER">No Answer</SelectItem>
                        <SelectItem value="VOICEMAIL">Left Voicemail</SelectItem>
                        <SelectItem value="BUSY">Busy</SelectItem>
                        <SelectItem value="WRONG_NUMBER">Wrong Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting-specific fields */}
            {formData.type === 'MEETING' && (
              <div className="border-t pt-4 space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Meeting Details</Label>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="meetingLocation" className="text-xs">
                      Location
                    </Label>
                    <Input
                      id="meetingLocation"
                      value={formData.meetingLocation}
                      onChange={(e) =>
                        setFormData({ ...formData, meetingLocation: e.target.value })
                      }
                      placeholder="Office, Conference Room, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meetingUrl" className="text-xs">
                      Meeting URL
                    </Label>
                    <Input
                      id="meetingUrl"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createActivity.isPending}>
              {createActivity.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Activity Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>Update activity information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editType">Activity Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map(({ value, label, icon: Icon }) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPriority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          {p.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTitle">Title *</Label>
              <Input
                id="editTitle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDueAt">Due Date</Label>
              <Input
                id="editDueAt"
                type="datetime-local"
                value={formData.dueAt}
                onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
              />
            </div>

            {/* Link to entities */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                Link to
              </Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="editContactId" className="text-xs">
                    Contact
                  </Label>
                  <Select
                    value={formData.contactId || 'none'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, contactId: value === 'none' ? '' : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No contact</SelectItem>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.displayName ||
                            `${c.firstName || ''} ${c.lastName || ''}`.trim() ||
                            c.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCompanyId" className="text-xs">
                    Company
                  </Label>
                  <Select
                    value={formData.companyId || 'none'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, companyId: value === 'none' ? '' : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No company</SelectItem>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDealId" className="text-xs">
                    Deal
                  </Label>
                  <Select
                    value={formData.dealId || 'none'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, dealId: value === 'none' ? '' : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No deal</SelectItem>
                      {deals.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name || d.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Call-specific fields */}
            {formData.type === 'CALL' && (
              <div className="border-t pt-4 space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Call Details</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="editCallDuration" className="text-xs">
                      Duration (minutes)
                    </Label>
                    <Input
                      id="editCallDuration"
                      type="number"
                      value={formData.callDuration}
                      onChange={(e) => setFormData({ ...formData, callDuration: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCallOutcome" className="text-xs">
                      Outcome
                    </Label>
                    <Select
                      value={formData.callOutcome || 'none'}
                      onValueChange={(value) =>
                        setFormData({ ...formData, callOutcome: value === 'none' ? '' : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="CONNECTED">Connected</SelectItem>
                        <SelectItem value="NO_ANSWER">No Answer</SelectItem>
                        <SelectItem value="VOICEMAIL">Left Voicemail</SelectItem>
                        <SelectItem value="BUSY">Busy</SelectItem>
                        <SelectItem value="WRONG_NUMBER">Wrong Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting-specific fields */}
            {formData.type === 'MEETING' && (
              <div className="border-t pt-4 space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Meeting Details</Label>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="editMeetingLocation" className="text-xs">
                      Location
                    </Label>
                    <Input
                      id="editMeetingLocation"
                      value={formData.meetingLocation}
                      onChange={(e) =>
                        setFormData({ ...formData, meetingLocation: e.target.value })
                      }
                      placeholder="Office, Conference Room, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editMeetingUrl" className="text-xs">
                      Meeting URL
                    </Label>
                    <Input
                      id="editMeetingUrl"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateActivity.isPending}>
              {updateActivity.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Activity Sheet */}
      <Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Activity Details</SheetTitle>
            <SheetDescription>View and manage activity information</SheetDescription>
          </SheetHeader>
          {currentActivity && (
            <div className="mt-6 space-y-6">
              {/* Activity Header */}
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'h-16 w-16 rounded-lg flex items-center justify-center',
                    activityColors[currentActivity.type] || 'bg-gray-100 text-gray-700'
                  )}
                >
                  {(() => {
                    const Icon = activityIcons[currentActivity.type] || CheckSquare;
                    return currentActivity.completed ? (
                      <Check className="h-8 w-8" />
                    ) : (
                      <Icon className="h-8 w-8" />
                    );
                  })()}
                </div>
                <div>
                  <h3
                    className={cn(
                      'text-lg font-semibold',
                      currentActivity.completed && 'line-through'
                    )}
                  >
                    {currentActivity.title}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {currentActivity.type?.toLowerCase() || 'Task'}
                  </p>
                </div>
              </div>

              {/* Activity Info */}
              <div className="space-y-4">
                {currentActivity.description && (
                  <div className="py-2 border-b">
                    <span className="text-sm text-muted-foreground">Description</span>
                    <p className="text-sm mt-1">{currentActivity.description}</p>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs',
                      currentActivity.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    )}
                  >
                    {currentActivity.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                {currentActivity.dueAt && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Due Date</span>
                    <span className="text-sm">{formatDate(currentActivity.dueAt)}</span>
                  </div>
                )}
                {currentActivity.contact && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Contact</span>
                    <span className="text-sm">
                      {currentActivity.contact.displayName ||
                        `${currentActivity.contact.firstName} ${currentActivity.contact.lastName}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {currentActivity.createdAt
                      ? new Date(currentActivity.createdAt).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowViewSheet(false);
                    handleOpenEdit(currentActivity);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant={currentActivity.completed ? 'secondary' : 'default'}
                  className="flex-1"
                  onClick={() => {
                    handleToggleComplete(currentActivity);
                    setShowViewSheet(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {currentActivity.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
