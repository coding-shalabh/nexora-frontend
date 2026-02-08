'use client';

import { Users, Plus, Star, TrendingUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function ContactScoringPage() {
  const stats = [
    createStat('Scored', '0', Users, 'blue'),
    createStat('Hot', '0', Star, 'red'),
    createStat('Warm', '0', TrendingUp, 'amber'),
    createStat('Cold', '0', Activity, 'blue'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Contact Scoring"
      description="Score contacts based on engagement and profile"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Star className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Contact scoring not configured</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Set up scoring rules to prioritize your contacts
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Configure Scoring
          </Button>
        </div>
      </div>
    </HubLayout>
  );
}
