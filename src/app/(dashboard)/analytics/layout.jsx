'use client';

import { AnalyticsSidebar } from '@/components/layout/sidebars';

export default function AnalyticsLayout({ children }) {
  return (
    <div className="flex h-full">
      <AnalyticsSidebar />
      <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-tl-2xl shadow-xl">
        {children}
      </main>
    </div>
  );
}
