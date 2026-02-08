'use client';

import { BarChart3, Activity, TrendingUp, CheckCircle } from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function AutomationAnalyticsPage() {
  const stats = [
    createStat('Total Executions', '0', Activity, 'purple'),
    createStat('Success Rate', '0%', CheckCircle, 'green'),
    createStat('Avg. Run Time', '0s', TrendingUp, 'blue'),
    createStat('Failed Today', '0', BarChart3, 'emerald'),
  ];

  return (
    <HubLayout
      hubId="automation"
      showTopBar={false}
      showSidebar={false}
      title="Automation Analytics"
      description="Performance metrics for your automations"
      stats={stats}
      showFixedMenu={false}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No analytics data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Analytics will appear once automations are active
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
