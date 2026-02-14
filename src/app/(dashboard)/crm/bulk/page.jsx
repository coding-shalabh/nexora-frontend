'use client';

import { Share2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function BulkActionsPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Bulk Actions" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Share2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Bulk actions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Update, delete, or tag multiple records at once
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Bulk Action
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
