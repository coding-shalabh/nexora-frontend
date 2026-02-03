'use client';

import { useState, useDeferredValue, useMemo } from 'react';
import {
  Plus,
  MoreHorizontal,
  Users,
  Filter,
  PlayCircle,
  PauseCircle,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  ChevronDown,
  LayoutGrid,
  LayoutList,
  Zap,
  Archive,
  CheckCircle,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  useSegments,
  useCreateSegment,
  useUpdateSegment,
  useDeleteSegment,
  useRefreshSegment,
} from '@/hooks/use-segments';
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

const segmentFields = [
  { value: 'email', label: 'Email' },
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'lifecycleStage', label: 'Lifecycle Stage' },
  { value: 'leadStatus', label: 'Lead Status' },
  { value: 'source', label: 'Source' },
  { value: 'industry', label: 'Industry' },
  { value: 'city', label: 'City' },
  { value: 'country', label: 'Country' },
  { value: 'leadScore', label: 'Lead Score' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'lastActivityAt', label: 'Last Activity' },
];

const operators = [
  { value: 'eq', label: 'equals' },
  { value: 'ne', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'startsWith', label: 'starts with' },
  { value: 'endsWith', label: 'ends with' },
  { value: 'gt', label: 'greater than' },
  { value: 'gte', label: 'greater than or equal' },
  { value: 'lt', label: 'less than' },
  { value: 'lte', label: 'less than or equal' },
  { value: 'in', label: 'is one of' },
  { value: 'isNull', label: 'is empty' },
  { value: 'isNotNull', label: 'is not empty' },
];

const emptySegment = {
  name: '',
  description: '',
  type: 'DYNAMIC',
  conditions: [{ field: 'lifecycleStage', operator: 'eq', value: '' }],
  isActive: true,
};

const emptyCondition = { field: 'email', operator: 'contains', value: '' };

export default function SegmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [formData, setFormData] = useState(emptySegment);

  const { toast } = useToast();

  // Fetch segments from API
  const { data, isLoading, error, refetch } = useSegments({
    page,
    limit,
    search: deferredSearch || undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
  });

  // Mutations
  const createSegment = useCreateSegment();
  const updateSegment = useUpdateSegment();
  const deleteSegment = useDeleteSegment();
  const refreshSegment = useRefreshSegment();

  const segments = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1 };

  // Calculate stats
  const stats = useMemo(() => {
    const dynamicCount = segments.filter((s) => s.type === 'DYNAMIC').length;
    const staticCount = segments.filter((s) => s.type === 'STATIC').length;
    const activeCount = segments.filter((s) => s.isActive).length;
    return { dynamic: dynamicCount, static: staticCount, active: activeCount };
  }, [segments]);

  // Layout stats for HubLayout
  const layoutStats = [
    createStat('Total', meta.total, Users, 'blue'),
    createStat('Dynamic', stats.dynamic, Zap, 'purple'),
    createStat('Static', stats.static, Archive, 'amber'),
    createStat('Active', stats.active, CheckCircle, 'green'),
  ];

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData(emptySegment);
    setShowAddModal(true);
  };

  // Action buttons for HubLayout - must be after handleOpenAdd is defined
  const actionButtons = (
    <Button onClick={handleOpenAdd} size="sm" className="gap-2">
      <Plus className="h-4 w-4" />
    </Button>
  );

  // Open Edit Modal
  const handleOpenEdit = (segment) => {
    setCurrentSegment(segment);
    setFormData({
      name: segment.name || '',
      description: segment.description || '',
      type: segment.type || 'DYNAMIC',
      conditions: segment.conditions?.length > 0 ? segment.conditions : [emptyCondition],
      isActive: segment.isActive ?? true,
    });
    setShowEditModal(true);
  };

  // Add condition
  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { ...emptyCondition }],
    });
  };

  // Remove condition
  const removeCondition = (index) => {
    if (formData.conditions.length > 1) {
      setFormData({
        ...formData,
        conditions: formData.conditions.filter((_, i) => i !== index),
      });
    }
  };

  // Update condition
  const updateCondition = (index, field, value) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({ ...formData, conditions: newConditions });
  };

  // Create Segment
  const handleCreate = async () => {
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Segment name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createSegment.mutateAsync(formData);
      setShowAddModal(false);
      setFormData(emptySegment);
      toast({
        title: 'Segment Created',
        description: 'The segment has been created successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create segment',
        variant: 'destructive',
      });
    }
  };

  // Update Segment
  const handleUpdate = async () => {
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Segment name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateSegment.mutateAsync({
        id: currentSegment.id,
        data: formData,
      });
      setShowEditModal(false);
      setCurrentSegment(null);
      toast({
        title: 'Segment Updated',
        description: 'The segment has been updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update segment',
        variant: 'destructive',
      });
    }
  };

  // Toggle Active
  const handleToggleActive = async (segment) => {
    try {
      await updateSegment.mutateAsync({
        id: segment.id,
        data: { isActive: !segment.isActive },
      });
      toast({
        title: segment.isActive ? 'Segment Paused' : 'Segment Activated',
        description: `The segment has been ${segment.isActive ? 'paused' : 'activated'}`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update segment',
        variant: 'destructive',
      });
    }
  };

  // Delete Segment
  const handleDelete = async (segment) => {
    if (!confirm(`Delete segment "${segment.name}"? This cannot be undone.`)) return;

    try {
      await deleteSegment.mutateAsync(segment.id);
      toast({
        title: 'Segment Deleted',
        description: 'The segment has been deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete segment',
        variant: 'destructive',
      });
    }
  };

  // Refresh Segment
  const handleRefresh = async (segment) => {
    try {
      await refreshSegment.mutateAsync(segment.id);
      toast({
        title: 'Segment Refreshed',
        description: 'Contact count has been recalculated',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to refresh segment',
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">Failed to load segments</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Render Conditions Form
  const renderConditionsForm = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Conditions</Label>
        <Button type="button" variant="outline" size="sm" onClick={addCondition}>
          <Plus className="h-4 w-4 mr-1" />
          Add Condition
        </Button>
      </div>
      {formData.conditions.map((condition, index) => (
        <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
          <Select value={condition.field} onValueChange={(v) => updateCondition(index, 'field', v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Field" />
            </SelectTrigger>
            <SelectContent>
              {segmentFields.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={condition.operator}
            onValueChange={(v) => updateCondition(index, 'operator', v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!['isNull', 'isNotNull'].includes(condition.operator) && (
            <Input
              value={condition.value}
              onChange={(e) => updateCondition(index, 'value', e.target.value)}
              placeholder="Value"
              className="flex-1"
            />
          )}
          {formData.conditions.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeCondition(index)}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  // Main content for HubLayout
  const mainContent = (
    <div className="space-y-6 p-6 overflow-y-auto h-full">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
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
            <Button
              variant={typeFilter === 'DYNAMIC' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                setTypeFilter('DYNAMIC');
                setPage(1);
              }}
            >
              Dynamic
            </Button>
            <Button
              variant={typeFilter === 'STATIC' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                setTypeFilter('STATIC');
                setPage(1);
              }}
            >
              Static
            </Button>
          </div>
          <div className="flex items-center border rounded-lg p-1 ml-auto">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {segments.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
          <Users className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No segments found</p>
          <Button onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Create your first segment
          </Button>
        </div>
      )}

      {/* Segments Grid */}
      {segments.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map((segment) => (
            <Card key={segment.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-lg flex items-center justify-center',
                      segment.isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{segment.name}</h3>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs',
                        segment.type === 'DYNAMIC'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {segment.type?.toLowerCase() || 'dynamic'}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenEdit(segment)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleActive(segment)}>
                      {segment.isActive ? (
                        <>
                          <PauseCircle className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    {segment.type === 'DYNAMIC' && (
                      <DropdownMenuItem onClick={() => handleRefresh(segment)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Count
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(segment)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {segment.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {segment.description}
                </p>
              )}

              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {segment.conditions?.length || 0} condition
                  {(segment.conditions?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {(segment.contactCount || 0).toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">contacts</span>
                </div>
                <Badge variant={segment.isActive ? 'default' : 'secondary'}>
                  {segment.isActive ? 'Active' : 'Paused'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Segments List */}
      {segments.length > 0 && viewMode === 'list' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Conditions
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Contacts
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {segments.map((segment) => (
                  <tr key={segment.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <span className="font-medium">{segment.name}</span>
                        {segment.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {segment.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          segment.type === 'DYNAMIC'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        )}
                      >
                        {segment.type?.toLowerCase() || 'dynamic'}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {segment.conditions?.length || 0} condition
                      {(segment.conditions?.length || 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {(segment.contactCount || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Badge variant={segment.isActive ? 'default' : 'secondary'}>
                        {segment.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(segment)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(segment)}>
                            {segment.isActive ? (
                              <>
                                <PauseCircle className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(segment)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
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

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">
              Showing {segments.length} of {meta.total} segments
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
        </Card>
      )}
    </div>
  );

  return (
    <>
      <HubLayout
        hubId="crm"
        title="Segments"
        description="Create and manage contact segments"
        stats={layoutStats}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search segments..."
        actions={actionButtons}
        showFixedMenu={false}
      >
        {mainContent}
      </HubLayout>

      {/* Add Segment Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Segment</DialogTitle>
            <DialogDescription>
              Define a segment to group contacts based on conditions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Segment Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., VIP Customers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DYNAMIC">Dynamic (auto-updates)</SelectItem>
                    <SelectItem value="STATIC">Static (manual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this segment represents..."
                rows={2}
              />
            </div>

            {formData.type === 'DYNAMIC' && renderConditionsForm()}

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createSegment.isPending}>
              {createSegment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Segment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Segment Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Segment</DialogTitle>
            <DialogDescription>Update segment settings and conditions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Segment Name *</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editType">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DYNAMIC">Dynamic (auto-updates)</SelectItem>
                    <SelectItem value="STATIC">Static (manual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            {formData.type === 'DYNAMIC' && renderConditionsForm()}

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateSegment.isPending}>
              {updateSegment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
