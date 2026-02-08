'use client';

import { Settings, Bell, Shield, Zap } from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function AutomationSettingsPage() {
  const stats = [
    createStat('Active Rules', '0', Zap, 'purple'),
    createStat('Notifications', 'Enabled', Bell, 'green'),
    createStat('Rate Limits', 'Default', Shield, 'blue'),
    createStat('Settings', '4', Settings, 'emerald'),
  ];

  return (
    <HubLayout
      hubId="automation"
      showTopBar={false}
      showSidebar={false}
      title="Automation Settings"
      description="Configure automation preferences"
      stats={stats}
      showFixedMenu={false}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure automation defaults, notifications, and more
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
