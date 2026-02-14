'use client';

import { Briefcase } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewJobPostingPage() {
  return (
    <UnifiedLayout hubId="hr" pageTitle="Create Job Posting" fixedMenu={null}>
      <ComingSoonPage
        title="Create Job Posting"
        description="Post new job openings and manage the recruitment pipeline. Coming soon."
        icon={Briefcase}
        backHref="/hr/recruitment"
        backLabel="Back to Recruitment"
      />
    </UnifiedLayout>
  );
}
