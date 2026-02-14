'use client';

import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function LifecycleRulesPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Lifecycle Rules" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No lifecycle rules</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create rules to automatically move contacts between stages
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
