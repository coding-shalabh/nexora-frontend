'use client';

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Users,
  Building2,
  Activity,
  Layers,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Download,
  RefreshCw,
  FormInput,
  FileText,
  UserCircle,
  Merge,
  Upload,
  Wrench,
  Star,
  Target,
  TrendingUp,
  BarChart3,
  History,
  ListTodo,
  MessageSquare,
  Mail,
  Video,
  GitMerge,
  Filter,
  PieChart,
  UserCheck,
  Share2,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION SECTIONS - Based on HubSpot, Salesforce, Zoho, Pipedrive, Freshsales, Odoo
// ═══════════════════════════════════════════════════════════════════════════════
const navigationSections = [
  {
    id: 'people',
    title: 'People',
    subtitle: 'Contacts & companies',
    icon: Users,
    items: [
      { title: 'Contacts', href: '/crm/contacts', icon: Users },
      { title: 'Companies', href: '/crm/companies', icon: Building2 },
      { title: 'Leads', href: '/crm/leads', icon: UserCircle },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement',
    subtitle: 'Interactions & tasks',
    icon: MessageSquare,
    items: [
      { title: 'Activities', href: '/crm/activities', icon: Activity },
      { title: 'Tasks', href: '/crm/tasks', icon: ListTodo },
      { title: 'Calls', href: '/crm/calls', icon: Phone },
      { title: 'Meetings', href: '/crm/meetings', icon: Video },
      { title: 'Notes', href: '/crm/notes', icon: FileText },
      { title: 'Emails', href: '/crm/emails', icon: Mail },
    ],
  },
  {
    id: 'segments',
    title: 'Segments',
    subtitle: 'Lists & targeting',
    icon: Layers,
    items: [
      { title: 'All Segments', href: '/crm/segments', icon: Layers },
      { title: 'Dynamic Segments', href: '/crm/segments/dynamic', icon: Filter },
      { title: 'Static Lists', href: '/crm/segments/static', icon: ListTodo },
      { title: 'Custom Views', href: '/crm/segments/custom', icon: Target },
    ],
  },
  {
    id: 'scoring',
    title: 'Scoring',
    subtitle: 'Lead & contact scoring',
    icon: Star,
    items: [
      { title: 'Contact Scoring', href: '/crm/scoring/contacts', icon: Users },
      { title: 'Company Scoring', href: '/crm/scoring/companies', icon: Building2 },
      { title: 'Scoring Rules', href: '/crm/scoring/rules', icon: Target },
      { title: 'Score History', href: '/crm/scoring/history', icon: History },
    ],
  },
  {
    id: 'lifecycle',
    title: 'Lifecycle',
    subtitle: 'Stages & journeys',
    icon: GitMerge,
    items: [
      { title: 'Lifecycle Stages', href: '/crm/lifecycle/stages', icon: GitMerge },
      { title: 'Contact Journey', href: '/crm/lifecycle/journey', icon: TrendingUp },
      { title: 'Stage Rules', href: '/crm/lifecycle/rules', icon: Settings },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    subtitle: 'CRM analytics',
    icon: BarChart3,
    items: [
      { title: 'Overview', href: '/crm/reports', icon: PieChart },
      { title: 'Contact Reports', href: '/crm/reports/contacts', icon: Users },
      { title: 'Company Reports', href: '/crm/reports/companies', icon: Building2 },
      { title: 'Activity Reports', href: '/crm/reports/activities', icon: Activity },
      { title: 'Source Reports', href: '/crm/reports/sources', icon: Globe },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'Data utilities',
    icon: Wrench,
    items: [
      { title: 'Import', href: '/crm/import', icon: Upload },
      { title: 'Export', href: '/crm/export', icon: Download },
      { title: 'Merge Duplicates', href: '/crm/contacts/duplicates', icon: Merge },
      { title: 'Data Enrichment', href: '/crm/enrich', icon: UserCheck },
      { title: 'Bulk Actions', href: '/crm/bulk', icon: Share2 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT FOR SHARING SELECTED SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const CRMContext = createContext(null);

export function useCRMContext() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRMContext must be used within CRMProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRM PROVIDER (Wraps everything to share state)
// ═══════════════════════════════════════════════════════════════════════════════
export function CRMProvider({ children }) {
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('people');

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

  return <CRMContext.Provider value={contextValue}>{children}</CRMContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRM SIDEBAR WITH ACCORDION PATTERN
// ═══════════════════════════════════════════════════════════════════════════════
export function CRMSidebar() {
  const { selectedSection, setSelectedSection, navigationSections, pathname } = useCRMContext();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState([selectedSection]);

  // Load collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('crm-sidebar-collapsed');
    if (saved !== null) setIsCollapsed(JSON.parse(saved));
  }, []);

  // Auto-expand section when pathname changes
  useEffect(() => {
    if (!expandedSections.includes(selectedSection)) {
      setExpandedSections((prev) => [...prev, selectedSection]);
    }
  }, [selectedSection]);

  // Toggle accordion section
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  // Handle section header click
  const handleSectionClick = (section) => {
    setSelectedSection(section.id);
    toggleSection(section.id);
    // Navigate to first item if section is being expanded
    if (!expandedSections.includes(section.id) && section.items?.length > 0) {
      router.push(section.items[0].href);
    }
  };

  // Handle item click
  const handleItemClick = (section, item) => {
    setSelectedSection(section.id);
    router.push(item.href);
  };

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('crm-sidebar-collapsed', JSON.stringify(newState));
  };

  const isItemActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 220 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
        className="relative h-full flex flex-col bg-transparent"
      >
        {/* Accordion Menu Items */}
        <nav
          className="flex-1 overflow-y-auto py-3 px-2"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
        >
          <div className="space-y-1">
            {navigationSections.map((section) => {
              const SectionIcon = section.icon;
              const isSelected = selectedSection === section.id;
              const isExpanded = expandedSections.includes(section.id);
              const hasActiveItem = section.items.some((item) => isItemActive(item.href));

              if (isCollapsed) {
                return (
                  <Tooltip key={section.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleSectionClick(section)}
                        className={cn(
                          'w-full flex items-center justify-center p-2 rounded-lg transition-all',
                          isSelected || hasActiveItem
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
                <div key={section.id} className="mb-1">
                  {/* Section Header (Accordion Trigger) - Matching Inbox Sidebar Pattern */}
                  <button
                    onClick={() => handleSectionClick(section)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group',
                      isExpanded
                        ? 'bg-white/70 text-gray-900'
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <SectionIcon
                        className={cn('h-4 w-4', isExpanded ? 'text-primary' : 'text-gray-500')}
                      />
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-gray-400 transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Accordion Content (Sub-items) - Matching Inbox Sidebar Pattern */}
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
                          className="pt-1 pl-2 space-y-0.5"
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={{
                            open: {
                              transition: {
                                staggerChildren: 0.05,
                                delayChildren: 0.1,
                              },
                            },
                            closed: {
                              transition: {
                                staggerChildren: 0.03,
                                staggerDirection: -1,
                              },
                            },
                          }}
                        >
                          {section.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isActive = isItemActive(item.href);

                            return (
                              <motion.div
                                key={item.href}
                                variants={{
                                  open: {
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                      y: { stiffness: 1000, velocity: -100 },
                                    },
                                  },
                                  closed: {
                                    y: 20,
                                    opacity: 0,
                                    transition: {
                                      y: { stiffness: 1000 },
                                    },
                                  },
                                }}
                              >
                                <button
                                  onClick={() => handleItemClick(section, item)}
                                  className={cn(
                                    'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all text-left',
                                    isActive && 'text-white bg-primary',
                                    !isActive &&
                                      'text-gray-700 hover:bg-white/50 hover:text-gray-900'
                                  )}
                                >
                                  <ItemIcon
                                    className={cn(
                                      'shrink-0 mt-0.5 h-4 w-4',
                                      isActive ? 'text-white' : 'text-gray-500'
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      'text-sm font-medium whitespace-nowrap',
                                      isActive && 'text-white',
                                      !isActive && 'text-gray-900'
                                    )}
                                  >
                                    {item.title}
                                  </span>
                                </button>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
  // People Section
  '/crm/contacts': [
    { value: '0', label: 'Total', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'New', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Tags', icon: Tag, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/companies': [
    { value: '0', label: 'Total', icon: Building2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Contacts', icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Deals', icon: FileText, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/leads': [
    { value: '0', label: 'Total', icon: UserCircle, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '0',
      label: 'Qualified',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    { value: '0', label: 'New', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Converted', icon: Users, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  // Engagement Section
  '/crm/activities': [
    { value: '0', label: 'Total', icon: Activity, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Today', icon: Calendar, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Calls', icon: Phone, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Meetings', icon: Video, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/tasks': [
    { value: '0', label: 'Total', icon: ListTodo, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Pending', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
    {
      value: '0',
      label: 'Completed',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    { value: '0', label: 'Overdue', icon: Activity, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/crm/calls': [
    { value: '0', label: 'Total', icon: Phone, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Today', icon: Calendar, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Scheduled', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Missed', icon: Activity, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/crm/meetings': [
    { value: '0', label: 'Total', icon: Video, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Today', icon: Calendar, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Upcoming', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    {
      value: '0',
      label: 'Completed',
      icon: CheckCircle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/crm/notes': [
    { value: '0', label: 'Total', icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Today', icon: Calendar, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Contacts', icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Companies', icon: Building2, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/emails': [
    { value: '0', label: 'Sent', icon: Mail, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Opened', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Clicked', icon: Target, bg: 'bg-purple-50', color: 'text-purple-600' },
    {
      value: '0',
      label: 'Replied',
      icon: MessageSquare,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  // Segments Section
  '/crm/segments': [
    { value: '0', label: 'Segments', icon: Layers, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Contacts', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Active',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Rules', icon: Settings, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/segments/dynamic': [
    { value: '0', label: 'Segments', icon: Filter, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Contacts', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Conditions',
      icon: Settings,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Updated', icon: RefreshCw, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/segments/static': [
    { value: '0', label: 'Lists', icon: ListTodo, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Contacts', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Active',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Archived', icon: History, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/segments/custom': [
    { value: '0', label: 'Views', icon: Target, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Filters', icon: Filter, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Shared', icon: Share2, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Private', icon: UserCircle, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  // Scoring Section
  '/crm/scoring/contacts': [
    { value: '0', label: 'Scored', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Hot', icon: Star, bg: 'bg-red-50', color: 'text-red-600' },
    { value: '0', label: 'Warm', icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600' },
    { value: '0', label: 'Cold', icon: Activity, bg: 'bg-blue-50', color: 'text-blue-600' },
  ],
  '/crm/scoring/companies': [
    { value: '0', label: 'Scored', icon: Building2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'High', icon: Star, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Medium', icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600' },
    { value: '0', label: 'Low', icon: Activity, bg: 'bg-gray-50', color: 'text-gray-600' },
  ],
  '/crm/scoring/rules': [
    { value: '0', label: 'Rules', icon: Target, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Triggered',
      icon: Activity,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Avg Score', icon: Star, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/scoring/history': [
    { value: '0', label: 'Changes', icon: History, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Today', icon: Calendar, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Increased',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Decreased', icon: Activity, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  // Lifecycle Section
  '/crm/lifecycle/stages': [
    { value: '0', label: 'Stages', icon: GitMerge, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Contacts', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Transitions',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Avg Days', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/lifecycle/journey': [
    { value: '0', label: 'Journeys', icon: TrendingUp, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: Activity, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Completed',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Dropped', icon: UserCircle, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/crm/lifecycle/rules': [
    { value: '0', label: 'Rules', icon: Settings, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Triggered',
      icon: Activity,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Updated', icon: RefreshCw, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  // Reports Section
  '/crm/reports': [
    { value: '0', label: 'Reports', icon: BarChart3, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Dashboards', icon: PieChart, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Scheduled', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Shared', icon: Share2, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/reports/contacts': [
    { value: '0', label: 'Contacts', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Growth', icon: TrendingUp, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Active', icon: Activity, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Churn', icon: UserCircle, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/crm/reports/companies': [
    { value: '0', label: 'Companies', icon: Building2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'New', icon: Plus, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Revenue',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Size Avg', icon: BarChart3, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/reports/activities': [
    { value: '0', label: 'Activities', icon: Activity, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Calls', icon: Phone, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Meetings', icon: Video, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Emails', icon: Mail, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/crm/reports/sources': [
    { value: '0', label: 'Sources', icon: Globe, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Top', icon: Star, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Conversion',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'ROI', icon: BarChart3, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  // Tools Section
  '/crm/import': [
    { value: '0', label: 'Imports', icon: Upload, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Records', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Pending', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Failed', icon: Activity, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/crm/export': [
    { value: '0', label: 'Exports', icon: Download, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Records', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Pending', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    {
      value: '0',
      label: 'Completed',
      icon: CheckCircle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/crm/contacts/duplicates': [
    { value: '0', label: 'Duplicates', icon: Merge, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Contacts', icon: Users, bg: 'bg-amber-50', color: 'text-amber-600' },
    {
      value: '0',
      label: 'Companies',
      icon: Building2,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Merged', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
  ],
  '/crm/enrich': [
    { value: '0', label: 'Enriched', icon: UserCheck, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Pending', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
    { value: '0', label: 'Updated', icon: RefreshCw, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Failed', icon: Activity, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/crm/bulk': [
    { value: '0', label: 'Actions', icon: Share2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Records', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Pending', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    {
      value: '0',
      label: 'Completed',
      icon: CheckCircle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE-SPECIFIC ACTIONS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const pageActions = {
  // People Section
  '/crm/contacts': [
    { icon: 'download', label: 'Export', variant: 'outline', href: '/crm/export' },
    { icon: 'plus', label: 'Add Contact', variant: 'default', href: '/crm/contacts/new' },
  ],
  '/crm/companies': [
    { icon: 'download', label: 'Export', variant: 'outline', href: '/crm/export' },
    { icon: 'plus', label: 'Add Company', variant: 'default', href: '/crm/companies/new' },
  ],
  '/crm/leads': [
    { icon: 'download', label: 'Export', variant: 'outline', href: '/crm/export' },
    { icon: 'plus', label: 'Add Lead', variant: 'default', href: '/crm/leads/new' },
  ],
  // Engagement Section
  '/crm/activities': [
    { icon: 'plus', label: 'Log Activity', variant: 'default', href: '/crm/activities/new' },
  ],
  '/crm/tasks': [{ icon: 'plus', label: 'Add Task', variant: 'default', href: '/crm/tasks/new' }],
  '/crm/calls': [{ icon: 'plus', label: 'Log Call', variant: 'default', href: '/crm/calls/new' }],
  '/crm/meetings': [
    { icon: 'plus', label: 'Schedule Meeting', variant: 'default', href: '/crm/meetings/new' },
  ],
  '/crm/notes': [{ icon: 'plus', label: 'Add Note', variant: 'default', href: '/crm/notes/new' }],
  '/crm/emails': [
    { icon: 'plus', label: 'Send Email', variant: 'default', href: '/crm/emails/compose' },
  ],
  // Segments Section
  '/crm/segments': [
    { icon: 'plus', label: 'Create Segment', variant: 'default', href: '/crm/segments/new' },
  ],
  '/crm/segments/dynamic': [
    {
      icon: 'plus',
      label: 'Create Dynamic Segment',
      variant: 'default',
      href: '/crm/segments/dynamic/new',
    },
  ],
  '/crm/segments/static': [
    {
      icon: 'plus',
      label: 'Create Static List',
      variant: 'default',
      href: '/crm/segments/static/new',
    },
  ],
  '/crm/segments/custom': [
    {
      icon: 'plus',
      label: 'Create Custom View',
      variant: 'default',
      href: '/crm/segments/custom/new',
    },
  ],
  // Scoring Section
  '/crm/scoring/contacts': [
    { icon: 'plus', label: 'Add Rule', variant: 'default', href: '/crm/scoring/contacts/new' },
  ],
  '/crm/scoring/companies': [
    { icon: 'plus', label: 'Add Rule', variant: 'default', href: '/crm/scoring/companies/new' },
  ],
  '/crm/scoring/rules': [
    { icon: 'plus', label: 'Create Rule', variant: 'default', href: '/crm/scoring/rules/new' },
  ],
  '/crm/scoring/history': [],
  // Lifecycle Section
  '/crm/lifecycle/stages': [
    { icon: 'plus', label: 'Add Stage', variant: 'default', href: '/crm/lifecycle/stages/new' },
  ],
  '/crm/lifecycle/journey': [
    {
      icon: 'plus',
      label: 'Create Journey',
      variant: 'default',
      href: '/crm/lifecycle/journey/new',
    },
  ],
  '/crm/lifecycle/rules': [
    { icon: 'plus', label: 'Create Rule', variant: 'default', href: '/crm/lifecycle/rules/new' },
  ],
  // Reports Section
  '/crm/reports': [
    { icon: 'plus', label: 'Create Report', variant: 'default', href: '/crm/reports/new' },
  ],
  '/crm/reports/contacts': [
    { icon: 'download', label: 'Export', variant: 'outline', href: '/crm/export' },
  ],
  '/crm/reports/companies': [
    { icon: 'download', label: 'Export', variant: 'outline', href: '/crm/export' },
  ],
  '/crm/reports/activities': [
    { icon: 'download', label: 'Export', variant: 'outline', href: '/crm/export' },
  ],
  '/crm/reports/sources': [
    { icon: 'download', label: 'Export', variant: 'outline', href: '/crm/export' },
  ],
  // Tools Section
  '/crm/import': [
    { icon: 'plus', label: 'New Import', variant: 'default', href: '/crm/import/new' },
  ],
  '/crm/export': [
    { icon: 'plus', label: 'New Export', variant: 'default', href: '/crm/export/new' },
  ],
  '/crm/contacts/duplicates': [
    {
      icon: 'plus',
      label: 'Scan Duplicates',
      variant: 'default',
      href: '/crm/contacts/duplicates/scan',
    },
  ],
  '/crm/enrich': [
    { icon: 'plus', label: 'Start Enrichment', variant: 'default', href: '/crm/enrich/new' },
  ],
  '/crm/bulk': [
    { icon: 'plus', label: 'New Bulk Action', variant: 'default', href: '/crm/bulk/new' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CRM HEADER (Status bar with title and stats)
// ═══════════════════════════════════════════════════════════════════════════════
export function CRMHeader() {
  const { currentSection, pathname } = useCRMContext();
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
              const buttonClasses = cn(
                'h-7 w-7 rounded-lg flex items-center justify-center transition-colors',
                action.variant === 'outline'
                  ? 'border border-gray-300 hover:bg-gray-50 text-gray-600'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              );
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    {action.href ? (
                      <Link href={action.href} className={buttonClasses} aria-label={action.label}>
                        <ActionIcon className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <button className={buttonClasses} aria-label={action.label}>
                        <ActionIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
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
// CRM SUB-MENU PANEL (List of items for selected section)
// ═══════════════════════════════════════════════════════════════════════════════
export function CRMSubMenu() {
  const { currentSection, pathname } = useCRMContext();
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
