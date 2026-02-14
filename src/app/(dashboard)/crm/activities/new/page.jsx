'use client';

import { Activity } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function NewActivityPage() {
  return (
    <ComingSoonPage
      title="Log New Activity"
      description="Record calls, emails, meetings, and other interactions with your contacts. Coming soon."
      icon={Activity}
      backHref="/crm/activities"
      backLabel="Back to Activities"
    />
  );
}
