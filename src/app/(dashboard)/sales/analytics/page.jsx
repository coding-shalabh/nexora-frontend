'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function SalesAnalyticsPage() {
  return (
    <UnifiedLayout hubId="sales" pageTitle="Sales Analytics">
      <ComingSoonPage
        title="Sales Analytics"
        description="Insights and metrics for sales performance. View trends, conversion rates, and team performance data."
        expectedDate="Q2 2026"
        showBackButton={false}
      />
    </UnifiedLayout>
  );
}
