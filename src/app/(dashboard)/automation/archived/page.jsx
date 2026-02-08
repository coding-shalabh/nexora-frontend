'use client';

import { redirect } from 'next/navigation';

export default function ArchivedAutomationsPage() {
  redirect('/automation?status=archived');
}
