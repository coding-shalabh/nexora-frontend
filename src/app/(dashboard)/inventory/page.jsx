'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Warehouse,
  Package,
  PackageSearch,
  Truck,
  ArrowDownUp,
  ClipboardCheck,
  Plus,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

// Quick actions
const quickActions = [
  {
    label: 'Add Product',
    href: '/inventory/products/new',
    icon: Package,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'Stock Adjustment',
    href: '/inventory/moves/new',
    icon: ArrowDownUp,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Purchase Order',
    href: '/inventory/purchase/new',
    icon: ClipboardCheck,
    color: 'from-orange-500 to-amber-500',
  },
  {
    label: 'Create Shipment',
    href: '/inventory/shipping/new',
    icon: Truck,
    color: 'from-purple-500 to-pink-500',
  },
];

// Low stock alerts
const lowStockItems = [
  { name: 'Widget A', sku: 'WGT-001', current: 5, reorder: 20, warehouse: 'Main Warehouse' },
  { name: 'Gadget Pro', sku: 'GDG-042', current: 8, reorder: 25, warehouse: 'East Warehouse' },
  { name: 'Component X', sku: 'CMP-108', current: 3, reorder: 15, warehouse: 'Main Warehouse' },
  { name: 'Part Y-200', sku: 'PRT-200', current: 12, reorder: 30, warehouse: 'West Warehouse' },
];

// Recent stock moves
const recentMoves = [
  {
    id: 'MOV-001',
    product: 'Widget A',
    type: 'in',
    qty: 100,
    from: 'Supplier',
    to: 'Main Warehouse',
    date: '2 hours ago',
  },
  {
    id: 'MOV-002',
    product: 'Gadget Pro',
    type: 'out',
    qty: 25,
    from: 'Main Warehouse',
    to: 'Customer Order',
    date: '4 hours ago',
  },
  {
    id: 'MOV-003',
    product: 'Component X',
    type: 'transfer',
    qty: 50,
    from: 'East Warehouse',
    to: 'Main Warehouse',
    date: '1 day ago',
  },
];

// Inventory tools
const tools = [
  { name: 'Products', description: 'Product catalog', href: '/inventory/products', icon: Package },
  {
    name: 'Warehouses',
    description: 'Storage locations',
    href: '/inventory/warehouses',
    icon: Warehouse,
  },
  {
    name: 'Stock Levels',
    description: 'Current inventory',
    href: '/inventory/stock',
    icon: PackageSearch,
  },
  {
    name: 'Stock Moves',
    description: 'In/Out movements',
    href: '/inventory/moves',
    icon: ArrowDownUp,
  },
  {
    name: 'Purchase Orders',
    description: 'Order from suppliers',
    href: '/inventory/purchase',
    icon: ClipboardCheck,
  },
  {
    name: 'Shipping',
    description: 'Outbound deliveries',
    href: '/inventory/shipping',
    icon: Truck,
  },
];

export default function InventoryHubPage() {
  // Stats for HubLayout
  const stats = [
    createStat('Total Products', '1,247', Package, 'blue'),
    createStat('Warehouses', '4', Warehouse, 'green'),
    createStat('Low Stock Items', '18', AlertTriangle, 'amber'),
    createStat('Pending Orders', '32', ClipboardCheck, 'purple'),
  ];

  return (
    <HubLayout
      hubId="inventory"
      title="Inventory Overview"
      description="Manage products, warehouses, stock levels, and shipments"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={action.href}>
                <Card className="hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg bg-gradient-to-br', action.color)}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">
                      {action.label}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Low Stock Alerts */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Low Stock Alerts
              </CardTitle>
              <Link href="/inventory/stock?filter=low">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.sku}
                    className="flex items-center gap-4 p-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20"
                  >
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.name}</p>
                        <Badge variant="outline" className="text-xs font-mono">
                          {item.sku}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.warehouse}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">{item.current}</p>
                      <p className="text-xs text-muted-foreground">Reorder at {item.reorder}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Stock Moves */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Recent Stock Moves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMoves.map((move) => (
                  <div key={move.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        className={cn(
                          'text-xs capitalize',
                          move.type === 'in' && 'bg-green-100 text-green-700',
                          move.type === 'out' && 'bg-red-100 text-red-700',
                          move.type === 'transfer' && 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {move.type === 'in'
                          ? 'Stock In'
                          : move.type === 'out'
                            ? 'Stock Out'
                            : 'Transfer'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{move.date}</span>
                    </div>
                    <p className="font-medium text-sm">{move.product}</p>
                    <p className="text-xs text-muted-foreground">Qty: {move.qty}</p>
                    <p className="text-xs text-muted-foreground">
                      {move.from} → {move.to}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Moves
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Tools */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Inventory Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {tools.map((tool) => (
                <Link key={tool.name} href={tool.href}>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer text-center">
                    <tool.icon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Capacity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Warehouse Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: 'Main Warehouse', used: 75, total: '10,000 units' },
                { name: 'East Warehouse', used: 45, total: '5,000 units' },
                { name: 'West Warehouse', used: 88, total: '3,000 units' },
                { name: 'Distribution Center', used: 32, total: '8,000 units' },
              ].map((wh) => (
                <div key={wh.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{wh.name}</span>
                    <span className="font-medium">{wh.used}%</span>
                  </div>
                  <Progress
                    value={wh.used}
                    className={cn('h-2', wh.used > 80 && '[&>div]:bg-orange-500')}
                  />
                  <p className="text-xs text-muted-foreground">Capacity: {wh.total}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}
