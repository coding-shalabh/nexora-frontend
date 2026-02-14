'use client';

import { ShoppingCart } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewPurchaseOrderPage() {
  return (
    <UnifiedLayout hubId="inventory" pageTitle="Create Purchase Order" fixedMenu={null}>
      <ComingSoonPage
        title="Create Purchase Order"
        description="Create purchase orders to restock your inventory from suppliers. Coming soon."
        icon={ShoppingCart}
        backHref="/inventory/purchase"
        backLabel="Back to Purchases"
      />
    </UnifiedLayout>
  );
}
