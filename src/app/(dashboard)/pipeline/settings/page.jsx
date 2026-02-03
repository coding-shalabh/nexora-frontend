'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Pipeline Settings - Redirects to main Settings Hub
 * All settings are managed from a single location: /settings
 */
export default function PipelineSettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main Settings Hub
    router.replace('/settings');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Redirecting to Settings...</p>
      </div>
    </div>
  );
}
