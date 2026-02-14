'use client';

import { UnifiedLayout, createAction } from '@/components/layout/unified';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SLAsPage() {
  const actions = [createAction('New SLA', Plus, () => console.log('New SLA'), { primary: true })];

  return (
    <UnifiedLayout hubId="tickets" pageTitle="SLA Policies" actions={actions} fixedMenu={null}>
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No SLA policies</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Define response and resolution time targets
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create SLA Policy
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
