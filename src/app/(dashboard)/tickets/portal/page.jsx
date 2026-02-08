'use client';

import { Globe, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomerPortalPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customer Portal</h1>
          <p className="text-muted-foreground">Self-service portal for customers</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Configure Portal
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <Globe className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Customer Portal</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Allow customers to submit and track tickets
        </p>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Setup Portal
        </Button>
      </div>
    </div>
  );
}
