'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyChatsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inbox?bucket=my_chats');
  }, [router]);

  return null;
}
