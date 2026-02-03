'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  ChevronDown,
  Command,
  Sparkles,
  Sun,
  Moon,
  Settings,
  HelpCircle,
  User,
  Building2,
  Ticket,
  Users,
  LogOut,
  Clock,
  MessageSquare,
  DollarSign,
  AlertCircle,
  BookOpen,
  ExternalLink,
  Home,
  Inbox,
  Calendar,
  CheckSquare,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/use-notifications';

// Core Layer navigation items (always accessible)
const coreNavItems = [
  { id: 'home', label: 'Home', href: '/dashboard', icon: Home },
  { id: 'inbox', label: 'Inbox', href: '/inbox', icon: Inbox, badge: 3 },
  { id: 'calendar', label: 'Calendar', href: '/calendar', icon: Calendar },
  { id: 'tasks', label: 'Tasks', href: '/tasks', icon: CheckSquare, badge: 5 },
  { id: 'files', label: 'Files', href: '/files', icon: FolderOpen },
];

// Notification type to icon and color mapping
const notificationTypeConfig = {
  MESSAGE: { icon: MessageSquare, color: 'text-blue-500' },
  CONVERSATION: { icon: Inbox, color: 'text-blue-500' },
  MENTION: { icon: MessageSquare, color: 'text-purple-500' },
  TASK: { icon: Clock, color: 'text-orange-500' },
  DEAL: { icon: DollarSign, color: 'text-green-500' },
  LEAD: { icon: Users, color: 'text-cyan-500' },
  CAMPAIGN: { icon: Sparkles, color: 'text-pink-500' },
  SYSTEM: { icon: AlertCircle, color: 'text-gray-500' },
  SECURITY: { icon: AlertCircle, color: 'text-red-500' },
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

// Search suggestions
const searchSuggestions = [
  { type: 'contact', label: 'Search Contacts', href: '/crm/contacts', icon: Users },
  { type: 'company', label: 'Search Companies', href: '/crm/companies', icon: Building2 },
  { type: 'deal', label: 'Search Deals', href: '/pipeline/deals', icon: DollarSign },
  { type: 'ticket', label: 'Search Tickets', href: '/tickets', icon: Ticket },
];

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Real notifications from API
  const {
    notifications,
    unreadCount,
    isLoading: notificationsLoading,
  } = useNotifications({ limit: 10 });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const markAsRead = (id) => {
    markReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 sticky top-0 z-50"
      >
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Nexora"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Search Bar */}
          <motion.div
            className="relative w-80 cursor-pointer"
            onClick={() => setSearchOpen(true)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <div className="pl-10 pr-20 py-2 bg-muted/50 border border-transparent rounded-md text-sm text-muted-foreground">
              Search anything...
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground pointer-events-none">
              <kbd className="flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </motion.div>

          {/* Core Layer Navigation */}
          <nav className="flex items-center gap-0.5 border-l pl-4 ml-2">
            {coreNavItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link key={item.id} href={item.href}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative gap-1.5 px-2.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <ItemIcon className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* AI Assistant Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary"
              asChild
            >
              <Link href="/ai-assistant">
                <Sparkles className="h-4 w-4" />
                AI Assistant
              </Link>
            </Button>
          </motion.div>

          {/* Help */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/help">
                <HelpCircle className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Theme Toggle */}
          {mounted && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </motion.div>
              </Button>
            </motion.div>
          )}

          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-[10px] font-bold text-white shadow-lg"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold">Notifications</h4>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
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
                          'flex items-start gap-3 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer',
                          !notification.read && 'bg-primary/5'
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className={cn('p-2 rounded-full bg-muted', config.color)}>
                          <NotificationIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{notification.title}</p>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/notifications">View all notifications</Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Settings */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="sm" className="gap-2 border-border/50 bg-card/50">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-brand-900 to-brand-700 text-white">
                      {user?.firstName?.[0] || 'U'}
                      {user?.lastName?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium max-w-[100px] truncate">
                    {user?.firstName || 'User'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
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
          <div className="p-3 border-t bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded border">↵</kbd> to search
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded border">esc</kbd> to close
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
