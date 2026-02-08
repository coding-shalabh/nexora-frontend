'use client';

import { Timer, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TimesheetsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Timesheets</h1>
          <p className="text-muted-foreground">Review and approve time entries</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <Timer className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No timesheet entries</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Time entries from your team will appear here
        </p>
      </div>
    </div>
  );
}
