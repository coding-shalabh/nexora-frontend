'use client';

import { TrendingUp, Plus, Activity, CheckCircle, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function ContactJourneyPage() {
  const stats = [
    createStat('Journeys', '0', TrendingUp, 'blue'),
    createStat('Active', '0', Activity, 'green'),
    createStat('Completed', '0', CheckCircle, 'purple'),
    createStat('Dropped', '0', UserCircle, 'red'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Contact Journey"
      description="Track contact progression through lifecycle"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Journey
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No journeys defined</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create journeys to visualize how contacts move through stages
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Journey
          </Button>
        </div>
      </div>
    </HubLayout>
  );
}
