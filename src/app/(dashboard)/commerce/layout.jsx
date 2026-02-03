'use client';

import { CommerceSidebar } from '@/components/layout/sidebars';

export default function CommerceLayout({ children }) {
  return (
    <div className="flex h-full">
      <CommerceSidebar />
      <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-tl-2xl shadow-xl">
        {children}
      </main>
    </div>
  );
}
