'use client';

import { cn } from '@/lib/utils';
import { HubSidebar } from './hub-sidebar';

/**
 * HubLayout - Standardized layout for all hub pages
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                           TOP-BAR                                        │
 * │  ┌─────────────────────────────────┐  ┌──────────────────────────────┐  │
 * │  │  PAGE-HEADER (Title + Desc)     │  │  ACTION-BUTTONS              │  │
 * │  │  STATS-ROW (Stat cards)         │  │                              │  │
 * │  └─────────────────────────────────┘  └──────────────────────────────┘  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         THREE-BOX-CONTAINER                              │
 * │ ┌──────────┐ ┌─────────────────────────┐ ┌────────────────────────────┐ │
 * │ │          │ │      FIXED-MENU         │ │                            │ │
 * │ │ HUB-     │ │  ┌───────────────────┐  │ │                            │ │
 * │ │ SIDEBAR  │ │  │ FIXED-MENU-FILTER │  │ │      CONTENT-AREA          │ │
 * │ │          │ │  ├───────────────────┤  │ │      (children)            │ │
 * │ │          │ │  │ FIXED-MENU-LIST   │  │ │                            │ │
 * │ │          │ │  ├───────────────────┤  │ │                            │ │
 * │ │          │ │  │ FIXED-MENU-FOOTER │  │ │                            │ │
 * │ │          │ │  └───────────────────┘  │ │                            │ │
 * │ └──────────┘ └─────────────────────────┘ └────────────────────────────┘ │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * SECTION NAMES (use these to reference specific parts):
 * - TOP-BAR: The white header bar at the top
 *   - PAGE-HEADER: Title and description
 *   - STATS-ROW: Row of colored stat cards
 *   - ACTION-BUTTONS: Right-side action buttons
 * - THREE-BOX-CONTAINER: The main content area below top bar
 *   - HUB-SIDEBAR: Left collapsible navigation (from HubSidebar component)
 *   - FIXED-MENU: Middle panel with filters and list
 *     - FIXED-MENU-FILTER: Top filter section
 *     - FIXED-MENU-LIST: Scrollable list area
 *     - FIXED-MENU-FOOTER: Bottom pagination area
 *   - CONTENT-AREA: Main content area (children)
 *
 * @param {Object} props
 * @param {string} props.hubId - Hub identifier for sidebar
 * @param {string} props.title - Page title (PAGE-HEADER)
 * @param {string} props.description - Page description (PAGE-HEADER)
 * @param {Array} props.stats - Array of stat objects (STATS-ROW)
 * @param {React.ReactNode} props.actions - Action buttons (ACTION-BUTTONS)
 * @param {React.ReactNode} props.fixedMenuFilters - Filter controls (FIXED-MENU-FILTER)
 * @param {React.ReactNode} props.fixedMenuList - List items (FIXED-MENU-LIST)
 * @param {React.ReactNode} props.fixedMenuFooter - Pagination (FIXED-MENU-FOOTER)
 * @param {React.ReactNode} props.children - Main content (CONTENT-AREA)
 * @param {string} props.fixedMenuWidth - Width of FIXED-MENU (default: 340px)
 * @param {boolean} props.showSidebar - Show HUB-SIDEBAR (default: true)
 * @param {boolean} props.showFixedMenu - Show FIXED-MENU (default: true)
 */
export function HubLayout({
  hubId,
  title,
  description,
  stats = [],
  actions,
  fixedMenuFilters,
  fixedMenuList,
  fixedMenuFooter,
  children,
  fixedMenuWidth = '340px',
  showSidebar = true,
  showFixedMenu = true,
}) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════
          TOP-BAR: White header bar containing page header, stats, and actions
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="shrink-0 bg-white dark:bg-card border-b border-gray-100 dark:border-gray-800 mx-2 mt-2 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side of TOP-BAR */}
          <div className="flex items-center gap-6">
            {/* ─── PAGE-HEADER: Title and description ─── */}
            {title && (
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            )}

            {/* ─── STATS-ROW: Row of colored stat cards ─── */}
            {stats.length > 0 && (
              <div className="flex items-center gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg',
                        stat.color || 'bg-primary/10'
                      )}
                    >
                      {stat.icon && (
                        <stat.icon className={cn('h-4 w-4', stat.iconColor || 'text-primary')} />
                      )}
                      <div className={cn('w-px h-5 opacity-30', stat.iconColor || 'bg-primary')} />
                      <div className="flex flex-col">
                        <p
                          className={cn(
                            'text-sm font-bold leading-none',
                            stat.iconColor || 'text-primary'
                          )}
                        >
                          {stat.value}
                        </p>
                        <p
                          className={cn(
                            'text-[10px] leading-tight mt-0.5 opacity-70',
                            stat.iconColor || 'text-primary'
                          )}
                        >
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── ACTION-BUTTONS: Right-side action buttons ─── */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          THREE-BOX-CONTAINER: Main content area with sidebar, fixed menu, content
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 w-full gap-2 p-2 overflow-hidden">
        {/* ─── HUB-SIDEBAR: Left collapsible navigation menu ─── */}
        {showSidebar && <HubSidebar hubId={hubId} />}

        {/* ─── FIXED-MENU: Middle panel with filters, list, and footer ─── */}
        {showFixedMenu && (
          <aside
            className="relative flex flex-col shrink-0 rounded-3xl bg-white dark:bg-card shadow-sm overflow-hidden"
            style={{ width: fixedMenuWidth }}
          >
            {/* FIXED-MENU-FILTER: Top filter/tab section */}
            {fixedMenuFilters && (
              <div className="border-b border-gray-100 dark:border-gray-800 shrink-0">
                {fixedMenuFilters}
              </div>
            )}

            {/* FIXED-MENU-LIST: Scrollable list of items */}
            <div className="flex-1 overflow-y-auto">{fixedMenuList}</div>

            {/* FIXED-MENU-FOOTER: Bottom pagination/actions */}
            {fixedMenuFooter && (
              <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
                {fixedMenuFooter}
              </div>
            )}
          </aside>
        )}

        {/* ─── CONTENT-AREA: Main content area (children) ─── */}
        <div className="flex-1 min-w-0 min-h-0 rounded-3xl bg-white dark:bg-card shadow-sm overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * StatItem helper - Creates a stat object for HubLayout
 */
export function createStat(label, value, icon, color = 'primary') {
  const colorClasses = {
    primary: { bg: 'bg-primary/10', icon: 'text-primary', value: 'text-primary' },
    blue: { bg: 'bg-blue-100', icon: 'text-blue-600', value: 'text-blue-600' },
    green: { bg: 'bg-green-100', icon: 'text-green-600', value: 'text-green-600' },
    emerald: { bg: 'bg-emerald-100', icon: 'text-emerald-600', value: 'text-emerald-600' },
    amber: { bg: 'bg-amber-100', icon: 'text-amber-600', value: 'text-amber-600' },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-600', value: 'text-purple-600' },
    red: { bg: 'bg-red-100', icon: 'text-red-600', value: 'text-red-600' },
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

export default HubLayout;
