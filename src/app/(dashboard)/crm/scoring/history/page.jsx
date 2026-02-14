'use client';

import { History } from 'lucide-react';
import { UnifiedLayout } from '@/components/layout/unified';

export default function ScoringHistoryPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Score History" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <History className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No score history</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Score changes will appear here as contacts and companies are scored
          </p>
        </div>
      </div>
    </UnifiedLayout>
  );
}
