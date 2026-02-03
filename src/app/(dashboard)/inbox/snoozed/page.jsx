'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SnoozedPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inbox?bucket=snoozed');
  }, [router]);

  return null;
}
