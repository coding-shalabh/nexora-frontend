'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * UnifiedStatusBar - Top header bar with breadcrumb, stats, and actions
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ [Hub Name / Page Title]  │ [Stat1] [Stat2] [Stat3] [Stat4] [Stat5]  │ [Actions] │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * @param {Object} props
 * @param {string} props.hubName - Hub name for breadcrumb (e.g., "CRM")
 * @param {string} props.pageTitle - Current page title (e.g., "Contacts")
 * @param {Array} props.stats - Array of stat objects (max 5)
 * @param {Array} props.actions - Array of action button objects
 */
export function UnifiedStatusBar({ hubName, pageTitle, stats = [], actions = [] }) {
  // Limit stats to 5
  const displayStats = stats.slice(0, 5);

  return (
    <div className="shrink-0 bg-white dark:bg-card border-b border-gray-100 dark:border-gray-800 mx-2 mt-2 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left side - Breadcrumb and Stats */}
        <div className="flex items-center gap-4">
          {/* ─── BREADCRUMB: "Hub Name / Page Title" ─── */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{hubName}</span>
            {pageTitle && (
              <>
                <span className="text-sm text-gray-400">/</span>
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
              </>
            )}
          </div>

          {/* ─── STATS-ROW: Compact inline stats ─── */}
          {displayStats.length > 0 && (
            <div className="flex items-center gap-2">
              {displayStats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 rounded-md',
                      stat.color || 'bg-primary/10'
                    )}
                  >
                    {StatIcon && (
                      <StatIcon className={cn('h-3.5 w-3.5', stat.iconColor || 'text-primary')} />
                    )}
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        stat.valueColor || stat.iconColor || 'text-primary'
                      )}
                    >
                      {stat.value}
                    </span>
                    <span
                      className={cn('text-[10px] opacity-70', stat.iconColor || 'text-primary')}
                    >
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── ACTION-BUTTONS: Right-side action buttons ─── */}
        {actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              const buttonProps = {
                variant: action.variant || (action.primary ? 'default' : 'outline'),
                size: action.size || 'sm',
                disabled: action.disabled,
                className: cn('gap-1.5', action.primary && 'bg-primary hover:bg-primary/90'),
              };

              const buttonContent = (
                <>
                  {ActionIcon && <ActionIcon className="h-4 w-4" />}
                  {action.label && <span>{action.label}</span>}
                </>
              );

              // If action has href, render as Link
              if (action.href) {
                return (
                  <Button key={index} {...buttonProps} asChild>
                    <Link href={action.href}>{buttonContent}</Link>
                  </Button>
                );
              }

              // Otherwise render as button with onClick
              return (
                <Button key={index} {...buttonProps} onClick={action.onClick}>
                  {buttonContent}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default UnifiedStatusBar;
