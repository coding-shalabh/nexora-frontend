'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Package, Warehouse, TrendingUp, TrendingDown, BarChart3, ArrowDownUp } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Stock Summary',
    description: 'Current stock levels',
  },
  {
    icon: ArrowDownUp,
    title: 'Stock Movement',
    description: 'Ins, outs, and transfers',
  },
  {
    icon: Warehouse,
    title: 'Warehouse Usage',
    description: 'Capacity utilization',
  },
  {
    icon: TrendingDown,
    title: 'Low Stock Alerts',
    description: 'Items below reorder level',
  },
  {
    icon: TrendingUp,
    title: 'Inventory Valuation',
    description: 'Total value by category',
  },
  {
    icon: BarChart3,
    title: 'Purchase Analysis',
    description: 'Supplier performance',
  },
];

export default function InventoryReportsPage() {
  return (
    <ComingSoonPage
      title="Inventory Reports"
      description="Inventory reports are being consolidated into the central Analytics hub. Visit Analytics for comprehensive stock metrics, warehouse utilization, and inventory valuation."
      icon={BarChart3}
      features={features}
      backHref="/analytics"
      backLabel="Go to Analytics"
    />
  );
}
