'use client';

import { Receipt } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewExpensePage() {
  return (
    <UnifiedLayout hubId="finance" pageTitle="Add New Expense" fixedMenu={null}>
      <ComingSoonPage
        title="Add New Expense"
        description="Record and categorize business expenses with receipt attachments. Coming soon."
        icon={Receipt}
        backHref="/finance/expenses"
        backLabel="Back to Expenses"
      />
    </UnifiedLayout>
  );
}
