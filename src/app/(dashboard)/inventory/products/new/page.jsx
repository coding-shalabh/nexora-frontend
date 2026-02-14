'use client';

import { Package } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewInventoryProductPage() {
  return (
    <UnifiedLayout hubId="inventory" pageTitle="Add New Product" fixedMenu={null}>
      <ComingSoonPage
        title="Add New Product"
        description="Add products to your inventory with SKU, variants, and stock levels. Coming soon."
        icon={Package}
        backHref="/inventory/products"
        backLabel="Back to Products"
      />
    </UnifiedLayout>
  );
}
