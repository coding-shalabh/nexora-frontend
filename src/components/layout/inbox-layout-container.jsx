'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * InboxLayoutContainer - Three container layout for inbox
 *
 * Structure:
 * 1. Collapsible Menu - Navigation sidebar (InboxSidebar)
 * 2. Fixed Menu - Chat list sidebar (collapsible)
 * 3. Content Area - Chat box only
 */
export function InboxLayoutContainer({
  collapsibleMenu,
  fixedMenu,
  children,
  fixedMenuWidth = 320,
  fixedMenuCollapsedWidth = 64,
  fixedMenuBgColor = '#c9ddf8',
  storageKey = 'inbox-fixed-menu-collapsed',
}) {
  const [isFixedMenuCollapsed, setIsFixedMenuCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setIsFixedMenuCollapsed(JSON.parse(saved));
    }
  }, [storageKey]);

  // Toggle collapsed state
  const toggleFixedMenuCollapsed = () => {
    const newState = !isFixedMenuCollapsed;
    setIsFixedMenuCollapsed(newState);
    localStorage.setItem(storageKey, JSON.stringify(newState));
  };

  return (
    <div className="flex h-full">
      {/* 1. Collapsible Menu - Navigation sidebar */}
      {collapsibleMenu}

      {/* 2. Fixed Menu - Chat list sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isFixedMenuCollapsed ? fixedMenuCollapsedWidth : fixedMenuWidth }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        className="relative flex flex-col shrink-0 rounded-tl-2xl"
        style={{ background: fixedMenuBgColor }}
      >
        {/* Collapse Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFixedMenuCollapsed}
          className="absolute -right-3 top-4 h-6 w-6 rounded-full border-gray-200 text-gray-600 shadow-md hover:bg-gray-50 hover:text-gray-900 z-10"
          style={{ background: fixedMenuBgColor }}
        >
          {isFixedMenuCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        {/* Fixed Menu Content */}
        {typeof fixedMenu === 'function'
          ? fixedMenu({
              isCollapsed: isFixedMenuCollapsed,
              toggleCollapsed: toggleFixedMenuCollapsed,
            })
          : fixedMenu}
      </motion.aside>

      {/* 3. Content Area - Chat box */}
      <div className="flex-1 flex flex-col bg-white dark:bg-card min-w-0 min-h-0 rounded-tl-2xl shadow-xl">
        {children}
      </div>
    </div>
  );
}

/**
 * FixedMenuSection - Wrapper for fixed menu content sections
 */
export function FixedMenuSection({ children, className, isCollapsed }) {
  if (isCollapsed) return null;

  return <div className={cn('shrink-0', className)}>{children}</div>;
}

/**
 * FixedMenuList - Scrollable list container for fixed menu
 */
export function FixedMenuList({ children, className, isCollapsed }) {
  return (
    <div className={cn('flex-1 overflow-auto', isCollapsed && 'py-2', className)}>{children}</div>
  );
}
