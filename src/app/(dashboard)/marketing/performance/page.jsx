'use client';

import { BarChart3 } from 'lucide-react';

export default function MarketingPerformancePage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Marketing Performance</h1>
          <p className="text-muted-foreground">Campaign metrics and ROI tracking</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No performance data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Performance metrics will appear once campaigns are sent
        </p>
      </div>
    </div>
  );
}
