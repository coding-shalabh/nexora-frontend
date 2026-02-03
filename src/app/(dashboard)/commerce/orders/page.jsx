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
      {
        label: 'Total Orders',
        value: total,
        icon: ShoppingCart,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
      },
      {
        label: 'Pending',
        value: pending,
        icon: Clock,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
      },
      {
        label: 'Completed',
        value: completed,
        icon: CheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
      },
      {
        label: 'Total Value',
        value: formatCurrency(totalValue, 'INR'),
        icon: DollarSign,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
      },
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/commerce/invoices/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                    <Icon className={cn('h-5 w-5', stat.textColor)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SENT">Pending</SelectItem>
            <SelectItem value="PAID">Completed</SelectItem>
            <SelectItem value="PARTIALLY_PAID">Partial Payment</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
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
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fulfillment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || statusFilter !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Create your first order to get started'}
                      </p>
                      {!searchQuery && statusFilter === 'all' && (
                        <Link href="/commerce/invoices/new">
                          <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Order
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.DRAFT;
                  const fulfillment = fulfillmentConfig.UNFULFILLED; // Default since we don't have fulfillment tracking yet
                  const StatusIcon = status.icon;
                  const FulfillmentIcon = fulfillment.icon;

                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/commerce/invoices/${order.id}`)}
                    >
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {order.invoiceNumber || `ORD-${order.id.slice(0, 8)}`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {order.contact?.firstName} {order.contact?.lastName}
                          </p>
                          {order.contact?.company?.name && (
                            <p className="text-sm text-muted-foreground">
                              {order.contact.company.name}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{formatDate(order.issueDate || order.createdAt)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(order.createdAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold">
                          {formatCurrency(
                            parseFloat(order.totalAmount) || 0,
                            order.currency || 'INR'
                          )}
                        </p>
                        {order.lines && order.lines.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {order.lines.length} item{order.lines.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('capitalize gap-1', status.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('capitalize gap-1', fulfillment.color)}>
                          <FulfillmentIcon className="h-3 w-3" />
                          {fulfillment.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
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
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
