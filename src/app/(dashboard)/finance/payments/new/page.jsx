'use client';

import { CreditCard } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewPaymentPage() {
  return (
    <UnifiedLayout hubId="finance" pageTitle="Record New Payment" fixedMenu={null}>
      <ComingSoonPage
        title="Record New Payment"
        description="Record incoming and outgoing payments with full transaction details. Coming soon."
        icon={CreditCard}
        backHref="/finance"
        backLabel="Back to Finance"
      />
    </UnifiedLayout>
  );
}
