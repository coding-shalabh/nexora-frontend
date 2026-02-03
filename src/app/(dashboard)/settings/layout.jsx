'use client';

import {
  SettingsSidebar,
  SettingsProvider,
  SettingsHeader,
  SettingsSubMenu,
} from '@/components/layout/sidebars';

export default function SettingsLayout({ children }) {
  return (
    <SettingsProvider>
      <div className="flex h-full bg-background">
        {/* Left: Core Menu Sidebar */}
        <SettingsSidebar />

        {/* Right: Header + SubMenu + Content */}
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
          {/* Header spanning full width (above both submenu and content) */}
          <div className="shrink-0 p-2 pb-0">
            <SettingsHeader />
          </div>

          {/* SubMenu + Content side by side */}
          <div className="flex flex-1 gap-2 p-2 overflow-hidden">
            {/* Sub-menu panel */}
            <SettingsSubMenu />

            {/* Content area */}
            <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-2xl shadow-sm border border-brand-100">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SettingsProvider>
  );
}
