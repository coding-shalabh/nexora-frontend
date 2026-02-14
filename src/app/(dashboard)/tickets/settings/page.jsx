'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { Settings } from 'lucide-react';

export default function TicketSettingsPage() {
  return (
    <UnifiedLayout hubId="tickets" pageTitle="Ticket Settings" fixedMenu={null}>
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure ticket workflows, notifications, and more
          </p>
        </div>
      </div>
    </UnifiedLayout>
  );
}
