'use client';

import { redirect } from 'next/navigation';

export default function PendingTicketsPage() {
  redirect('/tickets?status=PENDING');
}
