'use client';

import { Truck } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewShipmentPage() {
  return (
    <UnifiedLayout hubId="inventory" pageTitle="Create Shipment" fixedMenu={null}>
      <ComingSoonPage
        title="Create Shipment"
        description="Create and track outbound shipments to customers. Coming soon."
        icon={Truck}
        backHref="/inventory/shipping"
        backLabel="Back to Shipping"
      />
    </UnifiedLayout>
  );
}
