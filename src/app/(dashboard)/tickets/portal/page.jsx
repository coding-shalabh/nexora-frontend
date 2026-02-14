'use client';

import { UnifiedLayout, createAction } from '@/components/layout/unified';
import { Globe, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomerPortalPage() {
  const actions = [
    createAction('Configure Portal', Settings, () => console.log('Configure'), { primary: true }),
  ];

  return (
    <UnifiedLayout hubId="tickets" pageTitle="Customer Portal" actions={actions} fixedMenu={null}>
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Globe className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Customer Portal</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Allow customers to submit and track tickets
          </p>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Setup Portal
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
