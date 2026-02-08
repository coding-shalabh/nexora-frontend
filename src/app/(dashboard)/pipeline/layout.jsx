'use client';

import { PipelineSidebar, PipelineProvider, PipelineHeader } from '@/components/layout/sidebars';

export default function PipelineLayout({ children }) {
  return (
    <PipelineProvider>
      <div className="flex h-full bg-background">
        <PipelineSidebar />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <div className="shrink-0 p-2 pb-0">
            <PipelineHeader />
          </div>
          <div className="flex-1 p-2 pt-0 overflow-hidden">
            <main className="h-full overflow-hidden">{children}</main>
          </div>
        </div>
      </div>
    </PipelineProvider>
  );
}
