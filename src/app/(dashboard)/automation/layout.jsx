'use client';

import {
  AutomationSidebar,
  AutomationProvider,
  AutomationHeader,
  AutomationSubMenu,
} from '@/components/layout/sidebars/automation-sidebar';

export default function AutomationLayout({ children }) {
  return (
    <AutomationProvider>
      <div className="flex h-full bg-background">
        {/* Left: Core Menu Sidebar */}
        <AutomationSidebar />

        {/* Right: Header + SubMenu + Content */}
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
          {/* Header spanning full width (above both submenu and content) */}
          <div className="shrink-0 p-2 pb-0">
            <AutomationHeader />
          </div>

          {/* SubMenu + Content side by side */}
          <div className="flex flex-1 gap-2 p-2 overflow-hidden">
            {/* Sub-menu panel */}
            <AutomationSubMenu />

            {/* Content area */}
            <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-2xl shadow-sm border border-brand-100">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AutomationProvider>
  );
}
