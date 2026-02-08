'use client';

import { Settings } from 'lucide-react';

export default function ProjectSettingsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Project Settings</h1>
          <p className="text-muted-foreground">Configure project management preferences</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <Settings className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Project Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize project settings and preferences
        </p>
      </div>
    </div>
  );
}
