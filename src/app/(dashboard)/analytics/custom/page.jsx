'use client';

import { BarChart3 } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function CustomAnalyticsPage() {
  return (
    <UnifiedLayout hubId="analytics" pageTitle="Custom Analytics" fixedMenu={null}>
      <ComingSoonPage
        title="Custom Analytics"
        description="Create custom dashboards and analytics views for your specific needs. Coming soon."
        icon={BarChart3}
        backHref="/analytics"
        backLabel="Back to Analytics"
      />
    </UnifiedLayout>
  );
}
