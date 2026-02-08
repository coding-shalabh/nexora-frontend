'use client';

import { ProjectsSidebar, ProjectsProvider, ProjectsHeader } from '@/components/layout/sidebars';

export default function ProjectsLayout({ children }) {
  return (
    <ProjectsProvider>
      <div className="flex h-full bg-background">
        <ProjectsSidebar />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <div className="shrink-0 p-2 pb-0">
            <ProjectsHeader />
          </div>
          <div className="flex-1 p-2 pt-0 overflow-hidden">
            <main className="h-full overflow-hidden">{children}</main>
          </div>
        </div>
      </div>
    </ProjectsProvider>
  );
}
