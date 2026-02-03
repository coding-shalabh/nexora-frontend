'use client';

import { MarketingSidebar } from '@/components/layout/sidebars';

export default function MarketingLayout({ children }) {
  return (
    <div className="flex h-full">
      <MarketingSidebar />
      <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-tl-2xl shadow-xl">
        {children}
      </main>
    </div>
  );
}
