'use client';

import { Building2, Download, Plus, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function CompanyReportsPage() {
  const stats = [
    createStat('Companies', '0', Building2, 'blue'),
    createStat('New', '0', Plus, 'green'),
    createStat('Revenue', '$0', TrendingUp, 'purple'),
    createStat('Size Avg', '0', BarChart3, 'amber'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Company Reports"
      description="Analyze your company accounts"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Company reports</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View analytics on company accounts and revenue
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
