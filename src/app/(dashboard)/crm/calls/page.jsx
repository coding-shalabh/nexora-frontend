'use client';

import { Phone, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function CRMCallsPage() {
  const stats = [
    createStat('Total Calls', '0', Phone, 'blue'),
    createStat('Today', '0', Clock, 'green'),
    createStat('Scheduled', '0', Clock, 'purple'),
    createStat('Missed', '0', AlertCircle, 'red'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Calls"
      description="Track and log calls with contacts"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Call
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Phone className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No calls logged</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Log calls to track communication with contacts
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Log Call
          </Button>
        </div>
      </div>
    </HubLayout>
  );
}
