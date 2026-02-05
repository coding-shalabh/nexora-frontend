'use client';

import {
  ProjectsSidebar,
  ProjectsProvider,
  ProjectsHeader,
  ProjectsSubMenu,
} from '@/components/layout/sidebars/projects-sidebar';

export default function ProjectsLayout({ children }) {
  return (
    <ProjectsProvider>
      <div className="flex h-full bg-background">
        {/* Left: Core Menu Sidebar */}
        <ProjectsSidebar />

        {/* Right: Header + SubMenu + Content */}
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
          {/* Header spanning full width (above both submenu and content) */}
          <div className="shrink-0 p-2 pb-0">
            <ProjectsHeader />
          </div>

          {/* SubMenu + Content side by side */}
          <div className="flex flex-1 gap-2 p-2 overflow-hidden">
            {/* Sub-menu panel */}
            <ProjectsSubMenu />

            {/* Content area */}
            <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-2xl shadow-sm border border-brand-100">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProjectsProvider>
  );
}
