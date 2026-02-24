'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WhatsAppInboxPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inbox?channel=whatsapp');
  }, [router]);

  return null;
}
