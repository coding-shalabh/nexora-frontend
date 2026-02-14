'use client';

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Megaphone,
  Mail,
  Smartphone,
  Share2,
  FileText,
  FormInput,
  MousePointerClick,
  Calendar,
  Users,
  List,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  Plus,
  Download,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════
const navigationSections = [
  {
    id: 'campaigns',
    title: 'Campaigns',
    subtitle: 'Marketing campaigns',
    icon: Megaphone,
    items: [
      { title: 'Campaigns', href: '/marketing/campaigns', icon: Megaphone },
      { title: 'Broadcasts', href: '/marketing/broadcasts', icon: Megaphone },
      { title: 'Email', href: '/marketing/email', icon: Mail },
      { title: 'SMS', href: '/marketing/sms', icon: Smartphone },
      { title: 'Social Media', href: '/marketing/social', icon: Share2 },
    ],
  },
  {
    id: 'assets',
    title: 'Assets',
    subtitle: 'Marketing content',
    icon: FileText,
    items: [
      { title: 'Landing Pages', href: '/marketing/landing-pages', icon: FileText },
      { title: 'Forms', href: '/marketing/forms', icon: FormInput },
      { title: 'CTAs', href: '/marketing/ctas', icon: MousePointerClick },
      // Templates moved to Settings Hub - use /settings/templates (redirect in place)
    ],
  },
  {
    id: 'audience',
    title: 'Audience',
    subtitle: 'Targeting & segments',
    icon: Users,
    items: [
      { title: 'Segments', href: '/marketing/segments', icon: Users },
      { title: 'Lists', href: '/marketing/lists', icon: List },
      // Lead Scoring moved to Automation Hub - link directly to primary owner
      { title: 'Lead Scoring', href: '/automation/lead-scoring', icon: Target, external: true },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    subtitle: 'Event management',
    icon: Calendar,
    items: [{ title: 'Events', href: '/marketing/events', icon: Calendar }],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'Performance & insights',
    icon: BarChart3,
    items: [
      { title: 'Analytics', href: '/marketing/analytics', icon: BarChart3 },
      { title: 'Performance', href: '/marketing/performance', icon: TrendingUp },
    ],
  },
  {
    id: 'config',
    title: 'Config',
    subtitle: 'Settings',
    icon: Settings,
    items: [{ title: 'Settings', href: '/marketing/settings', icon: Settings }],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT FOR SHARING SELECTED SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const MarketingContext = createContext(null);

export function useMarketingContext() {
  const context = useContext(MarketingContext);
  if (!context) {
    throw new Error('useMarketingContext must be used within MarketingProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARKETING PROVIDER (Wraps everything to share state)
// ═══════════════════════════════════════════════════════════════════════════════
export function MarketingProvider({ children }) {
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('campaigns');

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

  return <MarketingContext.Provider value={contextValue}>{children}</MarketingContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARKETING SIDEBAR (CORE MENU WITH COLLAPSIBLE SECTIONS)
// ═══════════════════════════════════════════════════════════════════════════════
export function MarketingSidebar() {
  const { pathname } = useMarketingContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['campaigns', 'assets', 'audience']);

  // Load collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('marketing-sidebar-collapsed');
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
    localStorage.setItem('marketing-sidebar-collapsed', JSON.stringify(newState));
  };

  // Get config section (separate from others)
  const configSection = navigationSections.find((s) => s.id === 'config');
  const mainSections = navigationSections.filter((s) => s.id !== 'config');

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
            {/* Collapsible Sections */}
            {mainSections.map((section) => {
              const isExpanded = expandedSections.includes(section.id);
              const hasActiveItem = section.items.some((item) => isActive(item.href));
              const SectionIcon = section.icon;

              if (isCollapsed) {
                return (
                  <Tooltip key={section.id}>
                    <TooltipTrigger asChild>
                      <Link href={section.items[0]?.href || '#'}>
                        <div
                          className={cn(
                            'w-full flex items-center justify-center p-2 rounded-lg transition-all',
                            hasActiveItem
                              ? 'bg-gray-100 text-brand shadow-sm'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
                          )}
                        >
                          <SectionIcon className="h-5 w-5" />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-white border border-gray-200 shadow-lg"
                    >
                      <span className="font-medium text-gray-800">{section.title}</span>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <div key={section.id} className="mt-1 first:mt-0">
                  {/* Section Header - Clickable to expand/collapse */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left',
                      hasActiveItem
                        ? 'text-brand font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    )}
                  >
                    <SectionIcon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        hasActiveItem ? 'text-brand' : 'text-gray-400'
                      )}
                    />
                    <span className="text-sm flex-1 truncate">{section.title}</span>
                    <ChevronRight
                      className={cn('h-3 w-3 transition-transform', isExpanded ? 'rotate-90' : '')}
                    />
                  </button>

                  {/* Section Items - Collapsible */}
                  {isExpanded && (
                    <div className="ml-4 pl-2 border-l border-gray-200 mt-1 space-y-0.5">
                      {section.items.map((item) => {
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
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
  '/marketing/campaigns': [
    { value: '0', label: 'Total', icon: Megaphone, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Scheduled', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    {
      value: '0%',
      label: 'Engagement',
      icon: TrendingUp,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/marketing/email': [
    { value: '0', label: 'Sent', icon: Mail, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '0%',
      label: 'Open Rate',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '0%',
      label: 'Click Rate',
      icon: MousePointerClick,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Unsubscribed', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/marketing/sms': [
    { value: '0', label: 'Sent', icon: Smartphone, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '0%',
      label: 'Delivered',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '0%',
      label: 'Response',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Opt-outs', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/marketing/social': [
    { value: '0', label: 'Posts', icon: Share2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Reach', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Engagement',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Scheduled', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/marketing/landing-pages': [
    { value: '0', label: 'Pages', icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '0',
      label: 'Published',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    { value: '0', label: 'Views', icon: TrendingUp, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0%', label: 'Conversion', icon: Target, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/marketing/forms': [
    { value: '0', label: 'Forms', icon: FormInput, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Submissions',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0%', label: 'Conversion', icon: Target, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/marketing/segments': [
    { value: '0', label: 'Segments', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '0',
      label: 'Contacts',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    { value: '0', label: 'Active', icon: TrendingUp, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Rules', icon: Settings, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/marketing/lists': [
    { value: '0', label: 'Lists', icon: List, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Contacts', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Active',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Bounced', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/marketing/analytics': [
    { value: '0', label: 'Reports', icon: BarChart3, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Metrics', icon: TrendingUp, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Insights', icon: Target, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Alerts', icon: Settings, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE-SPECIFIC ACTIONS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const pageActions = {
  '/marketing/campaigns': [{ icon: 'plus', label: 'New Campaign', variant: 'default' }],
  '/marketing/email': [{ icon: 'plus', label: 'New Email', variant: 'default' }],
  '/marketing/sms': [{ icon: 'plus', label: 'New SMS', variant: 'default' }],
  '/marketing/social': [{ icon: 'plus', label: 'New Post', variant: 'default' }],
  '/marketing/landing-pages': [{ icon: 'plus', label: 'New Page', variant: 'default' }],
  '/marketing/forms': [{ icon: 'plus', label: 'New Form', variant: 'default' }],
  '/marketing/ctas': [{ icon: 'plus', label: 'New CTA', variant: 'default' }],
  '/marketing/templates': [{ icon: 'plus', label: 'New Template', variant: 'default' }],
  '/marketing/segments': [{ icon: 'plus', label: 'New Segment', variant: 'default' }],
  '/marketing/lists': [{ icon: 'plus', label: 'New List', variant: 'default' }],
  '/marketing/events': [{ icon: 'plus', label: 'New Event', variant: 'default' }],
  '/marketing/analytics': [{ icon: 'download', label: 'Export', variant: 'outline' }],
  '/marketing/performance': [{ icon: 'download', label: 'Export', variant: 'outline' }],
  '/marketing/settings': [],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MARKETING HEADER (Status bar with title and stats)
// ═══════════════════════════════════════════════════════════════════════════════
export function MarketingHeader() {
  const { currentSection, pathname } = useMarketingContext();
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
                  aria-label="Refresh"
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
// MARKETING SUB-MENU PANEL (List of items for selected section)
// ═══════════════════════════════════════════════════════════════════════════════
export function MarketingSubMenu() {
  const { currentSection, pathname } = useMarketingContext();
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  if (!currentSection) return null;

  return (
    <aside className="relative flex flex-col shrink-0 rounded-2xl w-[280px] bg-white shadow-sm overflow-hidden border border-gray-300">
      <nav
        className="flex-1 overflow-y-auto p-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
      >
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
                    <ItemIcon className={cn('h-4 w-4', active ? 'text-white' : 'text-gray-500')} />
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
      </nav>
    </aside>
  );
}
