'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Manage Page - Redirects to Settings
 *
 * All management features (Custom Fields, Tags, Templates, Pipelines, etc.)
 * are now centralized in the Settings hub for better organization.
 */
export default function ManagePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Settings page
    router.replace('/settings/organization');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand" />
        <p className="text-muted-foreground">Redirecting to Settings...</p>
      </div>
    </div>
  );
}
