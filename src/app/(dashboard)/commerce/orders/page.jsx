'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  ShoppingCart,
  Eye,
  Edit,
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  Loader2,
  FileText,
  RefreshCw,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useBilling, formatCurrency } from '@/hooks/use-billing';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const statusConfig = {
  DRAFT: { label: 'Draft', icon: Clock, color: 'bg-gray-100 text-gray-700' },
  SENT: { label: 'Pending', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  VIEWED: { label: 'Viewed', icon: Eye, color: 'bg-purple-100 text-purple-700' },
  PAID: { label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  PARTIALLY_PAID: { label: 'Partial', icon: DollarSign, color: 'bg-yellow-100 text-yellow-700' },
  OVERDUE: { label: 'Overdue', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'bg-gray-100 text-gray-500' },
  VOIDED: { label: 'Voided', icon: XCircle, color: 'bg-gray-100 text-gray-500' },
};

const fulfillmentConfig = {
  UNFULFILLED: { label: 'Unfulfilled', icon: Package, color: 'bg-yellow-100 text-yellow-700' },
  PARTIAL: { label: 'Partial', icon: Truck, color: 'bg-blue-100 text-blue-700' },
  FULFILLED: { label: 'Fulfilled', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
};

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { invoices, loading, error, fetchInvoices, sendInvoice } = useBilling();

  useEffect(() => {
    fetchInvoices({ limit: 100 });
  }, [fetchInvoices]);

  // Filter orders (invoices as orders)
  const filteredOrders = useMemo(() => {
    return invoices.filter((order) => {
      const matchesSearch =
        order.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.contact?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.contact?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.contact?.company?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = invoices.length;
    const pending = invoices.filter((o) => o.status === 'SENT' || o.status === 'VIEWED').length;
    const completed = invoices.filter((o) => o.status === 'PAID').length;
    const totalValue = invoices.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

    return [
      createStat('Total Orders', total, ShoppingCart, 'blue'),
      createStat('Pending', pending, Clock, 'amber'),
      createStat('Completed', completed, CheckCircle, 'green'),
      createStat('Total Value', formatCurrency(totalValue, 'INR'), DollarSign, 'purple'),
    ];
  }, [invoices]);

  const handleRefresh = () => {
    fetchInvoices({ limit: 100 });
    toast({
      title: 'Refreshed',
      description: 'Order list has been refreshed',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exporting orders',
      description: 'Your orders are being exported to CSV.',
    });
  };

  const handleSendOrder = async (order) => {
    try {
      await sendInvoice(order.id);
      toast({
        title: 'Order sent',
        description: `Order ${order.invoiceNumber} has been sent to the customer.`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send order',
        variant: 'destructive',
      });
    }
  };

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'create', label: 'Create Order', icon: Plus, variant: 'default' }],
    secondaryActions: [
      { id: 'refresh', label: 'Refresh', icon: RefreshCw, variant: 'ghost' },
      { id: 'export', label: 'Export', icon: Download, variant: 'ghost' },
    ],
    filters: {
      quickFilters: [
        { id: 'all', label: 'All Status' },
        { id: 'DRAFT', label: 'Draft' },
        { id: 'SENT', label: 'Pending' },
        { id: 'PAID', label: 'Completed' },
        { id: 'PARTIALLY_PAID', label: 'Partial' },
        { id: 'OVERDUE', label: 'Overdue' },
        { id: 'CANCELLED', label: 'Cancelled' },
      ],
    },
  };

  const handleAction = (actionId) => {
    if (actionId === 'create') {
      router.push('/commerce/invoices/new');
    } else if (actionId === 'refresh') {
      handleRefresh();
    } else if (actionId === 'export') {
      handleExport();
    }
  };

  // Order card component for list
  const OrderCard = ({ order }) => {
    const status = statusConfig[order.status] || statusConfig.DRAFT;
    const fulfillment = fulfillmentConfig.UNFULFILLED;
    const StatusIcon = status.icon;
    const FulfillmentIcon = fulfillment.icon;

    return (
      <Card
        className={cn(
          'p-4 hover:shadow-md transition-shadow cursor-pointer',
          selectedOrder?.id === order.id && 'ring-2 ring-primary'
        )}
        onClick={() => setSelectedOrder(order)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-mono">
                {order.invoiceNumber || `ORD-${order.id.slice(0, 8)}`}
              </Badge>
              <Badge className={cn('capitalize gap-1', status.color)}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>
            <div>
              <p className="font-medium">
                {order.contact?.firstName} {order.contact?.lastName}
              </p>
              {order.contact?.company?.name && (
                <p className="text-sm text-muted-foreground">{order.contact.company.name}</p>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <p className="font-bold">
                {formatCurrency(parseFloat(order.totalAmount) || 0, order.currency || 'INR')}
              </p>
              {order.lines && order.lines.length > 0 && (
                <p className="text-muted-foreground">
                  {order.lines.length} item{order.lines.length !== 1 ? 's' : ''}
                </p>
              )}
              <p className="text-muted-foreground ml-auto">
                {formatTimeAgo(order.issueDate || order.createdAt)}
              </p>
            </div>
          </div>
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
                  router.push(`/commerce/invoices/${order.id}`);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/commerce/invoices/${order.id}/edit`);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <FileText className="h-4 w-4 mr-2" />
                Download Invoice
              </DropdownMenuItem>
              {order.status === 'DRAFT' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendOrder(order);
                    }}
                    className="text-blue-600"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Send to Customer
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    );
  };

  // Order detail component
  const OrderDetail = ({ order }) => {
    if (!order) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No order selected</h3>
            <p className="text-muted-foreground">Select an order from the list to view details</p>
          </div>
        </div>
      );
    }

    const status = statusConfig[order.status] || statusConfig.DRAFT;
    const fulfillment = fulfillmentConfig.UNFULFILLED;
    const StatusIcon = status.icon;
    const FulfillmentIcon = fulfillment.icon;

    return (
      <div className="h-full overflow-y-auto p-6">
        {/* Order Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-muted-foreground text-sm">
              {order.invoiceNumber || `ORD-${order.id.slice(0, 8)}`}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Badge className={cn('capitalize gap-1', status.color)}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
            <Badge className={cn('capitalize gap-1', fulfillment.color)}>
              <FulfillmentIcon className="h-3 w-3" />
              {fulfillment.label}
            </Badge>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Customer</h4>
          <div className="space-y-2">
            <p className="font-medium">
              {order.contact?.firstName} {order.contact?.lastName}
            </p>
            {order.contact?.email && (
              <p className="text-sm text-muted-foreground">{order.contact.email}</p>
            )}
            {order.contact?.company?.name && (
              <p className="text-sm text-muted-foreground">{order.contact.company.name}</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        {order.lines && order.lines.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Items</h4>
            <div className="space-y-2">
              {order.lines.map((line, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{line.description || line.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {line.quantity} ×{' '}
                      {formatCurrency(parseFloat(line.unitPrice) || 0, order.currency || 'INR')}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(
                      (parseFloat(line.quantity) || 0) * (parseFloat(line.unitPrice) || 0),
                      order.currency || 'INR'
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Summary</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(parseFloat(order.subtotal) || 0, order.currency || 'INR')}
              </span>
            </div>
            {order.taxAmount && parseFloat(order.taxAmount) > 0 && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Tax</span>
                <span className="font-medium">
                  {formatCurrency(parseFloat(order.taxAmount) || 0, order.currency || 'INR')}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 border-t pt-2">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">
                {formatCurrency(parseFloat(order.totalAmount) || 0, order.currency || 'INR')}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Details</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Issue Date</span>
              <span>{formatDate(order.issueDate || order.createdAt)}</span>
            </div>
            {order.dueDate && (
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span>{formatDate(order.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Created</span>
              <span>{formatTimeAgo(order.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1" onClick={() => router.push(`/commerce/invoices/${order.id}`)}>
            <Eye className="h-4 w-4 mr-2" />
            View Full Invoice
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`/commerce/invoices/${order.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    );
  };

  const fixedMenuListContent = (
    <div className="space-y-2 p-4">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders by ID or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-muted-foreground">Failed to load orders</p>
          <Button variant="outline" onClick={() => fetchInvoices({ limit: 100 })}>
            Try Again
          </Button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first order to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => router.push('/commerce/invoices/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          )}
        </div>
      ) : (
        filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );

  return (
    <UnifiedLayout hubId="commerce" pageTitle="Orders" stats={stats} fixedMenu={null}>
      <div className="flex h-full">
        {/* Fixed Menu Panel */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <FixedMenuPanel
            config={fixedMenuConfig}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
            onAction={handleAction}
            className="p-4"
          />
          <div className="flex-1 overflow-auto">{fixedMenuListContent}</div>
        </div>
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <OrderDetail order={selectedOrder} />
        </div>
      </div>
    </UnifiedLayout>
  );
}
