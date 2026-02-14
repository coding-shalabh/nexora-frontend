'use client';

import { Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function DynamicSegmentsPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Dynamic Segments" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Filter className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No dynamic segments</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create segments that auto-update based on contact properties
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Segment
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
