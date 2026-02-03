'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Kanban,
  Ticket,
  FileText,
  Wallet,
  Zap,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  Sparkles,
  LogOut,
  Home,
  Building2,
  UserCheck,
  Target,
  TrendingUp,
  Phone,
  Calendar,
  FileEdit,
  BookOpen,
  GraduationCap,
  Mail,
  Share2,
  Megaphone,
  MousePointer,
  MessageCircle,
  CalendarDays,
  Layers,
  HeadphonesIcon,
  BookMarked,
  Users2,
  Clock,
  ShoppingCart,
  CreditCard,
  Package,
  Repeat,
  Link2,
  PieChart,
  Goal,
  Activity,
  Brain,
  Workflow,
  Gauge,
  Bot,
  FolderKanban,
  ListTodo,
  Timer,
  Search,
  Wrench,
  Database,
  Tags,
  FileCode,
  History,
  GitMerge,
  SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';

// Core Hubs - Main navigation (no sub-items, all navigation happens in hub sidebars)
const navigation = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    color: 'from-primary to-primary',
    description: 'Dashboard overview',
  },
  {
    title: 'Inbox',
    href: '/inbox',
    icon: MessageSquare,
    badge: '12',
    color: 'from-green-500 to-emerald-500',
    description: 'WhatsApp, Email, SMS',
  },
  {
    title: 'CRM',
    href: '/crm/contacts',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    description: 'Contacts & Companies',
  },
  {
    title: 'Pipeline',
    href: '/pipeline/deals',
    icon: Kanban,
    color: 'from-emerald-500 to-green-600',
    description: 'Deals & Pipeline',
  },
  {
    title: 'Sales',
    href: '/sales/workspace',
    icon: TrendingUp,
    color: 'from-blue-500 to-indigo-600',
    description: 'Sales operations',
  },
  {
    title: 'Marketing',
    href: '/marketing/campaigns',
    icon: Megaphone,
    color: 'from-pink-500 to-rose-600',
    description: 'Campaigns & Outreach',
  },
  {
    title: 'Service',
    href: '/service/tickets',
    icon: HeadphonesIcon,
    color: 'from-teal-500 to-cyan-600',
    description: 'Support tickets',
  },
  {
    title: 'Tickets',
    href: '/tickets',
    icon: Ticket,
    color: 'from-orange-500 to-red-600',
    description: 'Customer support',
  },
  {
    title: 'Commerce',
    href: '/commerce/products',
    icon: ShoppingCart,
    color: 'from-emerald-500 to-green-600',
    description: 'Products & Orders',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
    color: 'from-amber-500 to-orange-600',
    description: 'Project management',
  },
  {
    title: 'Automation',
    href: '/automation/workflows',
    icon: Zap,
    color: 'from-fuchsia-500 to-pink-600',
    description: 'Workflows & AI',
  },
  {
    title: 'Tags',
    href: '/tags',
    icon: Tags,
    color: 'from-violet-500 to-purple-600',
    description: 'Manage tags',
  },
  {
    title: 'Activity',
    href: '/activity',
    icon: Activity,
    color: 'from-cyan-500 to-blue-600',
    description: 'Activity log',
  },
  {
    title: 'Analytics',
    href: '/analytics/dashboards',
    icon: BarChart3,
    color: 'from-purple-500 to-indigo-600',
    description: 'Reports & Insights',
  },
];

const bottomNavigation = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    color: 'from-gray-500 to-slate-500',
  },
  {
    title: 'Help',
    href: '/help',
    icon: HelpCircle,
    color: 'from-gray-500 to-slate-500',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  // Check if a hub is active based on pathname
  const isHubActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    // For hubs, check if pathname starts with the hub's base path
    const hubBase = href.split('/').slice(0, 2).join('/');
    return pathname.startsWith(hubBase);
  };

  const NavLink = ({ item, index }) => {
    const isItemActive = isHubActive(item.href);

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        <Link
          href={item.href}
          className={cn(
            'relative flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
            'hover:bg-sidebar-item-hover',
            isItemActive
              ? 'text-sidebar-text-active bg-sidebar-hover'
              : 'text-sidebar-text hover:text-sidebar-text-active'
          )}
        >
          <span className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                isItemActive
                  ? `bg-gradient-to-br ${item.color} text-white shadow-lg`
                  : 'bg-sidebar-hover text-sidebar-text'
              )}
            >
              <item.icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span>{item.title}</span>
              {item.description && (
                <span className="text-[10px] text-sidebar-text-muted font-normal">
                  {item.description}
                </span>
              )}
            </div>
          </span>

          {item.badge && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-sidebar-active to-indigo-500 px-1.5 text-[10px] font-bold text-white shadow-lg">
              {item.badge}
            </span>
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <aside className="flex w-72 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-16 items-center gap-3 border-b border-gray-200 px-6"
      >
        <Link href="/dashboard" className="flex items-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Image
              src="/logo.png"
              alt="Nexora"
              width={140}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </motion.div>
        </Link>
      </motion.div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-auto p-4">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-text-muted">
          Main Menu
        </p>
        {navigation.map((item, index) => (
          <NavLink key={item.title} item={item} index={index} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 p-4 space-y-1">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-text-muted">
          Support
        </p>
        {bottomNavigation.map((item, index) => (
          <NavLink key={item.title} item={item} index={index} />
        ))}
      </div>

      {/* User Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-gray-200 p-4"
      >
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-hover p-3 hover:bg-sidebar-item-hover transition-colors">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sidebar-active to-indigo-400 shadow-lg">
              <span className="text-sm font-bold text-white">JD</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-sidebar-bg bg-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-sidebar-text-active">John Doe</p>
            <p className="text-xs text-sidebar-text-muted truncate">Admin • Pro Plan</p>
          </div>
          <button className="rounded-lg p-2 text-sidebar-text hover:bg-sidebar-item-hover hover:text-sidebar-text-active transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </aside>
  );
}
