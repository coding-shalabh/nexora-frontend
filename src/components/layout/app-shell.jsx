'use client';

import { GlobalHeader } from './global-header';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function AppShell({ children, sidebar = null }) {
  const pathname = usePathname();

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{
        background: '#ecf4ff',
      }}
    >
      {/* Global Header - Always visible */}
      <GlobalHeader />

      {/* Main Content Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Hub Sidebar - Context-specific navigation (Core Menu) */}
        {sidebar && (
          <aside
            className="overflow-auto border-r border-gray-200"
            style={{
              background: '#ecf4ff',
            }}
          >
            {sidebar}
          </aside>
        )}

        {/* Page Content - White background with border radius */}
        <main className="flex-1 overflow-auto bg-white dark:bg-card rounded-tl-2xl shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
