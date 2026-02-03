'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StarredPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inbox?bucket=starred');
  }, [router]);

  return null;
}
