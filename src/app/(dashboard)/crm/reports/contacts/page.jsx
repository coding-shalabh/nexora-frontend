'use client';

import { Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function ContactReportsPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Contact Reports" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Contact reports</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View analytics on contact growth, engagement, and lifecycle
          </p>
        </div>
      </div>
    </UnifiedLayout>
  );
}
