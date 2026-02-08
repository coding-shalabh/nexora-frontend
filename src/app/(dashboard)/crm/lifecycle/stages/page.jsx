'use client';

import { GitMerge, Plus, Users, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function LifecycleStagesPage() {
  const stats = [
    createStat('Stages', '0', GitMerge, 'blue'),
    createStat('Contacts', '0', Users, 'green'),
    createStat('Transitions', '0', TrendingUp, 'purple'),
    createStat('Avg Days', '0', Clock, 'amber'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Lifecycle Stages"
      description="Define contact lifecycle stages"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Stage
        </Button>
      }
    >
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
    </HubLayout>
  );
}
