'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Search,
  MessageSquare,
  Send,
  Reply,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  Loader2,
  RefreshCw,
  X,
  User,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Inbox as InboxIcon,
  ArrowLeft,
  Download,
  ExternalLink,
  Filter,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useToggleStar,
  useArchiveConversation,
} from '@/hooks/use-inbox';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { ContactPanel } from '@/components/inbox/contact-panel';
import { LinkifiedText } from '@/components/ui/linkified-text';

// SMS status badges
function SMSStatusBadge({ status }) {
  const statusConfig = {
    unread: { icon: MessageSquare, color: 'bg-blue-100 text-blue-700', label: 'Unread' },
    read: { icon: CheckCircle, color: 'bg-gray-100 text-gray-700', label: 'Read' },
    replied: { icon: Reply, color: 'bg-green-100 text-green-700', label: 'Replied' },
    archived: { icon: Archive, color: 'bg-purple-100 text-purple-700', label: 'Archived' },
  };

  const config = statusConfig[status] || statusConfig.unread;
  const Icon = config.icon;

  return (
    <Badge className={cn('gap-1 text-[10px]', config.color)}>
      <Icon className="h-2.5 w-2.5" />
      {config.label}
    </Badge>
  );
}

// SMS conversation item
function SMSConversationItem({ conversation, isSelected, onClick }) {
  const isUnread = !conversation.lastReadAt;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'w-full p-4 text-left transition-all rounded-xl mx-2 mb-2 cursor-pointer border',
        isSelected
          ? 'bg-[#800020]/5 ring-2 ring-[#800020]/20 shadow-sm border-[#800020]/20'
          : 'hover:bg-muted/50 border-transparent'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-[#800020]/10'
          )}
        >
          {conversation.contact?.avatar ? (
            <img
              src={conversation.contact.avatar}
              alt={conversation.contactName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <MessageSquare className="h-5 w-5 text-[#800020]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span
                className={cn(
                  'text-sm truncate',
                  isUnread ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
                )}
              >
                {conversation.contactName || conversation.contactPhone || 'Unknown'}
              </span>
              {conversation.isStarred && (
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
            </span>
          </div>

          {/* Phone Number */}
          <div className="mb-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {conversation.contactPhone || 'No phone'}
            </span>
          </div>

          {/* Preview */}
          <div className="mb-2">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {conversation.lastMessagePreview || 'No preview available'}
            </p>
          </div>

          {/* Footer Row */}
          <div className="flex items-center gap-2">
            {isUnread && <SMSStatusBadge status="unread" />}
            {conversation.tags?.length > 0 && (
              <Badge variant="outline" className="gap-1 text-[10px]">
                <Tag className="h-2.5 w-2.5" />
                {conversation.tags[0]}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// SMS message bubble
function SMSMessageBubble({ message }) {
  const isOutbound = message.direction === 'outbound';

  return (
    <div className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
          isOutbound ? 'bg-[#800020] text-white' : 'bg-white border'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-current/10">
          <User className="h-3 w-3 opacity-70" />
          <span className="text-xs font-medium opacity-90">
            {isOutbound ? 'You' : message.senderName || 'Customer'}
          </span>
          <span className="text-[10px] opacity-60 ml-auto">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Body */}
        <div className="text-sm">
          <LinkifiedText text={message.body} className={isOutbound ? 'text-white' : ''} />
        </div>

        {/* Footer Info */}
        <div className="mt-2 pt-2 border-t border-current/10 flex items-center gap-2 text-[10px] opacity-60">
          {message.deliveryStatus === 'delivered' && (
            <span className="flex items-center gap-1">
              <CheckCircle className="h-2.5 w-2.5" />
              Delivered
            </span>
          )}
          {message.deliveryStatus === 'read' && (
            <span className="flex items-center gap-1">
              <CheckCircle className="h-2.5 w-2.5" />
              Read
            </span>
          )}
          {message.deliveryStatus === 'failed' && (
            <span className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-2.5 w-2.5" />
              Failed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SMSInboxPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // Fetch SMS conversations only
  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useConversations({
    channelType: 'sms', // Filter for SMS only
    purpose: selectedFilter === 'all' ? undefined : selectedFilter,
    search: searchQuery,
  });

  const conversations = conversationsData?.data || [];

  // Fetch messages for selected conversation
  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useMessages(selectedConversation?.id, {
    enabled: !!selectedConversation?.id,
  });

  const messages = messagesData?.data || [];

  // Mutations
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const toggleStar = useToggleStar();
  const archiveConversation = useArchiveConversation();

  // Stats
  const stats = useMemo(() => {
    const total = conversations.length;
    const unread = conversations.filter((c) => !c.lastReadAt).length;
    const starred = conversations.filter((c) => c.isStarred).length;
    const archived = conversations.filter((c) => c.purpose === 'archived').length;

    return {
      total,
      unread,
      starred,
      archived,
    };
  }, [conversations]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'unread') return !conv.lastReadAt;
      if (selectedFilter === 'starred') return conv.isStarred;
      return conv.purpose === selectedFilter;
    });
  }, [conversations, selectedFilter]);

  // Handlers
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (!conversation.lastReadAt) {
      markAsRead.mutate(conversation.id);
    }
  };

  const handleSendSMS = async () => {
    if (!selectedConversation || !messageInput.trim()) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: selectedConversation.id,
        body: messageInput.trim(),
      });
      setMessageInput('');
      toast({ title: 'SMS sent successfully' });
      refetchMessages();
    } catch (error) {
      toast({
        title: 'Failed to send SMS',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleStar = (conversation) => {
    toggleStar.mutate(conversation.id);
  };

  const handleArchive = (conversation) => {
    archiveConversation.mutate(conversation.id, {
      onSuccess: () => {
        toast({ title: 'SMS archived' });
        setSelectedConversation(null);
        refetchConversations();
      },
    });
  };

  // Layout stats
  const layoutStats = useMemo(
    () => [
      createStat('Total', stats.total, InboxIcon, 'blue'),
      createStat('Unread', stats.unread, MessageSquare, 'red'),
      createStat('Starred', stats.starred, Star, 'amber'),
      createStat('Archived', stats.archived, Archive, 'purple'),
    ],
    [stats]
  );

  // Action buttons
  const actionButtons = (
    <>
      <Button size="sm" variant="outline" onClick={() => refetchConversations()}>
        <RefreshCw className={cn('h-4 w-4 mr-2', conversationsLoading && 'animate-spin')} />
        Refresh
      </Button>
    </>
  );

  // Fixed menu filters
  const fixedMenuFilters = (
    <div className="px-4 py-3 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search SMS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Filter dropdown */}
      <Select value={selectedFilter} onValueChange={setSelectedFilter}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Messages</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="starred">Starred</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // Fixed menu list
  const fixedMenuList = (
    <div className="flex-1 overflow-y-auto">
      {conversationsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-foreground">No SMS found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {searchQuery ? 'Try a different search' : 'Your SMS inbox is empty'}
          </p>
        </div>
      ) : (
        <div className="pb-2">
          {filteredConversations.map((conversation) => (
            <SMSConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              onClick={() => handleSelectConversation(conversation)}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Fixed menu footer
  const fixedMenuFooter = (
    <div className="text-xs text-muted-foreground text-center">
      {filteredConversations.length} {filteredConversations.length === 1 ? 'message' : 'messages'}
    </div>
  );

  // Main content area
  const mainContent = selectedConversation ? (
    <div className="flex flex-col h-full">
      {/* SMS header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#800020]/10 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-[#800020]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              {selectedConversation.contactName || selectedConversation.contactPhone}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {selectedConversation.contactPhone}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleToggleStar(selectedConversation)}>
            <Star
              className={cn(
                'h-4 w-4',
                selectedConversation.isStarred && 'fill-yellow-500 text-yellow-500'
              )}
            />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleArchive(selectedConversation)}>
            <Archive className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowContactPanel(!showContactPanel)}>
            <User className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messagesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium">No messages</p>
          </div>
        ) : (
          messages.map((message) => <SMSMessageBubble key={message.id} message={message} />)
        )}
      </div>

      {/* Message input */}
      <div className="px-6 py-4 border-t shrink-0">
        <div className="relative">
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendSMS();
              }
            }}
            className="pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              size="sm"
              className="h-7 px-3"
              onClick={handleSendSMS}
              disabled={!messageInput.trim() || sendMessage.isPending}
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Send className="h-3 w-3 mr-1" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
        {/* Character count */}
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {messageInput.length} / 160 characters
        </div>
      </div>

      {/* Contact panel overlay */}
      <AnimatePresence>
        {showContactPanel && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute right-0 top-0 h-full w-[400px] bg-white border-l shadow-xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold">Contact Details</h3>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => setShowContactPanel(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <ContactPanel contactId={selectedConversation.contactId} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
      <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
      <h3 className="font-medium text-lg">No SMS Selected</h3>
      <p className="text-sm mt-1">Choose a conversation from the list to view</p>
    </div>
  );

  return (
    <UnifiedLayout
      hubId="inbox"
      pageTitle="SMS Inbox"
      stats={layoutStats}
      actions={actionButtons}
      fixedMenu={{
        filters: fixedMenuFilters,
        list: fixedMenuList,
        footer: fixedMenuFooter,
        width: '360px',
      }}
    >
      {mainContent}
    </UnifiedLayout>
  );
}
