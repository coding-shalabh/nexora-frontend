'use client';

import { Users } from 'lucide-react';

export default function WorkloadPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team Workload</h1>
          <p className="text-muted-foreground">Monitor team capacity and resource allocation</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Workload Overview</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Team member workload and availability will be shown here
        </p>
      </div>
    </div>
  );
}
