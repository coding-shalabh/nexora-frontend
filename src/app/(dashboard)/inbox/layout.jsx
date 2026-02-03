'use client';

import { InboxSidebar } from '@/components/layout/sidebars';

/**
 * Inbox Layout with Three Containers:
 * 1. Collapsible Menu (InboxSidebar) - Navigation items
 * 2. Fixed Menu (Chat List) - Rendered by page.jsx
 * 3. Content Area (Chat Box) - Rendered by page.jsx
 *
 * The InboxLayoutContainer component handles containers 2 & 3
 * and is used inside page.jsx
 */
export default function InboxLayout({ children }) {
  return (
    <div className="flex h-full">
      {/* 1. Collapsible Menu - Navigation sidebar */}
      <InboxSidebar />

      {/* 2 & 3. Fixed Menu + Content Area - Handled by page.jsx using InboxLayoutContainer */}
      <div className="flex-1 min-w-0 overflow-hidden flex">{children}</div>
    </div>
  );
}
