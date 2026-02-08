'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Wallet,
  BookOpen,
  FileText,
  Landmark,
  TrendingUp,
  TrendingDown,
  Receipt,
  PieChart,
  Calculator,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Finance Sidebar Navigation Items
 * Organized by functional areas for better UX
 */
const financeNavigation = [
  // Dashboard
  {
    title: 'Dashboard',
    href: '/finance',
    icon: LayoutDashboard,
    description: 'Finance overview',
  },

  // Core Accounting
  {
    title: 'Chart of Accounts',
    href: '/finance/accounts',
    icon: Wallet,
    description: 'Account structure',
  },
  {
    title: 'General Ledger',
    href: '/finance/ledger',
    icon: BookOpen,
    description: 'All transactions',
  },
  {
    title: 'Journal Entries',
    href: '/finance/journal',
    icon: FileText,
    description: 'Manual entries',
  },

  // Banking
  {
    title: 'Bank Accounts',
    href: '/finance/bank',
    icon: Landmark,
    description: 'Manage accounts',
  },

  // Receivables & Payables
  {
    title: 'Receivables',
    href: '/finance/receivables',
    icon: TrendingUp,
    description: 'Money owed to you',
  },
  {
    title: 'Payables',
    href: '/finance/payables',
    icon: TrendingDown,
    description: 'Money you owe',
  },

  // Financial Management
  {
    title: 'Expenses',
    href: '/finance/expenses',
    icon: Receipt,
    description: 'Track expenses',
  },
  {
    title: 'Budgets',
    href: '/finance/budgets',
    icon: PieChart,
    description: 'Budget planning',
  },

  // Reporting
  {
    title: 'Financial Reports',
    href: '/finance/reports',
    icon: BarChart3,
    description: 'P&L, Balance Sheet',
  },
  {
    title: 'Tax Reports',
    href: '/finance/tax',
    icon: Calculator,
    description: 'Tax filings',
  },
];

export function FinanceSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('finance-sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('finance-sidebar-collapsed', JSON.stringify(newState));
  };

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const NavItem = ({ item }) => {
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
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {financeNavigation.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

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
