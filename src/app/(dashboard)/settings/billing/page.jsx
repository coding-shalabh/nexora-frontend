'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Redirect /settings/billing to /settings/subscription
export default function BillingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings/subscription');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-4" />
      <p className="text-gray-500">Redirecting to subscription...</p>
    </div>
  );
}
