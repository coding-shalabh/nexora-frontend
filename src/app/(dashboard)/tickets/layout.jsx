'use client';

import { TicketsSidebar, TicketsProvider, TicketsHeader } from '@/components/layout/sidebars';

export default function TicketsLayout({ children }) {
  return (
    <TicketsProvider>
      <div className="flex h-full bg-background">
        <TicketsSidebar />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <div className="shrink-0 p-2 pb-0">
            <TicketsHeader />
          </div>
          <div className="flex-1 p-2 pt-0 overflow-hidden">
            <main className="h-full overflow-hidden">{children}</main>
          </div>
        </div>
      </div>
    </TicketsProvider>
  );
}
