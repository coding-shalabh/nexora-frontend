'use client';

import { GitMerge, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function LifecycleStagesPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Lifecycle Stages" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <GitMerge className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No lifecycle stages</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Define stages to track contact journey from lead to customer
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Stage
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
