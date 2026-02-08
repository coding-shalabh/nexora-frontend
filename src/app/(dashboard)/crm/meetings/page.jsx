'use client';

import { Video, Plus, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function CRMMeetingsPage() {
  const stats = [
    createStat('Total Meetings', '0', Video, 'blue'),
    createStat('Today', '0', Calendar, 'green'),
    createStat('Upcoming', '0', Clock, 'purple'),
    createStat('Completed', '0', CheckCircle, 'amber'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Meetings"
      description="Schedule and manage meetings with contacts"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Video className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No meetings scheduled</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Schedule meetings to connect with contacts
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>
    </HubLayout>
  );
}
