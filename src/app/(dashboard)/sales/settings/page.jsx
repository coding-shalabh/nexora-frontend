'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function SalesSettingsPage() {
  return (
    <UnifiedLayout hubId="sales" pageTitle="Sales Settings">
      <ComingSoonPage
        title="Sales Settings"
        description="Configure sales quotas, commission rules, team assignments, and sales process preferences."
        expectedDate="Q2 2026"
        showBackButton={false}
      />
    </UnifiedLayout>
  );
}
