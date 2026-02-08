'use client';

import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectCalendarPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Project Calendar</h1>
          <p className="text-muted-foreground">View project timeline and deadlines</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Calendar View</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Project events and milestones will be displayed here
        </p>
      </div>
    </div>
  );
}
