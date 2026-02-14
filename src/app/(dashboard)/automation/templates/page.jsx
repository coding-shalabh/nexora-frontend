'use client';

import { LayoutTemplate } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function AutomationTemplatesPage() {
  return (
    <UnifiedLayout hubId="automation" pageTitle="Automation Templates" fixedMenu={null}>
      <ComingSoonPage
        title="Automation Templates"
        description="Browse and use pre-built automation templates to get started quickly. Coming soon."
        icon={LayoutTemplate}
        backHref="/automation"
        backLabel="Back to Automation"
      />
    </UnifiedLayout>
  );
}
