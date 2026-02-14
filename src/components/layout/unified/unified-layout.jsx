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
 */
export function createStat(label, value, icon, color = 'primary') {
  const colorClasses = {
    primary: { bg: 'bg-primary/10', icon: 'text-primary', value: 'text-primary' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', value: 'text-green-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', value: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', value: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', value: 'text-purple-600' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', value: 'text-red-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', value: 'text-orange-600' },
    cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', value: 'text-cyan-600' },
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
 */
export function createAction(label, icon, onClick, options = {}) {
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
