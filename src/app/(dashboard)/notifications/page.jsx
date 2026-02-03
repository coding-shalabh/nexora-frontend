'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Clock,
  MessageSquare,
  DollarSign,
  AlertCircle,
  User,
  Building2,
  Calendar,
  Settings,
  Archive,
  MoreHorizontal,
  Shield,
  CreditCard,
  Megaphone,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/hooks/use-notifications';

// Notification types config - maps to NotificationType enum from database
const NOTIFICATION_TYPES = {
  // Database enum types
  MESSAGE: { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  CONVERSATION: { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  MENTION: { icon: User, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  TASK: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  DEAL: { icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
  LEAD: { icon: User, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  CAMPAIGN: { icon: Megaphone, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  SYSTEM: { icon: Bell, color: 'text-gray-500', bg: 'bg-gray-500/10' },
  SECURITY: { icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
  BILLING: { icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  // Legacy lowercase types for backwards compatibility
  deal: { icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
  task: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  message: { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  alert: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  contact: { icon: User, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  company: { icon: Building2, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  meeting: { icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
  system: { icon: Bell, color: 'text-gray-500', bg: 'bg-gray-500/10' },
};

// Map notification type to filter value for backwards compatibility
const typeToFilterMap = {
  MESSAGE: 'message',
  CONVERSATION: 'message',
  MENTION: 'contact',
  TASK: 'task',
  DEAL: 'deal',
  LEAD: 'contact',
  CAMPAIGN: 'system',
  SYSTEM: 'system',
  SECURITY: 'alert',
  BILLING: 'system',
};

// Format time ago
function formatTimeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const d = new Date(date);
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

// Get link from notification data
function getNotificationLink(notification) {
  // Check if link is directly in data
  if (notification.data?.link) return notification.data.link;

  // Generate link based on type and entityId
  const entityId = notification.data?.entityId;
  const type = notification.type;

  // If we have an entityId, generate specific link
  if (entityId) {
    switch (type) {
      case 'MESSAGE':
      case 'CONVERSATION':
        return `/inbox?conversationId=${entityId}`;
      case 'TASK':
        return `/tasks?taskId=${entityId}`;
      case 'DEAL':
        return `/pipeline/deals/${entityId}`;
      case 'LEAD':
      case 'MENTION':
        return `/crm/contacts/${entityId}`;
      case 'CAMPAIGN':
        return `/campaigns/${entityId}`;
    }
  }

  // Fallback to module pages based on type (even without entityId)
  switch (type) {
    case 'MESSAGE':
    case 'CONVERSATION':
      return '/inbox';
    case 'TASK':
      return '/tasks';
    case 'DEAL':
      return '/pipeline/deals';
    case 'LEAD':
    case 'MENTION':
      return '/crm/contacts';
    case 'CAMPAIGN':
      return '/marketing/campaigns';
    case 'BILLING':
      return '/billing/invoices';
    case 'SECURITY':
      return '/settings/security';
    case 'SYSTEM':
      return '/home';
    default:
      return '/home';
  }
}

export default function NotificationsPage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Fetch notifications from API
  const { notifications, unreadCount, isLoading, refetch } = useNotifications({ limit: 100 });

  // Mutations
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    if (typeFilter !== 'all') {
      const mappedType = typeToFilterMap[notification.type] || notification.type?.toLowerCase();
      if (mappedType !== typeFilter) return false;
    }
    return true;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt);
    const dateString = date.toDateString();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let label = dateString;
    if (dateString === today) label = 'Today';
    else if (dateString === yesterday) label = 'Yesterday';
    else
      label = date.toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });

    if (!groups[label]) groups[label] = [];
    groups[label].push(notification);
    return groups;
  }, {});

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markReadMutation.mutate(notification.id);
    }
    // Navigate to link
    const link = getNotificationLink(notification);
    if (link && link !== '#') {
      router.push(link);
    }
  };

  const markAsRead = (id) => {
    markReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const handleDeleteNotification = (id) => {
    deleteMutation.mutate(id);
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const deleteSelected = () => {
    selectedIds.forEach((id) => deleteMutation.mutate(id));
    setSelectedIds([]);
  };

  const markSelectedAsRead = () => {
    selectedIds.forEach((id) => markReadMutation.mutate(id));
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Bell className="h-7 w-7" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">Stay updated with your CRM activities</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Bell className="h-7 w-7" />
            Notifications
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount} new</Badge>}
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with your CRM activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings/notifications">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Tabs value={filter} onValueChange={setFilter} className="w-auto">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-sm">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
                <TabsTrigger value="read" className="text-sm">
                  Read
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="deal">Deals</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="contact">Contacts</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>
                <Button variant="outline" size="sm" onClick={markSelectedAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteSelected}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{filteredNotifications.length} notifications</CardTitle>
            <Checkbox
              checked={
                selectedIds.length === filteredNotifications.length &&
                filteredNotifications.length > 0
              }
              onCheckedChange={selectAll}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : 'No notifications match your filters'}
              </p>
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <div className="px-4 py-2 bg-muted/50 text-sm font-medium text-muted-foreground sticky top-0">
                  {dateLabel}
                </div>
                {items.map((notification, index) => {
                  const config = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.system;
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={cn(
                        'flex items-start gap-4 p-4 border-b last:border-0 hover:bg-muted/30 transition-colors',
                        !notification.read && 'bg-primary/5'
                      )}
                    >
                      <Checkbox
                        checked={selectedIds.includes(notification.id)}
                        onCheckedChange={() => toggleSelect(notification.id)}
                        className="mt-1"
                      />
                      <div className={cn('p-2 rounded-full', config.bg)}>
                        <Icon className={cn('h-4 w-4', config.color)} />
                      </div>
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.read && (
                            <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                              <Check className="h-4 w-4 mr-2" />
                              Mark as read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  );
                })}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
