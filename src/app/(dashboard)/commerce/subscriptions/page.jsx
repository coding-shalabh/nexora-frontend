'use client';

import { useState, useMemo, useDeferredValue, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  Repeat,
  Calendar,
  CreditCard,
  TrendingUp,
  Users,
  Bell,
  Edit,
  Trash2,
  X,
  ChevronRight,
  CheckSquare,
  Square,
  MinusSquare,
  FileDown,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Pause,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

// Mock data
const mockSubscriptions = [
  {
    id: 1,
    customerName: 'Acme Corp',
    planName: 'Premium CRM License',
    status: 'active',
    billingCycle: 'monthly',
    amount: 99.99,
    nextBillingDate: '2026-03-05',
    startDate: '2025-09-05',
    paymentMethod: 'Credit Card',
    mrr: 99.99,
  },
  {
    id: 2,
    customerName: 'TechStart Inc',
    planName: 'Enterprise Support Package',
    status: 'active',
    billingCycle: 'yearly',
    amount: 499.99,
    nextBillingDate: '2026-08-15',
    startDate: '2025-08-15',
    paymentMethod: 'Invoice',
    mrr: 41.67,
  },
  {
    id: 3,
    customerName: 'Global Solutions',
    planName: 'API Access - 10K Calls/Month',
    status: 'trial',
    billingCycle: 'monthly',
    amount: 29.99,
    nextBillingDate: '2026-02-20',
    startDate: '2026-02-05',
    paymentMethod: 'Credit Card',
    mrr: 0,
  },
  {
    id: 4,
    customerName: 'Innovation Labs',
    planName: 'Premium CRM License',
    status: 'past_due',
    billingCycle: 'monthly',
    amount: 99.99,
    nextBillingDate: '2026-02-01',
    startDate: '2024-06-10',
    paymentMethod: 'Credit Card',
    mrr: 99.99,
  },
  {
    id: 5,
    customerName: 'Digital Ventures',
    planName: 'Enterprise Support Package',
    status: 'cancelled',
    billingCycle: 'yearly',
    amount: 499.99,
    nextBillingDate: null,
    startDate: '2024-01-01',
    paymentMethod: 'Invoice',
    mrr: 0,
  },
  {
    id: 6,
    customerName: 'StartUp Hub',
    planName: 'API Access - 10K Calls/Month',
    status: 'paused',
    billingCycle: 'monthly',
    amount: 29.99,
    nextBillingDate: null,
    startDate: '2025-11-20',
    paymentMethod: 'Credit Card',
    mrr: 0,
  },
];

const billingCycles = ['All Cycles', 'Monthly', 'Yearly'];
const statuses = ['All Status', 'Active', 'Trial', 'Past Due', 'Paused', 'Cancelled'];

// Subscription List Item Component
function SubscriptionListItem({
  subscription,
  isSelected,
  onClick,
  isChecked,
  onCheckChange,
  showCheckbox,
}) {
  const handleAvatarClick = (e) => {
    if (showCheckbox) {
      e.stopPropagation();
      onCheckChange?.(!isChecked);
    }
  };

  const handleArrowClick = (e) => {
    e.stopPropagation();
    onClick?.();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'trial':
        return <Clock className="h-3 w-3 text-blue-500" />;
      case 'past_due':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'paused':
        return <Pause className="h-3 w-3 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'secondary';
      case 'past_due':
        return 'destructive';
      case 'paused':
        return 'outline';
      case 'cancelled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'w-full p-4 text-left transition-all rounded-xl mx-2 mb-2 cursor-pointer',
        isSelected
          ? 'bg-primary/5 ring-2 ring-primary/20 shadow-sm'
          : isChecked
            ? 'bg-blue-50 ring-1 ring-blue-200'
            : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
      )}
      style={{ width: 'calc(100% - 16px)' }}
    >
      <div className="flex gap-3">
        {/* Avatar - Clickable for selection */}
        <button
          onClick={handleAvatarClick}
          className={cn(
            'h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all',
            isChecked
              ? 'bg-primary/80 border border-primary'
              : showCheckbox
                ? 'bg-primary/10 border border-primary/20 hover:bg-primary/20 cursor-pointer'
                : 'bg-primary/10 border border-primary/20 cursor-default'
          )}
        >
          {isChecked ? (
            <CheckSquare className="h-6 w-6 text-white/90" />
          ) : (
            <Repeat className="h-5 w-5 text-primary" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{subscription.customerName}</span>
            {getStatusIcon(subscription.status)}
          </div>

          {/* Plan Name & Amount */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground truncate">{subscription.planName}</span>
          </div>

          {/* Amount & Billing Cycle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary">
              ${subscription.amount.toFixed(2)}/
              {subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
            </span>
            <Badge
              variant={getStatusBadgeVariant(subscription.status)}
              className="text-[10px] px-1.5 py-0 h-5 capitalize"
            >
              {subscription.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Arrow - Clickable to open subscription */}
        <button
          onClick={handleArrowClick}
          className="shrink-0 mt-2 p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ChevronRight
            className={cn(
              'h-5 w-5 transition-colors',
              isSelected ? 'text-primary' : 'text-muted-foreground/50 hover:text-muted-foreground'
            )}
          />
        </button>
      </div>
    </motion.div>
  );
}

// Subscription Detail Panel Component
function SubscriptionDetailPanel({
  subscription,
  onEdit,
  onDelete,
  onClose,
  onPause,
  onResume,
  onCancel,
}) {
  if (!subscription) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
          <Repeat className="h-10 w-10 text-primary/50" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No subscription selected</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select a subscription from the list to view details
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'trial':
        return 'bg-blue-100 text-blue-700';
      case 'past_due':
        return 'bg-red-100 text-red-700';
      case 'paused':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Repeat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">{subscription.customerName}</h2>
            <p className="text-sm text-muted-foreground">{subscription.planName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(subscription)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {subscription.status === 'active' && (
                <DropdownMenuItem onClick={() => onPause(subscription)}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Subscription
                </DropdownMenuItem>
              )}
              {subscription.status === 'paused' && (
                <DropdownMenuItem onClick={() => onResume(subscription)}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume Subscription
                </DropdownMenuItem>
              )}
              {(subscription.status === 'active' || subscription.status === 'paused') && (
                <DropdownMenuItem onClick={() => onCancel(subscription)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(subscription)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Status Badge */}
        <div>
          <Badge className={cn('capitalize', getStatusColor(subscription.status))}>
            {subscription.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Billing Section */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Billing Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ${subscription.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">MRR</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  ${subscription.mrr.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Billing Cycle</p>
                <Badge variant="secondary" className="capitalize text-xs">
                  {subscription.billingCycle}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <span className="text-sm font-medium">{subscription.paymentMethod}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Subscription Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span className="text-sm font-medium">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </span>
              </div>
              {subscription.nextBillingDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Next Billing</span>
                  <span className="text-sm font-medium">
                    {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-sm font-medium">{subscription.planName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {subscription.status === 'past_due' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-red-900 mb-1">Payment Failed</h3>
                  <p className="text-xs text-red-700 mb-3">
                    The last payment attempt failed. Please update the payment method or contact the
                    customer.
                  </p>
                  <Button size="sm" variant="destructive">
                    Retry Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, preview
  const [selectedBillingCycle, setSelectedBillingCycle] = useState('All Cycles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    return mockSubscriptions.filter((subscription) => {
      const matchesSearch =
        subscription.customerName.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        subscription.planName.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesCycle =
        selectedBillingCycle === 'All Cycles' ||
        subscription.billingCycle === selectedBillingCycle.toLowerCase();
      const matchesStatus =
        selectedStatus === 'All Status' ||
        subscription.status === selectedStatus.toLowerCase().replace(' ', '_');
      return matchesSearch && matchesCycle && matchesStatus;
    });
  }, [deferredSearch, selectedBillingCycle, selectedStatus]);

  // Sorted subscriptions
  const sortedSubscriptions = useMemo(() => {
    let result = [...filteredSubscriptions];
    switch (sortBy) {
      case 'customer':
        result.sort((a, b) => a.customerName.localeCompare(b.customerName));
        break;
      case 'amount-high':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-low':
        result.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }
    return result;
  }, [filteredSubscriptions, sortBy]);

  // Bulk selection handlers
  const toggleSelectSubscription = useCallback((subscriptionId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(subscriptionId)) {
        next.delete(subscriptionId);
      } else {
        next.add(subscriptionId);
      }
      return next;
    });
  }, []);

  const selectAllSubscriptions = useCallback(() => {
    if (selectedIds.size === sortedSubscriptions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedSubscriptions.map((s) => s.id)));
    }
  }, [sortedSubscriptions, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, []);

  const toggleSelectionMode = useCallback(() => {
    if (selectionMode) {
      clearSelection();
    } else {
      setSelectionMode(true);
    }
  }, [selectionMode, clearSelection]);

  // Handlers
  const openPreview = (subscription) => {
    setSelectedSubscription(subscription);
    setViewMode('preview');
  };

  const handleDeleteSubscription = (subscription) => {
    setSubscriptionToDelete(subscription);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: 'Subscription deleted',
      description: `Subscription for ${subscriptionToDelete.customerName} has been deleted successfully.`,
    });
    if (selectedSubscription?.id === subscriptionToDelete.id) {
      setSelectedSubscription(null);
      setViewMode('list');
    }
    setDeleteDialogOpen(false);
    setSubscriptionToDelete(null);
  };

  const handlePause = (subscription) => {
    toast({
      title: 'Subscription paused',
      description: `Subscription for ${subscription.customerName} has been paused.`,
    });
  };

  const handleResume = (subscription) => {
    toast({
      title: 'Subscription resumed',
      description: `Subscription for ${subscription.customerName} has been resumed.`,
    });
  };

  const handleCancel = (subscription) => {
    toast({
      title: 'Subscription cancelled',
      description: `Subscription for ${subscription.customerName} has been cancelled.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exporting subscriptions',
      description: 'Your subscriptions are being exported to CSV.',
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} subscription(s)? This action cannot be undone.`))
      return;

    toast({
      title: 'Subscriptions Deleted',
      description: `${selectedIds.size} subscription(s) deleted successfully.`,
    });
    clearSelection();
  };

  const handleBulkExport = () => {
    if (selectedIds.size === 0) return;
    toast({
      title: 'Exporting subscriptions',
      description: `Exporting ${selectedIds.size} subscription(s) to CSV.`,
    });
  };

  // Stats
  const stats = useMemo(() => {
    const activeSubscriptions = mockSubscriptions.filter((s) => s.status === 'active');
    const totalMRR = mockSubscriptions.reduce((sum, s) => sum + s.mrr, 0);
    const trialSubscriptions = mockSubscriptions.filter((s) => s.status === 'trial');
    const pastDueSubscriptions = mockSubscriptions.filter((s) => s.status === 'past_due');

    return {
      total: mockSubscriptions.length,
      active: activeSubscriptions.length,
      mrr: totalMRR,
      trial: trialSubscriptions.length,
      pastDue: pastDueSubscriptions.length,
    };
  }, []);

  const layoutStats = [
    createStat('Total', stats.total, Repeat, 'blue'),
    createStat('Active', stats.active, TrendingUp, 'green'),
    createStat('MRR', `$${stats.mrr.toFixed(2)}`, DollarSign, 'purple'),
    createStat('Trial', stats.trial, Clock, 'amber'),
  ];

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'create', label: 'New Subscription', icon: Plus, variant: 'default' }],
    secondaryActions: [
      { id: 'export', label: 'Export', icon: Download, variant: 'ghost' },
      {
        id: 'selection',
        label: selectionMode ? 'Exit Selection' : 'Select',
        icon: selectionMode ? MinusSquare : CheckSquare,
        variant: selectionMode ? 'secondary' : 'ghost',
      },
    ],
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'trial', label: 'Trial' },
        { id: 'past_due', label: 'Past Due' },
      ],
    },
  };

  // Handle FixedMenuPanel actions
  const handleMenuAction = (actionId) => {
    switch (actionId) {
      case 'create':
        router.push('/commerce/subscriptions/new');
        break;
      case 'export':
        handleExport();
        break;
      case 'selection':
        toggleSelectionMode();
        break;
      default:
        break;
    }
  };

  // Bulk actions configuration
  const bulkActions = [
    { id: 'export', label: 'Export', icon: FileDown, variant: 'outline' },
    { id: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive' },
  ];

  const handleBulkAction = (actionId) => {
    switch (actionId) {
      case 'export':
        handleBulkExport();
        break;
      case 'delete':
        handleBulkDelete();
        break;
      default:
        break;
    }
  };

  // Fixed menu list
  const fixedMenuListContent = (
    <div className="py-2">
      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 space-y-2">
        <Select value={selectedBillingCycle} onValueChange={setSelectedBillingCycle}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {billingCycles.map((cycle) => (
              <SelectItem key={cycle} value={cycle} className="text-xs">
                {cycle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status} className="text-xs">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="text-xs">
                Newest
              </SelectItem>
              <SelectItem value="customer" className="text-xs">
                Customer A-Z
              </SelectItem>
              <SelectItem value="amount-high" className="text-xs">
                Amount High
              </SelectItem>
              <SelectItem value="amount-low" className="text-xs">
                Amount Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedSubscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Repeat className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-medium mb-1">No subscriptions found</p>
          <p className="text-xs text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Add your first subscription'}
          </p>
          {!searchQuery && (
            <Button size="sm" onClick={() => router.push('/commerce/subscriptions/new')}>
              <Plus className="h-4 w-4 mr-1" /> New Subscription
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Select All Row */}
          {selectionMode && sortedSubscriptions.length > 0 && (
            <button
              onClick={selectAllSubscriptions}
              className="w-full px-5 py-2 flex items-center gap-3 text-sm hover:bg-slate-50 transition-colors border-b border-gray-100"
            >
              {selectedIds.size === sortedSubscriptions.length ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : selectedIds.size > 0 ? (
                <MinusSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-muted-foreground">
                {selectedIds.size === sortedSubscriptions.length
                  ? 'Deselect all'
                  : `Select all (${sortedSubscriptions.length})`}
              </span>
            </button>
          )}
          {sortedSubscriptions.map((subscription) => (
            <SubscriptionListItem
              key={subscription.id}
              subscription={subscription}
              isSelected={selectedSubscription?.id === subscription.id && viewMode === 'preview'}
              onClick={() => openPreview(subscription)}
              showCheckbox={selectionMode}
              isChecked={selectedIds.has(subscription.id)}
              onCheckChange={() => toggleSelectSubscription(subscription.id)}
            />
          ))}
        </>
      )}
    </div>
  );

  // Content area
  const contentArea = (
    <AnimatePresence mode="wait">
      {viewMode === 'preview' && selectedSubscription ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <SubscriptionDetailPanel
            subscription={selectedSubscription}
            onEdit={(subscription) =>
              router.push(`/commerce/subscriptions/${subscription.id}/edit`)
            }
            onDelete={handleDeleteSubscription}
            onPause={handlePause}
            onResume={handleResume}
            onCancel={handleCancel}
            onClose={() => {
              setSelectedSubscription(null);
              setViewMode('list');
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          <SubscriptionDetailPanel
            subscription={null}
            onEdit={() => {}}
            onDelete={() => {}}
            onPause={() => {}}
            onResume={() => {}}
            onCancel={() => {}}
            onClose={() => {}}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <HubLayout
        hubId="commerce"
        title="Subscriptions"
        description="Manage recurring revenue and subscription billing"
        stats={layoutStats}
        showFixedMenu={true}
        fixedMenuFilters={
          <FixedMenuPanel
            config={fixedMenuConfig}
            activeFilter={
              selectedStatus === 'All Status'
                ? 'all'
                : selectedStatus.toLowerCase().replace(' ', '_')
            }
            onFilterChange={(filter) => {
              if (filter === 'all') setSelectedStatus('All Status');
              else if (filter === 'active') setSelectedStatus('Active');
              else if (filter === 'trial') setSelectedStatus('Trial');
              else if (filter === 'past_due') setSelectedStatus('Past Due');
            }}
            onAction={handleMenuAction}
            selectedCount={selectedIds.size}
            bulkActions={bulkActions}
            onBulkAction={handleBulkAction}
            className="p-4"
          />
        }
        fixedMenuList={fixedMenuListContent}
      >
        {contentArea}
      </HubLayout>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the subscription for "
              {subscriptionToDelete?.customerName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
