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
  ChevronLeft,
  ChevronRight,
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

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveMenu(null);
    }
  };

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const closeAll = () => {
    setActiveMenu(null);
    setIsOpen(false);
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* Fixed right-side panel */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
        {/* Expandable Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-gray-900 rounded-l-3xl shadow-2xl border-l border-t border-b border-gray-200 dark:border-gray-700 overflow-hidden"
              style={{ width: '320px', maxHeight: '80vh' }}
            >
              {/* Panel Header */}
              <div className="bg-gradient-to-r from-brand to-brand/90 text-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">Quick Actions</h3>
                  <button
                    onClick={closeAll}
                    className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Menu Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleMenu('add')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      activeMenu === 'add'
                        ? 'bg-white text-brand'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    )}
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Create
                  </button>
                  <button
                    onClick={() => toggleMenu('hubs')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      activeMenu === 'hubs'
                        ? 'bg-white text-brand'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    )}
                  >
                    <LayoutGrid className="h-4 w-4 inline mr-1" />
                    Hubs
                  </button>
                  <button
                    onClick={() => toggleMenu('ai')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      activeMenu === 'ai'
                        ? 'bg-white text-brand'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    )}
                  >
                    <Sparkles className="h-4 w-4 inline mr-1" />
                    AI
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
                <AnimatePresence mode="wait">
                  {activeMenu === 'add' && (
                    <motion.div
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      {quickCreateItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeAll}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-xl transition-all',
                            'hover:shadow-md group bg-gradient-to-br',
                            item.color
                          )}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white">Create {item.label}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                        </Link>
                      ))}
                    </motion.div>
                  )}

                  {activeMenu === 'hubs' && (
                    <motion.div
                      key="hubs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      {hubItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeAll}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                            <item.icon className="h-5 w-5 text-brand" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.label}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand transition-colors" />
                        </Link>
                      ))}
                    </motion.div>
                  )}

                  {activeMenu === 'ai' && (
                    <motion.div
                      key="ai"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">Nexora AI</h4>
                          <p className="text-xs text-muted-foreground">Your AI assistant</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">Ask a question</span>
                        </button>
                        <button className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                          <FileText className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium">Summarize contacts</span>
                        </button>
                        <button className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-emerald-500" />
                          <span className="text-sm font-medium">Analyze deals</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {!activeMenu && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <LayoutGrid className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Select a tab above to get started</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Arrow Tab - Always visible, stuck to right edge */}
        <motion.button
          onClick={togglePanel}
          className={cn(
            'flex items-center justify-center rounded-l-xl shadow-lg transition-all',
            'bg-brand text-white hover:bg-brand/90',
            isOpen ? 'h-16 w-10' : 'h-20 w-12'
          )}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow:
              '0 10px 40px -10px rgba(var(--brand-color-rgb), 0.5), 0 4px 20px -5px rgba(var(--brand-color-rgb), 0.4)',
          }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {isOpen ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
          </motion.div>
        </motion.button>
      </div>

      {/* Backdrop with blur for closing */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={closeAll}
          />
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
