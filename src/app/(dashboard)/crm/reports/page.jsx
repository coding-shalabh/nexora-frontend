'use client';

import { useRouter } from 'next/navigation';
import { BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function CRMReportsPage() {
  const router = useRouter();

  return (
    <UnifiedLayout hubId="crm" pageTitle="CRM Reports" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No reports yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create reports to analyze your CRM data
          </p>
          <Button variant="outline" onClick={() => router.push('/crm/reports/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
