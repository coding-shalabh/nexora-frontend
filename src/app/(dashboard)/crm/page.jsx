'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CRMPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/crm/contacts');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Redirecting to CRM Contacts...</p>
      </div>
    </div>
  );
}
