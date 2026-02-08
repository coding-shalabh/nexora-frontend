'use client';

import { MarketingSidebar, MarketingProvider, MarketingHeader } from '@/components/layout/sidebars';

export default function MarketingLayout({ children }) {
  return (
    <MarketingProvider>
      <div className="flex h-full bg-background">
        {/* Left: Core Menu Sidebar with collapsible accordion */}
        <MarketingSidebar />

        {/* Right: Header + Content */}
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
          {/* Header */}
          <div className="shrink-0 p-2 pb-0">
            <MarketingHeader />
          </div>

          {/* Content area */}
          <div className="flex-1 p-2 overflow-hidden">
            <main className="h-full overflow-auto bg-white dark:bg-card rounded-2xl shadow-sm border border-brand-100">
              {children}
            </main>
          </div>
        </div>
      </div>
    </MarketingProvider>
  );
}
