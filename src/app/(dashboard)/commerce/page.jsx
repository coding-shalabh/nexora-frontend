'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Receipt,
  Plus,
  ArrowUpRight,
  RefreshCw,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

// Quick actions for commerce
const quickActions = [
  {
    label: 'Create Invoice',
    href: '/commerce/invoices/new',
    icon: Receipt,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Payment Link',
    href: '/commerce/payment-links/new',
    icon: LinkIcon,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'New Order',
    href: '/commerce/orders/new',
    icon: Package,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Add Product',
    href: '/commerce/products/new',
    icon: ShoppingCart,
    color: 'from-orange-500 to-amber-500',
  },
];

// Recent orders
const recentOrders = [
  {
    id: 'ORD-4521',
    customer: 'Acme Corp',
    amount: 2450,
    status: 'paid',
    date: '2 hours ago',
    items: 3,
  },
  {
    id: 'ORD-4520',
    customer: 'Tech Solutions',
    amount: 890,
    status: 'pending',
    date: '4 hours ago',
    items: 1,
  },
  {
    id: 'ORD-4519',
    customer: 'Design Studio',
    amount: 1200,
    status: 'paid',
    date: '6 hours ago',
    items: 2,
  },
  {
    id: 'ORD-4518',
    customer: 'StartupX',
    amount: 450,
    status: 'failed',
    date: '8 hours ago',
    items: 1,
  },
];

// Commerce tools
const tools = [
  { name: 'Orders', description: 'Manage orders', href: '/commerce/orders', icon: Package },
  { name: 'Invoices', description: 'Send invoices', href: '/commerce/invoices', icon: Receipt },
  {
    name: 'Subscriptions',
    description: 'Recurring billing',
    href: '/commerce/subscriptions',
    icon: RefreshCw,
  },
  {
    name: 'Payment Links',
    description: 'Quick payments',
    href: '/commerce/payment-links',
    icon: LinkIcon,
  },
  {
    name: 'Products',
    description: 'Product catalog',
    href: '/commerce/products',
    icon: ShoppingCart,
  },
  { name: 'Quotes', description: 'Sales quotes', href: '/commerce/quotes', icon: FileText },
];

export default function CommerceHubPage() {
  // Stats for HubLayout
  const statsForLayout = [
    createStat('Total Revenue', '$124,850', DollarSign, 'green'),
    createStat('Active Subscriptions', '347', RefreshCw, 'blue'),
    createStat('Pending Invoices', '23', Receipt, 'amber'),
    createStat('MRR', '$18,420', TrendingUp, 'purple'),
  ];

  return (
    <HubLayout
      hubId="commerce"
      title="Commerce Overview"
      description="Manage orders, invoices, subscriptions, and payments"
      stats={statsForLayout}
      showFixedMenu={false}
      actions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Invoice
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
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <Link href="/commerce/orders">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {order.id}
                        </Badge>
                        <p className="font-medium truncate">{order.customer}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>
                          {order.items} item{order.items > 1 ? 's' : ''}
                        </span>
                        <span>{order.date}</span>
                      </div>
                    </div>
                    <p className="font-bold">${order.amount.toLocaleString()}</p>
                    <Badge
                      className={cn(
                        'capitalize',
                        order.status === 'paid' && 'bg-green-100 text-green-700',
                        order.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                        order.status === 'failed' && 'bg-red-100 text-red-700'
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commerce Tools */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Commerce Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <Link key={tool.name} href={tool.href}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <tool.icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    One-time Sales
                  </span>
                  <span className="font-medium">$78,420</span>
                </div>
                <Progress value={63} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    Subscriptions
                  </span>
                  <span className="font-medium">$38,200</span>
                </div>
                <Progress value={31} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    Add-ons
                  </span>
                  <span className="font-medium">$8,230</span>
                </div>
                <Progress value={6} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}
