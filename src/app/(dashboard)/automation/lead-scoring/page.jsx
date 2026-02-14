'use client';

import { TrendingUp, Plus, Target, Activity, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';

export default function LeadScoringPage() {
  const stats = [
    createStat('Total Rules', '0', Target, 'purple'),
    createStat('Active', '0', CheckCircle, 'green'),
    createStat('Leads Scored', '0', Activity, 'blue'),
    createStat('Avg. Score', '0', TrendingUp, 'emerald'),
  ];

  const actions = [createAction('New Scoring Rule', Plus, () => {}, { primary: true })];

  return (
    <UnifiedLayout
      hubId="automation"
      pageTitle="Lead Scoring"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No scoring rules</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create rules to automatically score leads based on their behavior
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
