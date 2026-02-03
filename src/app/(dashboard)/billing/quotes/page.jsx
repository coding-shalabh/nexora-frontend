'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  FileText,
  Send,
  Download,
  Copy,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useBilling, formatCurrency } from '@/hooks/use-billing';
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

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  SENT: { label: 'Sent', color: 'bg-blue-100 text-blue-700' },
  VIEWED: { label: 'Viewed', color: 'bg-purple-100 text-purple-700' },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  EXPIRED: { label: 'Expired', color: 'bg-orange-100 text-orange-700' },
};

const emptyQuote = {
  title: '',
  contactId: '',
  validUntil: '',
  notes: '',
  items: [{ description: '', quantity: 1, unitPrice: 0 }],
};

export default function QuotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 25;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewSheet, setShowViewSheet] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [formData, setFormData] = useState(emptyQuote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const {
    quotes,
    loading,
    error,
    fetchQuotes,
    createQuote,
  } = useBilling();

  // Initial fetch
  useEffect(() => {
    fetchQuotes({
      page,
      limit,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    });
  }, [fetchQuotes, page, statusFilter]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter quotes locally for search
  const filteredQuotes = quotes.filter((quote) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        quote.quoteNumber?.toLowerCase().includes(query) ||
        quote.title?.toLowerCase().includes(query) ||
        quote.contact?.displayName?.toLowerCase().includes(query) ||
        quote.contact?.company?.name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Calculate stats
  const totalValue = quotes.reduce((sum, q) => sum + (q.total || 0), 0);
  const acceptedValue = quotes
    .filter((q) => q.status === 'ACCEPTED')
    .reduce((sum, q) => sum + (q.total || 0), 0);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData(emptyQuote);
    setShowAddModal(true);
  };

  // Open View Sheet
  const handleOpenView = (quote) => {
    setCurrentQuote(quote);
    setShowViewSheet(true);
  };

  // Add line item
  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }],
    });
  };

  // Remove line item
  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  // Update line item
  const handleUpdateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  // Calculate total
  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  // Create Quote
  const handleCreate = async () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Quote title is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createQuote({
        ...formData,
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
      });
      setShowAddModal(false);
      setFormData(emptyQuote);
      toast({
        title: 'Quote Created',
        description: 'The quote has been created successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create quote',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading && quotes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error && quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">Failed to load quotes</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => fetchQuotes({ page, limit })}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quotes</h1>
          <p className="text-muted-foreground">Create and manage sales quotes</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Create Quote
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Quotes</div>
          <div className="text-2xl font-bold">{quotes.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Value</div>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Accepted Value</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(acceptedValue)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Conversion Rate</div>
          <div className="text-2xl font-bold">
            {quotes.length > 0
              ? ((quotes.filter((q) => q.status === 'ACCEPTED').length / quotes.length) * 100).toFixed(0)
              : 0}%
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quotes..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 border rounded-lg p-1 overflow-x-auto">
            <Button
              variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <Button
                key={key}
                variant={statusFilter === key ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(key)}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredQuotes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
          <FileText className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No quotes found</p>
          <Button onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Create your first quote
          </Button>
        </div>
      )}

      {/* Quotes Table */}
      {filteredQuotes.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Quote</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Valid Until</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleOpenView(quote)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-mono text-sm text-muted-foreground">
                            {quote.quoteNumber || quote.id}
                          </span>
                          <div className="font-medium">{quote.title || 'Untitled Quote'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">
                          {quote.contact?.displayName || quote.contact?.firstName || '-'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quote.contact?.company?.name || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        statusConfig[quote.status]?.color || 'bg-gray-100'
                      )}>
                        {statusConfig[quote.status]?.label || quote.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{formatCurrency(quote.total || 0)}</td>
                    <td className="p-4 text-sm">
                      {quote.validUntil
                        ? new Date(quote.validUntil).toLocaleDateString()
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
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenView(quote); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Quote
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Convert to Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Quote Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Quote</DialogTitle>
            <DialogDescription>
              Create a quote for your customer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quote Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Enterprise Solution Proposal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              />
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Line Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-28"
                    />
                    <span className="text-sm font-medium w-24 text-right">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-2 border-t">
                <span className="text-lg font-bold">
                  Total: {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Quote Sheet */}
      <Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Quote Details</SheetTitle>
            <SheetDescription>
              View quote information
            </SheetDescription>
          </SheetHeader>
          {currentQuote && (
            <div className="mt-6 space-y-6">
              {/* Quote Header */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <span className="font-mono text-sm text-muted-foreground">
                    {currentQuote.quoteNumber || currentQuote.id}
                  </span>
                  <h3 className="text-lg font-semibold">{currentQuote.title || 'Untitled Quote'}</h3>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    statusConfig[currentQuote.status]?.color || 'bg-gray-100'
                  )}>
                    {statusConfig[currentQuote.status]?.label || currentQuote.status}
                  </span>
                </div>
              </div>

              {/* Quote Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold">{formatCurrency(currentQuote.total || 0)}</span>
                </div>
                {currentQuote.contact && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Customer</span>
                    <span className="text-sm">{currentQuote.contact.displayName || '-'}</span>
                  </div>
                )}
                {currentQuote.validUntil && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Valid Until</span>
                    <span className="text-sm">
                      {new Date(currentQuote.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {currentQuote.createdAt
                      ? new Date(currentQuote.createdAt).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button className="flex-1">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Convert to Invoice
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
