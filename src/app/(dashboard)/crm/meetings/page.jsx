'use client';

import { useRouter } from 'next/navigation';
import { Video, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout } from '@/components/layout/unified';

export default function CRMMeetingsPage() {
  const router = useRouter();

  return (
    <UnifiedLayout hubId="crm" pageTitle="Meetings" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Video className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No meetings scheduled</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Schedule meetings to connect with contacts
          </p>
          <Button variant="outline" onClick={() => router.push('/crm/meetings/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
