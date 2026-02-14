'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Smartphone } from 'lucide-react';

export default function SMSMarketingPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="SMS Marketing" fixedMenu={null}>
      <ComingSoonPage
        title="SMS Marketing"
        description="Reach customers instantly with SMS campaigns. High open rates, automation, and seamless integration with your CRM."
        icon={Smartphone}
        features={[
          {
            icon: Smartphone,
            title: 'Bulk SMS',
            description: 'Send campaigns to thousands instantly',
          },
          {
            icon: Smartphone,
            title: 'Segmentation',
            description: 'Target specific audience segments',
          },
          { icon: Smartphone, title: 'Automation', description: 'Trigger-based SMS automation' },
          {
            icon: Smartphone,
            title: 'Two-Way SMS',
            description: 'Receive and respond to messages',
          },
          {
            icon: Smartphone,
            title: 'Analytics',
            description: 'Track delivery, opens, and clicks',
          },
          { icon: Smartphone, title: 'Templates', description: 'Pre-built SMS templates' },
        ]}
        backHref="/inbox"
        backLabel="Go to Inbox"
      />
    </UnifiedLayout>
  );
}
