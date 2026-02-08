'use client';

import { Target, Plus, CheckCircle, Activity, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function ScoringRulesPage() {
  const stats = [
    createStat('Rules', '0', Target, 'blue'),
    createStat('Active', '0', CheckCircle, 'green'),
    createStat('Triggered', '0', Activity, 'purple'),
    createStat('Avg Score', '0', Star, 'amber'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Scoring Rules"
      description="Configure scoring rules for contacts and companies"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No scoring rules</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create rules to automatically score contacts and companies
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>
    </HubLayout>
  );
}
