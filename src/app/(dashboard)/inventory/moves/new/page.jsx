'use client';

import { MoveRight } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewStockMovePage() {
  return (
    <UnifiedLayout hubId="inventory" pageTitle="Create Stock Move" fixedMenu={null}>
      <ComingSoonPage
        title="Create Stock Move"
        description="Transfer inventory between warehouses and locations. Coming soon."
        icon={MoveRight}
        backHref="/inventory/moves"
        backLabel="Back to Stock Moves"
      />
    </UnifiedLayout>
  );
}
