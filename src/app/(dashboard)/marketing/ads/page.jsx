'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Target } from 'lucide-react';

export default function AdsPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="Ads" fixedMenu={null}>
      <ComingSoonPage
        title="Ad Management"
        description="Manage paid advertising across Google, Facebook, LinkedIn, and more. Track ROI, sync audiences, and optimize your ad spend."
        icon={Target}
        features={[
          {
            icon: Target,
            title: 'Ad Management',
            description: 'Manage Google, Facebook, LinkedIn ads',
          },
          {
            icon: Target,
            title: 'Audience Sync',
            description: 'Sync CRM segments to ad platforms',
          },
          {
            icon: Target,
            title: 'Budget Tracking',
            description: 'Monitor ad spend across platforms',
          },
          { icon: Target, title: 'ROI Attribution', description: 'Track ad spend to revenue' },
          { icon: Target, title: 'Performance', description: 'Real-time ad performance metrics' },
          {
            icon: Target,
            title: 'Lookalike Audiences',
            description: 'Create lookalikes from your CRM data',
          },
        ]}
        backHref="/marketing/campaigns"
        backLabel="Go to Campaigns"
      />
    </UnifiedLayout>
  );
}
