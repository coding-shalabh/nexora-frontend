'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UnassignedPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inbox?bucket=unassigned');
  }, [router]);

  return null;
}
