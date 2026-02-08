'use client';

import Link from 'next/link';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Ticket, CheckCircle, Clock, AlertCircle, Plus, BookOpen } from 'lucide-react';

export default function ServiceLayout({ children }) {
  // Stats for the status bar
  const stats = [
    createStat('Open', 12, Ticket, 'blue'),
    createStat('Pending', 5, Clock, 'amber'),
    createStat('Resolved', 28, CheckCircle, 'green'),
    createStat('Overdue', 3, AlertCircle, 'red'),
  ];

  // Action buttons for the status bar
  const actions = (
    <>
      <Link href="/service/kb/articles/new">
        <Button variant="outline" size="sm">
          <BookOpen className="h-4 w-4 mr-1.5" />
          New Article
        </Button>
      </Link>
      <Link href="/service/tickets/new">
        <Button size="sm" className="bg-primary">
          <Plus className="h-4 w-4 mr-1.5" />
          New Ticket
        </Button>
      </Link>
    </>
  );

  return (
    <HubLayout
      hubId="service"
      title="Service"
      stats={stats}
      actions={actions}
      showFixedMenu={false}
      showTopBar={true}
    >
      {children}
    </HubLayout>
  );
}
