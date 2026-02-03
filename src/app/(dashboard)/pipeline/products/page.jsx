'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  MoreHorizontal,
  Package,
  DollarSign,
  Archive,
  Edit2,
  CheckCircle,
  Repeat,
  Briefcase,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Mock data
const products = [
  {
    id: '1',
    name: 'Professional Plan',
    description: 'Best for growing teams with advanced features',
    sku: 'PRO-001',
    unitPrice: 99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'Subscription',
    isActive: true,
    usageCount: 45,
  },
  {
    id: '2',
    name: 'Enterprise Plan',
    description: 'For large organizations with custom needs',
    sku: 'ENT-001',
    unitPrice: 299,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'Subscription',
    isActive: true,
    usageCount: 23,
  },
  {
    id: '3',
    name: 'Starter Plan',
    description: 'Perfect for small teams getting started',
    sku: 'START-001',
    unitPrice: 29,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'Subscription',
    isActive: true,
    usageCount: 89,
  },
  {
    id: '4',
    name: 'Implementation Service',
    description: 'One-time setup and onboarding service',
    sku: 'SVC-IMPL-001',
    unitPrice: 2500,
    currency: 'USD',
    billingCycle: 'one-time',
    category: 'Service',
    isActive: true,
    usageCount: 12,
  },
  {
    id: '5',
    name: 'Training Package',
    description: 'Comprehensive training for your team',
    sku: 'SVC-TRN-001',
    unitPrice: 1500,
    currency: 'USD',
    billingCycle: 'one-time',
    category: 'Service',
    isActive: true,
    usageCount: 8,
  },
  {
    id: '6',
    name: 'Legacy Plan',
    description: 'Deprecated plan - no longer available',
    sku: 'LEG-001',
    unitPrice: 49,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'Subscription',
    isActive: false,
    usageCount: 5,
  },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (!showInactive && !p.isActive) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Calculate stats
  const activeProducts = products.filter((p) => p.isActive).length;
  const subscriptions = products.filter((p) => p.category === 'Subscription').length;
  const services = products.filter((p) => p.category === 'Service').length;

  // Layout stats for HubLayout
  const layoutStats = useMemo(
    () => [
      createStat('Total', products.length, Package, 'blue'),
      createStat('Active', activeProducts, CheckCircle, 'green'),
      createStat('Subscriptions', subscriptions, Repeat, 'purple'),
      createStat('Services', services, Briefcase, 'orange'),
    ],
    [activeProducts, subscriptions, services]
  );

  // Action buttons for HubLayout
  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button
        variant={showInactive ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => setShowInactive(!showInactive)}
      >
        <Archive className="h-4 w-4 mr-2" />
        {showInactive ? 'Hide Inactive' : 'Show Inactive'}
      </Button>
      <Button size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Product
      </Button>
    </div>
  );

  // Main content
  const mainContent = (
    <div className="p-6 overflow-y-auto h-full">
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className={cn(
              'p-6 hover:shadow-md transition-shadow',
              !product.isActive && 'opacity-60'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className="text-sm text-muted-foreground">{product.sku}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  product.category === 'Subscription'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                )}
              >
                {product.category}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {product.billingCycle}
              </span>
              {!product.isActive && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Inactive
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-semibold text-lg">{formatCurrency(product.unitPrice)}</span>
                {product.billingCycle === 'monthly' && (
                  <span className="text-sm text-muted-foreground">/mo</span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                Used in {product.usageCount} deals
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              {product.isActive ? (
                <Button variant="outline" size="sm" className="flex-1">
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="flex-1">
                  Activate
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <HubLayout
      hubId="pipeline"
      title="Products"
      description="Manage your product catalog for deals and quotes"
      stats={layoutStats}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search products..."
      actions={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
