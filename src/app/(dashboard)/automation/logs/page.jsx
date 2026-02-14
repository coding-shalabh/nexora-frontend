'use client';

import { ScrollText } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function AutomationLogsPage() {
  return (
    <UnifiedLayout hubId="automation" pageTitle="Automation Logs" fixedMenu={null}>
      <ComingSoonPage
        title="Automation Logs"
        description="View execution history and debug logs for all your automations. Coming soon."
        icon={ScrollText}
        backHref="/automation"
        backLabel="Back to Automation"
      />
    </UnifiedLayout>
  );
}
