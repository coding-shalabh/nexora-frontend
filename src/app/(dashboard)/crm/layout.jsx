'use client';

import { CRMSidebar } from '@/components/layout/sidebars';
import { SidebarProvider } from '@/contexts/sidebar-context';

export default function CRMLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-full">
        <CRMSidebar />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </SidebarProvider>
  );
}
