'use client';

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Briefcase,
  TrendingUp,
  UserPlus,
  Building2,
  FileText,
  Zap,
  ClipboardList,
  Files,
  Target,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Trophy,
  Plus,
  Download,
  CheckCircle,
  Clock,
  RefreshCw,
  DollarSign,
  Layers,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION SECTIONS - Core sidebar categories
// ═══════════════════════════════════════════════════════════════════════════════
const navigationSections = [
  {
    id: 'core',
    title: 'Core',
    subtitle: 'Sales tools & pipeline',
    icon: Briefcase,
    // Items grouped by category for accordion display in SubMenu
    groups: [
      {
        id: 'overview',
        title: null, // No header for overview
        items: [{ title: 'Overview', href: '/sales', icon: TrendingUp }],
      },
      {
        id: 'leads',
        title: 'Leads',
        items: [
          { title: 'Leads', href: '/sales/leads', icon: Target },
          { title: 'Prospecting', href: '/sales/prospecting', icon: Target },
        ],
      },
      {
        id: 'pipeline',
        title: 'Pipeline',
        items: [
          { title: 'Pipeline', href: '/sales/pipeline', icon: LineChart },
          { title: 'Deals', href: '/sales/deals', icon: Briefcase },
        ],
      },
      {
        id: 'quotes',
        title: 'Quotes',
        items: [
          { title: 'Quotes', href: '/sales/quotes', icon: FileText },
          { title: 'Products', href: '/sales/products', icon: LayoutGrid },
        ],
      },
      {
        id: 'forecasting',
        title: 'Forecasting',
        items: [
          { title: 'Forecasts', href: '/sales/forecasts', icon: TrendingUp },
          { title: 'Goals', href: '/sales/goals', icon: Target },
        ],
      },
      {
        id: 'workspace',
        title: 'Workspace',
        items: [
          { title: 'Workspace', href: '/sales/workspace', icon: LayoutGrid },
          { title: 'Documents', href: '/sales/documents', icon: Files },
        ],
      },
      {
        id: 'tools',
        title: 'Tools',
        items: [
          { title: 'Sequences', href: '/sales/sequences', icon: RefreshCw },
          { title: 'Playbooks', href: '/sales/playbooks', icon: ClipboardList },
          { title: 'Coaching', href: '/sales/coaching', icon: Trophy },
        ],
      },
      {
        id: 'analytics',
        title: 'Analytics',
        items: [
          { title: 'Reports', href: '/sales/reports', icon: LineChart },
          { title: 'Leaderboard', href: '/sales/leaderboard', icon: Trophy },
        ],
      },
      {
        id: 'ai',
        title: 'AI',
        items: [
          { title: 'AI Forecasting', href: '/sales/ai-forecast', icon: TrendingUp },
          { title: 'Call Intelligence', href: '/sales/call-intelligence', icon: Target },
          { title: 'Deal Insights', href: '/sales/deal-insights', icon: LineChart },
        ],
      },
    ],
    // Flat items for stats/header (first item of each group)
    items: [{ title: 'Overview', href: '/sales', icon: TrendingUp }],
  },
  {
    id: 'config',
    title: 'Config',
    subtitle: 'Settings',
    icon: Settings,
    items: [{ title: 'Settings', href: '/sales/settings', icon: Settings }],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT FOR SHARING SELECTED SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const SalesContext = createContext(null);

export function useSalesContext() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSalesContext must be used within SalesProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SALES PROVIDER (Wraps everything to share state)
// ═══════════════════════════════════════════════════════════════════════════════
export function SalesProvider({ children }) {
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('core');

  // Find which section contains the active item
  useEffect(() => {
    for (const section of navigationSections) {
      for (const item of section.items) {
        if (pathname === item.href || pathname.startsWith(item.href + '/')) {
          setSelectedSection(section.id);
          return;
        }
      }
    }
  }, [pathname]);

  const currentSection = useMemo(
    () => navigationSections.find((s) => s.id === selectedSection),
    [selectedSection]
  );

  const contextValue = useMemo(
    () => ({
      currentSection,
      selectedSection,
      setSelectedSection,
      navigationSections,
      pathname,
    }),
    [currentSection, selectedSection, pathname]
  );

  return <SalesContext.Provider value={contextValue}>{children}</SalesContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SALES SIDEBAR (CORE MENU WITH COLLAPSIBLE SECTIONS)
// ═══════════════════════════════════════════════════════════════════════════════
export function SalesSidebar() {
  const { pathname } = useSalesContext();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['leads', 'pipeline', 'quotes']);

  // Load collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('sales-sidebar-collapsed');
    if (saved !== null) setIsCollapsed(JSON.parse(saved));
  }, []);

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sales-sidebar-collapsed', JSON.stringify(newState));
  };

  // Get the Core section which has all the groups
  const coreSection = navigationSections.find((s) => s.id === 'core');
  const configSection = navigationSections.find((s) => s.id === 'config');

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 220 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
        className="relative h-full flex flex-col bg-transparent"
      >
        {/* Core Menu Items with Collapsible Sections */}
        <nav
          className="flex-1 overflow-y-auto py-3 px-2"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
        >
          <div className="space-y-1">
            {/* Overview - always visible */}
            {coreSection?.groups
              ?.find((g) => g.id === 'overview')
              ?.items.map((item) => {
                const active = isActive(item.href);
                const ItemIcon = item.icon;

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <div
                            className={cn(
                              'w-full flex items-center justify-center p-2 rounded-lg transition-all',
                              active
                                ? 'bg-gray-100 text-brand shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
                            )}
                          >
                            <ItemIcon className="h-5 w-5" />
                          </div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-white border border-gray-200 shadow-lg"
                      >
                        <span className="font-medium text-gray-800">{item.title}</span>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all',
                        active
                          ? 'bg-gray-100 text-brand shadow-sm font-medium'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                      )}
                    >
                      <ItemIcon
                        className={cn('h-4 w-4 shrink-0', active ? 'text-brand' : 'text-gray-500')}
                      />
                      <span className="text-sm truncate">{item.title}</span>
                    </div>
                  </Link>
                );
              })}

            {/* Collapsible Sections */}
            {coreSection?.groups
              ?.filter((g) => g.id !== 'overview')
              .map((group) => {
                const isExpanded = expandedSections.includes(group.id);
                const hasActiveItem = group.items.some((item) => isActive(item.href));
                const GroupIcon = group.items[0]?.icon || Target;

                if (isCollapsed) {
                  return (
                    <Tooltip key={group.id}>
                      <TooltipTrigger asChild>
                        <Link href={group.items[0]?.href || '#'}>
                          <div
                            className={cn(
                              'w-full flex items-center justify-center p-2 rounded-lg transition-all',
                              hasActiveItem
                                ? 'bg-gray-100 text-brand shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
                            )}
                          >
                            <GroupIcon className="h-5 w-5" />
                          </div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-white border border-gray-200 shadow-lg"
                      >
                        <span className="font-medium text-gray-800">{group.title}</span>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <div key={group.id} className="mt-1">
                    {/* Section Header - Clickable to expand/collapse */}
                    <button
                      onClick={() => toggleSection(group.id)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left',
                        hasActiveItem
                          ? 'text-brand font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      )}
                    >
                      <GroupIcon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          hasActiveItem ? 'text-brand' : 'text-gray-400'
                        )}
                      />
                      <span className="text-sm flex-1 truncate">{group.title}</span>
                      <ChevronRight
                        className={cn(
                          'h-3 w-3 transition-transform',
                          isExpanded ? 'rotate-90' : ''
                        )}
                      />
                    </button>

                    {/* Section Items - Collapsible */}
                    {isExpanded && (
                      <div className="ml-4 pl-2 border-l border-gray-200 mt-1 space-y-0.5">
                        {group.items.map((item) => {
                          const active = isActive(item.href);
                          const ItemIcon = item.icon;

                          return (
                            <Link key={item.href} href={item.href}>
                              <div
                                className={cn(
                                  'flex items-center gap-2 px-2 py-1.5 rounded-md transition-all text-sm',
                                  active
                                    ? 'bg-gray-100 text-brand font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                )}
                              >
                                <ItemIcon
                                  className={cn(
                                    'h-3.5 w-3.5 shrink-0',
                                    active ? 'text-brand' : 'text-gray-400'
                                  )}
                                />
                                <span className="truncate">{item.title}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Config Section */}
            {configSection && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {configSection.items.map((item) => {
                  const active = isActive(item.href);
                  const ItemIcon = item.icon;

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          <Link href={item.href}>
                            <div
                              className={cn(
                                'w-full flex items-center justify-center p-2 rounded-lg transition-all',
                                active
                                  ? 'bg-gray-100 text-brand shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
                              )}
                            >
                              <ItemIcon className="h-5 w-5" />
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-white border border-gray-200 shadow-lg"
                        >
                          <span className="font-medium text-gray-800">{item.title}</span>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all',
                          active
                            ? 'bg-gray-100 text-brand shadow-sm font-medium'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                        )}
                      >
                        <ItemIcon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            active ? 'text-brand' : 'text-gray-500'
                          )}
                        />
                        <span className="text-sm truncate">{item.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Collapse Toggle */}
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

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE-SPECIFIC STATS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const pageStats = {
  '/sales': [
    { value: '6', label: 'Deals', icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '$220K',
      label: 'Pipeline',
      icon: DollarSign,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '$36K',
      label: 'Avg Deal',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '5', label: 'Stages', icon: Layers, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/sales/pipeline': [
    { value: '6', label: 'Deals', icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '$220K',
      label: 'Pipeline',
      icon: DollarSign,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '$36K',
      label: 'Avg Deal',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '5', label: 'Stages', icon: Layers, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/sales/workspace': [
    { value: '0', label: 'Pipeline', icon: DollarSign, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '0',
      label: 'Open Deals',
      icon: Briefcase,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '0',
      label: 'This Month',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Won', icon: Trophy, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/sales/deals': [
    { value: '0', label: 'Total', icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Open', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Won', icon: CheckCircle, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '$0', label: 'Value', icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/sales/leads': [
    { value: '0', label: 'Total', icon: UserPlus, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'New', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Qualified',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    {
      value: '0%',
      label: 'Conversion',
      icon: TrendingUp,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/sales/accounts': [
    { value: '0', label: 'Total', icon: Building2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Deals', icon: Briefcase, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '$0', label: 'Revenue', icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/sales/quotes': [
    { value: '0', label: 'Total', icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Pending', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Accepted',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '$0', label: 'Value', icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/sales/forecasts': [
    { value: '$0', label: 'Target', icon: Target, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '$0', label: 'Forecast', icon: LineChart, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0%',
      label: 'Achieved',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Deals', icon: Briefcase, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/sales/leaderboard': [
    { value: '0', label: 'Reps', icon: Trophy, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '$0', label: 'Total', icon: DollarSign, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Deals Won',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    {
      value: '0%',
      label: 'Win Rate',
      icon: TrendingUp,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/sales/analytics': [
    { value: '0', label: 'Reports', icon: TrendingUp, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Metrics', icon: LineChart, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Insights', icon: Target, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Alerts', icon: Zap, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE-SPECIFIC ACTIONS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const pageActions = {
  '/sales': [
    { icon: 'download', label: 'Export', variant: 'outline' },
    { icon: 'upload', label: 'Import', variant: 'outline' },
    { icon: 'plus', label: 'Add Deal', variant: 'default' },
  ],
  '/sales/pipeline': [
    { icon: 'download', label: 'Export', variant: 'outline' },
    { icon: 'upload', label: 'Import', variant: 'outline' },
    { icon: 'plus', label: 'Add Deal', variant: 'default' },
  ],
  '/sales/workspace': [],
  '/sales/deals': [
    { icon: 'download', label: 'Export', variant: 'outline' },
    { icon: 'plus', label: 'Add Deal', variant: 'default' },
  ],
  '/sales/leads': [
    { icon: 'download', label: 'Export', variant: 'outline' },
    { icon: 'plus', label: 'Add Lead', variant: 'default' },
  ],
  '/sales/accounts': [
    { icon: 'download', label: 'Export', variant: 'outline' },
    { icon: 'plus', label: 'Add Account', variant: 'default' },
  ],
  '/sales/quotes': [{ icon: 'plus', label: 'Create Quote', variant: 'default' }],
  '/sales/sequences': [{ icon: 'plus', label: 'New Sequence', variant: 'default' }],
  '/sales/playbooks': [{ icon: 'plus', label: 'New Playbook', variant: 'default' }],
  '/sales/documents': [{ icon: 'plus', label: 'Upload', variant: 'default' }],
  '/sales/prospecting': [{ icon: 'plus', label: 'New Search', variant: 'default' }],
  '/sales/forecasts': [],
  '/sales/leaderboard': [],
  '/sales/analytics': [],
  '/sales/settings': [],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SALES HEADER (Status bar with title and stats)
// ═══════════════════════════════════════════════════════════════════════════════
export function SalesHeader() {
  const { currentSection, pathname } = useSalesContext();
  const [refreshing, setRefreshing] = useState(false);

  if (!currentSection) return null;

  // Find the active sub-menu item
  const activeItem = currentSection.items
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0];

  // Get page-specific stats
  const stats = pageStats[pathname] ||
    pageStats[activeItem?.href] || [
      {
        value: currentSection.items.length,
        label: 'Items',
        icon: Settings,
        bg: 'bg-blue-50',
        color: 'text-blue-600',
      },
    ];

  // Get page-specific actions
  const actions = pageActions[pathname] || pageActions[activeItem?.href] || [];

  const getActionIcon = (iconName) => {
    switch (iconName) {
      case 'plus':
        return Plus;
      case 'download':
        return Download;
      case 'upload':
        return Upload;
      default:
        return Plus;
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="shrink-0 bg-white border-b border-gray-300 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">{currentSection.title}</span>
              {activeItem && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-700 font-medium">{activeItem.title}</span>
                </>
              )}
            </div>

            <div className="w-px h-4 bg-gray-300" />

            {/* Stats Boxes */}
            <div className="flex items-center gap-3">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={index}
                    className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg', stat.bg)}
                  >
                    <StatIcon className={cn('h-3.5 w-3.5', stat.color)} />
                    <span className={cn('text-sm font-semibold', stat.color)}>{stat.value}</span>
                    <span className="text-[10px] text-gray-400">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {actions.map((action, index) => {
              const ActionIcon = getActionIcon(action.icon);
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        'h-7 w-7 rounded-lg flex items-center justify-center transition-colors',
                        action.variant === 'outline'
                          ? 'border border-gray-300 hover:bg-gray-50 text-gray-600'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      )}
                    >
                      <ActionIcon className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {action.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setRefreshing(true)}
                  disabled={refreshing}
                  className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Refresh
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SALES SUB-MENU PANEL (Grouped items with accordion sections)
// ═══════════════════════════════════════════════════════════════════════════════
export function SalesSubMenu() {
  const { currentSection, pathname } = useSalesContext();
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  if (!currentSection) return null;

  // Check if section has grouped items or flat items
  const hasGroups = currentSection.groups && currentSection.groups.length > 0;

  return (
    <aside className="relative flex flex-col shrink-0 rounded-2xl w-[280px] bg-white shadow-sm overflow-hidden border border-gray-300">
      <nav
        className="flex-1 overflow-y-auto p-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
      >
        {hasGroups ? (
          // Render grouped items with section headers (accordion style)
          <div className="space-y-1">
            {currentSection.groups.map((group) => (
              <div key={group.id} className={group.title ? 'mt-4 first:mt-0' : ''}>
                {/* Section header */}
                {group.title && (
                  <h3 className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group.title}
                  </h3>
                )}
                {/* Section items */}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const ItemIcon = item.icon;

                    return (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                            active
                              ? 'bg-gray-100 text-brand shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          )}
                        >
                          <ItemIcon
                            className={cn(
                              'shrink-0 h-4 w-4',
                              active ? 'text-brand' : 'text-gray-500'
                            )}
                          />
                          <span
                            className={cn(
                              'text-sm font-medium flex-1 whitespace-nowrap',
                              active ? 'text-brand' : 'text-gray-900'
                            )}
                          >
                            {item.title}
                          </span>
                          {active && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Render flat items (original behavior)
          <div className="space-y-1">
            {currentSection.items.map((item) => {
              const active = isActive(item.href);
              const ItemIcon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                      active
                        ? 'bg-gray-100 text-brand shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center h-9 w-9 rounded-lg shrink-0',
                        active ? 'bg-brand' : 'bg-gray-100'
                      )}
                    >
                      <ItemIcon
                        className={cn('h-4 w-4', active ? 'text-white' : 'text-gray-500')}
                      />
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium flex-1',
                        active ? 'text-brand' : 'text-gray-800'
                      )}
                    >
                      {item.title}
                    </span>
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
