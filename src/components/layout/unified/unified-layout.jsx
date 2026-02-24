'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { UnifiedCoreMenu } from './unified-core-menu';
import { UnifiedStatusBar } from './unified-status-bar';
import { UnifiedFixedMenu } from './unified-fixed-menu';
import { getHub } from '@/config/hubs';

/**
 * UnifiedLayout Context
 * Provides shared state across all layout components
 */
const UnifiedLayoutContext = createContext(null);

export const useUnifiedLayout = () => {
  const context = useContext(UnifiedLayoutContext);
  if (!context) {
    throw new Error('useUnifiedLayout must be used within UnifiedLayout');
  }
  return context;
};

/**
 * UnifiedLayout - Single component for all hub pages
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ GLOBAL HEADER (exists - no changes)                                          │
 * ├───────────────┬──────────────────────────────────────────────────────────────┤
 * │ CORE-MENU     │ STATUS-BAR                                                   │
 * │ (accordion)   │ [Hub / Page Title]  [Stat] [Stat]  [Actions...]              │
 * │               ├───────────────┬──────────────────────────────────────────────┤
 * │ [Section] ▼   │ FIXED-MENU    │ CONTENT-AREA                                 │
 * │   [Item]      │ (optional)    │                                              │
 * │   [Item] ●    │               │  {children}                                  │
 * │               │               │                                              │
 * │ [Section] ▶   │               │                                              │
 * └───────────────┴───────────────┴──────────────────────────────────────────────┘
 *
 * @param {Object} props
 * @param {string} props.hubId - Hub identifier (loads menu from hubs.js)
 * @param {Object} props.menu - Custom menu configuration (overrides hubId)
 * @param {string} props.pageTitle - Page title for breadcrumb
 * @param {Array} props.stats - Stats array for status bar
 * @param {Array} props.actions - Action buttons for status bar
 * @param {Object} props.fixedMenu - Fixed menu config (null = hidden)
 * @param {React.ReactNode} props.children - Main content
 * @param {string} props.className - Additional class names
 */
export function UnifiedLayout({
  // Core Menu
  hubId,
  menu,

  // Status Bar
  pageTitle,
  stats = [],
  actions = [],

  // Fixed Menu (null = hidden)
  fixedMenu = null,

  // Content
  children,
  className,
}) {
  // Get hub info
  const hub = hubId ? getHub(hubId) : null;
  const hubName = hub?.name || menu?.title || 'Hub';

  // Core menu collapsed state
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  // Fixed menu state
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [switchValue, setSwitchValue] = useState(null);

  // Initialize switch value from config (only once)
  useEffect(() => {
    if (fixedMenu?.selectedSwitch && switchValue === null) {
      setSwitchValue(fixedMenu.selectedSwitch);
    }
  }, [fixedMenu?.selectedSwitch, switchValue]);

  // Load collapsed state from localStorage (SSR-safe)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = `unified-menu-collapsed-${hubId || 'default'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setIsMenuCollapsed(JSON.parse(saved));
    }
  }, [hubId]);

  // Load last selected item from localStorage (SSR-safe)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (fixedMenu?.hasDetailPage && fixedMenu?.detailBasePath) {
      const storageKey = `unified-selected-${fixedMenu.detailBasePath}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSelectedItemId(saved);
      }
    }
    // Only run on mount and when detailBasePath changes - NOT when items change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedMenu?.detailBasePath, fixedMenu?.hasDetailPage]);

  // Save collapsed state
  const toggleMenuCollapsed = useCallback(() => {
    const storageKey = `unified-menu-collapsed-${hubId || 'default'}`;
    setIsMenuCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem(storageKey, JSON.stringify(newState));
      return newState;
    });
  }, [hubId]);

  // Handle item selection
  const handleItemSelect = useCallback(
    (item) => {
      const itemId = fixedMenu?.getItemId?.(item) || item.id;
      setSelectedItemId(itemId);

      // Save to localStorage
      if (fixedMenu?.hasDetailPage && fixedMenu?.detailBasePath) {
        const storageKey = `unified-selected-${fixedMenu.detailBasePath}`;
        localStorage.setItem(storageKey, itemId);
      }

      // Call external handler
      fixedMenu?.onSelect?.(item);
    },
    [fixedMenu]
  );

  // Handle search
  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);
      fixedMenu?.onSearchChange?.(value);
    },
    [fixedMenu]
  );

  // Handle switch change
  const handleSwitchChange = useCallback(
    (value) => {
      setSwitchValue(value);
      fixedMenu?.onSwitchChange?.(value);
    },
    [fixedMenu]
  );

  // Context value
  const contextValue = {
    hubId,
    hub,
    hubName,
    pageTitle,
    isMenuCollapsed,
    toggleMenuCollapsed,
    selectedItemId,
    setSelectedItemId: handleItemSelect,
    searchQuery,
    setSearchQuery: handleSearchChange,
    switchValue,
    setSwitchValue: handleSwitchChange,
  };

  // Determine if fixed menu should be shown
  const showFixedMenu = fixedMenu !== null && fixedMenu !== undefined;

  return (
    <UnifiedLayoutContext.Provider value={contextValue}>
      <div className={cn('flex h-full', className)}>
        {/* ═══════════════════════════════════════════════════════════════════════
            CORE-MENU: Left accordion navigation
            ═══════════════════════════════════════════════════════════════════════ */}
        <UnifiedCoreMenu
          hubId={hubId}
          menu={menu}
          isCollapsed={isMenuCollapsed}
          onToggleCollapse={toggleMenuCollapsed}
        />

        {/* ═══════════════════════════════════════════════════════════════════════
            CONTENT WRAPPER: Status bar + Fixed menu + Content area
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {/* ─── STATUS-BAR: Breadcrumb + Stats + Actions ─── */}
          <UnifiedStatusBar
            hubName={hubName}
            pageTitle={pageTitle}
            stats={stats}
            actions={actions}
          />

          {/* ─── MAIN CONTENT: Fixed menu + Content area ─── */}
          <div className="flex flex-1 gap-2 p-2 overflow-hidden">
            {/* ─── FIXED-MENU: Optional list panel ─── */}
            {showFixedMenu && (
              <UnifiedFixedMenu
                config={{
                  ...fixedMenu,
                  selectedId: selectedItemId,
                  searchValue: searchQuery,
                  selectedSwitch: switchValue,
                }}
                onSelect={handleItemSelect}
                onSearchChange={handleSearchChange}
                onSwitchChange={handleSwitchChange}
              />
            )}

            {/* ─── CONTENT-AREA: Main content ─── */}
            <div
              className={cn(
                'flex-1 min-w-0 min-h-0 rounded-3xl bg-white dark:bg-card shadow-sm overflow-y-auto',
                !showFixedMenu && 'rounded-3xl'
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </UnifiedLayoutContext.Provider>
  );
}

/**
 * Helper function to create stat objects
 * Accepts either positional args: createStat(label, value, icon, color)
 * or a single options object: createStat({ label, value, icon, color })
 */
export function createStat(labelOrOptions, value, icon, color = 'primary') {
  // Support object-style call: createStat({ label, value, icon, color })
  let label;
  if (
    labelOrOptions !== null &&
    typeof labelOrOptions === 'object' &&
    !Array.isArray(labelOrOptions) &&
    typeof labelOrOptions.label !== 'undefined'
  ) {
    ({ label, value, icon, color = 'primary' } = labelOrOptions);
  } else {
    label = labelOrOptions;
  }

  const colorClasses = {
    primary: { bg: 'bg-primary/10', icon: 'text-primary', value: 'text-primary' },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      icon: 'text-blue-600 dark:text-blue-400',
      value: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-500/10',
      icon: 'text-green-600 dark:text-green-400',
      value: 'text-green-600 dark:text-green-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      icon: 'text-emerald-600 dark:text-emerald-400',
      value: 'text-emerald-600 dark:text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      icon: 'text-amber-600 dark:text-amber-400',
      value: 'text-amber-600 dark:text-amber-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      icon: 'text-purple-600 dark:text-purple-400',
      value: 'text-purple-600 dark:text-purple-400',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-500/10',
      icon: 'text-red-600 dark:text-red-400',
      value: 'text-red-600 dark:text-red-400',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      icon: 'text-orange-600 dark:text-orange-400',
      value: 'text-orange-600 dark:text-orange-400',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-500/10',
      icon: 'text-cyan-600 dark:text-cyan-400',
      value: 'text-cyan-600 dark:text-cyan-400',
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-500/10',
      icon: 'text-gray-600 dark:text-gray-400',
      value: 'text-gray-600 dark:text-gray-400',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return {
    label,
    value,
    icon,
    color: colors.bg,
    iconColor: colors.icon,
    valueColor: colors.value,
  };
}

/**
 * Helper function to create action objects
 * Accepts either positional args: createAction(label, icon, onClick, options)
 * or a single options object: createAction({ label, icon, onClick, options })
 */
export function createAction(labelOrOptions, icon, onClick, options = {}) {
  // Support object-style call: createAction({ label, icon, onClick, options })
  let label;
  if (
    labelOrOptions !== null &&
    typeof labelOrOptions === 'object' &&
    !Array.isArray(labelOrOptions) &&
    typeof labelOrOptions.label !== 'undefined'
  ) {
    ({ label, icon, onClick, options = {} } = labelOrOptions);
  } else {
    label = labelOrOptions;
  }

  return {
    label,
    icon,
    onClick,
    primary: options.primary || false,
    variant: options.variant || (options.primary ? 'default' : 'outline'),
    size: options.size || 'sm',
    href: options.href,
    disabled: options.disabled || false,
  };
}

export default UnifiedLayout;
