'use client';

import { FileBarChart } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function CustomReportsPage() {
  return (
    <UnifiedLayout hubId="analytics" pageTitle="Custom Reports" fixedMenu={null}>
      <ComingSoonPage
        title="Custom Reports"
        description="Build custom reports with drag-and-drop fields and advanced filters. Coming soon."
        icon={FileBarChart}
        backHref="/analytics"
        backLabel="Back to Analytics"
      />
    </UnifiedLayout>
  );
}
