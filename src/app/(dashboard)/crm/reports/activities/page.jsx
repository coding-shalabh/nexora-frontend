'use client';

import { Activity, Download, Phone, Video, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function ActivityReportsPage() {
  const stats = [
    createStat('Activities', '0', Activity, 'blue'),
    createStat('Calls', '0', Phone, 'green'),
    createStat('Meetings', '0', Video, 'purple'),
    createStat('Emails', '0', Mail, 'amber'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Activity Reports"
      description="Analyze team activities and engagement"
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
          <Activity className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Activity reports</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View analytics on calls, meetings, and emails
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
