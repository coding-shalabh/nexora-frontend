'use client';

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Workflow,
  GitBranch,
  Zap,
  Trophy,
  Bot,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Play,
  Archive,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════
const navigationSections = [
  {
    id: 'automation',
    title: 'Automation',
    subtitle: 'Workflows & sequences',
    icon: Workflow,
    items: [
      { title: 'Workflows', href: '/automation/workflows', icon: GitBranch },
      { title: 'Sequences', href: '/automation/sequences', icon: Zap },
      { title: 'Lead Scoring', href: '/automation/lead-scoring', icon: Trophy },
    ],
  },
  {
    id: 'ai',
    title: 'AI',
    subtitle: 'Intelligent automation',
    icon: Bot,
    items: [
      { title: 'Chatbots', href: '/automation/chatbots', icon: Bot },
      { title: 'AI Agents', href: '/automation/ai-agents', icon: Bot },
    ],
  },
  {
    id: 'status',
    title: 'Status',
    subtitle: 'Monitor automations',
    icon: Play,
    items: [
      { title: 'Active', href: '/automation/active', icon: Play },
      { title: 'Archived', href: '/automation/archived', icon: Archive },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'Performance metrics',
    icon: BarChart3,
    items: [{ title: 'Analytics', href: '/automation/analytics', icon: BarChart3 }],
  },
  {
    id: 'config',
    title: 'Config',
    subtitle: 'Settings',
    icon: Settings,
    items: [{ title: 'Settings', href: '/automation/settings', icon: Settings }],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT FOR SHARING SELECTED SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const AutomationContext = createContext(null);

export function useAutomationContext() {
  const context = useContext(AutomationContext);
  if (!context) {
    throw new Error('useAutomationContext must be used within AutomationProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTOMATION PROVIDER (Wraps everything to share state)
// ═══════════════════════════════════════════════════════════════════════════════
export function AutomationProvider({ children }) {
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('automation');

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

  return <AutomationContext.Provider value={contextValue}>{children}</AutomationContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTOMATION SIDEBAR (CORE MENU ONLY)
// ═══════════════════════════════════════════════════════════════════════════════
export function AutomationSidebar() {
  const { selectedSection, setSelectedSection, navigationSections } = useAutomationContext();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('automation-sidebar-collapsed');
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
    localStorage.setItem('automation-sidebar-collapsed', JSON.stringify(newState));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 180 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
        className="relative h-full flex flex-col bg-transparent"
      >
        {/* Core Menu Items */}
        <nav
          className="flex-1 overflow-y-auto py-3 px-2"
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
  '/automation/workflows': [
    { value: '0', label: 'Workflows', icon: GitBranch, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: Play, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Paused', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Runs', icon: Target, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/automation/sequences': [
    { value: '0', label: 'Sequences', icon: Zap, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: Play, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Contacts', icon: Target, bg: 'bg-purple-50', color: 'text-purple-600' },
    {
      value: '0%',
      label: 'Open Rate',
      icon: CheckCircle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/automation/lead-scoring': [
    { value: '0', label: 'Rules', icon: Trophy, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Scored', icon: Target, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Hot Leads', icon: Zap, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Avg Score', icon: BarChart3, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/automation/chatbots': [
    { value: '0', label: 'Chatbots', icon: Bot, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: Play, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Conversations',
      icon: Target,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    {
      value: '0%',
      label: 'Resolution',
      icon: CheckCircle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/automation/ai-agents': [
    { value: '0', label: 'Agents', icon: Bot, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: Play, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Tasks', icon: CheckCircle, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0%', label: 'Success', icon: Target, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/automation/active': [
    { value: '0', label: 'Running', icon: Play, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Workflows', icon: GitBranch, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Sequences', icon: Zap, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Today', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/automation/archived': [
    { value: '0', label: 'Archived', icon: Archive, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Workflows', icon: GitBranch, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Sequences', icon: Zap, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'This Month', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/automation/analytics': [
    { value: '0', label: 'Total Runs', icon: BarChart3, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '0%',
      label: 'Success',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    { value: '0', label: 'Actions', icon: Zap, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Errors', icon: Target, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE-SPECIFIC ACTIONS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const pageActions = {
  '/automation/workflows': [{ icon: 'plus', label: 'New Workflow', variant: 'default' }],
  '/automation/sequences': [{ icon: 'plus', label: 'New Sequence', variant: 'default' }],
  '/automation/lead-scoring': [{ icon: 'plus', label: 'New Rule', variant: 'default' }],
  '/automation/chatbots': [{ icon: 'plus', label: 'New Chatbot', variant: 'default' }],
  '/automation/ai-agents': [{ icon: 'plus', label: 'New Agent', variant: 'default' }],
  '/automation/active': [],
  '/automation/archived': [],
  '/automation/analytics': [],
  '/automation/settings': [],
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTOMATION HEADER (Status bar with title and stats)
// ═══════════════════════════════════════════════════════════════════════════════
export function AutomationHeader() {
  const { currentSection, pathname } = useAutomationContext();
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
// AUTOMATION SUB-MENU PANEL (List of items for selected section)
// ═══════════════════════════════════════════════════════════════════════════════
export function AutomationSubMenu() {
  const { currentSection, pathname } = useAutomationContext();
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
