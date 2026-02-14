'use client';

import { ListTodo, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function CRMTasksPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Tasks" fixedMenu={null}>
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
    </UnifiedLayout>
  );
}
