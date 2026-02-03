'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Redirect to centralized Tags management
 * Tags are now managed in Settings → Tags
 */
export default function InboxTagsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings/tags');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Redirecting to Tags settings...</p>
      </div>
    </div>
  );
}
