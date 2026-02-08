'use client';

import { BarChart3 } from 'lucide-react';

export default function SalesAnalyticsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Analytics</h1>
          <p className="text-muted-foreground">Insights and metrics for sales performance</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No analytics data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Analytics will appear once sales data is available
        </p>
      </div>
    </div>
  );
}
