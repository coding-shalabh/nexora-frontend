'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  CreditCard,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Eye,
  X,
  Building2,
  User,
  FileText,
  Loader2,
  Receipt,
  Banknote,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useBilling, formatCurrency } from '@/hooks/use-billing';
import { useContacts } from '@/hooks/use-contacts';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  COMPLETED: { label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  PENDING: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  FAILED: { label: 'Failed', icon: XCircle, color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Refunded', icon: RefreshCw, color: 'bg-purple-100 text-purple-700' },
};

const methodConfig = {
  CARD: { label: 'Card', icon: CreditCard },
  BANK_TRANSFER: { label: 'Bank Transfer', icon: Banknote },
  CASH: { label: 'Cash', icon: Wallet },
  WALLET: { label: 'Wallet', icon: Wallet },
  UPI: { label: 'UPI', icon: Receipt },
  CHECK: { label: 'Check', icon: FileText },
};

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PaymentsPage() {
  const { toast } = useToast();
  const { payments, loading, fetchPayments, recordPayment, fetchInvoices, invoices } = useBilling();
  const { data: contactsData } = useContacts();
  const contacts = contactsData?.data || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: '',
    method: 'CARD',
    transactionId: '',
    notes: '',
  });

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, [fetchPayments, fetchInvoices]);

  const filteredPayments = (payments || []).filter((payment) => {
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        payment.id?.toLowerCase().includes(query) ||
        payment.transactionId?.toLowerCase().includes(query) ||
        payment.invoice?.contact?.firstName?.toLowerCase().includes(query) ||
        payment.invoice?.contact?.lastName?.toLowerCase().includes(query) ||
        payment.invoice?.contact?.company?.name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const completedAmount = (payments || [])
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = (payments || [])
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleRecordPayment = async () => {
    if (!formData.invoiceId || !formData.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await recordPayment({
        invoiceId: formData.invoiceId,
        amount: parseFloat(formData.amount),
        method: formData.method,
        transactionId: formData.transactionId || undefined,
        notes: formData.notes || undefined,
      });
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      });
      setIsRecordOpen(false);
      setFormData({
        invoiceId: '',
        amount: '',
        method: 'CARD',
        transactionId: '',
        notes: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to record payment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setIsViewOpen(true);
  };

  const unpaidInvoices = (invoices || []).filter(
    (inv) => inv.status === 'SENT' || inv.status === 'OVERDUE'
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Track incoming payments</p>
        </div>
        <Button onClick={() => setIsRecordOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowDownLeft className="h-4 w-4 text-green-600" />
            Total Received
          </div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(completedAmount)}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-yellow-600" />
            Pending
          </div>
          <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Transactions</div>
          <div className="text-2xl font-bold">{payments?.length || 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Success Rate</div>
          <div className="text-2xl font-bold">
            {payments?.length > 0
              ? (
                  ((payments || []).filter((p) => p.status === 'COMPLETED').length /
                    payments.length) *
                  100
                ).toFixed(0)
              : 0}
            %
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Payments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPayments.length === 0 ? (
        <Card className="p-12 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No payments found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Record your first payment to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => setIsRecordOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPayments.map((payment) => {
            const status = statusConfig[payment.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;
            const method = methodConfig[payment.method] || methodConfig.CARD;
            const MethodIcon = method.icon;
            const contact = payment.invoice?.contact;
            const company = contact?.company;

            return (
              <Card key={payment.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'h-12 w-12 rounded-lg flex items-center justify-center',
                      status.color
                    )}
                  >
                    <StatusIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                      {company && (
                        <>
                          <span className="text-sm text-muted-foreground">from</span>
                          <span className="font-medium">{company.name}</span>
                        </>
                      )}
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', status.color)}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      {contact && (
                        <span>
                          {contact.firstName} {contact.lastName}
                        </span>
                      )}
                      {payment.invoice && (
                        <>
                          <span>•</span>
                          <span>Invoice: {payment.invoice.invoiceNumber}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MethodIcon className="h-3 w-3" />
                        {method.label}
                      </span>
                      {payment.transactionId && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-xs">{payment.transactionId}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(payment.createdAt)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewPayment(payment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewPayment(payment)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                          </DropdownMenuItem>
                          {payment.status === 'COMPLETED' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Process Refund
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Record Payment Modal */}
      <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Invoice *</Label>
              <Select
                value={formData.invoiceId}
                onValueChange={(value) => {
                  const invoice = invoices.find((i) => i.id === value);
                  setFormData({
                    ...formData,
                    invoiceId: value,
                    amount: invoice?.total?.toString() || '',
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice" />
                </SelectTrigger>
                <SelectContent>
                  {unpaidInvoices.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No unpaid invoices found
                    </div>
                  ) : (
                    unpaidInvoices.map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber} - {formatCurrency(invoice.total)} (
                        {invoice.contact?.firstName} {invoice.contact?.lastName})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value) => setFormData({ ...formData, method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(methodConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <config.icon className="h-4 w-4" />
                        {config.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Transaction ID</Label>
              <Input
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                placeholder="e.g., txn_abc123..."
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes about this payment..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsRecordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                'Record Payment'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Payment Sheet */}
      <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
        <SheetContent className="w-[500px] sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Payment Details</SheetTitle>
          </SheetHeader>
          {selectedPayment && (
            <div className="mt-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    statusConfig[selectedPayment.status]?.color
                  )}
                >
                  {statusConfig[selectedPayment.status]?.label || selectedPayment.status}
                </span>
              </div>

              {/* Amount */}
              <div className="text-center py-6 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Amount</div>
                <div className="text-4xl font-bold">
                  {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-sm">{selectedPayment.id}</span>
                </div>

                {selectedPayment.transactionId && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-sm">{selectedPayment.transactionId}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Method</span>
                  <span className="flex items-center gap-2">
                    {methodConfig[selectedPayment.method] && (
                      <>
                        {(() => {
                          const MethodIcon = methodConfig[selectedPayment.method].icon;
                          return <MethodIcon className="h-4 w-4" />;
                        })()}
                        {methodConfig[selectedPayment.method].label}
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span>{formatDateTime(selectedPayment.createdAt)}</span>
                </div>

                {selectedPayment.invoice && (
                  <>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground">Invoice</span>
                      <span className="font-medium">
                        {selectedPayment.invoice.invoiceNumber}
                      </span>
                    </div>

                    {selectedPayment.invoice.contact && (
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Customer</span>
                        <div className="text-right">
                          <div className="font-medium">
                            {selectedPayment.invoice.contact.firstName}{' '}
                            {selectedPayment.invoice.contact.lastName}
                          </div>
                          {selectedPayment.invoice.contact.company && (
                            <div className="text-sm text-muted-foreground">
                              {selectedPayment.invoice.contact.company.name}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedPayment.notes && (
                  <div className="py-2">
                    <span className="text-sm text-muted-foreground block mb-2">Notes</span>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedPayment.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                {selectedPayment.status === 'COMPLETED' && (
                  <Button variant="destructive" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
