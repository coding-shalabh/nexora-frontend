'use client';

import { Share2, Plus, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function BulkActionsPage() {
  const stats = [
    createStat('Actions', '0', Share2, 'blue'),
    createStat('Records', '0', Users, 'green'),
    createStat('Pending', '0', Clock, 'purple'),
    createStat('Completed', '0', CheckCircle, 'amber'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Bulk Actions"
      description="Perform bulk operations on your data"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Bulk Action
        </Button>
      }
    >
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
    </HubLayout>
  );
}
