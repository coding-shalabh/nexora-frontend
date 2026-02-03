'use client';

import { PipelineSidebar } from '@/components/layout/sidebars';
import { SidebarProvider } from '@/contexts/sidebar-context';

export default function PipelineLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-full">
        {/* Hub Sidebar with lighter purple background */}
        <aside
          className="overflow-auto border-r border-indigo-700/30"
          style={{
            background: 'linear-gradient(to bottom, #292450, #352f6e)',
          }}
        >
          <PipelineSidebar />
        </aside>
        <div className="flex-1 overflow-auto bg-white dark:bg-card rounded-tl-2xl shadow-xl">
          <div className="p-6 max-w-[1600px] mx-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
