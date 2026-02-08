'use client';

import { redirect } from 'next/navigation';

export default function ResolvedTicketsPage() {
  redirect('/tickets?status=RESOLVED');
}
