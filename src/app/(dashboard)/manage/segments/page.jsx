'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Redirect to centralized Segments management
 * Segments are now managed in CRM → Segments
 */
export default function ManageSegmentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/crm/segments');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Redirecting to Segments...</p>
      </div>
    </div>
  );
}
