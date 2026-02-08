'use client';

import { Users, Download, TrendingUp, Activity, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function ContactReportsPage() {
  const stats = [
    createStat('Contacts', '0', Users, 'blue'),
    createStat('Growth', '0%', TrendingUp, 'green'),
    createStat('Active', '0', Activity, 'purple'),
    createStat('Churn', '0', UserCircle, 'red'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Contact Reports"
      description="Analyze your contact database"
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
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Contact reports</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View analytics on contact growth, engagement, and lifecycle
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
