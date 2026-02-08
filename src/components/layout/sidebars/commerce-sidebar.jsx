'use client';

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ShoppingCart,
  Package,
  ShoppingBag,
  FileText,
  CreditCard,
  RefreshCw,
  Link as LinkIcon,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Receipt,
  Wallet,
  Plus,
  Download,
  CheckCircle,
  Clock,
  Users,
  Percent,
  Warehouse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════
const navigationSections = [
  {
    id: 'catalog',
    title: 'Catalog',
    subtitle: 'Products & inventory',
    icon: Package,
    items: [
      { title: 'Products', href: '/commerce/products', icon: Package },
      { title: 'Inventory', href: '/commerce/inventory', icon: Warehouse },
      { title: 'Discounts', href: '/commerce/discounts', icon: Percent },
    ],
  },
  {
    id: 'customers',
    title: 'Customers',
    subtitle: 'Customer management',
    icon: Users,
    items: [{ title: 'Customers', href: '/commerce/customers', icon: Users }],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    subtitle: 'Orders & payments',
    icon: ShoppingBag,
    items: [
      { title: 'Orders', href: '/commerce/orders', icon: ShoppingBag },
      { title: 'Invoices', href: '/commerce/invoices', icon: FileText },
      { title: 'Payments', href: '/commerce/payments', icon: CreditCard },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    subtitle: 'Subscriptions & links',
    icon: RefreshCw,
    items: [
      { title: 'Subscriptions', href: '/commerce/subscriptions', icon: RefreshCw },
      { title: 'Payment Links', href: '/commerce/payment-links', icon: LinkIcon },
      { title: 'Wallet', href: '/commerce/wallet', icon: Wallet },
    ],
  },
  {
    id: 'insights',
    title: 'Insights',
    subtitle: 'Revenue & reports',
    icon: BarChart3,
    items: [
      { title: 'Revenue', href: '/commerce/revenue', icon: DollarSign },
      { title: 'Receipts', href: '/commerce/receipts', icon: Receipt },
      { title: 'Reports', href: '/commerce/reports', icon: BarChart3 },
    ],
  },
  {
    id: 'config',
    title: 'Config',
    subtitle: 'Settings',
    icon: Settings,
    items: [{ title: 'Settings', href: '/commerce/settings', icon: Settings }],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT FOR SHARING SELECTED SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const CommerceContext = createContext(null);

export function useCommerceContext() {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerceContext must be used within CommerceProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMERCE PROVIDER (Wraps everything to share state)
// ═══════════════════════════════════════════════════════════════════════════════
export function CommerceProvider({ children }) {
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('catalog');

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

  return <CommerceContext.Provider value={contextValue}>{children}</CommerceContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMERCE SIDEBAR (CORE MENU ONLY)
// ═══════════════════════════════════════════════════════════════════════════════
export function CommerceSidebar() {
  const { selectedSection, setSelectedSection, navigationSections } = useCommerceContext();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('commerce-sidebar-collapsed');
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
    localStorage.setItem('commerce-sidebar-collapsed', JSON.stringify(newState));
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
  '/commerce/products': [
    { value: '0', label: 'Products', icon: Package, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Categories',
      icon: Settings,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '$0', label: 'Value', icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/commerce/orders': [
    { value: '0', label: 'Total', icon: ShoppingBag, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Pending', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Completed',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '$0', label: 'Revenue', icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/commerce/invoices': [
    { value: '0', label: 'Total', icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Unpaid', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Paid', icon: CheckCircle, bg: 'bg-purple-50', color: 'text-purple-600' },
    {
      value: '$0',
      label: 'Outstanding',
      icon: DollarSign,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/commerce/payments': [
    { value: '0', label: 'Total', icon: CreditCard, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Pending', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Successful',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '$0', label: 'Volume', icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/commerce/subscriptions': [
    { value: '0', label: 'Active', icon: RefreshCw, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Trials', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Cancelled',
      icon: Settings,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '$0', label: 'MRR', icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/commerce/payment-links': [
    { value: '0', label: 'Links', icon: LinkIcon, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Used', icon: Clock, bg: 'bg-purple-50', color: 'text-purple-600' },
    {
      value: '$0',
      label: 'Collected',
      icon: DollarSign,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/commerce/wallet': [
    { value: '0', label: 'Wallets', icon: Wallet, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '$0', label: 'Balance', icon: DollarSign, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Transactions',
      icon: RefreshCw,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Active', icon: CheckCircle, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/commerce/revenue': [
    { value: '$0', label: 'Total', icon: DollarSign, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '$0', label: 'This Month', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0%', label: 'Growth', icon: BarChart3, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Orders', icon: ShoppingBag, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/commerce/receipts': [
    { value: '0', label: 'Total', icon: Receipt, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'This Week', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '$0',
      label: 'Amount',
      icon: DollarSign,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Pending', icon: CheckCircle, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/commerce/reports': [
    { value: '0', label: 'Reports', icon: BarChart3, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Scheduled', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '0', label: 'Custom', icon: Settings, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '0', label: 'Exports', icon: FileText, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE-SPECIFIC ACTIONS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const pageActions = {
  '/commerce/products': [
    { icon: 'download', label: 'Export', variant: 'outline' },
    { icon: 'plus', label: 'Add Product', variant: 'default' },
  ],
  '/commerce/orders': [
    { icon: 'download', label: 'Export', variant: 'outline' },
    { icon: 'plus', label: 'New Order', variant: 'default' },
  ],
  '/commerce/invoices': [
    { icon: 'download', label: 'Export', variant: 'outline' },
    { icon: 'plus', label: 'Create Invoice', variant: 'default' },
  ],
  '/commerce/payments': [{ icon: 'download', label: 'Export', variant: 'outline' }],
  '/commerce/subscriptions': [{ icon: 'plus', label: 'New Plan', variant: 'default' }],
  '/commerce/payment-links': [{ icon: 'plus', label: 'Create Link', variant: 'default' }],
  '/commerce/wallet': [],
  '/commerce/revenue': [{ icon: 'download', label: 'Export', variant: 'outline' }],
  '/commerce/receipts': [{ icon: 'download', label: 'Export', variant: 'outline' }],
  '/commerce/reports': [{ icon: 'plus', label: 'New Report', variant: 'default' }],
  '/commerce/settings': [],
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMMERCE HEADER (Status bar with title and stats)
// ═══════════════════════════════════════════════════════════════════════════════
export function CommerceHeader() {
  const { currentSection, pathname } = useCommerceContext();
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
// COMMERCE SUB-MENU PANEL (List of items for selected section)
// ═══════════════════════════════════════════════════════════════════════════════
export function CommerceSubMenu() {
  const { currentSection, pathname } = useCommerceContext();
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
