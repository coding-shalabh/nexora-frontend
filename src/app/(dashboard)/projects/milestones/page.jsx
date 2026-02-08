'use client';

import { Flag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MilestonesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Milestones</h1>
          <p className="text-muted-foreground">Track project milestones and deadlines</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <Flag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No milestones yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create your first milestone to track project progress
        </p>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create Milestone
        </Button>
      </div>
    </div>
  );
}
