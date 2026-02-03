'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { DollarSign, ShoppingCart, TrendingUp, Package, BarChart3, Receipt } from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Revenue Analytics',
    description: 'Track sales and revenue trends',
  },
  {
    icon: ShoppingCart,
    title: 'Order Metrics',
    description: 'Order volume and AOV',
  },
  {
    icon: TrendingUp,
    title: 'MRR Tracking',
    description: 'Subscription revenue',
  },
  {
    icon: Package,
    title: 'Top Products',
    description: 'Best selling items',
  },
  {
    icon: Receipt,
    title: 'Invoice Status',
    description: 'Payment tracking',
  },
  {
    icon: BarChart3,
    title: 'Custom Reports',
    description: 'Build your own reports',
  },
];

export default function CommerceReportsPage() {
  return (
    <ComingSoonPage
      title="Commerce Reports"
      description="Commerce reports are being consolidated into the central Analytics hub. Visit Analytics for comprehensive revenue metrics, order analytics, and product performance."
      icon={BarChart3}
      features={features}
      backHref="/analytics"
      backLabel="Go to Analytics"
    />
  );
}
