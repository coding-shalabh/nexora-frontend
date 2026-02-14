'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LifeBuoy,
  Ticket,
  BookOpen,
  Globe,
  Clock,
  MessageCircle,
  ClipboardCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  HeadphonesIcon,
  Star,
  Plus,
  AlertCircle,
  CheckCircle,
  Timer,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Service Hub Sidebar Navigation Items
 * Flat list - no collapsible sections
 */
const serviceNavigation = [
  { title: 'Tickets', href: '/service/tickets', icon: Ticket, description: 'Support tickets' },
  {
    title: 'Knowledge Base',
    href: '/service/kb',
    icon: BookOpen,
    description: 'Help articles',
  },
  {
    title: 'Customer Portal',
    href: '/service/portal',
    icon: Globe,
    description: 'Self-service portal',
  },
  {
    title: 'Live Chat',
    href: '/service/live-chat',
    icon: MessageCircle,
    description: 'Real-time chat',
  },
  { title: 'SLAs', href: '/service/slas', icon: Clock, description: 'Service agreements' },
  {
    title: 'Surveys',
    href: '/service/surveys',
    icon: ClipboardCheck,
    description: 'Customer feedback',
  },
  {
    title: 'Call Center',
    href: '/service/call-center',
    icon: HeadphonesIcon,
    description: 'Phone support',
  },
  { title: 'Customer Health', href: '/service/health', icon: Star, description: 'Health scores' },
  { title: 'Team Inbox', href: '/service/team-inbox', icon: Users, description: 'Shared inbox' },
  { title: 'Reports', href: '/service/reports', icon: BarChart3, description: 'Service metrics' },
  {
    title: 'Settings',
    href: '/service/settings',
    icon: Settings,
    description: 'Configure service',
  },
];

/**
 * Fixed Action Buttons (always visible at top)
 */
const fixedActions = [
  { id: 'add', title: 'New Ticket', href: '/service/tickets/new', icon: Plus, variant: 'default' },
  {
    id: 'article',
    title: 'New Article',
    href: '/service/kb/articles/new',
    icon: BookOpen,
    variant: 'outline',
  },
];

/**
 * Quick Filters for Tickets page
 */
const ticketFilters = [
  { id: 'all', label: 'All Tickets', icon: null },
  { id: 'mine', label: 'Assigned to Me', icon: UserCheck },
  { id: 'unassigned', label: 'Unassigned', icon: AlertCircle },
  { id: 'overdue', label: 'Overdue', icon: Timer },
  { id: 'resolved', label: 'Resolved', icon: CheckCircle },
];

/**
 * Priority Filters
 */
const priorityFilters = [
  { id: 'all', label: 'All Priorities' },
  { id: 'critical', label: 'Critical' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

export function ServiceSidebar({ onAction }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activePriorityFilter, setActivePriorityFilter] = useState('all');
  const [showClosedTickets, setShowClosedTickets] = useState(false);

  // Check if we're on the tickets page
  const isTicketsPage = pathname.includes('/service/tickets');

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('service-sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('service-sidebar-collapsed', JSON.stringify(newState));
  };

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId);
    }
  };

  const NavItem = ({ item, showDescription = false }) => {
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
            {showDescription && item.description && (
              <p
                className={cn(
                  'text-xs truncate mt-0.5',
                  active ? 'text-white/70' : 'text-gray-500'
                )}
              >
                {item.description}
              </p>
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
        {/* Fixed Action Buttons (always visible) */}
        {!isCollapsed && (
          <div className="px-3 py-3 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {fixedActions.map((action) => {
                const Icon = action.icon;
                if (action.href) {
                  return (
                    <Link key={action.id} href={action.href} className="flex-1">
                      <Button
                        variant={action.variant || 'default'}
                        size="sm"
                        className="w-full"
                        style={action.variant === 'default' ? { background: '#0004c3' } : undefined}
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {action.title}
                      </Button>
                    </Link>
                  );
                }
                return (
                  <Button
                    key={action.id}
                    variant={action.variant || 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAction(action.onClick || action.id)}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {action.title}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsed state: show action buttons as icons */}
        {isCollapsed && (
          <div className="px-2 py-2 border-b border-gray-200 space-y-1">
            {fixedActions.map((action) => {
              const Icon = action.icon;
              const content = (
                <Button
                  variant={action.variant === 'default' ? 'default' : 'ghost'}
                  size="icon"
                  className="w-full h-10"
                  style={action.variant === 'default' ? { background: '#0004c3' } : undefined}
                  onClick={() => !action.href && handleAction(action.onClick || action.id)}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              );
              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    {action.href ? <Link href={action.href}>{content}</Link> : content}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white border-0 shadow-lg">
                    {action.title}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}

        {/* Navigation Links - Flat list (no section headers) */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {serviceNavigation.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* Ticket Filters (shown when on Tickets page) */}
        {isTicketsPage && !isCollapsed && (
          <div className="px-3 py-3 border-t border-gray-200">
            <div className="space-y-3">
              {/* Quick Filters */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-500">Filter Tickets</span>
                <div className="flex flex-wrap gap-1">
                  {ticketFilters.map((filter) => {
                    const FilterIcon = filter.icon;
                    const isFilterActive = activeFilter === filter.id;
                    return (
                      <Button
                        key={filter.id}
                        variant={isFilterActive ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn(
                          'h-7 text-xs',
                          isFilterActive && 'bg-primary/10 text-primary'
                        )}
                        onClick={() => setActiveFilter(filter.id)}
                      >
                        {FilterIcon && <FilterIcon className="h-3 w-3 mr-1" />}
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Priority Filters */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-500">Priority</span>
                <div className="flex flex-wrap gap-1">
                  {priorityFilters.map((filter) => {
                    const isFilterActive = activePriorityFilter === filter.id;
                    return (
                      <Button
                        key={filter.id}
                        variant={isFilterActive ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn(
                          'h-7 text-xs',
                          isFilterActive && 'bg-primary/10 text-primary'
                        )}
                        onClick={() => setActivePriorityFilter(filter.id)}
                      >
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Show Closed Toggle */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-500">Show Closed Tickets</span>
                <Switch
                  checked={showClosedTickets}
                  onCheckedChange={setShowClosedTickets}
                  className="h-4 w-7"
                />
              </div>
            </div>
          </div>
        )}

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
