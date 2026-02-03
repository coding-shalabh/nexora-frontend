'use client';

import { SalesSidebar } from '@/components/layout/sidebars';

export default function SalesLayout({ children }) {
  return (
    <div className="flex h-full">
      <SalesSidebar />
      <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-tl-2xl shadow-xl">
        {children}
      </main>
    </div>
  );
}
