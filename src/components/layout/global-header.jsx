'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Command,
  Sun,
  Moon,
  Users,
  Ticket,
  FileText,
  Sparkles,
  ExternalLink,
  Loader2,
  User,
  Building2,
  DollarSign,
  Clock,
  MessageSquare,
  BookOpen,
  Megaphone,
  Calendar,
  Home,
  Inbox,
  CheckSquare,
  FolderOpen,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUpdateAgentStatus } from '@/hooks/use-inbox-agent';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/use-notifications';
import { HubSwitcher } from '@/components/layout/hub-switcher';

// Notification type to icon and color mapping
const notificationTypeConfig = {
  MESSAGE: { icon: MessageSquare, color: 'text-blue-500' },
  CONVERSATION: { icon: Inbox, color: 'text-blue-500' },
  MENTION: { icon: MessageSquare, color: 'text-purple-500' },
  TASK: { icon: Clock, color: 'text-orange-500' },
  DEAL: { icon: DollarSign, color: 'text-green-500' },
  LEAD: { icon: Users, color: 'text-cyan-500' },
  CAMPAIGN: { icon: Megaphone, color: 'text-pink-500' },
  SYSTEM: { icon: Bell, color: 'text-gray-500' },
  SECURITY: { icon: Bell, color: 'text-red-500' },
  BILLING: { icon: DollarSign, color: 'text-yellow-500' },
  TEAM: { icon: Users, color: 'text-primary' },
};

// Format time ago
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

// Core Layer navigation items (always accessible)
const coreNavItems = [
  { id: 'home', label: 'Home', href: '/dashboard', icon: Home },
  { id: 'inbox', label: 'Inbox', href: '/inbox', icon: Inbox, badge: 3 },
  { id: 'calendar', label: 'Calendar', href: '/calendar', icon: Calendar },
  { id: 'tasks', label: 'Tasks', href: '/tasks', icon: CheckSquare, badge: 5 },
  { id: 'files', label: 'Files', href: '/files', icon: FolderOpen },
];

// Search suggestions - updated for merged hub structure
const searchSuggestions = [
  { type: 'contact', label: 'Search Contacts', href: '/crm/contacts', icon: Users },
  { type: 'company', label: 'Search Companies', href: '/crm/companies', icon: Building2 },
  { type: 'deal', label: 'Search Deals', href: '/sales/deals', icon: DollarSign },
  { type: 'ticket', label: 'Search Tickets', href: '/service/tickets', icon: Ticket },
];

export function GlobalHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);

  // Real notifications from API
  const { notifications, unreadCount } = useNotifications({ limit: 10 });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  // Agent status
  const updateAgentStatus = useUpdateAgentStatus();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load agent status from localStorage
    const savedStatus = localStorage.getItem('agent-online-status');
    if (savedStatus !== null) {
      setIsOnline(JSON.parse(savedStatus));
    }
  }, []);

  const handleStatusToggle = async (newStatus) => {
    setIsOnline(newStatus);
    localStorage.setItem('agent-online-status', JSON.stringify(newStatus));
    try {
      await updateAgentStatus.mutateAsync({ isOnline: newStatus });
    } catch (error) {
      console.error('Failed to update agent status:', error);
    }
  };

  // Global keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // unreadCount comes from useNotifications hook

  const markAsRead = (id) => {
    markReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
  };

  const getTenantName = () => {
    if (!user?.tenant) return 'My Company';
    return user.tenant.name || 'My Company';
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 flex h-16 items-center justify-between px-2"
        style={{
          background: 'transparent',
        }}
      >
        {/* Left Section: Logo and Search */}
        <div className="flex items-center">
          {/* Nexora Logo */}
          <Link href="/dashboard" className="flex items-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Image
                src="/logo.png"
                alt="Nexora"
                width={120}
                height={32}
                priority
                style={{ width: 'auto', height: 'auto' }}
              />
            </motion.div>
          </Link>

          {/* Vertical Separator */}
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-3" />

          {/* Customer Logo */}
          <div className="flex items-center">
            {user?.tenant?.logo ? (
              // Use regular img for SVG files, Next.js Image for others
              user.tenant.logo.toLowerCase().endsWith('.svg') ? (
                <img
                  src={user.tenant.logo}
                  alt={user.tenant.name || 'Company'}
                  className="h-8 w-auto object-contain max-w-[120px]"
                />
              ) : (
                <Image
                  src={user.tenant.logo}
                  alt={user.tenant.name || 'Company'}
                  width={120}
                  height={32}
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto', maxWidth: '120px', maxHeight: '32px' }}
                  unoptimized={
                    user.tenant.logo.includes('data:') || user.tenant.logo.includes('.svg')
                  }
                />
              )
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.tenant?.name || 'My Company'}
              </span>
            )}
          </div>

          {/* Vertical Separator */}
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-3" />

          {/* Hub Switcher */}
          <HubSwitcher />

          {/* Search Bar - aligned with HubLayout stats bar left edge */}
          <div className="relative hidden md:block ml-[52px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 h-9 w-[400px] bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:bg-white dark:focus:bg-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
          </div>
        </div>

        {/* Right Section: Nav + Search + Actions */}
        <div className="flex items-center gap-2">
          {/* Core Layer Navigation - Collapsible */}
          <TooltipProvider delayDuration={500} skipDelayDuration={0}>
            <nav className="hidden md:flex items-center">
              {/* Expand/Collapse Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNavExpanded(!navExpanded)}
                className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                aria-label={navExpanded ? 'Collapse navigation' : 'Expand navigation'}
              >
                {navExpanded ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>

              <motion.div
                className="flex items-center gap-0.5 overflow-hidden"
                initial={false}
                animate={{ width: navExpanded ? 'auto' : 'auto' }}
              >
                {coreNavItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <motion.div
                            initial={false}
                            animate={{
                              paddingLeft: navExpanded ? 10 : 8,
                              paddingRight: navExpanded ? 10 : 8,
                              gap: navExpanded ? 6 : 0,
                            }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className={cn(
                              'relative flex items-center h-8 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 cursor-pointer'
                            )}
                          >
                            <ItemIcon className="h-4 w-4 shrink-0" />
                            <AnimatePresence mode="wait">
                              {navExpanded && (
                                <motion.span
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: 'auto' }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                                  className="text-sm whitespace-nowrap overflow-hidden pl-1.5"
                                >
                                  {item.label}
                                </motion.span>
                              )}
                            </AnimatePresence>
                            {item.badge && (
                              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium text-white bg-brand">
                                {item.badge}
                              </span>
                            )}
                          </motion.div>
                        </Link>
                      </TooltipTrigger>
                      {!navExpanded && <TooltipContent side="bottom">{item.label}</TooltipContent>}
                    </Tooltip>
                  );
                })}
              </motion.div>
            </nav>
          </TooltipProvider>

          {/* Vertical Separator */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden md:block" />

          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 md:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h4 className="font-medium text-sm">Notifications</h4>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const config =
                      notificationTypeConfig[notification.type] || notificationTypeConfig.SYSTEM;
                    const NotificationIcon = config.icon;
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer',
                          !notification.read && 'bg-primary/5'
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className={cn('p-1.5 rounded-full bg-muted', config.color)}>
                          <NotificationIcon className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full h-8 text-xs" asChild>
                  <Link href="/notifications">View all</Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Settings */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                  asChild
                  aria-label="Settings"
                >
                  <Link href="/settings/organization">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-white/50 dark:hover:bg-white/10"
                aria-label="User menu"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-gray-200 dark:ring-gray-700 bg-brand">
                  <span className="text-xs font-medium text-white">{getUserInitials()}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2 border-b mb-1">
                <p className="font-medium text-sm">{getUserDisplayName()}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>

              {/* Online/Offline Status Toggle */}
              <div className="px-2 py-2 border-b mb-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle
                      className={cn(
                        'h-2.5 w-2.5',
                        isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-300 text-gray-300'
                      )}
                    />
                    <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                  <Switch
                    checked={isOnline}
                    onCheckedChange={handleStatusToggle}
                    className="scale-75"
                  />
                </div>
              </div>

              <DropdownMenuItem asChild>
                <Link href="/settings/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/organization" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {mounted && (
                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-red-600 focus:text-red-600"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-2xl p-0">
          <div className="p-4 border-b">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  type="search"
                  placeholder="Search contacts, companies, deals, tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-12 text-lg border-0 focus-visible:ring-0"
                />
              </div>
            </form>
          </div>
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-3 py-2">Quick Links</div>
            {searchSuggestions.map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  router.push(
                    searchQuery ? `${item.href}?q=${encodeURIComponent(searchQuery)}` : item.href
                  );
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span>{item.label}</span>
                {searchQuery && (
                  <span className="text-muted-foreground ml-auto">for "{searchQuery}"</span>
                )}
              </button>
            ))}
            <Separator className="my-2" />
            <button
              onClick={() => {
                router.push('/help');
                setSearchOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
            >
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>Browse Knowledge Base</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
            </button>
          </div>
          <div className="p-3 border-t bg-muted/30 text-xs text-muted-foreground flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border">↵</kbd> search
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border">esc</kbd> close
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
