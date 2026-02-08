'use client';

import { Globe, Download, Star, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function SourceReportsPage() {
  const stats = [
    createStat('Sources', '0', Globe, 'blue'),
    createStat('Top', '-', Star, 'green'),
    createStat('Conversion', '0%', TrendingUp, 'purple'),
    createStat('ROI', '$0', BarChart3, 'amber'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Source Reports"
      description="Track where your contacts come from"
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
          <Globe className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Source reports</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Analyze lead sources and conversion rates
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
