'use client';

import { Share2 } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewSocialPostPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="Create Social Post" fixedMenu={null}>
      <ComingSoonPage
        title="Create Social Post"
        description="Compose and schedule social media posts across multiple platforms. Coming soon."
        icon={Share2}
        backHref="/marketing/social"
        backLabel="Back to Social Media"
      />
    </UnifiedLayout>
  );
}
