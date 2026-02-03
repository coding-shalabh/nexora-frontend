'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArchivedPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inbox?bucket=archived');
  }, [router]);

  return null;
}
