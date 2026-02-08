'use client';

import { useState, useMemo, useDeferredValue, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  X,
  ChevronRight,
  CheckSquare,
  Square,
  MinusSquare,
  FileDown,
  Percent,
  Tag,
  DollarSign,
  Calendar,
  TrendingDown,
  AlertCircle,
  Users,
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
const mockDiscounts = [
  {
    id: 1,
    code: 'SUMMER2024',
    name: 'Summer Sale',
    type: 'percentage',
    value: 20,
    status: 'active',
    usageCount: 145,
    usageLimit: 500,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    applicableTo: 'All Products',
  },
  {
    id: 2,
    code: 'WELCOME10',
    name: 'Welcome Discount',
    type: 'percentage',
    value: 10,
    status: 'active',
    usageCount: 89,
    usageLimit: null,
    startDate: '2024-01-01',
    endDate: null,
    applicableTo: 'First Purchase',
  },
  {
    id: 3,
    code: 'BULK50',
    name: 'Bulk Order Discount',
    type: 'fixed',
    value: 50,
    status: 'active',
    usageCount: 23,
    usageLimit: 100,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    applicableTo: 'Orders > $500',
  },
  {
    id: 4,
    code: 'FLASH25',
    name: 'Flash Sale',
    type: 'percentage',
    value: 25,
    status: 'expired',
    usageCount: 456,
    usageLimit: 1000,
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    applicableTo: 'Selected Products',
  },
  {
    id: 5,
    code: 'VIP15',
    name: 'VIP Customer Discount',
    type: 'percentage',
    value: 15,
    status: 'scheduled',
    usageCount: 0,
    usageLimit: null,
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    applicableTo: 'VIP Customers',
  },
];

const discountTypes = ['All Types', 'Percentage', 'Fixed'];
const statuses = ['All Status', 'Active', 'Scheduled', 'Expired'];

// Discount List Item Component
function DiscountListItem({
  discount,
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

  const usagePercentage = discount.usageLimit
    ? ((discount.usageCount / discount.usageLimit) * 100).toFixed(0)
    : null;

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
            <Percent className="h-5 w-5 text-primary" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{discount.name}</span>
            {discount.status === 'active' && (
              <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            )}
          </div>

          {/* Code & Value */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-5">
              {discount.code}
            </Badge>
            <span className="text-xs font-semibold text-primary">
              {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
            </span>
          </div>

          {/* Usage Stats */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">
              {discount.usageCount} uses
              {discount.usageLimit && ` / ${discount.usageLimit}`}
            </span>
            {usagePercentage && (
              <Badge
                variant={parseInt(usagePercentage) > 80 ? 'destructive' : 'secondary'}
                className="text-[10px] px-1.5 py-0 h-5"
              >
                {usagePercentage}%
              </Badge>
            )}
          </div>
        </div>

        {/* Arrow - Clickable to open discount */}
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

// Discount Detail Panel Component
function DiscountDetailPanel({ discount, onEdit, onDelete, onClose, onDuplicate }) {
  if (!discount) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
          <Percent className="h-10 w-10 text-primary/50" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No discount selected</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select a discount from the list to view details
        </p>
      </div>
    );
  }

  const usagePercentage = discount.usageLimit
    ? ((discount.usageCount / discount.usageLimit) * 100).toFixed(1)
    : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Percent className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">{discount.name}</h2>
            <p className="text-sm text-muted-foreground font-mono">{discount.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(discount)}>
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
              <DropdownMenuItem onClick={() => onDuplicate(discount)}>
                <Tag className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(discount)} className="text-red-600">
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
          <Badge
            className={cn(
              'capitalize',
              discount.status === 'active' && 'bg-green-100 text-green-700',
              discount.status === 'scheduled' && 'bg-blue-100 text-blue-700',
              discount.status === 'expired' && 'bg-gray-100 text-gray-700'
            )}
          >
            {discount.status}
          </Badge>
        </div>

        {/* Discount Value Section */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Discount Value</h3>
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {discount.type === 'percentage' ? 'Percentage Off' : 'Fixed Amount'}
                </p>
                <p className="text-5xl font-bold text-primary">
                  {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Usage Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Times Used</span>
                <span className="text-sm font-medium">{discount.usageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Usage Limit</span>
                <span className="text-sm font-medium">
                  {discount.usageLimit ? discount.usageLimit : 'Unlimited'}
                </span>
              </div>
              {usagePercentage && (
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Usage Rate</span>
                    <Badge
                      variant={parseFloat(usagePercentage) > 80 ? 'destructive' : 'secondary'}
                      className="text-sm"
                    >
                      {usagePercentage}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all',
                        parseFloat(usagePercentage) > 80 ? 'bg-red-500' : 'bg-primary'
                      )}
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Validity Period */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Validity Period</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span className="text-sm font-medium">
                  {new Date(discount.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">End Date</span>
                <span className="text-sm font-medium">
                  {discount.endDate ? new Date(discount.endDate).toLocaleDateString() : 'No expiry'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicability */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Applicable To</h3>
            <p className="text-sm">{discount.applicableTo}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DiscountsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, preview
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Filter discounts
  const filteredDiscounts = useMemo(() => {
    return mockDiscounts.filter((discount) => {
      const matchesSearch =
        discount.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        discount.code.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesType =
        selectedType === 'All Types' || discount.type === selectedType.toLowerCase();
      const matchesStatus =
        selectedStatus === 'All Status' || discount.status === selectedStatus.toLowerCase();
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [deferredSearch, selectedType, selectedStatus]);

  // Sorted discounts
  const sortedDiscounts = useMemo(() => {
    let result = [...filteredDiscounts];
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'value-high':
        result.sort((a, b) => b.value - a.value);
        break;
      case 'value-low':
        result.sort((a, b) => a.value - b.value);
        break;
      default:
        break;
    }
    return result;
  }, [filteredDiscounts, sortBy]);

  // Bulk selection handlers
  const toggleSelectDiscount = useCallback((discountId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(discountId)) {
        next.delete(discountId);
      } else {
        next.add(discountId);
      }
      return next;
    });
  }, []);

  const selectAllDiscounts = useCallback(() => {
    if (selectedIds.size === sortedDiscounts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedDiscounts.map((d) => d.id)));
    }
  }, [sortedDiscounts, selectedIds.size]);

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
  const openPreview = (discount) => {
    setSelectedDiscount(discount);
    setViewMode('preview');
  };

  const handleDeleteDiscount = (discount) => {
    setDiscountToDelete(discount);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: 'Discount deleted',
      description: `${discountToDelete.name} has been deleted successfully.`,
    });
    if (selectedDiscount?.id === discountToDelete.id) {
      setSelectedDiscount(null);
      setViewMode('list');
    }
    setDeleteDialogOpen(false);
    setDiscountToDelete(null);
  };

  const handleDuplicate = (discount) => {
    toast({
      title: 'Discount duplicated',
      description: `A copy of ${discount.name} has been created.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exporting discounts',
      description: 'Your discounts are being exported to CSV.',
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} discount(s)? This action cannot be undone.`)) return;

    toast({
      title: 'Discounts Deleted',
      description: `${selectedIds.size} discount(s) deleted successfully.`,
    });
    clearSelection();
  };

  const handleBulkExport = () => {
    if (selectedIds.size === 0) return;
    toast({
      title: 'Exporting discounts',
      description: `Exporting ${selectedIds.size} discount(s) to CSV.`,
    });
  };

  // Stats
  const stats = useMemo(
    () => ({
      total: mockDiscounts.length,
      active: mockDiscounts.filter((d) => d.status === 'active').length,
      totalUses: mockDiscounts.reduce((sum, d) => sum + d.usageCount, 0),
      scheduled: mockDiscounts.filter((d) => d.status === 'scheduled').length,
    }),
    []
  );

  const layoutStats = [
    createStat('Total', stats.total, Tag, 'blue'),
    createStat('Active', stats.active, TrendingDown, 'green'),
    createStat('Uses', stats.totalUses, Users, 'purple'),
    createStat('Scheduled', stats.scheduled, Calendar, 'amber'),
  ];

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'create', label: 'Add Discount', icon: Plus, variant: 'default' }],
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
        { id: 'scheduled', label: 'Scheduled' },
        { id: 'expired', label: 'Expired' },
      ],
    },
  };

  // Handle FixedMenuPanel actions
  const handleMenuAction = (actionId) => {
    switch (actionId) {
      case 'create':
        router.push('/commerce/discounts/new');
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
            placeholder="Search discounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 space-y-2">
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {discountTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-xs">
                  {type}
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
              <SelectItem value="name" className="text-xs">
                Name A-Z
              </SelectItem>
              <SelectItem value="value-high" className="text-xs">
                Value High
              </SelectItem>
              <SelectItem value="value-low" className="text-xs">
                Value Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedDiscounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Percent className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-medium mb-1">No discounts found</p>
          <p className="text-xs text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first discount'}
          </p>
          {!searchQuery && (
            <Button size="sm" onClick={() => router.push('/commerce/discounts/new')}>
              <Plus className="h-4 w-4 mr-1" /> Add Discount
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Select All Row */}
          {selectionMode && sortedDiscounts.length > 0 && (
            <button
              onClick={selectAllDiscounts}
              className="w-full px-5 py-2 flex items-center gap-3 text-sm hover:bg-slate-50 transition-colors border-b border-gray-100"
            >
              {selectedIds.size === sortedDiscounts.length ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : selectedIds.size > 0 ? (
                <MinusSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-muted-foreground">
                {selectedIds.size === sortedDiscounts.length
                  ? 'Deselect all'
                  : `Select all (${sortedDiscounts.length})`}
              </span>
            </button>
          )}
          {sortedDiscounts.map((discount) => (
            <DiscountListItem
              key={discount.id}
              discount={discount}
              isSelected={selectedDiscount?.id === discount.id && viewMode === 'preview'}
              onClick={() => openPreview(discount)}
              showCheckbox={selectionMode}
              isChecked={selectedIds.has(discount.id)}
              onCheckChange={() => toggleSelectDiscount(discount.id)}
            />
          ))}
        </>
      )}
    </div>
  );

  // Content area
  const contentArea = (
    <AnimatePresence mode="wait">
      {viewMode === 'preview' && selectedDiscount ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <DiscountDetailPanel
            discount={selectedDiscount}
            onEdit={(discount) => router.push(`/commerce/discounts/${discount.id}/edit`)}
            onDelete={handleDeleteDiscount}
            onDuplicate={handleDuplicate}
            onClose={() => {
              setSelectedDiscount(null);
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
          <DiscountDetailPanel
            discount={null}
            onEdit={() => {}}
            onDelete={() => {}}
            onDuplicate={() => {}}
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
        title="Discounts"
        description="Manage discount codes and promotions"
        stats={layoutStats}
        showFixedMenu={true}
        fixedMenuFilters={
          <FixedMenuPanel
            config={fixedMenuConfig}
            activeFilter={selectedStatus.toLowerCase()}
            onFilterChange={(filter) => {
              if (filter === 'all') setSelectedStatus('All Status');
              else if (filter === 'active') setSelectedStatus('Active');
              else if (filter === 'scheduled') setSelectedStatus('Scheduled');
              else if (filter === 'expired') setSelectedStatus('Expired');
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
            <DialogTitle>Delete Discount</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{discountToDelete?.name}"? This action cannot be
              undone.
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
