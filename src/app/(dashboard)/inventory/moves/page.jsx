'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowDownUp,
  Plus,
  Search,
  Filter,
  Download,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Package,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

// Mock stock moves data
const stockMoves = [
  {
    id: 'MOV-001',
    date: '2026-01-19 10:30',
    type: 'in',
    product: 'Widget Pro',
    sku: 'WGT-001',
    qty: 100,
    from: 'Supplier: ABC Corp',
    to: 'Main Warehouse',
    reference: 'PO-2024-0156',
    status: 'completed',
  },
  {
    id: 'MOV-002',
    date: '2026-01-19 09:15',
    type: 'out',
    product: 'Gadget Plus',
    sku: 'GDG-042',
    qty: 25,
    from: 'Main Warehouse',
    to: 'Customer: XYZ Ltd',
    reference: 'SO-2024-0892',
    status: 'completed',
  },
  {
    id: 'MOV-003',
    date: '2026-01-18 16:45',
    type: 'transfer',
    product: 'Component X',
    sku: 'CMP-108',
    qty: 50,
    from: 'East Warehouse',
    to: 'Main Warehouse',
    reference: 'TR-2024-0043',
    status: 'completed',
  },
  {
    id: 'MOV-004',
    date: '2026-01-18 14:20',
    type: 'adjustment',
    product: 'Part Y-200',
    sku: 'PRT-200',
    qty: -5,
    from: 'West Warehouse',
    to: 'Adjustment (Damaged)',
    reference: 'ADJ-2024-0021',
    status: 'completed',
  },
  {
    id: 'MOV-005',
    date: '2026-01-18 11:00',
    type: 'in',
    product: 'Accessory Bundle',
    sku: 'ACC-050',
    qty: 200,
    from: 'Supplier: DEF Inc',
    to: 'Distribution Center',
    reference: 'PO-2024-0157',
    status: 'pending',
  },
];

const stats = [
  { label: 'Stock In (Today)', value: '300', icon: ArrowDown, color: 'text-green-600' },
  { label: 'Stock Out (Today)', value: '125', icon: ArrowUp, color: 'text-red-600' },
  { label: 'Transfers (Week)', value: '12', icon: ArrowRight, color: 'text-blue-600' },
  { label: 'Adjustments (Week)', value: '8', icon: ArrowDownUp, color: 'text-orange-600' },
];

const getTypeConfig = (type) => {
  const configs = {
    in: { badge: 'bg-green-100 text-green-700', label: 'Stock In', icon: ArrowDown },
    out: { badge: 'bg-red-100 text-red-700', label: 'Stock Out', icon: ArrowUp },
    transfer: { badge: 'bg-blue-100 text-blue-700', label: 'Transfer', icon: ArrowRight },
    adjustment: { badge: 'bg-orange-100 text-orange-700', label: 'Adjustment', icon: ArrowDownUp },
  };
  return configs[type] || configs.in;
};

export default function InventoryMovesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const layoutStats = [
    createStat('Stock In (Today)', '300', ArrowDown, 'green'),
    createStat('Stock Out (Today)', '125', ArrowUp, 'red'),
    createStat('Transfers (Week)', '12', ArrowRight, 'blue'),
    createStat('Adjustments (Week)', '8', ArrowDownUp, 'amber'),
  ];

  return (
    <UnifiedLayout
      hubId="inventory"
      pageTitle="Stock Movements"
      stats={layoutStats}
      fixedMenu={null}
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stock Movements</h1>
            <p className="text-muted-foreground">Track all inventory ins, outs, and transfers</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Link href="/inventory/moves/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Movement
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
                  placeholder="Search by product, SKU, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Movements Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ArrowDownUp className="h-4 w-4" />
              Movement History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockMoves.map((move) => {
                  const typeConfig = getTypeConfig(move.type);
                  return (
                    <TableRow key={move.id}>
                      <TableCell className="font-mono text-sm">{move.id}</TableCell>
                      <TableCell className="text-sm">{move.date}</TableCell>
                      <TableCell>
                        <Badge className={typeConfig.badge}>
                          <typeConfig.icon className="h-3 w-3 mr-1" />
                          {typeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{move.product}</p>
                          <p className="text-xs text-muted-foreground font-mono">{move.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={cn(move.qty > 0 ? 'text-green-600' : 'text-red-600')}>
                          {move.qty > 0 ? '+' : ''}
                          {move.qty}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{move.from}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{move.to}</TableCell>
                      <TableCell className="font-mono text-sm">{move.reference}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            move.status === 'completed' && 'bg-green-100 text-green-700',
                            move.status === 'pending' && 'bg-yellow-100 text-yellow-700'
                          )}
                        >
                          {move.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
