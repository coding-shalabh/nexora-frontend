'use client';

import { useState } from 'react';
import { Package, Plus, Minus, ArrowUpDown, History, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

const mockProducts = [
  { id: 1, sku: 'PRD-001', name: 'Premium License', stock: 999 },
  { id: 2, sku: 'PRD-002', name: 'Enterprise Pack', stock: 50 },
  { id: 3, sku: 'PRD-003', name: 'Starter Kit', stock: 5 },
  { id: 4, sku: 'PRD-004', name: 'Add-on Module', stock: 0 },
];

const recentAdjustments = [
  {
    id: 1,
    product: 'Premium License',
    type: 'add',
    quantity: 100,
    date: '2024-03-10',
    reason: 'New stock received',
  },
  {
    id: 2,
    product: 'Starter Kit',
    type: 'remove',
    quantity: 5,
    date: '2024-03-09',
    reason: 'Damaged goods',
  },
  {
    id: 3,
    product: 'Enterprise Pack',
    type: 'add',
    quantity: 25,
    date: '2024-03-08',
    reason: 'Restock',
  },
];

export default function InventoryAdjustPage() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [quantity, setQuantity] = useState('');

  const stats = [
    createStat('Total Products', mockProducts.length, Package, 'primary'),
    createStat('Recent Adjustments', recentAdjustments.length, History, 'blue'),
    createStat('Additions Today', 1, Plus, 'green'),
    createStat('Removals Today', 1, Minus, 'amber'),
  ];

  return (
    <HubLayout
      hubId="commerce"
      title="Adjust Inventory"
      description="Make manual adjustments to your inventory levels"
      stats={stats}
      showFixedMenu={false}
    >
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                New Adjustment
              </CardTitle>
              <CardDescription>Add or remove stock from inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.sku} - {product.name} (Stock: {product.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Adjustment Type</Label>
                <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="remove">Remove Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label>Reason</Label>
                <Input placeholder="Enter reason for adjustment" />
              </div>

              <Button className="w-full gap-2">
                <CheckCircle className="h-4 w-4" />
                Submit Adjustment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Adjustments
              </CardTitle>
              <CardDescription>Last 3 inventory adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAdjustments.map((adj) => (
                  <div
                    key={adj.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{adj.product}</p>
                      <p className="text-sm text-muted-foreground">{adj.reason}</p>
                      <p className="text-xs text-muted-foreground">{adj.date}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${adj.type === 'add' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {adj.type === 'add' ? (
                        <Plus className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                      {adj.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HubLayout>
  );
}
