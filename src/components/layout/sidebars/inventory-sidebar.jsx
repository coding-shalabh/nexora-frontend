'use client';

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Package,
  Warehouse,
  ArrowDownUp,
  ClipboardCheck,
  Truck,
  PackageSearch,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Settings,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Building2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════
const navigationSections = [
  {
    id: 'products',
    title: 'Products',
    subtitle: 'Product catalog',
    icon: Package,
    items: [
      { title: 'All Products', href: '/inventory/products', icon: Package },
      { title: 'Add Product', href: '/inventory/products/new', icon: Package },
    ],
  },
  {
    id: 'stock',
    title: 'Stock',
    subtitle: 'Stock management',
    icon: PackageSearch,
    items: [
      { title: 'Stock Levels', href: '/inventory/stock', icon: PackageSearch },
      { title: 'Stock Moves', href: '/inventory/moves', icon: ArrowDownUp },
      { title: 'New Movement', href: '/inventory/moves/new', icon: ArrowDownUp },
    ],
  },
  {
    id: 'warehouses',
    title: 'Warehouses',
    subtitle: 'Storage locations',
    icon: Warehouse,
    items: [{ title: 'All Warehouses', href: '/inventory/warehouses', icon: Warehouse }],
  },
  {
    id: 'purchasing',
    title: 'Purchasing',
    subtitle: 'Purchase orders',
    icon: ClipboardCheck,
    items: [
      { title: 'Purchase Orders', href: '/inventory/purchase', icon: ClipboardCheck },
      { title: 'New Order', href: '/inventory/purchase/new', icon: ClipboardCheck },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping',
    subtitle: 'Outbound deliveries',
    icon: Truck,
    items: [
      { title: 'All Shipments', href: '/inventory/shipping', icon: Truck },
      { title: 'New Shipment', href: '/inventory/shipping/new', icon: Truck },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    subtitle: 'Analytics & insights',
    icon: BarChart3,
    items: [{ title: 'Inventory Reports', href: '/inventory/reports', icon: BarChart3 }],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT FOR SHARING SELECTED SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const InventoryContext = createContext(null);

export function useInventoryContext() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventoryContext must be used within InventoryProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVENTORY PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════
export function InventoryProvider({ children }) {
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('products');

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

  return <InventoryContext.Provider value={contextValue}>{children}</InventoryContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVENTORY SIDEBAR (CORE MENU ONLY)
// ═══════════════════════════════════════════════════════════════════════════════
export function InventorySidebar() {
  const { selectedSection, setSelectedSection, navigationSections } = useInventoryContext();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('inventory-sidebar-collapsed');
    if (saved !== null) setIsCollapsed(JSON.parse(saved));
  }, []);

  // Handle section click - navigate to first item of section
  const handleSectionClick = (section) => {
    setSelectedSection(section.id);
    // Navigate to the first item of the section
    if (section.items && section.items.length > 0) {
      router.push(section.items[0].href);
    }
  };

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('inventory-sidebar-collapsed', JSON.stringify(newState));
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
          {!isCollapsed && <h2 className="text-sm font-semibold text-gray-700">Inventory</h2>}
          {isCollapsed && (
            <div className="flex justify-center">
              <Package className="h-5 w-5 text-gray-500" />
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
  '/inventory': [
    { value: '1,247', label: 'Products', icon: Package, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '4',
      label: 'Warehouses',
      icon: Warehouse,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '18',
      label: 'Low Stock',
      icon: AlertTriangle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
    {
      value: '32',
      label: 'Pending',
      icon: ClipboardCheck,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ],
  '/inventory/products': [
    {
      value: '1,247',
      label: 'Products',
      icon: Package,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      value: '856',
      label: 'Active',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '89',
      label: 'Low Stock',
      icon: AlertTriangle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
    {
      value: '₹45L',
      label: 'Value',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ],
  '/inventory/stock': [
    { value: '12K', label: 'Items', icon: Package, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '89',
      label: 'Low Stock',
      icon: AlertTriangle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
    { value: '4', label: 'Locations', icon: Warehouse, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '₹45L',
      label: 'Value',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ],
  '/inventory/moves': [
    { value: '234', label: 'Today', icon: ArrowDownUp, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '145',
      label: 'Stock In',
      icon: TrendingUp,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    { value: '89', label: 'Stock Out', icon: Package, bg: 'bg-amber-50', color: 'text-amber-600' },
    {
      value: '12',
      label: 'Pending',
      icon: CheckCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ],
  '/inventory/warehouses': [
    { value: '4', label: 'Warehouses', icon: Warehouse, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '3', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '75%',
      label: 'Avg Usage',
      icon: BarChart3,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    {
      value: '26K',
      label: 'Total Items',
      icon: Package,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/inventory/purchase': [
    {
      value: '32',
      label: 'Orders',
      icon: ClipboardCheck,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      value: '12',
      label: 'Pending',
      icon: AlertTriangle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
    {
      value: '18',
      label: 'Suppliers',
      icon: Building2,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '₹12L',
      label: 'Value',
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ],
  '/inventory/shipping': [
    { value: '45', label: 'Shipments', icon: Truck, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '23',
      label: 'In Transit',
      icon: ArrowDownUp,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
    {
      value: '18',
      label: 'Delivered',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    { value: '4', label: 'Pending', icon: Package, bg: 'bg-purple-50', color: 'text-purple-600' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// INVENTORY HEADER
// ═══════════════════════════════════════════════════════════════════════════════
export function InventoryHeader() {
  const { currentSection, pathname } = useInventoryContext();

  if (!currentSection) return null;

  // Find the active sub-menu item
  const activeItem = currentSection.items
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0];

  // Get page-specific stats
  const stats = pageStats[pathname] || pageStats[activeItem?.href] || [];

  return (
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

          {/* Stats */}
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
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVENTORY SUB-MENU PANEL
// ═══════════════════════════════════════════════════════════════════════════════
export function InventorySubMenu() {
  const { currentSection, pathname } = useInventoryContext();
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
