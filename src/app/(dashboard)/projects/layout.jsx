'use client';

import { ProjectsSidebar } from '@/components/layout/sidebars';

export default function ProjectsLayout({ children }) {
  return (
    <div className="flex h-full">
      <ProjectsSidebar />
      <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-tl-2xl shadow-xl">
        {children}
      </main>
    </div>
  );
}
