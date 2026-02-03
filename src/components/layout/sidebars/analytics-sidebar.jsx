'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  LayoutDashboard,
  FileText,
  Target,
  PieChart,
  TrendingUp,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Filter,
  Plus,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Analytics Hub Sidebar Navigation Items
 * Flat list - no collapsible sections
 */
const analyticsNavigation = [
  {
    title: 'Dashboards',
    href: '/analytics/dashboards',
    icon: LayoutDashboard,
    description: 'Visual dashboards',
  },
  { title: 'Reports', href: '/analytics/reports', icon: FileText, description: 'Detailed reports' },
  {
    title: 'Custom Reports',
    href: '/analytics/custom-reports',
    icon: PieChart,
    description: 'Build reports',
  },
  { title: 'Goals', href: '/analytics/goals', icon: Target, description: 'Track objectives' },
  {
    title: 'Data Sources',
    href: '/analytics/data-sources',
    icon: Database,
    description: 'Connect data',
  },
  { title: 'Metrics', href: '/analytics/metrics', icon: TrendingUp, description: 'Key metrics' },
  { title: 'Filters', href: '/analytics/filters', icon: Filter, description: 'Data filters' },
  { title: 'Export', href: '/analytics/export', icon: Download, description: 'Export reports' },
  { title: 'Share', href: '/analytics/share', icon: Share2, description: 'Share insights' },
  {
    title: 'Settings',
    href: '/analytics/settings',
    icon: Settings,
    description: 'Configure analytics',
  },
];

/**
 * Fixed Action Buttons (always visible at top)
 */
const fixedActions = [
  {
    id: 'dashboard',
    title: 'New Dashboard',
    href: '/analytics/dashboards/new',
    icon: Plus,
    variant: 'default',
  },
  {
    id: 'report',
    title: 'New Report',
    href: '/analytics/reports/new',
    icon: FileText,
    variant: 'outline',
  },
];

/**
 * Date Range Presets
 */
const dateRangePresets = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: 'custom', label: 'Custom', icon: Calendar },
];

export function AnalyticsSidebar({ onAction }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeDateRange, setActiveDateRange] = useState('30d');

  // Check if we're on the dashboards page
  const isDashboardsPage = pathname.includes('/analytics/dashboards');

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('analytics-sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('analytics-sidebar-collapsed', JSON.stringify(newState));
  };

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId);
    }
  };

  const NavItem = ({ item, showDescription = false }) => {
    const active = isActive(item.href);

    const linkContent = (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-all overflow-hidden',
          active && 'text-white',
          !active && 'text-gray-700 hover:bg-white/50 hover:text-gray-900',
          isCollapsed && 'justify-center px-2 py-2'
        )}
        style={active ? { background: '#0004c3' } : undefined}
      >
        <item.icon
          className={cn(
            'shrink-0',
            isCollapsed ? 'h-5 w-5' : 'h-4 w-4',
            active ? 'text-white' : 'text-gray-500'
          )}
        />
        {!isCollapsed && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <span
              className={cn(
                'text-sm font-medium whitespace-nowrap',
                active ? 'text-white' : 'text-gray-900'
              )}
            >
              {item.title}
            </span>
            {showDescription && item.description && (
              <p
                className={cn(
                  'text-xs truncate mt-0.5',
                  active ? 'text-white/70' : 'text-gray-500'
                )}
              >
                {item.description}
              </p>
            )}
          </div>
        )}
      </div>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href}>{linkContent}</Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="flex flex-col gap-1 bg-white border-0 px-3 py-2 shadow-lg"
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            {item.description && <span className="text-xs text-gray-500">{item.description}</span>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <Link href={item.href}>{linkContent}</Link>;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 260 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        className="relative h-full flex flex-col bg-transparent"
      >
        {/* Fixed Action Buttons (always visible) */}
        {!isCollapsed && (
          <div className="px-3 py-3 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {fixedActions.map((action) => {
                const Icon = action.icon;
                if (action.href) {
                  return (
                    <Link key={action.id} href={action.href} className="flex-1">
                      <Button
                        variant={action.variant || 'default'}
                        size="sm"
                        className="w-full"
                        style={action.variant === 'default' ? { background: '#0004c3' } : undefined}
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {action.title}
                      </Button>
                    </Link>
                  );
                }
                return (
                  <Button
                    key={action.id}
                    variant={action.variant || 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAction(action.onClick || action.id)}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {action.title}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsed state: show action buttons as icons */}
        {isCollapsed && (
          <div className="px-2 py-2 border-b border-gray-200 space-y-1">
            {fixedActions.map((action) => {
              const Icon = action.icon;
              const content = (
                <Button
                  variant={action.variant === 'default' ? 'default' : 'ghost'}
                  size="icon"
                  className="w-full h-10"
                  style={action.variant === 'default' ? { background: '#0004c3' } : undefined}
                  onClick={() => !action.href && handleAction(action.onClick || action.id)}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              );
              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    {action.href ? <Link href={action.href}>{content}</Link> : content}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white border-0 shadow-lg">
                    {action.title}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}

        {/* Navigation Links - Flat list (no section headers) */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {analyticsNavigation.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* Date Range Filters (shown when on Dashboards page) */}
        {isDashboardsPage && !isCollapsed && (
          <div className="px-3 py-3 border-t border-gray-200">
            <div className="space-y-3">
              {/* Date Range */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-500">Date Range</span>
                <div className="flex flex-wrap gap-1">
                  {dateRangePresets.map((preset) => {
                    const PresetIcon = preset.icon;
                    const isPresetActive = activeDateRange === preset.id;
                    return (
                      <Button
                        key={preset.id}
                        variant={isPresetActive ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn(
                          'h-7 text-xs',
                          isPresetActive && 'bg-primary/10 text-primary'
                        )}
                        onClick={() => setActiveDateRange(preset.id)}
                      >
                        {PresetIcon && <PresetIcon className="h-3 w-3 mr-1" />}
                        {preset.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white border-gray-200 text-gray-600 shadow-md hover:bg-gray-50 hover:text-gray-900 z-10"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}
