'use client';

import { Target } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function KPIsPage() {
  return (
    <UnifiedLayout hubId="analytics" pageTitle="KPI Dashboard" fixedMenu={null}>
      <ComingSoonPage
        title="KPI Dashboard"
        description="Track and visualize key performance indicators across your business. Coming soon."
        icon={Target}
        backHref="/analytics"
        backLabel="Back to Analytics"
      />
    </UnifiedLayout>
  );
}
