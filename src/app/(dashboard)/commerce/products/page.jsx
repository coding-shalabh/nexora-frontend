'use client';

import { useState, useMemo, useDeferredValue, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Download,
  Upload,
  Package,
  Grid3x3,
  List,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  Tags,
  DollarSign,
  Boxes,
  TrendingUp,
  AlertCircle,
  X,
  Loader2,
  ChevronRight,
  CheckSquare,
  Square,
  MinusSquare,
  FileDown,
  Star,
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Premium CRM License',
    sku: 'CRM-PREM-001',
    category: 'Software',
    price: 99.99,
    cost: 45.0,
    stock: 'Unlimited',
    status: 'active',
    image: null,
    type: 'recurring',
    billingPeriod: 'monthly',
  },
  {
    id: 2,
    name: 'Professional Services - Hourly',
    sku: 'SERV-PROF-001',
    category: 'Services',
    price: 150.0,
    cost: 75.0,
    stock: 'N/A',
    status: 'active',
    image: null,
    type: 'one-time',
    billingPeriod: null,
  },
  {
    id: 3,
    name: 'Enterprise Support Package',
    sku: 'SUP-ENT-001',
    category: 'Support',
    price: 499.99,
    cost: 200.0,
    stock: 'Unlimited',
    status: 'active',
    image: null,
    type: 'recurring',
    billingPeriod: 'yearly',
  },
  {
    id: 4,
    name: 'API Access - 10K Calls/Month',
    sku: 'API-10K-001',
    category: 'Add-ons',
    price: 29.99,
    cost: 10.0,
    stock: 'Unlimited',
    status: 'active',
    image: null,
    type: 'recurring',
    billingPeriod: 'monthly',
  },
  {
    id: 5,
    name: 'Custom Integration Setup',
    sku: 'INT-CUST-001',
    category: 'Services',
    price: 1500.0,
    cost: 600.0,
    stock: 'N/A',
    status: 'draft',
    image: null,
    type: 'one-time',
    billingPeriod: null,
  },
];

const categories = ['All Categories', 'Software', 'Services', 'Support', 'Add-ons'];
const productTypes = ['All Types', 'One-time', 'Recurring'];
const statuses = ['All Status', 'Active', 'Draft', 'Archived'];

// Product List Item Component
function ProductListItem({ product, isSelected, onClick, isChecked, onCheckChange, showCheckbox }) {
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

  const margin = (((product.price - product.cost) / product.price) * 100).toFixed(1);

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
            <Package className="h-5 w-5 text-primary" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{product.name}</span>
            {product.status === 'active' && (
              <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            )}
          </div>

          {/* SKU & Price */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-5">
              {product.sku}
            </Badge>
            <span className="text-xs font-semibold text-primary">${product.price.toFixed(2)}</span>
          </div>

          {/* Category & Margin */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">{product.category}</span>
            <Badge
              variant={parseFloat(margin) > 50 ? 'default' : 'secondary'}
              className="text-[10px] px-1.5 py-0 h-5"
            >
              {margin}%
            </Badge>
          </div>
        </div>

        {/* Arrow - Clickable to open product */}
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

// Product Detail Panel Component
function ProductDetailPanel({ product, onEdit, onDelete, onClose, onDuplicate }) {
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
          <Package className="h-10 w-10 text-primary/50" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No product selected</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select a product from the list to view details
        </p>
      </div>
    );
  }

  const margin = (((product.price - product.cost) / product.price) * 100).toFixed(1);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-sm text-muted-foreground">{product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
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
              <DropdownMenuItem onClick={() => onDuplicate(product)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(product)} className="text-red-600">
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
              product.status === 'active' && 'bg-green-100 text-green-700',
              product.status === 'draft' && 'bg-yellow-100 text-yellow-700',
              product.status === 'archived' && 'bg-gray-100 text-gray-700'
            )}
          >
            {product.status}
          </Badge>
        </div>

        {/* Pricing Section */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Price</p>
                <p className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Cost</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  ${product.cost.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <Badge
                  variant={parseFloat(margin) > 50 ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {margin}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Product Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="secondary" className="capitalize text-xs">
                  {product.type}
                </Badge>
              </div>
              {product.billingPeriod && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Billing Period</span>
                  <span className="text-sm font-medium capitalize">{product.billingPeriod}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Stock</span>
                <span className="text-sm font-medium">{product.stock}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, preview
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesType =
        selectedType === 'All Types' ||
        product.type === selectedType.toLowerCase().replace('-', '');
      const matchesStatus =
        selectedStatus === 'All Status' || product.status === selectedStatus.toLowerCase();
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [deferredSearch, selectedCategory, selectedType, selectedStatus]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    let result = [...filteredProducts];
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }
    return result;
  }, [filteredProducts, sortBy]);

  // Bulk selection handlers
  const toggleSelectProduct = useCallback((productId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const selectAllProducts = useCallback(() => {
    if (selectedIds.size === sortedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedProducts.map((p) => p.id)));
    }
  }, [sortedProducts, selectedIds.size]);

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
  const openPreview = (product) => {
    setSelectedProduct(product);
    setViewMode('preview');
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: 'Product deleted',
      description: `${productToDelete.name} has been deleted successfully.`,
    });
    if (selectedProduct?.id === productToDelete.id) {
      setSelectedProduct(null);
      setViewMode('list');
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDuplicate = (product) => {
    toast({
      title: 'Product duplicated',
      description: `A copy of ${product.name} has been created.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exporting products',
      description: 'Your products are being exported to CSV.',
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} product(s)? This action cannot be undone.`)) return;

    toast({
      title: 'Products Deleted',
      description: `${selectedIds.size} product(s) deleted successfully.`,
    });
    clearSelection();
  };

  const handleBulkExport = () => {
    if (selectedIds.size === 0) return;
    toast({
      title: 'Exporting products',
      description: `Exporting ${selectedIds.size} product(s) to CSV.`,
    });
  };

  // Stats
  const stats = useMemo(
    () => ({
      total: mockProducts.length,
      active: mockProducts.filter((p) => p.status === 'active').length,
      totalValue: mockProducts.reduce((sum, p) => sum + p.price, 0),
      categories: [...new Set(mockProducts.map((p) => p.category))].length,
    }),
    []
  );

  const layoutStats = [
    createStat('Total', stats.total, Package, 'blue'),
    createStat('Active', stats.active, TrendingUp, 'green'),
    createStat('Value', `$${stats.totalValue.toFixed(2)}`, DollarSign, 'purple'),
    createStat('Categories', stats.categories, Tags, 'amber'),
  ];

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'create', label: 'Add Product', icon: Plus, variant: 'default' }],
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
        { id: 'draft', label: 'Draft' },
      ],
    },
  };

  // Handle FixedMenuPanel actions
  const handleMenuAction = (actionId) => {
    switch (actionId) {
      case 'create':
        router.push('/commerce/products/new');
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
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 space-y-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="text-xs">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
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
              <SelectItem value="price-high" className="text-xs">
                Price High
              </SelectItem>
              <SelectItem value="price-low" className="text-xs">
                Price Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-medium mb-1">No products found</p>
          <p className="text-xs text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Add your first product'}
          </p>
          {!searchQuery && (
            <Button size="sm" onClick={() => router.push('/commerce/products/new')}>
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Select All Row */}
          {selectionMode && sortedProducts.length > 0 && (
            <button
              onClick={selectAllProducts}
              className="w-full px-5 py-2 flex items-center gap-3 text-sm hover:bg-slate-50 transition-colors border-b border-gray-100"
            >
              {selectedIds.size === sortedProducts.length ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : selectedIds.size > 0 ? (
                <MinusSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-muted-foreground">
                {selectedIds.size === sortedProducts.length
                  ? 'Deselect all'
                  : `Select all (${sortedProducts.length})`}
              </span>
            </button>
          )}
          {sortedProducts.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id && viewMode === 'preview'}
              onClick={() => openPreview(product)}
              showCheckbox={selectionMode}
              isChecked={selectedIds.has(product.id)}
              onCheckChange={() => toggleSelectProduct(product.id)}
            />
          ))}
        </>
      )}
    </div>
  );

  // Content area
  const contentArea = (
    <AnimatePresence mode="wait">
      {viewMode === 'preview' && selectedProduct ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <ProductDetailPanel
            product={selectedProduct}
            onEdit={(product) => router.push(`/commerce/products/${product.id}/edit`)}
            onDelete={handleDeleteProduct}
            onDuplicate={handleDuplicate}
            onClose={() => {
              setSelectedProduct(null);
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
          <ProductDetailPanel
            product={null}
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
      <UnifiedLayout hubId="commerce" pageTitle="Products" stats={layoutStats} fixedMenu={null}>
        <div className="flex h-full">
          {/* Fixed Menu Panel */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <FixedMenuPanel
              config={fixedMenuConfig}
              activeFilter={selectedStatus.toLowerCase()}
              onFilterChange={(filter) => {
                if (filter === 'all') setSelectedStatus('All Status');
                else if (filter === 'active') setSelectedStatus('Active');
                else if (filter === 'draft') setSelectedStatus('Draft');
              }}
              onAction={handleMenuAction}
              selectedCount={selectedIds.size}
              bulkActions={bulkActions}
              onBulkAction={handleBulkAction}
              className="p-4"
            />
            <div className="flex-1 overflow-auto">{fixedMenuListContent}</div>
          </div>
          {/* Content Area */}
          <div className="flex-1 overflow-auto">{contentArea}</div>
        </div>
      </UnifiedLayout>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be
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
