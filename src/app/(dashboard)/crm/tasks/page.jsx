'use client';

import { ListTodo, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function CRMTasksPage() {
  const stats = [
    createStat('Total Tasks', '0', ListTodo, 'blue'),
    createStat('Pending', '0', Clock, 'amber'),
    createStat('Completed', '0', CheckCircle, 'green'),
    createStat('Overdue', '0', AlertCircle, 'red'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Tasks"
      description="Manage tasks linked to contacts and companies"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <ListTodo className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create tasks to track follow-ups with contacts and companies
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
    </HubLayout>
  );
}
