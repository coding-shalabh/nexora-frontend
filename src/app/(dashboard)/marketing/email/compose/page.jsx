'use client';

import { Mail } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function ComposeEmailPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="Compose Email" fixedMenu={null}>
      <ComingSoonPage
        title="Compose Email"
        description="Create and send marketing emails to your contacts and segments. Coming soon."
        icon={Mail}
        backHref="/marketing/email"
        backLabel="Back to Email Marketing"
      />
    </UnifiedLayout>
  );
}
