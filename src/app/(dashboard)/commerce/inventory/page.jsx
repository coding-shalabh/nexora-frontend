'use client';

import { useState } from 'react';
import { Package, Search, Plus, AlertTriangle, CheckCircle, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const mockInventory = [
  { id: 1, sku: 'PRD-001', name: 'Premium License', stock: 999, reorder: 10, status: 'in-stock' },
  { id: 2, sku: 'PRD-002', name: 'Enterprise Pack', stock: 50, reorder: 20, status: 'in-stock' },
  { id: 3, sku: 'PRD-003', name: 'Starter Kit', stock: 5, reorder: 15, status: 'low-stock' },
  { id: 4, sku: 'PRD-004', name: 'Add-on Module', stock: 0, reorder: 10, status: 'out-of-stock' },
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    createStat('Total Products', mockInventory.length, Package, 'primary'),
    createStat(
      'In Stock',
      mockInventory.filter((i) => i.status === 'in-stock').length,
      CheckCircle,
      'green'
    ),
    createStat(
      'Low Stock',
      mockInventory.filter((i) => i.status === 'low-stock').length,
      AlertTriangle,
      'amber'
    ),
    createStat(
      'Out of Stock',
      mockInventory.filter((i) => i.status === 'out-of-stock').length,
      AlertTriangle,
      'red'
    ),
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'in-stock': 'bg-green-100 text-green-700',
      'low-stock': 'bg-amber-100 text-amber-700',
      'out-of-stock': 'bg-red-100 text-red-700',
    };
    return <Badge className={styles[status]}>{status.replace('-', ' ')}</Badge>;
  };

  return (
    <UnifiedLayout hubId="commerce" pageTitle="Inventory" stats={stats} fixedMenu={null}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Reorder Point</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>{item.reorder}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Adjust
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </UnifiedLayout>
  );
}
