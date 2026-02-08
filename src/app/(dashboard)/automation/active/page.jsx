'use client';

import { redirect } from 'next/navigation';

export default function ActiveAutomationsPage() {
  redirect('/automation?status=active');
}
