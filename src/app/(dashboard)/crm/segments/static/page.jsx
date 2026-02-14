'use client';

import { ListTodo, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function StaticListsPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Static Lists" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <ListTodo className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No static lists</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create manually curated lists of contacts
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create List
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
