'use client';

import { Bot, Plus, CheckCircle, Activity, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';

export default function AIAgentsPage() {
  const stats = [
    createStat('Total Agents', '0', Bot, 'purple'),
    createStat('Active', '0', CheckCircle, 'green'),
    createStat('Tasks Completed', '0', Activity, 'blue'),
    createStat('AI Actions', '0', Sparkles, 'emerald'),
  ];

  const actions = [createAction('New AI Agent', Plus, () => {}, { primary: true })];

  return (
    <UnifiedLayout
      hubId="automation"
      pageTitle="AI Agents"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Bot className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No AI agents</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create AI agents to automate complex tasks
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create AI Agent
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
