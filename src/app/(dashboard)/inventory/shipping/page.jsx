'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Truck,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Package,
  Clock,
  CheckCircle,
  MapPin,
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

// Mock shipments data
const shipments = [
  {
    id: 'SHP-2024-0089',
    date: '2026-01-19',
    order: 'SO-2024-0892',
    customer: 'XYZ Ltd',
    items: 3,
    carrier: 'BlueDart',
    tracking: 'BD12345678',
    status: 'in-transit',
    destination: 'Mumbai, Maharashtra',
  },
  {
    id: 'SHP-2024-0088',
    date: '2026-01-18',
    order: 'SO-2024-0891',
    customer: 'ABC Industries',
    items: 5,
    carrier: 'DTDC',
    tracking: 'DT98765432',
    status: 'delivered',
    destination: 'Delhi, NCR',
  },
  {
    id: 'SHP-2024-0087',
    date: '2026-01-18',
    order: 'SO-2024-0890',
    customer: 'PQR Corp',
    items: 2,
    carrier: 'FedEx',
    tracking: 'FX11223344',
    status: 'processing',
    destination: 'Bangalore, Karnataka',
  },
  {
    id: 'SHP-2024-0086',
    date: '2026-01-17',
    order: 'SO-2024-0889',
    customer: 'LMN Solutions',
    items: 8,
    carrier: 'Delhivery',
    tracking: 'DL55667788',
    status: 'out-for-delivery',
    destination: 'Chennai, Tamil Nadu',
  },
  {
    id: 'SHP-2024-0085',
    date: '2026-01-16',
    order: 'SO-2024-0888',
    customer: 'STU Enterprises',
    items: 1,
    carrier: 'BlueDart',
    tracking: 'BD99887766',
    status: 'returned',
    destination: 'Kolkata, West Bengal',
  },
];

const stats = [
  { label: 'Processing', value: '8', icon: Package, color: 'text-yellow-600' },
  { label: 'In Transit', value: '23', icon: Truck, color: 'text-blue-600' },
  { label: 'Delivered (Week)', value: '156', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Pending Pickup', value: '5', icon: Clock, color: 'text-orange-600' },
];

const getStatusConfig = (status) => {
  const configs = {
    processing: { badge: 'bg-yellow-100 text-yellow-700', label: 'Processing' },
    'in-transit': { badge: 'bg-blue-100 text-blue-700', label: 'In Transit' },
    'out-for-delivery': { badge: 'bg-purple-100 text-purple-700', label: 'Out for Delivery' },
    delivered: { badge: 'bg-green-100 text-green-700', label: 'Delivered' },
    returned: { badge: 'bg-red-100 text-red-700', label: 'Returned' },
  };
  return configs[status] || configs.processing;
};

export default function InventoryShippingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipping</h1>
          <p className="text-muted-foreground">Track outbound deliveries and shipments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/inventory/shipping/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Shipment
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
                placeholder="Search by shipment ID, order, or tracking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => {
                const statusConfig = getStatusConfig(shipment.status);
                return (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-mono font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.date}</TableCell>
                    <TableCell className="font-mono text-sm">{shipment.order}</TableCell>
                    <TableCell className="font-medium">{shipment.customer}</TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell className="font-mono text-sm">{shipment.tracking}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {shipment.destination}
                      </div>
                    </TableCell>
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
                            <MapPin className="h-4 w-4 mr-2" /> Track Shipment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
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
