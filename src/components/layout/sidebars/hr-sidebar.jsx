'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Network,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  GraduationCap,
  UserMinus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * HR Sidebar Navigation Items
 */
const hrNavigation = [
  { title: 'Dashboard', href: '/hr', icon: LayoutDashboard, description: 'HR overview' },
  { title: 'Employees', href: '/hr/employees', icon: Users, description: 'Employee directory' },
  {
    title: 'Recruitment',
    href: '/hr/recruitment',
    icon: UserPlus,
    description: 'Hiring pipeline',
  },
  {
    title: 'Organization',
    href: '/hr/org',
    icon: Network,
    description: 'Org structure',
  },
  { title: 'Attendance', href: '/hr/attendance', icon: Clock, description: 'Time tracking' },
  { title: 'Leave', href: '/hr/leave', icon: Calendar, description: 'Leave management' },
  { title: 'Payroll', href: '/hr/payroll', icon: DollarSign, description: 'Payroll processing' },
  {
    title: 'Performance',
    href: '/hr/performance',
    icon: TrendingUp,
    description: 'Performance reviews',
  },
  {
    title: 'Training',
    href: '/hr/training',
    icon: GraduationCap,
    description: 'Learning & development',
  },
  {
    title: 'Offboarding',
    href: '/hr/offboarding',
    icon: UserMinus,
    description: 'Exit process',
  },
];

export function HRSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hr-sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('hr-sidebar-collapsed', JSON.stringify(newState));
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
            {hrNavigation.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* Collapse Toggle Button */}
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
