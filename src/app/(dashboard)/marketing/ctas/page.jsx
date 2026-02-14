'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { MousePointer } from 'lucide-react';

export default function CTAsPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="CTAs" fixedMenu={null}>
      <ComingSoonPage
        title="Calls-to-Action"
        description="Create dynamic, personalized CTAs that convert. Pop-ups, banners, and smart CTAs that adapt to your visitors."
        icon={MousePointer}
        features={[
          {
            icon: MousePointer,
            title: 'CTA Designer',
            description: 'Create eye-catching call-to-action buttons',
          },
          {
            icon: MousePointer,
            title: 'Smart CTAs',
            description: 'Personalized CTAs based on visitor data',
          },
          {
            icon: MousePointer,
            title: 'Pop-ups & Banners',
            description: 'Exit intent, scroll-triggered pop-ups',
          },
          {
            icon: MousePointer,
            title: 'Click Analytics',
            description: 'Track CTA performance and clicks',
          },
          {
            icon: MousePointer,
            title: 'A/B Testing',
            description: 'Test different CTA variations',
          },
          {
            icon: MousePointer,
            title: 'Embed Anywhere',
            description: 'Add CTAs to any page or email',
          },
        ]}
        backHref="/marketing/pages"
        backLabel="Go to Landing Pages"
      />
    </UnifiedLayout>
  );
}
