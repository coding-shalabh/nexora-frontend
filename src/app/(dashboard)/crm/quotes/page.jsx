'use client';

import { FileText } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function CRMQuotesPage() {
  return (
    <ComingSoonPage
      title="Quotes"
      description="Create and manage quotes for your contacts and deals. Coming soon."
      icon={FileText}
      backHref="/crm"
      backLabel="Back to CRM"
    />
  );
}
