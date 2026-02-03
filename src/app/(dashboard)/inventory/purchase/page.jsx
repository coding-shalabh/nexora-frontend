'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Mock purchase orders data
const purchaseOrders = [
  {
    id: 'PO-2024-0157',
    date: '2026-01-19',
    supplier: 'ABC Corp',
    items: 5,
    total: 12500.0,
    status: 'pending',
    expectedDate: '2026-01-25',
  },
  {
    id: 'PO-2024-0156',
    date: '2026-01-18',
    supplier: 'DEF Inc',
    items: 3,
    total: 8750.0,
    status: 'approved',
    expectedDate: '2026-01-24',
  },
  {
    id: 'PO-2024-0155',
    date: '2026-01-17',
    supplier: 'GHI Supplies',
    items: 8,
    total: 23400.0,
    status: 'shipped',
    expectedDate: '2026-01-22',
  },
  {
    id: 'PO-2024-0154',
    date: '2026-01-15',
    supplier: 'JKL Manufacturing',
    items: 2,
    total: 5600.0,
    status: 'received',
    expectedDate: '2026-01-20',
  },
  {
    id: 'PO-2024-0153',
    date: '2026-01-14',
    supplier: 'MNO Parts',
    items: 4,
    total: 3200.0,
    status: 'cancelled',
    expectedDate: '2026-01-21',
  },
];

const stats = [
  { label: 'Pending Orders', value: '12', icon: Clock, color: 'text-yellow-600' },
  { label: 'In Transit', value: '8', icon: Truck, color: 'text-blue-600' },
  { label: 'Received (Month)', value: '45', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Total Value', value: '$156K', icon: ClipboardCheck, color: 'text-purple-600' },
];

const getStatusConfig = (status) => {
  const configs = {
    pending: { badge: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
    approved: { badge: 'bg-blue-100 text-blue-700', label: 'Approved' },
    shipped: { badge: 'bg-purple-100 text-purple-700', label: 'Shipped' },
    received: { badge: 'bg-green-100 text-green-700', label: 'Received' },
    cancelled: { badge: 'bg-red-100 text-red-700', label: 'Cancelled' },
  };
  return configs[status] || configs.pending;
};

export default function InventoryPurchasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage orders from your suppliers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/inventory/purchase/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Purchase Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by PO number or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Purchase Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => {
                const statusConfig = getStatusConfig(po.status);
                return (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono font-medium">{po.id}</TableCell>
                    <TableCell>{po.date}</TableCell>
                    <TableCell className="font-medium">{po.supplier}</TableCell>
                    <TableCell className="text-right">{po.items}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${po.total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{po.expectedDate}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig.badge}>{statusConfig.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          {po.status === 'shipped' && (
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" /> Mark Received
                            </DropdownMenuItem>
                          )}
                          {po.status === 'pending' && (
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="h-4 w-4 mr-2" /> Cancel
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
