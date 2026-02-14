'use client';

import { UserPlus } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewEmployeePage() {
  return (
    <UnifiedLayout hubId="hr" pageTitle="Add New Employee" fixedMenu={null}>
      <ComingSoonPage
        title="Add New Employee"
        description="Onboard new employees with all their information and documents. Coming soon."
        icon={UserPlus}
        backHref="/hr/employees"
        backLabel="Back to Employees"
      />
    </UnifiedLayout>
  );
}
