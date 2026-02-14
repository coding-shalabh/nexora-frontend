'use client';

import { ArrowLeftRight } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function BankTransferPage() {
  return (
    <UnifiedLayout hubId="finance" pageTitle="Bank Transfer" fixedMenu={null}>
      <ComingSoonPage
        title="Bank Transfer"
        description="Transfer funds between bank accounts and track movements. Coming soon."
        icon={ArrowLeftRight}
        backHref="/finance/bank"
        backLabel="Back to Banking"
      />
    </UnifiedLayout>
  );
}
