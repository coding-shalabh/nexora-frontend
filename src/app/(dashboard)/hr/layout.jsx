'use client';

import { HRSidebar } from '@/components/layout/sidebars/hr-sidebar';

export default function HRLayout({ children }) {
  return (
    <div className="flex h-full bg-background">
      <HRSidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="flex-1 p-2 overflow-hidden">
          <main className="h-full overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}
