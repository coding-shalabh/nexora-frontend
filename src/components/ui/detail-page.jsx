'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Minimalist Section Card
export function Section({ title, icon: Icon, children, className, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border border-border/50 bg-card p-5',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        {action}
      </div>
      <div className="space-y-0.5">{children}</div>
    </motion.div>
  );
}

// Collapsible Section
export function CollapsibleSection({ title, icon: Icon, children, className, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border border-border/50 bg-card overflow-hidden',
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <ChevronRight
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-90'
          )}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 pt-0 space-y-0.5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// Property Row - Clean inline display
export function PropertyRow({ label, value, icon: Icon, copyable, onCopy }) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-center justify-between py-2.5 group border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-right">{value}</span>
        {copyable && onCopy && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onCopy(value, label)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Stat Display - Minimal stats
export function StatDisplay({ label, value, icon: Icon, trend, className }) {
  return (
    <div className={cn('flex flex-col gap-1 p-4 rounded-xl border border-border/50 bg-card', className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {trend !== undefined && (
          <span
            className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded',
              trend > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
            )}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}

// Quick Action Button
export function QuickAction({ icon: Icon, label, onClick, variant = 'default' }) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className="gap-2"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}

// Page Header - Minimalist
export function PageHeader({
  title,
  subtitle,
  avatar,
  badges,
  actions,
  breadcrumbs,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {crumb}
            </div>
          ))}
        </div>
      )}

      {/* Main Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {avatar}
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {badges}
            </div>
            {subtitle && (
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Info Grid - For displaying multiple properties in a grid
export function InfoGrid({ children, columns = 2 }) {
  return (
    <div className={cn(
      'grid gap-4',
      columns === 2 && 'grid-cols-1 md:grid-cols-2',
      columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    )}>
      {children}
    </div>
  );
}

// Empty State
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="font-medium text-sm">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Activity Timeline Item
export function TimelineItem({ icon: Icon, iconColor, title, description, time, isLast }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full shrink-0',
          iconColor || 'bg-muted'
        )}>
          <Icon className="h-4 w-4" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border/50 my-1" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{title}</p>
          <span className="text-xs text-muted-foreground shrink-0">{time}</span>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

// Status Badge
export function StatusBadge({ status, variant = 'default' }) {
  const variants = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
      variants[variant]
    )}>
      {status}
    </span>
  );
}
