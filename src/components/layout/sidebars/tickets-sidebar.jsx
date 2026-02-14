'use client';

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Ticket,
  Inbox,
  Clock,
  CheckCircle,
  BookOpen,
  Settings,
  Globe,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  Users,
  MessageSquare,
  RefreshCw,
  Filter,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════
const navigationSections = [
  {
    id: 'tickets',
    title: 'Tickets',
    subtitle: 'Support tickets',
    icon: Ticket,
    items: [
      { title: 'All Tickets', href: '/tickets', icon: Ticket, badge: 24 },
      { title: 'Open', href: '/tickets/open', icon: Inbox, badge: 12 },
      { title: 'Pending', href: '/tickets/pending', icon: Clock, badge: 8 },
      { title: 'Resolved', href: '/tickets/resolved', icon: CheckCircle },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'Support tools',
    icon: Settings,
    items: [
      { title: 'Knowledge Base', href: '/tickets/knowledge-base', icon: BookOpen },
      { title: 'SLAs', href: '/tickets/slas', icon: Settings },
      { title: 'Customer Portal', href: '/tickets/portal', icon: Globe },
    ],
  },
  {
    id: 'config',
    title: 'Config',
    subtitle: 'Settings',
    icon: Settings,
    items: [{ title: 'Settings', href: '/tickets/settings', icon: Settings }],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT FOR SHARING SELECTED SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const TicketsContext = createContext(null);

export function useTicketsContext() {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error('useTicketsContext must be used within TicketsProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TICKETS PROVIDER (Wraps everything to share state)
// ═══════════════════════════════════════════════════════════════════════════════
export function TicketsProvider({ children }) {
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('tickets');

  // Find which section contains the active item
  useEffect(() => {
    for (const section of navigationSections) {
      for (const item of section.items) {
        const itemPath = item.href === '/tickets' ? '/tickets' : item.href;
        if (
          pathname === itemPath ||
          (item.href !== '/tickets' && pathname.startsWith(item.href + '/'))
        ) {
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

  return <TicketsContext.Provider value={contextValue}>{children}</TicketsContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TICKETS SIDEBAR (CORE MENU ONLY)
// ═══════════════════════════════════════════════════════════════════════════════
export function TicketsSidebar() {
  const { selectedSection, setSelectedSection, navigationSections } = useTicketsContext();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('tickets-sidebar-collapsed');
    if (saved !== null) setIsCollapsed(JSON.parse(saved));
  }, []);

  // Handle section click - navigate to first item of section
  const handleSectionClick = (section) => {
    setSelectedSection(section.id);
    if (section.items && section.items.length > 0) {
      router.push(section.items[0].href);
    }
  };

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('tickets-sidebar-collapsed', JSON.stringify(newState));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 180 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
        className="relative h-full flex flex-col border-r shrink-0 bg-transparent border-gray-300"
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-300">
          {!isCollapsed && <h2 className="text-sm font-semibold text-gray-700">Tickets</h2>}
          {isCollapsed && (
            <div className="flex justify-center">
              <Ticket className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </div>

        {/* Core Menu Items */}
        <nav
          className="flex-1 overflow-y-auto py-2 px-2"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
        >
          <div className="space-y-1">
            {navigationSections.map((section) => {
              const SectionIcon = section.icon;
              const isSelected = selectedSection === section.id;

              if (isCollapsed) {
                return (
                  <Tooltip key={section.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleSectionClick(section)}
                        className={cn(
                          'w-full flex items-center justify-center p-2 rounded-lg transition-all',
                          isSelected
                            ? 'bg-gray-100 text-brand shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
                        )}
                      >
                        <SectionIcon className="h-5 w-5" />
                      </button>
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
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-left',
                    isSelected
                      ? 'bg-gray-100 text-brand shadow-sm font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  )}
                >
                  <SectionIcon
                    className={cn('h-4 w-4 shrink-0', isSelected ? 'text-brand' : 'text-gray-500')}
                  />
                  <span className="text-sm truncate">{section.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-16 h-6 w-6 rounded-full bg-white border-gray-300 text-gray-600 shadow-md hover:bg-gray-50 hover:text-gray-900 z-10"
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
  '/tickets': [
    { value: '24', label: 'Total', icon: Ticket, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '12', label: 'Open', icon: Inbox, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '8', label: 'Pending', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '4', label: 'Urgent', icon: AlertCircle, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/tickets/open': [
    { value: '12', label: 'Open', icon: Inbox, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '4', label: 'Urgent', icon: AlertCircle, bg: 'bg-red-50', color: 'text-red-600' },
    { value: '3', label: 'Assigned', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '5', label: 'Unassigned', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/tickets/pending': [
    { value: '8', label: 'Pending', icon: Clock, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '3', label: 'Customer', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '5',
      label: 'Internal',
      icon: MessageSquare,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '2', label: 'Overdue', icon: AlertCircle, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/tickets/resolved': [
    {
      value: '156',
      label: 'Resolved',
      icon: CheckCircle,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    { value: '4.2h', label: 'Avg Time', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '94%',
      label: 'Satisfaction',
      icon: BarChart3,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '32', label: 'This Week', icon: Ticket, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/tickets/knowledge-base': [
    { value: '48', label: 'Articles', icon: BookOpen, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '12', label: 'Categories', icon: Filter, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '1.2k',
      label: 'Views',
      icon: BarChart3,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '8', label: 'Draft', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/tickets/slas': [
    { value: '5', label: 'SLAs', icon: Settings, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '3', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '98%', label: 'Met', icon: BarChart3, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '2', label: 'Breached', icon: AlertCircle, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/tickets/portal': [
    { value: '245', label: 'Users', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '89', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '32', label: 'Tickets', icon: Ticket, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '156', label: 'KB Views', icon: BookOpen, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE-SPECIFIC ACTIONS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const pageActions = {
  '/tickets': [{ icon: 'plus', label: 'New Ticket', variant: 'default' }],
  '/tickets/open': [{ icon: 'plus', label: 'New Ticket', variant: 'default' }],
  '/tickets/pending': [{ icon: 'plus', label: 'New Ticket', variant: 'default' }],
  '/tickets/resolved': [],
  '/tickets/knowledge-base': [{ icon: 'plus', label: 'New Article', variant: 'default' }],
  '/tickets/slas': [{ icon: 'plus', label: 'New SLA', variant: 'default' }],
  '/tickets/portal': [],
  '/tickets/settings': [],
};

// ═══════════════════════════════════════════════════════════════════════════════
// TICKETS HEADER (Status bar with title and stats)
// ═══════════════════════════════════════════════════════════════════════════════
export function TicketsHeader() {
  const { currentSection, pathname } = useTicketsContext();
  const [refreshing, setRefreshing] = useState(false);

  if (!currentSection) return null;

  // Find the active sub-menu item
  const activeItem = currentSection.items
    .filter((item) => {
      if (item.href === '/tickets') return pathname === '/tickets';
      return pathname === item.href || pathname.startsWith(item.href + '/');
    })
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
// TICKETS SUB-MENU PANEL (List of items for selected section)
// ═══════════════════════════════════════════════════════════════════════════════
export function TicketsSubMenu() {
  const { currentSection, pathname } = useTicketsContext();
  const isActive = (href) => {
    if (href === '/tickets') return pathname === '/tickets';
    return pathname === href || pathname.startsWith(href + '/');
  };

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
                  {item.badge > 0 && (
                    <span
                      className={cn(
                        'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                        active ? 'bg-brand/20 text-brand' : 'bg-gray-200 text-gray-600'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && !item.badge && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
