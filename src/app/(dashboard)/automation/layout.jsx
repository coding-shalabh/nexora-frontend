'use client';

import { AutomationSidebar } from '@/components/layout/sidebars';

export default function AutomationLayout({ children }) {
  return (
    <div className="flex h-full">
      <AutomationSidebar />
      <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-tl-2xl shadow-xl">
        {children}
      </main>
    </div>
  );
}
