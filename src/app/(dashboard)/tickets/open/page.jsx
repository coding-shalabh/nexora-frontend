'use client';

import { redirect } from 'next/navigation';

export default function OpenTicketsPage() {
  redirect('/tickets?status=OPEN');
}
