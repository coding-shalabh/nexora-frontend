'use client';

import { ListFilter, Plus, Users, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const layoutStats = [
  createStat('Total Lists', '0', ListFilter, 'blue'),
  createStat('Total Contacts', '0', Users, 'green'),
  createStat('Active Lists', '0', CheckCircle, 'purple'),
  createStat('Email Ready', '0', Mail, 'amber'),
];

export default function MarketingListsPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="Contact Lists" stats={layoutStats} fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Contact Lists</h1>
            <p className="text-muted-foreground">Manage subscriber and contact lists</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New List
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <ListFilter className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No lists</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create contact lists for your marketing campaigns
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create List
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
