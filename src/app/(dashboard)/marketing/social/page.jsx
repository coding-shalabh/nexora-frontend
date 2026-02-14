'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Share2 } from 'lucide-react';

export default function SocialMarketingPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="Social Media" fixedMenu={null}>
      <ComingSoonPage
        title="Social Media Marketing"
        description="Manage all your social media from one place. Schedule posts, monitor engagement, and generate leads from your social presence."
        icon={Share2}
        features={[
          {
            icon: Share2,
            title: 'Content Calendar',
            description: 'Schedule posts across all platforms',
          },
          {
            icon: Share2,
            title: 'Multi-Platform',
            description: 'Publish to LinkedIn, Twitter, Facebook, Instagram',
          },
          { icon: Share2, title: 'Engagement', description: 'Monitor and respond to comments' },
          { icon: Share2, title: 'AI Captions', description: 'Generate engaging captions with AI' },
          { icon: Share2, title: 'Analytics', description: 'Track reach, engagement, and clicks' },
          {
            icon: Share2,
            title: 'Lead Generation',
            description: 'Convert social interactions to leads',
          },
        ]}
        backHref="/marketing/campaigns"
        backLabel="Go to Campaigns"
      />
    </UnifiedLayout>
  );
}
