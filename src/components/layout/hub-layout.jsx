'use client';

import { cn } from '@/lib/utils';
import { HubSidebar } from './hub-sidebar';
import { getHub } from '@/config/hubs';

/**
 * HubLayout - Standardized layout for all hub pages (matches Inbox structure)
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ┌──────────┐ ┌─────────────────────────────────────────────────────────┐│
 * │ │          │ │  TOP-BAR (inside content area, not full width)         ││
 * │ │          │ │  ┌─────────────────────────────────────────────────┐   ││
 * │ │ HUB-     │ │  │ BREADCRUMB + STATS-ROW (compact) │ ACTIONS     │   ││
 * │ │ SIDEBAR  │ │  └─────────────────────────────────────────────────┘   ││
 * │ │          │ ├─────────────────────────────────────────────────────────┤│
 * │ │          │ │  ┌─────────────────┐ ┌─────────────────────────────────┐││
 * │ │          │ │  │  FIXED-MENU     │ │        CONTENT-AREA             │││
 * │ │          │ │  │  (filters/list) │ │        (children)               │││
 * │ │          │ │  └─────────────────┘ └─────────────────────────────────┘││
 * │ └──────────┘ └─────────────────────────────────────────────────────────┘│
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * @param {Object} props
 * @param {string} props.hubId - Hub identifier for sidebar and breadcrumb
 * @param {string} props.title - Page title (shown in breadcrumb)
 * @param {string} props.description - Page description (optional, for tooltip)
 * @param {Array} props.stats - Array of stat objects (STATS-ROW)
 * @param {React.ReactNode} props.actions - Action buttons
 * @param {React.ReactNode} props.fixedMenuFilters - Filter controls (FIXED-MENU-FILTER)
 * @param {React.ReactNode} props.fixedMenuList - List items (FIXED-MENU-LIST)
 * @param {React.ReactNode} props.fixedMenuFooter - Pagination (FIXED-MENU-FOOTER)
 * @param {React.ReactNode} props.children - Main content (CONTENT-AREA)
 * @param {string} props.fixedMenuWidth - Width of FIXED-MENU (default: 340px)
 * @param {boolean} props.showSidebar - Show HUB-SIDEBAR (default: true)
 * @param {boolean} props.showFixedMenu - Show FIXED-MENU (default: true)
 * @param {boolean} props.showTopBar - Show TOP-BAR with breadcrumb/stats (default: true)
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
  showTopBar = true,
}) {
  // Get hub info for breadcrumb
  const hub = getHub(hubId);
  const hubName = hub?.name || `${hubId?.charAt(0).toUpperCase()}${hubId?.slice(1)} Hub`;

  return (
    <div className="flex h-full">
      {/* ═══════════════════════════════════════════════════════════════════════
          HUB-SIDEBAR: Left collapsible navigation menu (OUTSIDE content area)
          ═══════════════════════════════════════════════════════════════════════ */}
      {showSidebar && <HubSidebar hubId={hubId} />}

      {/* ═══════════════════════════════════════════════════════════════════════
          CONTENT WRAPPER: Contains TOP-BAR + THREE-BOX content
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 overflow-hidden flex">
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* ─── TOP-BAR: Header with breadcrumb and compact stats ─── */}
          {showTopBar && (
            <div className="shrink-0 bg-white dark:bg-card border-b border-gray-100 dark:border-gray-800 mx-2 mt-2 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between px-4 py-2.5">
                {/* Left side - Breadcrumb and Stats */}
                <div className="flex items-center gap-4">
                  {/* ─── BREADCRUMB: "Hub Name / Page Title" ─── */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{hubName}</span>
                    <span className="text-sm text-gray-400">/</span>
                    <h1 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h1>
                  </div>

                  {/* ─── STATS-ROW: Compact inline stats (like inbox) ─── */}
                  {stats.length > 0 && (
                    <div className="flex items-center gap-2">
                      {stats.map((stat, index) => (
                        <div
                          key={index}
                          className={cn(
                            'flex items-center gap-1.5 px-2 py-1 rounded-md',
                            stat.color || 'bg-primary/10'
                          )}
                        >
                          {stat.icon && (
                            <stat.icon
                              className={cn('h-3.5 w-3.5', stat.iconColor || 'text-primary')}
                            />
                          )}
                          <span
                            className={cn(
                              'text-xs font-semibold',
                              stat.iconColor || 'text-primary'
                            )}
                          >
                            {stat.value}
                          </span>
                          <span
                            className={cn(
                              'text-[10px] opacity-70',
                              stat.iconColor || 'text-primary'
                            )}
                          >
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ─── ACTION-BUTTONS: Right-side action buttons ─── */}
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            </div>
          )}

          {/* ─── TWO-BOX-CONTAINER: Fixed menu + Content area ─── */}
          <div className="flex flex-1 w-full gap-2 p-2 overflow-hidden">
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
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', value: 'text-green-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', value: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', value: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', value: 'text-purple-600' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', value: 'text-red-600' },
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
