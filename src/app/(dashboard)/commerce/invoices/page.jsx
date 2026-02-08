'use client';

import { useState, useMemo, useDeferredValue, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  Send,
  Receipt,
  Eye,
  Edit,
  Copy,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight,
  CheckSquare,
  Square,
  MinusSquare,
  FileDown,
  Trash2,
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

// Mock invoices data
const mockInvoices = [
  {
    id: 'INV-2024-001',
    customer: 'Acme Corporation',
    amount: 2450.0,
    status: 'paid',
    dueDate: '2024-12-25',
    issueDate: '2024-12-10',
    items: 3,
  },
  {
    id: 'INV-2024-002',
    customer: 'Tech Solutions Inc',
    amount: 1890.5,
    status: 'sent',
    dueDate: '2024-12-28',
    issueDate: '2024-12-15',
    items: 2,
  },
  {
    id: 'INV-2024-003',
    customer: 'Design Studio LLC',
    amount: 3200.0,
    status: 'overdue',
    dueDate: '2024-12-15',
    issueDate: '2024-11-30',
    items: 5,
  },
  {
    id: 'INV-2024-004',
    customer: 'StartupX',
    amount: 750.0,
    status: 'draft',
    dueDate: '2025-01-05',
    issueDate: '2024-12-20',
    items: 1,
  },
  {
    id: 'INV-2024-005',
    customer: 'Enterprise Co',
    amount: 5600.0,
    status: 'paid',
    dueDate: '2024-12-20',
    issueDate: '2024-12-05',
    items: 8,
  },
];

const statuses = ['All Status', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];

// Invoice List Item Component
function InvoiceListItem({ invoice, isSelected, onClick, isChecked, onCheckChange, showCheckbox }) {
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

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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
            <Receipt className="h-5 w-5 text-primary" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-5">
              {invoice.id}
            </Badge>
            <Badge
              className={cn(
                'capitalize text-[10px] px-1.5 py-0 h-5',
                getStatusColor(invoice.status)
              )}
            >
              {invoice.status}
            </Badge>
          </div>

          {/* Customer */}
          <div className="font-semibold text-sm mb-1 truncate">{invoice.customer}</div>

          {/* Amount & Due Date */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-green-600">
              ${invoice.amount.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Due: {new Date(invoice.dueDate).toLocaleDateString()}
            </span>
            {invoice.status === 'overdue' && <AlertCircle className="h-3 w-3 text-red-600" />}
          </div>
        </div>

        {/* Arrow - Clickable to open invoice */}
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

// Invoice Detail Panel Component
function InvoiceDetailPanel({
  invoice,
  onEdit,
  onDelete,
  onClose,
  onSend,
  onDownload,
  onDuplicate,
}) {
  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
          <Receipt className="h-10 w-10 text-primary/50" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No invoice selected</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select an invoice from the list to view details
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">{invoice.id}</h2>
            <p className="text-sm text-muted-foreground">{invoice.customer}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status !== 'paid' && (
            <Button variant="outline" size="sm" onClick={() => onSend(invoice)}>
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onEdit(invoice)}>
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
              <DropdownMenuItem onClick={() => onDownload(invoice)}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(invoice)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(invoice)} className="text-red-600">
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
          <Badge className={cn('capitalize', getStatusColor(invoice.status))}>
            {invoice.status}
          </Badge>
        </div>

        {/* Amount Section */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Invoice Amount</h3>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-green-600">
                ${invoice.amount.toLocaleString()}
              </p>
              {invoice.status === 'paid' && (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Paid
                </Badge>
              )}
              {invoice.status === 'overdue' && (
                <Badge className="bg-red-100 text-red-700">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Invoice Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Invoice ID</span>
                <span className="text-sm font-medium font-mono">{invoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Customer</span>
                <span className="text-sm font-medium">{invoice.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Issue Date</span>
                <span className="text-sm font-medium">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="text-sm font-medium">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Items</span>
                <span className="text-sm font-medium">{invoice.items}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onDownload(invoice)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {invoice.status !== 'paid' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onSend(invoice)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Customer
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onDuplicate(invoice)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate Invoice
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, preview
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesStatus =
        selectedStatus === 'All Status' || invoice.status === selectedStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [deferredSearch, selectedStatus]);

  // Bulk selection handlers
  const toggleSelectInvoice = useCallback((invoiceId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(invoiceId)) {
        next.delete(invoiceId);
      } else {
        next.add(invoiceId);
      }
      return next;
    });
  }, []);

  const selectAllInvoices = useCallback(() => {
    if (selectedIds.size === filteredInvoices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInvoices.map((i) => i.id)));
    }
  }, [filteredInvoices, selectedIds.size]);

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
  const openPreview = (invoice) => {
    setSelectedInvoice(invoice);
    setViewMode('preview');
  };

  const handleSendInvoice = (invoice) => {
    toast({
      title: 'Invoice sent',
      description: `${invoice.id} has been sent to the customer.`,
    });
  };

  const handleDownload = (invoice) => {
    toast({
      title: 'Downloading invoice',
      description: `${invoice.id} is being downloaded.`,
    });
  };

  const handleDeleteInvoice = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: 'Invoice deleted',
      description: `${invoiceToDelete.id} has been deleted successfully.`,
    });
    if (selectedInvoice?.id === invoiceToDelete.id) {
      setSelectedInvoice(null);
      setViewMode('list');
    }
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const handleDuplicate = (invoice) => {
    toast({
      title: 'Invoice duplicated',
      description: `A copy of ${invoice.id} has been created.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exporting invoices',
      description: 'Your invoices are being exported to CSV.',
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} invoice(s)? This action cannot be undone.`)) return;

    toast({
      title: 'Invoices Deleted',
      description: `${selectedIds.size} invoice(s) deleted successfully.`,
    });
    clearSelection();
  };

  const handleBulkExport = () => {
    if (selectedIds.size === 0) return;
    toast({
      title: 'Exporting invoices',
      description: `Exporting ${selectedIds.size} invoice(s) to CSV.`,
    });
  };

  const handleBulkSend = () => {
    if (selectedIds.size === 0) return;
    toast({
      title: 'Sending invoices',
      description: `Sending ${selectedIds.size} invoice(s) to customers.`,
    });
    clearSelection();
  };

  // Stats
  const stats = useMemo(
    () => ({
      totalInvoiced: mockInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      paid: mockInvoices
        .filter((i) => i.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0),
      pending: mockInvoices.filter((i) => i.status === 'sent').length,
      overdue: mockInvoices.filter((i) => i.status === 'overdue').length,
    }),
    []
  );

  const layoutStats = [
    createStat('Total', `$${stats.totalInvoiced.toLocaleString()}`, DollarSign, 'blue'),
    createStat('Paid', `$${stats.paid.toLocaleString()}`, CheckCircle, 'green'),
    createStat('Pending', stats.pending, Clock, 'amber'),
    createStat('Overdue', stats.overdue, AlertCircle, 'red'),
  ];

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'create', label: 'Create Invoice', icon: Plus, variant: 'default' }],
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
        { id: 'draft', label: 'Draft' },
        { id: 'sent', label: 'Sent' },
        { id: 'paid', label: 'Paid' },
        { id: 'overdue', label: 'Overdue' },
      ],
    },
  };

  // Handle FixedMenuPanel actions
  const handleMenuAction = (actionId) => {
    switch (actionId) {
      case 'create':
        router.push('/commerce/invoices/new');
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
    { id: 'send', label: 'Send', icon: Send, variant: 'outline' },
    { id: 'export', label: 'Export', icon: FileDown, variant: 'outline' },
    { id: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive' },
  ];

  const handleBulkAction = (actionId) => {
    switch (actionId) {
      case 'send':
        handleBulkSend();
        break;
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
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="px-4 mb-4">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="h-8 text-xs">
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
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Receipt className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-medium mb-1">No invoices found</p>
          <p className="text-xs text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first invoice'}
          </p>
          {!searchQuery && (
            <Button size="sm" onClick={() => router.push('/commerce/invoices/new')}>
              <Plus className="h-4 w-4 mr-1" /> Create Invoice
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Select All Row */}
          {selectionMode && filteredInvoices.length > 0 && (
            <button
              onClick={selectAllInvoices}
              className="w-full px-5 py-2 flex items-center gap-3 text-sm hover:bg-slate-50 transition-colors border-b border-gray-100"
            >
              {selectedIds.size === filteredInvoices.length ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : selectedIds.size > 0 ? (
                <MinusSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-muted-foreground">
                {selectedIds.size === filteredInvoices.length
                  ? 'Deselect all'
                  : `Select all (${filteredInvoices.length})`}
              </span>
            </button>
          )}
          {filteredInvoices.map((invoice) => (
            <InvoiceListItem
              key={invoice.id}
              invoice={invoice}
              isSelected={selectedInvoice?.id === invoice.id && viewMode === 'preview'}
              onClick={() => openPreview(invoice)}
              showCheckbox={selectionMode}
              isChecked={selectedIds.has(invoice.id)}
              onCheckChange={() => toggleSelectInvoice(invoice.id)}
            />
          ))}
        </>
      )}
    </div>
  );

  // Content area
  const contentArea = (
    <AnimatePresence mode="wait">
      {viewMode === 'preview' && selectedInvoice ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <InvoiceDetailPanel
            invoice={selectedInvoice}
            onEdit={(invoice) => router.push(`/commerce/invoices/${invoice.id}/edit`)}
            onDelete={handleDeleteInvoice}
            onSend={handleSendInvoice}
            onDownload={handleDownload}
            onDuplicate={handleDuplicate}
            onClose={() => {
              setSelectedInvoice(null);
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
          <InvoiceDetailPanel
            invoice={null}
            onEdit={() => {}}
            onDelete={() => {}}
            onSend={() => {}}
            onDownload={() => {}}
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
        title="Invoices"
        description="Create and manage customer invoices"
        stats={layoutStats}
        showFixedMenu={true}
        fixedMenuFilters={
          <FixedMenuPanel
            config={fixedMenuConfig}
            activeFilter={selectedStatus.toLowerCase().replace(' ', '')}
            onFilterChange={(filter) => {
              if (filter === 'all') setSelectedStatus('All Status');
              else if (filter === 'draft') setSelectedStatus('Draft');
              else if (filter === 'sent') setSelectedStatus('Sent');
              else if (filter === 'paid') setSelectedStatus('Paid');
              else if (filter === 'overdue') setSelectedStatus('Overdue');
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
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{invoiceToDelete?.id}"? This action cannot be undone.
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
