'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X, Pin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FixedMenuPanel } from './fixed-menu-panel';

/**
 * Three Box Layout Component
 *
 * Provides consistent 3-box layout structure like inbox:
 * [Left Sidebar (320px)] | [Main Content (flex-1)] | [Right Panel (320px)]
 *
 * Features:
 * - Rounded 3xl corners
 * - White background with shadows
 * - Pinnable right panel
 * - Search in left sidebar
 * - Fixed menu in right panel
 *
 * Usage:
 * <ThreeBoxLayout
 *   leftSidebar={<YourListComponent />}
 *   mainContent={<YourDetailComponent />}
 *   rightPanel={<YourActionsComponent />}
 *   fixedMenuConfig={contactsFixedMenu}
 *   searchPlaceholder="Search contacts..."
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   sidebarTitle="Contacts"
 *   sidebarSubtitle="Manage your contacts"
 * />
 */
export function ThreeBoxLayout({
  // Sidebar props
  leftSidebar,
  sidebarTitle,
  sidebarSubtitle,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  showSearch = true,
  sidebarHeader,
  sidebarFooter,
  sidebarWidth = 'w-[320px]',

  // Main content props
  mainContent,
  mainHeader,
  mainFooter,
  emptyState,
  showEmptyState = false,

  // Right panel props
  rightPanel,
  fixedMenuConfig,
  rightPanelWidth = 'w-80',
  showRightPanel = true,
  rightPanelPinned = true,
  onRightPanelPinChange,

  // Fixed menu handlers
  activeFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onAction,
  toggleStates,
  onToggleChange,
  selectedCount,
  bulkActions,
  onBulkAction,

  // Advanced filters
  advancedFiltersContent,
  showAdvancedFilters = false,
  onAdvancedFiltersChange,

  // Layout options
  className,
  gap = 'gap-2',
  padding = 'p-2',
}) {
  const [localPinned, setLocalPinned] = useState(rightPanelPinned);
  const isPinned = onRightPanelPinChange ? rightPanelPinned : localPinned;
  const handlePinChange = onRightPanelPinChange || setLocalPinned;

  return (
    <div className={cn('flex w-full h-full overflow-hidden', gap, padding, className)}>
      {/* Left Sidebar */}
      <aside
        className={cn(
          'relative flex flex-col shrink-0 rounded-3xl bg-white shadow-sm overflow-hidden',
          sidebarWidth
        )}
      >
        {/* Sidebar Header */}
        {(sidebarTitle || sidebarHeader) && (
          <div className="p-3 pb-2 shrink-0">
            {sidebarHeader || (
              <>
                <h2 className="text-sm font-semibold text-muted-foreground">{sidebarTitle}</h2>
                {sidebarSubtitle && (
                  <p className="text-xs text-muted-foreground/70">{sidebarSubtitle}</p>
                )}
              </>
            )}
          </div>
        )}

        {/* Search and Filter */}
        {showSearch && (
          <div className="px-3 pb-3 space-y-2 shrink-0">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  className="pl-9 h-9 bg-muted/50 border-0"
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
              {advancedFiltersContent && (
                <Popover open={showAdvancedFilters} onOpenChange={onAdvancedFiltersChange}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-9 w-9 shrink-0',
                        showAdvancedFilters && 'bg-primary/10 text-primary'
                      )}
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3" align="end">
                    {advancedFiltersContent}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        )}

        {/* Sidebar Content (scrollable) */}
        <div className="flex-1 overflow-y-auto">{leftSidebar}</div>

        {/* Sidebar Footer */}
        {sidebarFooter && <div className="shrink-0 border-t">{sidebarFooter}</div>}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col bg-white dark:bg-card min-w-0 min-h-0 rounded-3xl shadow-sm overflow-hidden">
        {/* Main Header */}
        {mainHeader && <div className="shrink-0 border-b">{mainHeader}</div>}

        {/* Main Content (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          {showEmptyState && emptyState ? emptyState : mainContent}
        </div>

        {/* Main Footer */}
        {mainFooter && <div className="shrink-0 border-t">{mainFooter}</div>}
      </div>

      {/* Right Panel */}
      {showRightPanel && (
        <aside
          className={cn(
            'flex flex-col bg-white dark:bg-card rounded-3xl shadow-sm overflow-hidden ml-2 shrink-0',
            rightPanelWidth
          )}
        >
          {/* Right Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <span className="text-xs font-medium text-muted-foreground">Actions</span>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-6 w-6', isPinned && 'text-primary')}
              onClick={() => handlePinChange(!isPinned)}
            >
              <Pin className={cn('h-3.5 w-3.5', isPinned && 'fill-current')} />
            </Button>
          </div>

          {/* Fixed Menu Panel */}
          {fixedMenuConfig && (
            <div className="px-4 py-3 border-b shrink-0">
              <FixedMenuPanel
                config={fixedMenuConfig}
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                onAction={onAction}
                toggleStates={toggleStates}
                onToggleChange={onToggleChange}
                selectedCount={selectedCount}
                bulkActions={bulkActions}
                onBulkAction={onBulkAction}
              />
            </div>
          )}

          {/* Custom Right Panel Content */}
          {rightPanel && <div className="flex-1 overflow-y-auto">{rightPanel}</div>}
        </aside>
      )}
    </div>
  );
}

/**
 * Simpler two-box layout (no right panel)
 */
export function TwoBoxLayout({
  leftSidebar,
  mainContent,
  sidebarTitle,
  sidebarSubtitle,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  showSearch = true,
  sidebarWidth = 'w-[320px]',
  className,
}) {
  return (
    <ThreeBoxLayout
      leftSidebar={leftSidebar}
      mainContent={mainContent}
      sidebarTitle={sidebarTitle}
      sidebarSubtitle={sidebarSubtitle}
      searchPlaceholder={searchPlaceholder}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      showSearch={showSearch}
      sidebarWidth={sidebarWidth}
      showRightPanel={false}
      className={className}
    />
  );
}

export default ThreeBoxLayout;
