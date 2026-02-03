'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { LayoutList, LayoutGrid, Kanban, Calendar } from 'lucide-react';

/**
 * Fixed Menu Panel Component
 *
 * Renders action buttons and filters for 3-box layout pages.
 * No titles, no collapsible sections - just clean action buttons.
 *
 * Usage:
 * <FixedMenuPanel
 *   config={contactsFixedMenu}
 *   activeFilter="all"
 *   onFilterChange={(filterId) => setFilter(filterId)}
 *   viewMode="list"
 *   onViewModeChange={(mode) => setViewMode(mode)}
 *   onAction={(actionId) => handleAction(actionId)}
 *   toggleStates={{ hideCompleted: false }}
 *   onToggleChange={(toggleId, value) => setToggle(toggleId, value)}
 *   selectedCount={0}
 *   bulkActions={[{ id: 'delete', label: 'Delete', variant: 'destructive' }]}
 *   onBulkAction={(actionId) => handleBulkAction(actionId)}
 * />
 */
export function FixedMenuPanel({
  config,
  activeFilter = 'all',
  onFilterChange,
  viewMode = 'list',
  onViewModeChange,
  onAction,
  toggleStates = {},
  onToggleChange,
  selectedCount = 0,
  bulkActions = [],
  onBulkAction,
  className,
}) {
  if (!config) return null;

  const viewModeIcons = {
    list: LayoutList,
    grid: LayoutGrid,
    kanban: Kanban,
    calendar: Calendar,
    table: LayoutList,
    timeline: LayoutList,
    dashboard: LayoutGrid,
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Primary Action Buttons */}
      {config.primaryActions?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {config.primaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant || 'default'}
                size="sm"
                onClick={() => onAction?.(action.id)}
                className="flex-1 min-w-[100px]"
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Secondary Action Buttons */}
      {config.secondaryActions?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {config.secondaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant || 'ghost'}
                size="sm"
                onClick={() => onAction?.(action.id)}
              >
                {Icon && <Icon className="h-4 w-4 mr-1" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Bulk Actions (when items selected) */}
      {selectedCount > 0 && bulkActions.length > 0 && (
        <div className="p-2 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">{selectedCount} selected</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {bulkActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={() => onBulkAction?.(action.id)}
                  className="h-7 text-xs"
                >
                  {Icon && <Icon className="h-3 w-3 mr-1" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Filters */}
      {config.filters?.quickFilters?.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Filters</span>
          <div className="flex flex-wrap gap-1">
            {config.filters.quickFilters.map((filter) => {
              const FilterIcon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <Button
                  key={filter.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onFilterChange?.(filter.id)}
                  className={cn('h-7 text-xs', isActive && 'bg-primary/10 text-primary')}
                >
                  {FilterIcon && <FilterIcon className="h-3 w-3 mr-1" />}
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toggle Filters (like Hide Completed) */}
      {config.filters?.toggleFilters?.length > 0 && (
        <div className="space-y-2">
          {config.filters.toggleFilters.map((toggle) => (
            <div key={toggle.id} className="flex items-center justify-between py-1">
              <span className="text-xs text-muted-foreground">{toggle.label}</span>
              <Switch
                checked={toggleStates[toggle.id] ?? toggle.defaultValue ?? false}
                onCheckedChange={(checked) => onToggleChange?.(toggle.id, checked)}
                className="h-4 w-7"
              />
            </div>
          ))}
        </div>
      )}

      {/* View Mode Toggle */}
      {config.viewModes?.length > 1 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">View</span>
          <div className="flex rounded-lg border p-1 bg-muted/30">
            {config.viewModes.map((mode) => {
              const ViewIcon = viewModeIcons[mode] || LayoutList;
              const isActive = viewMode === mode;
              return (
                <Button
                  key={mode}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange?.(mode)}
                  className={cn('flex-1 h-7 px-2', isActive && 'bg-white shadow-sm')}
                >
                  <ViewIcon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for smaller spaces
 */
export function FixedMenuPanelCompact({
  config,
  activeFilter = 'all',
  onFilterChange,
  onAction,
  className,
}) {
  if (!config) return null;

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {/* Primary Actions */}
      {config.primaryActions?.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant={action.variant || 'default'}
            size="sm"
            onClick={() => onAction?.(action.id)}
          >
            {Icon && <Icon className="h-4 w-4 mr-1" />}
            {action.label}
          </Button>
        );
      })}

      {/* Separator */}
      {config.primaryActions?.length > 0 && config.filters?.quickFilters?.length > 0 && (
        <div className="h-6 w-px bg-border" />
      )}

      {/* Quick Filters as pills */}
      {config.filters?.quickFilters?.slice(0, 5).map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <Badge
            key={filter.id}
            variant={isActive ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer hover:bg-muted',
              isActive && 'bg-primary text-primary-foreground'
            )}
            onClick={() => onFilterChange?.(filter.id)}
          >
            {filter.label}
          </Badge>
        );
      })}
    </div>
  );
}

export default FixedMenuPanel;
