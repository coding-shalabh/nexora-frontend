'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, Filter, ChevronDown, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * UnifiedFixedMenu - Secondary list panel with search, filters, and items
 *
 * ┌─────────────────────────────────┐
 * │ [🔍 Search...]      [Filter] ▼  │  <- Search bar + Filter button + Switch dropdown
 * ├─────────────────────────────────┤
 * │ ┌─────────────────────────────┐ │
 * │ │ [Item 1] •                  │ │  <- Scrollable list
 * │ │ [Item 2]                    │ │
 * │ │ [Item 3]                    │ │
 * │ └─────────────────────────────┘ │
 * ├─────────────────────────────────┤
 * │ [Footer: Pagination/Stats]      │  <- Optional footer
 * └─────────────────────────────────┘
 *
 * @param {Object} props
 * @param {Object} props.config - Configuration object
 * @param {Array} props.config.items - List items to display
 * @param {boolean} props.config.hasDetailPage - Whether items link to detail pages
 * @param {string} props.config.detailBasePath - Base path for detail pages (e.g., "/crm/contacts")
 * @param {Function} props.config.getItemId - Function to extract item ID
 * @param {Function} props.config.renderItem - Custom item renderer
 * @param {string} props.config.searchPlaceholder - Search placeholder text
 * @param {Array} props.config.filters - Filter options for modal
 * @param {Array} props.config.switchOptions - Switch dropdown options (like channels)
 * @param {string} props.config.selectedSwitch - Currently selected switch option
 * @param {string} props.config.selectedId - Currently selected item ID
 * @param {string} props.config.searchValue - Current search value
 * @param {React.ReactNode} props.config.footer - Optional footer content
 * @param {string} props.config.width - Panel width (default: "340px")
 * @param {string} props.config.emptyMessage - Message when no items
 * @param {string} props.config.emptyIcon - Icon component for empty state
 * @param {Function} props.onSelect - Item selection handler
 * @param {Function} props.onSearchChange - Search change handler
 * @param {Function} props.onSwitchChange - Switch dropdown change handler
 * @param {Function} props.onFilterApply - Filter apply handler
 */
export function UnifiedFixedMenu({
  config,
  onSelect,
  onSearchChange,
  onSwitchChange,
  onFilterApply,
}) {
  const pathname = usePathname();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const {
    items = [],
    list,
    hasDetailPage = false,
    detailBasePath = '',
    getItemId = (item) => item.id,
    renderItem,
    searchPlaceholder = 'Search...',
    filters = [],
    switchOptions = [],
    selectedSwitch,
    selectedId,
    searchValue = '',
    footer,
    width = '340px',
    emptyMessage = 'No items found',
    EmptyIcon,
  } = config || {};

  // Check if item is selected based on URL or selectedId
  const isItemSelected = (item) => {
    const itemId = getItemId(item);
    if (hasDetailPage && detailBasePath) {
      return pathname === `${detailBasePath}/${itemId}`;
    }
    return selectedId === itemId;
  };

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).filter((v) => v && v !== 'all').length;
  }, [activeFilters]);

  // Handle filter change
  const handleFilterChange = (filterId, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFilterApply?.(activeFilters);
    setIsFilterOpen(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setActiveFilters({});
    onFilterApply?.({});
  };

  return (
    <aside
      className="relative flex flex-col shrink-0 rounded-3xl bg-white dark:bg-card shadow-sm overflow-hidden"
      style={{ width }}
    >
      {/* ─── HEADER: Search + Filter + Switch ─── */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800 space-y-2">
        {/* Search and Filter row */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9 h-9 bg-gray-50 border-0 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Filter Button */}
          {filters.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFilterOpen(true)}
              className={cn(
                'h-9 w-9 shrink-0',
                activeFilterCount > 0 && 'border-primary text-primary'
              )}
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Switch Dropdown (e.g., for channels) */}
        {switchOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between h-8 text-sm font-normal"
              >
                <span className="truncate">
                  {switchOptions.find((opt) => opt.value === selectedSwitch)?.label || 'Select...'}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
              {switchOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSwitchChange?.(option.value)}
                  className={cn(
                    'flex items-center gap-2',
                    selectedSwitch === option.value && 'bg-primary/5'
                  )}
                >
                  {option.icon && <option.icon className="h-4 w-4 text-gray-500" />}
                  <span className="flex-1">{option.label}</span>
                  {selectedSwitch === option.value && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* ─── LIST: Scrollable items ─── */}
      <ScrollArea className="flex-1">
        {list ? (
          list
        ) : (
          <div className="p-2 space-y-1">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                {EmptyIcon && <EmptyIcon className="h-10 w-10 mb-3 opacity-50" />}
                <p className="text-sm">{emptyMessage}</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => {
                  const itemId = getItemId(item);
                  const isSelected = isItemSelected(item);

                  // Use custom renderer if provided
                  if (renderItem) {
                    return (
                      <motion.div
                        key={itemId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15, delay: index * 0.02 }}
                      >
                        {renderItem({
                          item,
                          isSelected,
                          onSelect: () => onSelect?.(item),
                          href: hasDetailPage ? `${detailBasePath}/${itemId}` : undefined,
                        })}
                      </motion.div>
                    );
                  }

                  // Default item rendering
                  const ItemWrapper = hasDetailPage ? Link : 'button';
                  const itemProps = hasDetailPage
                    ? { href: `${detailBasePath}/${itemId}` }
                    : { onClick: () => onSelect?.(item), type: 'button' };

                  return (
                    <motion.div
                      key={itemId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                    >
                      <ItemWrapper
                        {...itemProps}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
                          isSelected
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        {/* Avatar/Icon */}
                        {item.avatar ? (
                          <div className="h-10 w-10 rounded-full overflow-hidden shrink-0">
                            <img
                              src={item.avatar}
                              alt={item.name || item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : item.icon ? (
                          <div
                            className={cn(
                              'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                              isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                            )}
                          >
                            <item.icon
                              className={cn('h-5 w-5', isSelected ? 'text-white' : 'text-gray-500')}
                            />
                          </div>
                        ) : (
                          <div
                            className={cn(
                              'h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-medium',
                              isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                            )}
                          >
                            {(item.name || item.title || '?').charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                'font-medium truncate',
                                isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                              )}
                            >
                              {item.name || item.title}
                            </span>
                            {item.time && (
                              <span
                                className={cn(
                                  'text-xs shrink-0',
                                  isSelected ? 'text-white/70' : 'text-gray-400'
                                )}
                              >
                                {item.time}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p
                              className={cn(
                                'text-sm truncate',
                                isSelected ? 'text-white/80' : 'text-gray-500'
                              )}
                            >
                              {item.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Badge */}
                        {item.badge && (
                          <span
                            className={cn(
                              'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold shrink-0',
                              isSelected ? 'bg-white/20 text-white' : 'bg-primary text-white'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </ItemWrapper>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        )}
      </ScrollArea>

      {/* ─── FOOTER: Pagination/Stats ─── */}
      {footer && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
          {footer}
        </div>
      )}

      {/* ─── FILTER MODAL ─── */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Apply filters to narrow down your results.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{filter.label}</label>
                <div className="flex flex-wrap gap-2">
                  {filter.options.map((option) => (
                    <Button
                      key={option.value}
                      variant={activeFilters[filter.id] === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange(filter.id, option.value)}
                      className="rounded-full"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}

export default UnifiedFixedMenu;
