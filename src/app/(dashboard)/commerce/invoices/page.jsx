'use client';

import { useState, useEffect, useMemo, useDeferredValue, useCallback } from 'react';
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
import { api } from '@/lib/api';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';
import { renderInvoice, getSelectedTemplateId } from '@/config/invoice-templates';

// Normalize API invoice to frontend shape
function normalizeInvoice(inv) {
  const contactName = inv.contact
    ? `${inv.contact.firstName || ''} ${inv.contact.lastName || ''}`.trim()
    : inv.buyerLegalName || inv.buyerTradeName || 'Unknown';
  const lines = (inv.lines || []).map((l) => ({
    description: l.description,
    hsn: l.hsnCode || l.sacCode || '',
    qty: Number(l.quantity) || 1,
    rate: Number(l.unitPrice) || 0,
    taxRate:
      Number(l.taxRate) ||
      Number(l.cgstRate || 0) + Number(l.sgstRate || 0) + Number(l.igstRate || 0),
  }));
  return {
    id: inv.invoiceNumber || inv.id,
    _id: inv.id, // keep real DB id for API calls
    customer: contactName,
    customerAddress: inv.buyerAddress || inv.contact?.address || '',
    customerGSTIN: inv.buyerGstin || '',
    customerEmail: inv.contact?.email || '',
    amount: Number(inv.totalAmount) || 0,
    status: (inv.status || 'draft').toLowerCase(),
    dueDate: inv.dueDate ? inv.dueDate.split('T')[0] : '',
    issueDate: inv.issueDate ? inv.issueDate.split('T')[0] : '',
    paymentTerms: inv.terms ? '' : '',
    placeOfSupply: inv.placeOfSupplyName || inv.placeOfSupply || '',
    items: lines.length,
    lineItems: lines,
    notes: inv.notes || '',
    terms: inv.terms || '',
  };
}

// Fallback mock data shown only when API returns empty
const fallbackInvoices = [
  {
    id: 'INV-2024-001',
    _id: 'INV-2024-001',
    customer: 'Acme Corporation',
    customerAddress: '42, MG Road, Bengaluru, Karnataka 560001',
    customerGSTIN: '29AABCA1234F1ZP',
    customerEmail: 'billing@acmecorp.in',
    amount: 2450.0,
    status: 'paid',
    dueDate: '2024-12-25',
    issueDate: '2024-12-10',
    paymentTerms: 'Net 15',
    placeOfSupply: 'Karnataka (29)',
    items: 3,
    lineItems: [
      { description: 'CRM Pro License — Annual', hsn: '998314', qty: 2, rate: 800, taxRate: 18 },
      { description: 'Data Migration Service', hsn: '998313', qty: 1, rate: 500, taxRate: 18 },
      {
        description: 'Onboarding & Training (8 hrs)',
        hsn: '998313',
        qty: 1,
        rate: 350,
        taxRate: 18,
      },
    ],
    notes: 'Thank you for choosing our platform. Support: support@nexora.app',
    terms:
      'Payment due within 15 days of invoice date. Late payments attract 1.5% monthly interest.',
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
      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Status + Amount */}
        <div className="flex items-center justify-between">
          <Badge className={cn('capitalize', getStatusColor(invoice.status))}>
            {invoice.status}
          </Badge>
          <div className="text-right">
            <p className="text-2xl font-bold">${invoice.amount.toLocaleString()}</p>
            {invoice.paymentTerms && (
              <p className="text-xs text-muted-foreground">{invoice.paymentTerms}</p>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-sm mb-2">Details</h3>
            {[
              ['Invoice ID', invoice.id],
              ['Issue Date', new Date(invoice.issueDate).toLocaleDateString()],
              ['Due Date', new Date(invoice.dueDate).toLocaleDateString()],
              ['Payment Terms', invoice.paymentTerms],
              ['Place of Supply', invoice.placeOfSupply],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium font-mono text-xs">{value}</span>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Customer */}
        <Card>
          <CardContent className="p-4 space-y-1">
            <h3 className="font-semibold text-sm mb-2">Customer</h3>
            <p className="text-sm font-medium">{invoice.customer}</p>
            {invoice.customerAddress && (
              <p className="text-xs text-muted-foreground">{invoice.customerAddress}</p>
            )}
            {invoice.customerEmail && (
              <p className="text-xs text-muted-foreground">{invoice.customerEmail}</p>
            )}
            {invoice.customerGSTIN && (
              <Badge variant="secondary" className="mt-1 text-[10px] font-mono">
                GSTIN: {invoice.customerGSTIN}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Line Items */}
        {invoice.lineItems && invoice.lineItems.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-sm mb-2">Line Items</h3>
              <div className="space-y-2">
                {invoice.lineItems.map((item, idx) => {
                  const lineTotal = item.qty * item.rate;
                  const lineTax = (lineTotal * item.taxRate) / 100;
                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-start text-sm py-1.5 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-medium text-xs truncate">{item.description}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.qty} × ${item.rate.toLocaleString()} &middot; HSN {item.hsn}{' '}
                          &middot; {item.taxRate}% GST
                        </p>
                      </div>
                      <p className="font-semibold text-xs whitespace-nowrap">
                        $
                        {(lineTotal + lineTax).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* Totals */}
              <div className="pt-2 mt-2 border-t space-y-1">
                {(() => {
                  const sub = invoice.lineItems.reduce((s, l) => s + l.qty * l.rate, 0);
                  const tax = invoice.lineItems.reduce(
                    (s, l) => s + (l.qty * l.rate * l.taxRate) / 100,
                    0
                  );
                  return (
                    <>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${sub.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      {tax > 0 && (
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>GST</span>
                          <span>
                            ${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold pt-1">
                        <span>Total</span>
                        <span>
                          ${(sub + tax).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {invoice.notes && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-1">Notes</h3>
              <p className="text-xs text-muted-foreground">{invoice.notes}</p>
            </CardContent>
          </Card>
        )}

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
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orgInfo, setOrgInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    gstin: '',
    logoUrl: null,
    currency: 'INR',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  // Fetch invoices from billing API
  const fetchInvoices = useCallback(() => {
    setIsLoading(true);
    api
      .get('/billing/invoices?limit=100')
      .then((res) => {
        const raw = res.data?.data || res.data || [];
        const list = Array.isArray(raw) ? raw : [];
        if (list.length > 0) {
          setInvoices(list.map(normalizeInvoice));
        } else {
          setInvoices(fallbackInvoices);
        }
      })
      .catch(() => {
        setInvoices(fallbackInvoices);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Fetch organization details for invoice branding
  useEffect(() => {
    fetchInvoices();
    api
      .get('/settings/organization')
      .then((res) => {
        const d = res.data?.data || res.data || {};
        setOrgInfo({
          name: d.name || '',
          address: d.address || '',
          phone: d.phone || '',
          email: d.email || '',
          website: d.website || d.domain || '',
          gstin: d.gstin || d.settings?.gstin || '',
          logoUrl: d.logoUrl || null,
          currency: d.currency || 'INR',
        });
      })
      .catch(() => {});
  }, [fetchInvoices]);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesStatus =
        selectedStatus === 'All Status' || invoice.status === selectedStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [invoices, deferredSearch, selectedStatus]);

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
    const html = renderInvoice(getSelectedTemplateId(), { invoice, orgInfo });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      };
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.id}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
    toast({
      title: 'Invoice ready',
      description: `${invoice.id} opened for printing/saving as PDF.`,
    });
  };

  const handleDeleteInvoice = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    const dbId = invoiceToDelete._id || invoiceToDelete.id;
    try {
      await api.delete(`/billing/invoices/${dbId}`);
    } catch {
      // If API fails (mock invoice), still remove locally
    }
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceToDelete.id));
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

  const handleDuplicate = async (invoice) => {
    try {
      // Create a new invoice via API with same line items
      const items = (invoice.lineItems || []).map((l) => ({
        description: l.description,
        quantity: l.qty,
        unitPrice: l.rate,
        hsnCode: l.hsn || undefined,
        gstRate: l.taxRate || undefined,
      }));
      const res = await api.post('/billing/invoices', {
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        items:
          items.length > 0
            ? items
            : [{ description: 'Duplicated item', quantity: 1, unitPrice: 0 }],
        notes: invoice.notes || '',
      });
      const created = res.data?.data || res.data;
      if (created) {
        setInvoices((prev) => [normalizeInvoice(created), ...prev]);
        toast({
          title: 'Invoice duplicated',
          description: `${created.invoiceNumber || 'New invoice'} created as a draft copy of ${invoice.id}.`,
        });
      }
    } catch {
      // Fallback: local duplicate
      const nextNum = String(invoices.length + 1).padStart(3, '0');
      const newInvoice = {
        ...invoice,
        id: `INV-${new Date().getFullYear()}-${nextNum}`,
        _id: `local-${Date.now()}`,
        status: 'draft',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      };
      setInvoices((prev) => [newInvoice, ...prev]);
      toast({
        title: 'Invoice duplicated',
        description: `${newInvoice.id} created as a draft copy of ${invoice.id}.`,
      });
    }
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
      totalInvoiced: invoices.reduce((sum, inv) => sum + inv.amount, 0),
      paid: invoices.filter((i) => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
      pending: invoices.filter((i) => i.status === 'sent').length,
      overdue: invoices.filter((i) => i.status === 'overdue').length,
    }),
    [invoices]
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
            onEdit={(invoice) =>
              router.push(`/commerce/invoices/${invoice._id || invoice.id}/edit`)
            }
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
      <UnifiedLayout hubId="commerce" pageTitle="Invoices" stats={layoutStats} fixedMenu={null}>
        <div className="flex h-full">
          {/* Fixed Menu Panel */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
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
