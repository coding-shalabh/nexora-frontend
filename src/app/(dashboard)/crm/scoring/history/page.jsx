'use client';

import { History, Calendar, TrendingUp, Activity } from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function ScoringHistoryPage() {
  const stats = [
    createStat('Changes', '0', History, 'blue'),
    createStat('Today', '0', Calendar, 'green'),
    createStat('Increased', '0', TrendingUp, 'purple'),
    createStat('Decreased', '0', Activity, 'red'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Score History"
      description="Track score changes over time"
      stats={stats}
      showFixedMenu={false}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <History className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No score history</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Score changes will appear here as contacts and companies are scored
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
