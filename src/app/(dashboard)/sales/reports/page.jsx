'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function SalesReportsPage() {
  return (
    <UnifiedLayout hubId="sales" pageTitle="Sales Reports">
      <ComingSoonPage
        title="Sales Reports"
        description="Sales reports are being consolidated into the central Analytics hub. Visit Analytics for comprehensive sales metrics, pipeline analysis, and team performance."
        expectedDate="Q2 2026"
        showBackButton={false}
      />
    </UnifiedLayout>
  );
}
