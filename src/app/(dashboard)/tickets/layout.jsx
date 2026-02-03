'use client';

import { TicketsSidebar } from '@/components/layout/sidebars';

export default function TicketsLayout({ children }) {
  return (
    <div className="flex h-full">
      <TicketsSidebar />
      <div className="flex-1 overflow-auto p-6 bg-white dark:bg-card rounded-tl-2xl shadow-xl">
        {children}
      </div>
    </div>
  );
}
