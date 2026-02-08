'use client';

import { BarChart3, Plus, PieChart, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function CRMReportsPage() {
  const stats = [
    createStat('Reports', '0', BarChart3, 'blue'),
    createStat('Dashboards', '0', PieChart, 'green'),
    createStat('Scheduled', '0', Clock, 'purple'),
    createStat('Shared', '0', Share2, 'amber'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="CRM Reports"
      description="Analytics and reporting for your CRM data"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No reports yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create reports to analyze your CRM data
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>
    </HubLayout>
  );
}
