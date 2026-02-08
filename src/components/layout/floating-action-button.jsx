'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  LayoutGrid,
  Plus,
  X,
  MessageSquare,
  Users,
  Building2,
  DollarSign,
  Calendar,
  Ticket,
  FileText,
  TrendingUp,
  Megaphone,
  HeadphonesIcon,
  ShoppingCart,
  FolderKanban,
  BarChart3,
  Workflow,
  Settings,
  Inbox,
  UserCog,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Quick create items - updated paths for merged hubs
const quickCreateItems = [
  { label: 'Contact', href: '/crm/contacts/new', icon: Users, color: 'from-blue-500 to-cyan-500' },
  {
    label: 'Company',
    href: '/crm/companies/new',
    icon: Building2,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    label: 'Deal',
    href: '/sales/deals/new',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Ticket',
    href: '/service/tickets/new',
    icon: Ticket,
    color: 'from-orange-500 to-red-500',
  },
  { label: 'Task', href: '/tasks/new', icon: FileText, color: 'from-amber-500 to-orange-500' },
  { label: 'Meeting', href: '/calendar/new', icon: Calendar, color: 'from-pink-500 to-rose-500' },
];

// Hub navigation items - all hubs with consistent blue branding
// NOTE: Pipeline merged into Sales, Tickets merged into Service
const hubItems = [
  { label: 'Inbox', href: '/inbox', icon: Inbox },
  { label: 'CRM', href: '/crm/contacts', icon: Users },
  { label: 'Sales', href: '/sales/deals', icon: TrendingUp },
  { label: 'Marketing', href: '/marketing/campaigns', icon: Megaphone },
  { label: 'Service', href: '/service/tickets', icon: HeadphonesIcon },
  { label: 'Commerce', href: '/commerce/orders', icon: ShoppingCart },
  { label: 'HR', href: '/hr/employees', icon: UserCog },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Analytics', href: '/analytics/dashboards', icon: BarChart3 },
  { label: 'Automation', href: '/automation/workflows', icon: Workflow },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'ai', 'hubs', 'add'

  const toggleMenu = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
      setIsOpen(false);
    } else {
      setActiveMenu(menu);
      setIsOpen(true);
    }
  };

  const closeAll = () => {
    setActiveMenu(null);
    setIsOpen(false);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Expanded Menu Items */}
        <AnimatePresence>
          {activeMenu === 'add' && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex flex-col gap-2 mb-2"
            >
              {quickCreateItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={closeAll}
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-full shadow-lg',
                          'bg-gradient-to-br text-white transition-transform hover:scale-110',
                          item.color
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-gray-900 text-white border-0">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeMenu === 'hubs' && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex flex-col gap-2 mb-2 items-end"
            >
              {hubItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeAll}
                    className="group flex items-center gap-2"
                  >
                    {/* Text pill - appears on left on hover */}
                    <span className="px-3 py-1.5 rounded-full bg-white text-brand text-sm font-medium whitespace-nowrap opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-200 shadow-lg">
                      {item.label}
                    </span>
                    {/* Icon circle - always visible */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                      <item.icon className="h-5 w-5 text-brand" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeMenu === 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="mb-2"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 w-72 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Nexora AI</h4>
                    <p className="text-xs text-muted-foreground">Your AI assistant</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Ask a question
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    Summarize contacts
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    Analyze deals
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Container */}
        <motion.div
          layout
          className="flex items-center gap-1 p-1.5 rounded-full shadow-2xl bg-brand"
          style={{
            boxShadow:
              '0 10px 40px -10px rgba(var(--brand-color-rgb), 0.5), 0 4px 20px -5px rgba(var(--brand-color-rgb), 0.4)',
          }}
        >
          {/* AI Chat Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleMenu('ai')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full transition-all',
                  activeMenu === 'ai'
                    ? 'bg-white text-brand'
                    : 'bg-white/10 text-white hover:bg-white/20'
                )}
              >
                <Sparkles className="h-5 w-5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 text-white border-0">
              AI Assistant
            </TooltipContent>
          </Tooltip>

          {/* Hubs Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleMenu('hubs')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full transition-all',
                  activeMenu === 'hubs'
                    ? 'bg-white text-brand'
                    : 'bg-white/10 text-white hover:bg-white/20'
                )}
              >
                <LayoutGrid className="h-5 w-5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 text-white border-0">
              All Hubs
            </TooltipContent>
          </Tooltip>

          {/* Add Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleMenu('add')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full transition-all',
                  activeMenu === 'add'
                    ? 'bg-white text-brand'
                    : 'bg-white/10 text-white hover:bg-white/20'
                )}
              >
                <motion.div
                  animate={{ rotate: activeMenu === 'add' ? 45 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Plus className="h-5 w-5" />
                </motion.div>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 text-white border-0">
              Quick Create
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Backdrop with blur for closing */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[-1] bg-black/20"
              onClick={closeAll}
            />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
