'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Ticket,
  Inbox,
  Clock,
  CheckCircle,
  LifeBuoy,
  BookOpen,
  Settings as SettingsIcon,
  Globe,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ticketsNavigation = [
  {
    title: 'All Tickets',
    href: '/tickets',
    icon: Ticket,
    badge: 24,
    description: 'View all tickets',
  },
  { title: 'Open', href: '/tickets/open', icon: Inbox, badge: 12, description: 'Active tickets' },
  {
    title: 'Pending',
    href: '/tickets/pending',
    icon: Clock,
    badge: 8,
    description: 'Awaiting response',
  },
  {
    title: 'Resolved',
    href: '/tickets/resolved',
    icon: CheckCircle,
    description: 'Closed tickets',
  },
];

const ticketsTools = [
  {
    title: 'Knowledge Base',
    href: '/tickets/knowledge-base',
    icon: BookOpen,
    description: 'Help articles',
  },
  { title: 'SLAs', href: '/tickets/slas', icon: SettingsIcon, description: 'Service agreements' },
  {
    title: 'Customer Portal',
    href: '/tickets/portal',
    icon: Globe,
    description: 'Self-service portal',
  },
];

export function TicketsSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tickets-sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('tickets-sidebar-collapsed', JSON.stringify(newState));
  };

  const isActive = (href) => {
    if (href === '/tickets') return pathname === '/tickets';
    return pathname.startsWith(href);
  };

  const NavItem = ({ item, showDescription = true }) => {
    const active = isActive(item.href);

    const linkContent = (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all overflow-hidden',
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
            <div className="flex items-center justify-between gap-2">
              <span className={cn('text-sm font-medium whitespace-nowrap', active && 'text-white')}>
                {item.title}
              </span>
              {item.badge > 0 && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                    active ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </div>
            {showDescription && item.description && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
            )}
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
            className="flex flex-col gap-1 bg-white border-0 px-3 py-2 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.3),0_2px_8px_-2px_rgba(168,85,247,0.2)]"
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            {item.description && <span className="text-xs text-gray-500">{item.description}</span>}
            {item.badge > 0 && <span className="text-xs text-primary">{item.badge} tickets</span>}
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
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Main Navigation */}
          <div className="space-y-1">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Tickets
                </motion.p>
              )}
            </AnimatePresence>
            {ticketsNavigation.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          {/* Divider */}
          <div className={cn('py-3', isCollapsed ? 'px-2' : 'px-3')}>
            <div className="h-px bg-border/50" />
          </div>

          {/* Tools */}
          <div className="space-y-1">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Tools
                </motion.p>
              )}
            </AnimatePresence>
            {ticketsTools.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* Collapse Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white dark:bg-card shadow-md hover:bg-muted z-10"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}
