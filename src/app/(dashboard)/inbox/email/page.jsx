'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailInboxPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inbox?channel=email');
  }, [router]);

  return null;
}
