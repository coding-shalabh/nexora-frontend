'use client';

import { Settings, Mail, Bell, Shield } from 'lucide-react';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const layoutStats = [
  createStat('Email Defaults', '1', Mail, 'blue'),
  createStat('Notifications', 'On', Bell, 'green'),
  createStat('Tracking', 'Enabled', Settings, 'purple'),
  createStat('Compliance', 'GDPR', Shield, 'amber'),
];

export default function MarketingSettingsPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="Settings" stats={layoutStats} fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Marketing Settings</h1>
            <p className="text-muted-foreground">Configure marketing module preferences</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure email defaults, tracking, and more
          </p>
        </div>
      </div>
    </UnifiedLayout>
  );
}
