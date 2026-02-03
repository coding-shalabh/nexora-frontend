'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Filter,
  Plus,
  MoreHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  DollarSign,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Trophy,
  X,
  Building2,
  TrendingUp,
  Target,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  useDeals,
  usePipelines,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
  useMoveDeal,
  useWinDeal,
  useLoseDeal,
} from '@/hooks/use-deals';
import { useToast } from '@/hooks/use-toast';
import { useCustomFields } from '@/hooks/use-custom-fields';
import { CustomFieldGroup } from '@/components/crm/custom-field-renderer';
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

// Default stages if pipeline not loaded
const defaultStages = [
  { id: 'qualification', name: 'Qualification', color: '#3B82F6', probability: 10 },
  { id: 'discovery', name: 'Discovery', color: '#8B5CF6', probability: 25 },
  { id: 'proposal', name: 'Proposal', color: '#F59E0B', probability: 50 },
  { id: 'negotiation', name: 'Negotiation', color: '#EF4444', probability: 75 },
  { id: 'closed', name: 'Closed Won', color: '#22C55E', probability: 100 },
];

const emptyDeal = {
  title: '',
  value: '',
  stageId: '',
  expectedCloseDate: '',
  probability: '',
  description: '',
  contactId: '',
  companyId: '',
  customFields: {},
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount || 0);
}

export default function DealsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('kanban');
  const [page, setPage] = useState(1);
  const limit = 50;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewSheet, setShowViewSheet] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [formData, setFormData] = useState(emptyDeal);
  const [loseReason, setLoseReason] = useState('');

  const { toast } = useToast();

  // Fetch pipelines and deals from API
  const { data: pipelineData } = usePipelines('DEAL');
  const { data, isLoading, error, refetch } = useDeals({
    page,
    limit,
    search: searchQuery || undefined,
  });

  // Mutations
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();
  const deleteDeal = useDeleteDeal();
  const moveDeal = useMoveDeal();
  const winDeal = useWinDeal();
  const loseDeal = useLoseDeal();

  // Fetch custom fields for deals
  const { data: customFieldsData } = useCustomFields('DEAL');
  const customFields = customFieldsData?.data || [];

  const handleCustomFieldsChange = (values) => {
    setFormData({ ...formData, customFields: values });
  };

  const deals = data?.data || [];
  const pipelines = pipelineData?.data || [];
  const currentPipeline = pipelines[0];
  const stages = currentPipeline?.stages || defaultStages;

  // Calculate stats - ensure values are converted to numbers
  const totalValue = deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const weightedValue = deals.reduce(
    (sum, d) => sum + (Number(d.value) || 0) * ((Number(d.probability) || 0) / 100),
    0
  );
  const openDeals = deals.filter((d) => d.status === 'OPEN').length;
  const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0;

  // Layout stats for HubLayout
  const layoutStats = useMemo(
    () => [
      createStat('Pipeline', formatCurrency(totalValue), DollarSign, 'blue'),
      createStat('Weighted', formatCurrency(weightedValue), TrendingUp, 'green'),
      createStat('Open Deals', openDeals, Target, 'purple'),
      createStat('Avg. Size', formatCurrency(avgDealSize), DollarSign, 'orange'),
    ],
    [totalValue, weightedValue, openDeals, avgDealSize]
  );

  const getDealsForStage = (stageId) => deals.filter((d) => d.stageId === stageId);
  const getStageValue = (stageId) =>
    getDealsForStage(stageId).reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // Open Add Modal
  const handleOpenAdd = (stageId = '') => {
    setFormData({ ...emptyDeal, stageId: stageId || stages[0]?.id || '' });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (deal) => {
    setCurrentDeal(deal);
    setFormData({
      title: deal.title || '',
      value: deal.value?.toString() || '',
      stageId: deal.stageId || '',
      expectedCloseDate: deal.expectedCloseDate
        ? new Date(deal.expectedCloseDate).toISOString().slice(0, 10)
        : '',
      probability: deal.probability?.toString() || '',
      description: deal.description || '',
      contactId: deal.contactId || '',
      companyId: deal.companyId || '',
      customFields: deal.customFields || {},
    });
    setShowEditModal(true);
  };

  // Navigate to deal detail page
  const handleOpenView = (deal) => {
    router.push(`/pipeline/deals/${deal.id}`);
  };

  // Create Deal
  const handleCreate = async () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Deal title is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const dealData = {
        title: formData.title,
        stageId: formData.stageId,
        pipelineId: currentPipeline?.id,
        value: formData.value ? parseFloat(formData.value) : null,
        probability: formData.probability ? parseInt(formData.probability) : null,
        expectedCloseDate: formData.expectedCloseDate
          ? new Date(formData.expectedCloseDate).toISOString()
          : null,
        description: formData.description || null,
      };
      // Only include optional IDs if they have values
      if (formData.contactId) dealData.contactId = formData.contactId;
      if (formData.companyId) dealData.companyId = formData.companyId;
      if (Object.keys(formData.customFields || {}).length > 0) {
        dealData.customFields = formData.customFields;
      }
      await createDeal.mutateAsync(dealData);
      setShowAddModal(false);
      setFormData(emptyDeal);
      toast({
        title: 'Deal Created',
        description: 'The deal has been created successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create deal',
        variant: 'destructive',
      });
    }
  };

  // Update Deal
  const handleUpdate = async () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Deal title is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateDeal.mutateAsync({
        id: currentDeal.id,
        data: {
          ...formData,
          value: formData.value ? parseFloat(formData.value) : null,
          probability: formData.probability ? parseInt(formData.probability) : null,
          expectedCloseDate: formData.expectedCloseDate
            ? new Date(formData.expectedCloseDate).toISOString()
            : null,
        },
      });
      setShowEditModal(false);
      setCurrentDeal(null);
      toast({
        title: 'Deal Updated',
        description: 'The deal has been updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update deal',
        variant: 'destructive',
      });
    }
  };

  // Move Deal to different stage
  const handleMoveDeal = async (dealId, newStageId) => {
    try {
      await moveDeal.mutateAsync({ id: dealId, stageId: newStageId });
      toast({
        title: 'Deal Moved',
        description: 'The deal has been moved to a new stage',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to move deal',
        variant: 'destructive',
      });
    }
  };

  // Win Deal
  const handleWin = async () => {
    try {
      await winDeal.mutateAsync(currentDeal.id);
      setShowWinModal(false);
      setCurrentDeal(null);
      toast({
        title: 'Deal Won!',
        description: 'Congratulations on closing this deal!',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to mark deal as won',
        variant: 'destructive',
      });
    }
  };

  // Lose Deal
  const handleLose = async () => {
    try {
      await loseDeal.mutateAsync({ id: currentDeal.id, reason: loseReason });
      setShowLoseModal(false);
      setCurrentDeal(null);
      setLoseReason('');
      toast({
        title: 'Deal Closed',
        description: 'The deal has been marked as lost',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to mark deal as lost',
        variant: 'destructive',
      });
    }
  };

  // Delete Deal
  const handleDelete = async (deal) => {
    if (!confirm(`Delete "${deal.title}"?`)) return;

    try {
      await deleteDeal.mutateAsync(deal.id);
      toast({
        title: 'Deal Deleted',
        description: 'The deal has been deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete deal',
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
        <p className="text-lg font-medium">Failed to load deals</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Action buttons for HubLayout
  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Filters
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>
      <div className="flex items-center border rounded-lg">
        <Button
          variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('kanban')}
        >
          <LayoutGrid className="h-4 w-4 mr-1" />
          Board
        </Button>
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4 mr-1" />
          List
        </Button>
      </div>
      <Button size="sm" onClick={() => handleOpenAdd()}>
        <Plus className="h-4 w-4 mr-2" />
        Add Deal
      </Button>
    </div>
  );

  // Main content
  const mainContent = (
    <div className="p-6 overflow-y-auto h-full">
      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageDeals = getDealsForStage(stage.id);
            const stageValue = getStageValue(stage.id);

            return (
              <div key={stage.id} className="flex-shrink-0 w-80">
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <h3 className="font-semibold">{stage.name}</h3>
                      <span className="text-sm text-muted-foreground">({stageDeals.length})</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(stageValue)}</span>
                  </div>
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: stage.color,
                        width: `${stage.probability || 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <Card
                      key={deal.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleOpenView(deal)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{deal.title}</h4>
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
                                handleOpenView(deal);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(deal);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentDeal(deal);
                                setShowWinModal(true);
                              }}
                            >
                              <Trophy className="h-4 w-4 mr-2 text-green-600" />
                              Mark as Won
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentDeal(deal);
                                setShowLoseModal(true);
                              }}
                            >
                              <X className="h-4 w-4 mr-2 text-red-600" />
                              Mark as Lost
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(deal);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {deal.company && (
                        <p className="text-sm text-muted-foreground mb-3">{deal.company.name}</p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 font-medium text-primary">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(deal.value)}
                        </span>
                        {deal.expectedCloseDate && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      {deal.contact && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {deal.contact.displayName ||
                              `${deal.contact.firstName} ${deal.contact.lastName}`}
                          </span>
                        </div>
                      )}
                    </Card>
                  ))}

                  <Button
                    variant="ghost"
                    className="w-full border-2 border-dashed"
                    onClick={() => handleOpenAdd(stage.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deal
                  </Button>
                </div>
              </div>
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
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Deal</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Stage</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Value</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Probability
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Close Date
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Contact
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => {
                  const stage = stages.find((s) => s.id === deal.stageId);
                  return (
                    <tr
                      key={deal.id}
                      className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleOpenView(deal)}
                    >
                      <td className="p-4">
                        <div>
                          <span className="font-medium">{deal.title}</span>
                          {deal.company && (
                            <div className="text-sm text-muted-foreground">{deal.company.name}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: `${stage?.color || '#gray'}20`,
                            color: stage?.color || '#gray',
                          }}
                        >
                          {stage?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{formatCurrency(deal.value)}</td>
                      <td className="p-4">{deal.probability || 0}%</td>
                      <td className="p-4">
                        {deal.expectedCloseDate
                          ? new Date(deal.expectedCloseDate).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="p-4">
                        {deal.contact
                          ? deal.contact.displayName ||
                            `${deal.contact.firstName} ${deal.contact.lastName}`
                          : '-'}
                      </td>
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
                                handleOpenView(deal);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(deal);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentDeal(deal);
                                setShowWinModal(true);
                              }}
                            >
                              <Trophy className="h-4 w-4 mr-2 text-green-600" />
                              Mark as Won
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentDeal(deal);
                                setShowLoseModal(true);
                              }}
                            >
                              <X className="h-4 w-4 mr-2 text-red-600" />
                              Mark as Lost
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(deal);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <>
      <HubLayout
        hubId="pipeline"
        title="Deals"
        description="Track and manage your sales pipeline"
        stats={layoutStats}
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        searchPlaceholder="Search deals..."
        actions={actionButtons}
        showFixedMenu={false}
      >
        {mainContent}
      </HubLayout>

      {/* Add Deal Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
            <DialogDescription>Create a new deal in your sales pipeline</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Acme Enterprise Deal"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Deal Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  placeholder="50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stageId">Stage</Label>
                <Select
                  value={formData.stageId}
                  onValueChange={(value) => setFormData({ ...formData, stageId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deal description..."
                rows={3}
              />
            </div>
            {/* Custom Fields */}
            {customFields.length > 0 && (
              <div className="border-t pt-4">
                <Label className="text-sm font-medium mb-3 block">Custom Fields</Label>
                <CustomFieldGroup
                  fields={customFields}
                  values={formData.customFields}
                  onChange={handleCustomFieldsChange}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createDeal.isPending}>
              {createDeal.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Deal Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogDescription>Update deal information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle">Deal Title *</Label>
              <Input
                id="editTitle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editValue">Deal Value ($)</Label>
                <Input
                  id="editValue"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editProbability">Probability (%)</Label>
                <Input
                  id="editProbability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editStageId">Stage</Label>
                <Select
                  value={formData.stageId}
                  onValueChange={(value) => setFormData({ ...formData, stageId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editExpectedCloseDate">Expected Close Date</Label>
                <Input
                  id="editExpectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                />
              </div>
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
            {/* Custom Fields */}
            {customFields.length > 0 && (
              <div className="border-t pt-4">
                <Label className="text-sm font-medium mb-3 block">Custom Fields</Label>
                <CustomFieldGroup
                  fields={customFields}
                  values={formData.customFields}
                  onChange={handleCustomFieldsChange}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateDeal.isPending}>
              {updateDeal.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Win Deal Modal */}
      <Dialog open={showWinModal} onOpenChange={setShowWinModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Deal as Won</DialogTitle>
            <DialogDescription>Congratulations! You're about to close this deal.</DialogDescription>
          </DialogHeader>
          {currentDeal && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Mark <strong>{currentDeal.title}</strong> ({formatCurrency(currentDeal.value)}) as
                won?
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWinModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleWin}
              disabled={winDeal.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {winDeal.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Trophy className="h-4 w-4 mr-2" />
              Mark as Won
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lose Deal Modal */}
      <Dialog open={showLoseModal} onOpenChange={setShowLoseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Deal as Lost</DialogTitle>
            <DialogDescription>
              Record why this deal was lost for future reference.
            </DialogDescription>
          </DialogHeader>
          {currentDeal && (
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Mark <strong>{currentDeal.title}</strong> as lost?
              </p>
              <div className="space-y-2">
                <Label htmlFor="loseReason">Reason (optional)</Label>
                <Textarea
                  id="loseReason"
                  value={loseReason}
                  onChange={(e) => setLoseReason(e.target.value)}
                  placeholder="e.g., Lost to competitor, Budget constraints..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoseModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleLose} disabled={loseDeal.isPending} variant="destructive">
              {loseDeal.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Mark as Lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Deal Sheet */}
      <Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Deal Details</SheetTitle>
            <SheetDescription>View and manage deal information</SheetDescription>
          </SheetHeader>
          {currentDeal && (
            <div className="mt-6 space-y-6">
              {/* Deal Header */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{currentDeal.title}</h3>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(currentDeal.value)}
                  </p>
                </div>
              </div>

              {/* Deal Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Stage</span>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${stages.find((s) => s.id === currentDeal.stageId)?.color || '#gray'}20`,
                      color: stages.find((s) => s.id === currentDeal.stageId)?.color || '#gray',
                    }}
                  >
                    {stages.find((s) => s.id === currentDeal.stageId)?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Probability</span>
                  <span className="text-sm">{currentDeal.probability || 0}%</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Expected Close</span>
                  <span className="text-sm">
                    {currentDeal.expectedCloseDate
                      ? new Date(currentDeal.expectedCloseDate).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
                {currentDeal.company && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Company</span>
                    <span className="text-sm flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {currentDeal.company.name}
                    </span>
                  </div>
                )}
                {currentDeal.contact && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Contact</span>
                    <span className="text-sm flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {currentDeal.contact.displayName ||
                        `${currentDeal.contact.firstName} ${currentDeal.contact.lastName}`}
                    </span>
                  </div>
                )}
                {currentDeal.description && (
                  <div className="py-2 border-b">
                    <span className="text-sm text-muted-foreground">Description</span>
                    <p className="text-sm mt-1">{currentDeal.description}</p>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {currentDeal.createdAt
                      ? new Date(currentDeal.createdAt).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowViewSheet(false);
                      handleOpenEdit(currentDeal);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setShowViewSheet(false);
                      setShowWinModal(true);
                    }}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Won
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setShowViewSheet(false);
                      setShowLoseModal(true);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Lost
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
