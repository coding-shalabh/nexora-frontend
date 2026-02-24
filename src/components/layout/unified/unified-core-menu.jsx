'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  Users,
  Clock,
  Wrench,
  Database,
  Sparkles,
  BarChart3,
  Settings,
  Target,
  Kanban,
  FileText,
  TrendingUp,
  Briefcase,
  Megaphone,
  Radio,
  FileCode,
  CalendarDays,
  Ticket,
  BookOpen,
  Heart,
  ClipboardList,
  ShoppingCart,
  CreditCard,
  Wallet,
  Tags,
  FolderKanban,
  ListTodo,
  Timer,
  Boxes,
  GraduationCap,
  Award,
  CalendarCheck,
  DollarSign,
  UserMinus,
  Calculator,
  ArrowLeftRight,
  Landmark,
  PiggyBank,
  Package,
  PackageSearch,
  Warehouse,
  Truck,
  LayoutDashboard,
  Goal,
  MousePointer,
  Workflow,
  Zap,
  Bot,
  User,
  Building2,
  Link2,
  Inbox,
  SlidersHorizontal,
  Shield,
  Code,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HUBS, PLANS, hasFeatureAccess } from '@/config/hubs';

// TODO: SECURITY - Replace with real subscription from auth context
// This mock grants admin access to all features - DO NOT use in production
const useSubscription = () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[UnifiedCoreMenu] Using mock subscription - replace with auth context in production'
    );
  }
  return {
    plan: PLANS.PROFESSIONAL,
    isAdmin: true,
  };
};

/**
 * UnifiedCoreMenu - Accordion-based navigation sidebar
 *
 * Features:
 * - Max 2 levels of nesting (Section > Items)
 * - Collapsible sections with expand/collapse
 * - Badge counts on items
 * - Bottom fixed items (Settings, Analytics)
 * - Collapsible sidebar with toggle button
 * - Remembers expanded/collapsed state in localStorage
 *
 * @param {Object} props
 * @param {string} props.hubId - Hub ID to load menu from hubs.js
 * @param {Object} props.menu - Custom menu configuration
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed
 * @param {Function} props.onToggleCollapse - Toggle collapse handler
 */
export function UnifiedCoreMenu({ hubId, menu, isCollapsed = false, onToggleCollapse }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { plan, isAdmin } = useSubscription();

  // Get hub configuration
  const hub = hubId ? HUBS[hubId.toUpperCase()] : null;

  // Build menu sections from hub config or custom menu (memoized to prevent re-renders)
  const menuConfig = useMemo(() => menu || buildMenuFromHub(hub), [menu, hub]);

  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState({});

  // Initialize expanded sections from localStorage and auto-expand active section
  useEffect(() => {
    // SSR guard - localStorage only available in browser
    if (typeof window === 'undefined') return;

    const storageKey = `unified-menu-sections-${hubId || 'custom'}`;
    let sections = {};

    // Try to load from localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        sections = JSON.parse(saved);
      } catch {
        sections = {};
      }
    }

    // Set defaults for sections not in localStorage
    menuConfig?.sections?.forEach((section) => {
      if (sections[section.id] === undefined) {
        sections[section.id] = section.defaultExpanded ?? false;
      }
    });

    // Auto-expand section containing active item
    const activeSectionId = findActiveSectionId(menuConfig, pathname, searchParams);
    if (activeSectionId) {
      sections[activeSectionId] = true;
    }

    setExpandedSections(sections);
  }, [hubId, pathname, searchParams, menuConfig]);

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    const storageKey = `unified-menu-sections-${hubId || 'custom'}`;
    setExpandedSections((prev) => {
      const newState = { ...prev, [sectionId]: !prev[sectionId] };
      localStorage.setItem(storageKey, JSON.stringify(newState));
      return newState;
    });
  };

  // Check if item is active
  const isItemActive = (href) => {
    if (!href) return false;

    // Handle query params (e.g., ?bucket=unassigned)
    if (href.includes('?')) {
      const [path, query] = href.split('?');
      const params = new URLSearchParams(query);

      // Check if path matches and all query params match
      if (pathname !== path && !pathname.startsWith(path)) return false;
      for (const [key, value] of params.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
      return true;
    }

    // Exact match
    if (pathname === href) return true;

    // Starts with match (but not for root paths like /crm)
    if (href !== `/${hubId}` && pathname.startsWith(href)) return true;

    return false;
  };

  if (!menuConfig) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 180 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="relative h-full flex flex-col bg-transparent"
      >
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 scrollbar-track-transparent">
          <div className="space-y-1">
            {menuConfig.sections?.map((section) => {
              const isExpanded = expandedSections[section.id];
              const SectionIcon = section.icon;

              // Calculate total badge count for section
              const sectionBadgeCount =
                section.items?.reduce((sum, item) => {
                  return sum + (item.badge || 0);
                }, 0) || 0;

              return (
                <div
                  key={section.id}
                  className={cn(
                    'mb-1',
                    isCollapsed && 'border-b border-gray-200/50 dark:border-gray-700/50 pb-1'
                  )}
                >
                  {/* Section Header */}
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className={cn(
                            'w-full flex items-center justify-center p-1.5 rounded transition-all',
                            isExpanded
                              ? 'text-gray-400 dark:text-gray-500'
                              : 'text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-400'
                          )}
                        >
                          {SectionIcon && <SectionIcon className="h-4 w-4" />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {section.title}
                        </span>
                        {sectionBadgeCount > 0 && (
                          <span className="ml-2 text-xs text-primary">({sectionBadgeCount})</span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group',
                        isExpanded
                          ? 'bg-white/70 dark:bg-white/10 text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {SectionIcon && (
                          <SectionIcon
                            className={cn(
                              'h-4 w-4',
                              isExpanded ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                            )}
                          />
                        )}
                        <span className="text-sm font-medium">{section.title}</span>
                        {sectionBadgeCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white bg-primary">
                            {sectionBadgeCount}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </button>
                  )}

                  {/* Section Items */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className={cn('space-y-0.5', isCollapsed ? 'pt-1' : 'pt-1 pl-2')}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={{
                            open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                            closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                          }}
                        >
                          {section.items?.map((item) => (
                            <motion.div
                              key={item.href || item.title}
                              variants={{
                                open: { y: 0, opacity: 1 },
                                closed: { y: 20, opacity: 0 },
                              }}
                            >
                              <NavItem
                                item={item}
                                isActive={isItemActive(item.href)}
                                isCollapsed={isCollapsed}
                                plan={plan}
                                hubId={hubId}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom fixed items */}
        {menuConfig.bottomItems?.length > 0 && (
          <div className="px-2 py-2 bg-transparent border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="space-y-0.5">
              {menuConfig.bottomItems.map((item) => (
                <NavItem
                  key={item.href || item.title}
                  item={item}
                  isActive={isItemActive(item.href)}
                  isCollapsed={isCollapsed}
                  plan={plan}
                  hubId={hubId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Collapse Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white z-10"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}

/**
 * NavItem component - Renders a single navigation item
 */
function NavItem({ item, isActive, isCollapsed, plan, hubId }) {
  const ItemIcon = item.icon;
  const hasAccess = hubId ? hasFeatureAccess(hubId, item.href, plan) : true;
  const isLocked = item.locked || !hasAccess;

  const linkContent = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
        isActive && 'text-white bg-primary',
        !isActive &&
          !isLocked &&
          'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white',
        isLocked && 'opacity-50 cursor-not-allowed',
        isCollapsed && 'justify-center px-2 py-2'
      )}
    >
      {/* Icon with optional color */}
      {item.color ? (
        <span
          className={cn(
            'flex items-center justify-center rounded-md shrink-0',
            isCollapsed ? 'h-6 w-6' : 'h-5 w-5',
            isActive ? item.bgColor : 'bg-gray-100 dark:bg-gray-800'
          )}
        >
          {ItemIcon && (
            <ItemIcon className={cn(isCollapsed ? 'h-3.5 w-3.5' : 'h-3 w-3', item.color)} />
          )}
        </span>
      ) : ItemIcon ? (
        <ItemIcon
          className={cn(
            'shrink-0',
            isCollapsed ? 'h-5 w-5' : 'h-4 w-4',
            isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
          )}
        />
      ) : null}

      {/* Title and badge */}
      {!isCollapsed && (
        <div className="flex items-center justify-between flex-1 min-w-0">
          <span
            className={cn(
              'text-sm font-medium whitespace-nowrap',
              isActive ? 'text-white' : 'text-gray-900 dark:text-white'
            )}
          >
            {item.title}
          </span>
          <div className="flex items-center gap-1.5">
            {item.badge > 0 && (
              <span
                className={cn(
                  'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                  isActive ? 'bg-white/20 text-white' : 'text-white bg-primary'
                )}
              >
                {item.badge}
              </span>
            )}
            {isLocked && <Lock className="h-3 w-3 text-gray-400" />}
          </div>
        </div>
      )}
    </div>
  );

  // Collapsed view with tooltip
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {isLocked ? <div>{linkContent}</div> : <Link href={item.href || '#'}>{linkContent}</Link>}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-white dark:bg-gray-800 border-0 px-3 py-2 shadow-lg"
        >
          <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
          {isLocked && <span className="text-xs text-orange-500 block">Upgrade required</span>}
          {item.badge > 0 && <span className="text-xs text-primary block">{item.badge} items</span>}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Normal view
  return isLocked ? <div>{linkContent}</div> : <Link href={item.href || '#'}>{linkContent}</Link>;
}

/**
 * Section-to-icon mapping for grouped sections
 * Maps section names to appropriate Lucide icons
 */
const SECTION_ICONS = {
  // CRM Sections
  People: Users,
  Activities: Clock,
  Tools: Wrench,
  Data: Database,
  AI: Sparkles,
  Reports: BarChart3,
  Settings: Settings,

  // Sales Sections
  Leads: Target,
  Pipeline: Kanban,
  Quotes: FileText,
  Forecasting: TrendingUp,
  Workspace: Briefcase,
  Analytics: BarChart3,

  // Marketing Sections
  Campaigns: Megaphone,
  Channels: Radio,
  Content: FileCode,
  Events: CalendarDays,

  // Service Sections
  Tickets: Ticket,
  'Knowledge Base': BookOpen,
  Customer: Heart,
  Management: ClipboardList,

  // Commerce Sections
  Orders: ShoppingCart,
  Billing: CreditCard,
  Payments: Wallet,
  Pricing: Tags,

  // Projects Sections
  Projects: FolderKanban,
  Tasks: ListTodo,
  Time: Timer,
  Resources: Boxes,

  // HR Sections
  Talent: GraduationCap,
  Performance: Award,
  'Time & Attendance': CalendarCheck,
  Compensation: DollarSign,
  Exit: UserMinus,

  // Finance Sections
  Accounting: Calculator,
  'AR/AP': ArrowLeftRight,
  'Cash Management': Landmark,
  Planning: PiggyBank,

  // Inventory Sections
  Products: Package,
  Stock: PackageSearch,
  Warehouse: Warehouse,

  // Analytics Sections
  Dashboards: LayoutDashboard,
  Goals: Goal,
  Website: MousePointer,

  // Automation Sections
  Workflows: Workflow,
  Triggers: Zap,
  'AI & Scoring': Target,
  'AI Copilot': Bot,

  // Settings Sections
  Account: User,
  Organization: Building2,
  Inbox: Inbox,
  Configuration: SlidersHorizontal,
  Security: Shield,
  Developer: Code,
};

/**
 * Get icon for a section name
 */
function getSectionIcon(sectionName) {
  return SECTION_ICONS[sectionName] || Settings;
}

/**
 * Build menu configuration from hub config
 */
function buildMenuFromHub(hub) {
  if (!hub) return null;

  // Group features by section
  const grouped = {};
  const noSection = [];

  hub.features?.forEach((feature) => {
    if (feature.section) {
      if (!grouped[feature.section]) {
        grouped[feature.section] = [];
      }
      grouped[feature.section].push({
        title: feature.name,
        href: feature.path,
        icon: feature.icon,
        requiredPlan: feature.requiredPlan,
      });
    } else {
      noSection.push({
        title: feature.name,
        href: feature.path,
        icon: feature.icon,
        requiredPlan: feature.requiredPlan,
      });
    }
  });

  // Build sections array
  const sections = [];

  // Add non-section items as first "section" (Overview)
  if (noSection.length > 0) {
    sections.push({
      id: 'overview',
      title: 'Overview',
      icon: hub.icon,
      defaultExpanded: true,
      items: noSection,
    });
  }

  // Add grouped sections with appropriate icons
  Object.entries(grouped).forEach(([sectionName, items]) => {
    sections.push({
      id: sectionName.toLowerCase().replace(/\s+/g, '-'),
      title: sectionName,
      icon: getSectionIcon(sectionName),
      defaultExpanded: false,
      items,
    });
  });

  return {
    title: hub.name,
    sections,
    bottomItems: [],
  };
}

/**
 * Find the section ID containing the active menu item
 */
function findActiveSectionId(menuConfig, pathname, searchParams) {
  if (!menuConfig?.sections) return null;

  for (const section of menuConfig.sections) {
    for (const item of section.items || []) {
      if (!item.href) continue;

      // Handle query params
      if (item.href.includes('?')) {
        const [path, query] = item.href.split('?');
        const params = new URLSearchParams(query);

        if (pathname === path || pathname.startsWith(path)) {
          let allMatch = true;
          for (const [key, value] of params.entries()) {
            if (searchParams.get(key) !== value) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) return section.id;
        }
      } else {
        if (pathname === item.href || pathname.startsWith(item.href)) {
          return section.id;
        }
      }
    }
  }

  return null;
}

export default UnifiedCoreMenu;
