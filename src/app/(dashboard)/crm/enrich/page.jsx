'use client';

import { UserCheck, Plus, Clock, RefreshCw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function DataEnrichmentPage() {
  const stats = [
    createStat('Enriched', '0', UserCheck, 'blue'),
    createStat('Pending', '0', Clock, 'amber'),
    createStat('Updated', '0', RefreshCw, 'green'),
    createStat('Failed', '0', Activity, 'red'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Data Enrichment"
      description="Enrich contact and company data automatically"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Start Enrichment
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Data enrichment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Automatically enrich contact and company data from external sources
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Start Enrichment
          </Button>
        </div>
      </div>
    </HubLayout>
  );
}
