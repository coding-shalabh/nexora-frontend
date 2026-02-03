'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Users,
  Building2,
  Activity,
  Layers,
  Tag,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  CheckSquare,
  FileText,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * CRM Sidebar Navigation Items
 * Flat list - no collapsible sections
 */
const crmNavigation = [
  { title: 'Contacts', href: '/crm/contacts', icon: Users, description: 'Manage contacts' },
  { title: 'Companies', href: '/crm/companies', icon: Building2, description: 'Manage companies' },
  { title: 'Activities', href: '/crm/activities', icon: Activity, description: 'Track activities' },
  { title: 'Segments', href: '/crm/segments', icon: Layers, description: 'Contact segments' },
  { title: 'Tags', href: '/crm/tags', icon: Tag, description: 'Manage tags' },
  {
    title: 'Custom Fields',
    href: '/crm/fields',
    icon: SettingsIcon,
    description: 'Configure fields',
  },
];

/**
 * Activity Type Filters
 */
const activityFilters = [
  { id: 'all', label: 'All', icon: null },
  { id: 'calls', label: 'Calls', icon: Phone },
  { id: 'meetings', label: 'Meetings', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'emails', label: 'Emails', icon: Mail },
];

export function CRMSidebar({ onAction }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeActivityFilter, setActiveActivityFilter] = useState('all');
  const [hideCompleted, setHideCompleted] = useState(false);

  // Check if we're on the activities page
  const isActivitiesPage = pathname.includes('/crm/activities');

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crm-sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('crm-sidebar-collapsed', JSON.stringify(newState));
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
        {/* Navigation Links - Flat list (no section headers) */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {crmNavigation.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* Activity Filters (shown when on Activities page) */}
        {isActivitiesPage && !isCollapsed && (
          <div className="px-3 py-3 border-t border-gray-200">
            <div className="space-y-3">
              {/* Activity Type Filter */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-500">Filter by Type</span>
                <div className="flex flex-wrap gap-1">
                  {activityFilters.map((filter) => {
                    const FilterIcon = filter.icon;
                    const isFilterActive = activeActivityFilter === filter.id;
                    return (
                      <Button
                        key={filter.id}
                        variant={isFilterActive ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn(
                          'h-7 text-xs',
                          isFilterActive && 'bg-primary/10 text-primary'
                        )}
                        onClick={() => setActiveActivityFilter(filter.id)}
                      >
                        {FilterIcon && <FilterIcon className="h-3 w-3 mr-1" />}
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Hide Completed Toggle */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-500">Hide Completed</span>
                <Switch
                  checked={hideCompleted}
                  onCheckedChange={setHideCompleted}
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
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white border-gray-200 text-gray-600 shadow-md hover:bg-gray-50 hover:text-gray-900 z-10"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}
