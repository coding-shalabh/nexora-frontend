'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PackageSearch,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Mock stock levels data
const stockItems = [
  {
    id: 1,
    sku: 'WGT-001',
    name: 'Widget Pro',
    warehouse: 'Main Warehouse',
    current: 150,
    reserved: 25,
    available: 125,
    reorderLevel: 50,
    maxStock: 300,
    status: 'optimal',
  },
  {
    id: 2,
    sku: 'GDG-042',
    name: 'Gadget Plus',
    warehouse: 'Main Warehouse',
    current: 8,
    reserved: 3,
    available: 5,
    reorderLevel: 25,
    maxStock: 100,
    status: 'low',
  },
  {
    id: 3,
    sku: 'CMP-108',
    name: 'Component X',
    warehouse: 'East Warehouse',
    current: 3,
    reserved: 0,
    available: 3,
    reorderLevel: 15,
    maxStock: 50,
    status: 'critical',
  },
  {
    id: 4,
    sku: 'PRT-200',
    name: 'Part Y-200',
    warehouse: 'West Warehouse',
    current: 200,
    reserved: 50,
    available: 150,
    reorderLevel: 30,
    maxStock: 250,
    status: 'optimal',
  },
  {
    id: 5,
    sku: 'ACC-050',
    name: 'Accessory Bundle',
    warehouse: 'Distribution Center',
    current: 0,
    reserved: 0,
    available: 0,
    reorderLevel: 20,
    maxStock: 80,
    status: 'out',
  },
];

const stats = [
  { label: 'Total SKUs', value: '1,247', icon: PackageSearch, color: 'text-blue-600' },
  { label: 'Optimal Stock', value: '1,089', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Low Stock', value: '112', icon: AlertTriangle, color: 'text-orange-600' },
  { label: 'Out of Stock', value: '46', icon: XCircle, color: 'text-red-600' },
];

const getStatusConfig = (status) => {
  const configs = {
    optimal: { badge: 'bg-green-100 text-green-700', label: 'Optimal', icon: CheckCircle },
    low: { badge: 'bg-orange-100 text-orange-700', label: 'Low Stock', icon: AlertTriangle },
    critical: { badge: 'bg-red-100 text-red-700', label: 'Critical', icon: AlertTriangle },
    out: { badge: 'bg-gray-100 text-gray-700', label: 'Out of Stock', icon: XCircle },
  };
  return configs[status] || configs.optimal;
};

export default function InventoryStockPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Levels</h1>
          <p className="text-muted-foreground">Monitor inventory across all warehouses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Stock Report
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
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
                placeholder="Search by SKU or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                <SelectItem value="main">Main Warehouse</SelectItem>
                <SelectItem value="east">East Warehouse</SelectItem>
                <SelectItem value="west">West Warehouse</SelectItem>
                <SelectItem value="dist">Distribution Center</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="optimal">Optimal</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <PackageSearch className="h-4 w-4" />
            Stock Levels by Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                const stockPercent = Math.round((item.current / item.maxStock) * 100);
                const reorderPercent = Math.round((item.reorderLevel / item.maxStock) * 100);

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.warehouse}
                    </TableCell>
                    <TableCell className="text-right font-medium">{item.current}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.reserved}
                    </TableCell>
                    <TableCell className="text-right font-medium">{item.available}</TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="relative">
                          <Progress
                            value={stockPercent}
                            className={cn(
                              'h-2',
                              item.status === 'optimal' && '[&>div]:bg-green-500',
                              item.status === 'low' && '[&>div]:bg-orange-500',
                              item.status === 'critical' && '[&>div]:bg-red-500',
                              item.status === 'out' && '[&>div]:bg-gray-300'
                            )}
                          />
                          {/* Reorder level marker */}
                          <div
                            className="absolute top-0 h-2 w-0.5 bg-red-500"
                            style={{ left: `${reorderPercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.current} / {item.maxStock}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.badge}>{statusConfig.label}</Badge>
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
