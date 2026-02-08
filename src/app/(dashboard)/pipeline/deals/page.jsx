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
  Search,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';
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

// Deal List Item Component
function DealListItem({ deal, isSelected, onClick, stages }) {
  const stage = stages.find((s) => s.id === deal.stageId);

  return (
    <Card
      className={cn(
        'p-4 mb-2 mx-2 hover:shadow-md transition-shadow cursor-pointer',
        isSelected && 'ring-2 ring-primary/20 bg-primary/5'
      )}
      onClick={onClick}
      style={{ width: 'calc(100% - 16px)' }}
    >
      <div className="flex items-start gap-4">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${stage?.color || '#gray'}20` }}
        >
          <DollarSign className="h-5 w-5" style={{ color: stage?.color || '#gray' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-sm truncate">{deal.title}</h3>
            <span className="text-sm font-semibold text-primary shrink-0">
              {formatCurrency(deal.value)}
            </span>
          </div>
          {deal.company && (
            <p className="text-xs text-muted-foreground mb-2 truncate">{deal.company.name}</p>
          )}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            {stage && (
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${stage.color}20`,
                  color: stage.color,
                }}
              >
                {stage.name}
              </span>
            )}
            {deal.expectedCloseDate && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            {deal.contact && (
              <span className="flex items-center gap-1 text-muted-foreground truncate">
                <User className="h-3 w-3" />
                {deal.contact.displayName || `${deal.contact.firstName} ${deal.contact.lastName}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function DealsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 50;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
    status: statusFilter !== 'all' ? statusFilter : undefined,
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

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'create', label: 'Add Deal', icon: Plus, variant: 'default' }],
    secondaryActions: [
      {
        id: 'view-kanban',
        label: 'Board',
        icon: LayoutGrid,
        variant: viewMode === 'kanban' ? 'secondary' : 'ghost',
      },
      {
        id: 'view-list',
        label: 'List',
        icon: List,
        variant: viewMode === 'list' ? 'secondary' : 'ghost',
      },
    ],
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'OPEN', label: 'Open' },
        { id: 'WON', label: 'Won' },
        { id: 'LOST', label: 'Lost' },
      ],
    },
  };

  // Handle FixedMenuPanel actions
  const handleMenuAction = (actionId) => {
    switch (actionId) {
      case 'create':
        handleOpenAdd();
        break;
      case 'view-kanban':
        setViewMode('kanban');
        break;
      case 'view-list':
        setViewMode('list');
        break;
      default:
        break;
    }
  };

  // Fixed menu list (deals list)
  const fixedMenuListContent = (
    <div className="py-2">
      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      {/* Deals List */}
      {deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-medium mb-1">No deals found</p>
          <p className="text-xs text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Add your first deal'}
          </p>
          {!searchQuery && (
            <Button size="sm" onClick={() => handleOpenAdd()}>
              <Plus className="h-4 w-4 mr-1" /> Add Deal
            </Button>
          )}
        </div>
      ) : (
        deals.map((deal) => (
          <DealListItem
            key={deal.id}
            deal={deal}
            isSelected={selectedDeal?.id === deal.id}
            onClick={() => setSelectedDeal(deal)}
            stages={stages}
          />
        ))
      )}
    </div>
  );

  // Content area - Kanban or Deal Detail
  const contentArea = (
    <div className="p-6 overflow-y-auto h-full">
      {viewMode === 'kanban' ? (
        /* Kanban View */
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
      ) : selectedDeal ? (
        /* Deal Detail View */
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">{selectedDeal.title}</h2>
              {selectedDeal.company && (
                <p className="text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {selectedDeal.company.name}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(selectedDeal.value)}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedDeal.probability || 0}% probability
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Stage</Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      stages.find((s) => s.id === selectedDeal.stageId)?.color || '#gray',
                  }}
                />
                <span className="font-medium">
                  {stages.find((s) => s.id === selectedDeal.stageId)?.name || 'Unknown'}
                </span>
              </div>
            </Card>

            {selectedDeal.expectedCloseDate && (
              <Card className="p-4">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Expected Close Date
                </Label>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedDeal.expectedCloseDate).toLocaleDateString()}
                </p>
              </Card>
            )}

            {selectedDeal.contact && (
              <Card className="p-4">
                <Label className="text-sm text-muted-foreground mb-2 block">Contact</Label>
                <p className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {selectedDeal.contact.displayName ||
                    `${selectedDeal.contact.firstName} ${selectedDeal.contact.lastName}`}
                </p>
              </Card>
            )}

            <Card className="p-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Created</Label>
              <p className="font-medium">
                {selectedDeal.createdAt
                  ? new Date(selectedDeal.createdAt).toLocaleDateString()
                  : '-'}
              </p>
            </Card>
          </div>

          {selectedDeal.description && (
            <Card className="p-4 mb-6">
              <Label className="text-sm text-muted-foreground mb-2 block">Description</Label>
              <p className="text-sm whitespace-pre-wrap">{selectedDeal.description}</p>
            </Card>
          )}

          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => handleOpenEdit(selectedDeal)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Deal
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-green-600 hover:text-green-700"
              onClick={() => {
                setCurrentDeal(selectedDeal);
                setShowWinModal(true);
              }}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Mark as Won
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700"
              onClick={() => {
                setCurrentDeal(selectedDeal);
                setShowLoseModal(true);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Mark as Lost
            </Button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No deal selected</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a deal from the list to view details
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <HubLayout
        hubId="crm"
        title="Deals"
        description="Track and manage your sales pipeline"
        stats={layoutStats}
        showFixedMenu={true}
        fixedMenuFilters={
          <FixedMenuPanel
            config={fixedMenuConfig}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
            onAction={handleMenuAction}
            className="p-4"
          />
        }
        fixedMenuList={fixedMenuListContent}
      >
        {contentArea}
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
    </>
  );
}
