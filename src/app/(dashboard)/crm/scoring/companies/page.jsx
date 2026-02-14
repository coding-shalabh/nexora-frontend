'use client';

import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function CompanyScoringPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Company Scoring" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Company scoring not configured</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Set up scoring rules to prioritize your target accounts
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Configure Scoring
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
