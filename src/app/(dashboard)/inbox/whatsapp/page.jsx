'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  User,
  Tag,
  FileText,
  Reply,
  Forward,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  Loader2,
  RefreshCw,
  X,
  Building2,
  MessageSquare,
  Users,
  Inbox,
  UserCheck,
  Clock3,
  BellOff,
  Pin,
  Share2,
  Settings,
  CheckCircle,
  UserPlus,
  Filter,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useResolveConversation,
  useInboxStats,
  useToggleStar,
  useArchiveConversation,
  useAssignConversation,
} from '@/hooks/use-inbox';
import { useSocket, useConversationSocket } from '@/context/socket-context';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';
import { MessageInput } from '@/components/inbox/message-input';
import { NotesPanel } from '@/components/inbox/notes-panel';
import { SnoozeDialog } from '@/components/inbox/snooze-dialog';
import { AssignButton } from '@/components/inbox/assign-dialog';
import { ConversationContextMenu } from '@/components/inbox/conversation-context-menu';
import { ContactPanel } from '@/components/inbox/contact-panel';
import { LinkifiedText } from '@/components/ui/linkified-text';

// WhatsApp icon component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Helper functions
function formatTimeAgo(dateStr) {
  if (!dateStr) return '-';
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch (e) {
    return '-';
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Message status icon
function MessageStatusIcon({ status }) {
  if (status === 'sent') return <Check className="h-3 w-3 text-gray-400" />;
  if (status === 'delivered') return <CheckCheck className="h-3 w-3 text-gray-400" />;
  if (status === 'read') return <CheckCheck className="h-3 w-3 text-blue-500" />;
  return <Clock className="h-3 w-3 text-gray-400" />;
}

// Message Bubble Component
function MessageBubble({ message, contactName }) {
  const isOutbound = message.direction === 'outbound';

  return (
    <div className={cn('flex gap-2 mb-3', isOutbound && 'flex-row-reverse')}>
      <div className={cn('flex flex-col gap-1 max-w-[70%]', isOutbound && 'items-end')}>
        {!isOutbound && (
          <span className="text-xs text-muted-foreground px-2">{contactName || 'Contact'}</span>
        )}
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isOutbound
              ? 'bg-[#d9fdd3] text-gray-900'
              : 'bg-white border border-gray-200 text-gray-900'
          )}
        >
          {message.mediaType === 'image' && (
            <div className="mb-2">
              <img
                src={message.mediaUrl}
                alt="Image"
                className="rounded-lg max-w-xs max-h-64 object-cover"
              />
            </div>
          )}
          {message.mediaType === 'video' && (
            <div className="mb-2">
              <video src={message.mediaUrl} controls className="rounded-lg max-w-xs max-h-64" />
            </div>
          )}
          {message.mediaType === 'audio' && (
            <div className="flex items-center gap-2 min-w-[200px]">
              <audio src={message.mediaUrl} controls className="w-full" />
            </div>
          )}
          {message.mediaType === 'document' && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-sm">{message.fileName || 'Document'}</span>
            </div>
          )}
          {message.content && (
            <LinkifiedText className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </LinkifiedText>
          )}
          <div
            className={cn(
              'flex items-center gap-1 mt-1',
              isOutbound ? 'justify-end' : 'justify-start'
            )}
          >
            <span className="text-[10px] text-gray-500">{formatTimeAgo(message.createdAt)}</span>
            {isOutbound && <MessageStatusIcon status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppInboxPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bucketFilter, setBucketFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [showSnoozeDialog, setShowSnoozeDialog] = useState(false);

  const messagesEndRef = useRef(null);

  // Fetch conversations (WhatsApp only)
  const conversationsQuery = useConversations({
    channel: 'whatsapp',
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
    bucket: bucketFilter,
  });

  // Fetch messages for selected conversation
  const messagesQuery = useMessages(selectedId);
  const messages = messagesQuery.data || [];

  // Fetch inbox stats
  const { data: inboxStatsData } = useInboxStats({ channel: 'whatsapp' });
  const inboxStats = inboxStatsData?.data || {};

  // Mutations
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const resolveConversationMutation = useResolveConversation();
  const toggleStarMutation = useToggleStar();
  const archiveConversationMutation = useArchiveConversation();

  const conversations = conversationsQuery.data?.data || [];
  const selectedConversation = conversations.find((c) => c.id === selectedId);

  // Socket connection
  useSocket();
  useConversationSocket(selectedId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Mark as read when conversation is opened
  useEffect(() => {
    if (selectedId && selectedConversation?.unreadCount > 0) {
      markAsReadMutation.mutate(selectedId);
    }
  }, [selectedId, selectedConversation?.unreadCount]);

  // Handle send message
  const handleSendMessage = async (content, attachments) => {
    if (!content && !attachments?.length) return;
    if (!selectedId) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedId,
        content,
        attachments,
      });
      setMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  // Update bucket filter
  const updateBucketFilter = (value) => {
    const newBucket = value === 'none' ? null : value;
    setBucketFilter(newBucket);
  };

  // Stats configuration
  const stats = [
    createStat('Open', inboxStats?.open || 0, Inbox, 'blue'),
    createStat('Assigned', inboxStats?.assigned || 0, UserCheck, 'green'),
    createStat('Unassigned', inboxStats?.unassigned || 0, Users, 'amber'),
    createStat('Resolved', inboxStats?.resolved || 0, CheckCircle, 'purple'),
  ];

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [],
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'my_chats', label: 'My Chats' },
        { id: 'unassigned', label: 'Unassigned' },
        { id: 'open', label: 'Open' },
        { id: 'resolved', label: 'Resolved' },
      ],
    },
  };

  // Empty state component
  const EmptyState = () => (
    <div className="p-12 text-center">
      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No conversations found</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery || statusFilter !== 'all'
          ? 'Try adjusting your filters'
          : 'Start a conversation to see it here'}
      </p>
    </div>
  );

  // Conversation Card Component
  const ConversationCard = ({ conv }) => {
    const initials =
      conv.contactName
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || '?';

    return (
      <ConversationContextMenu conversation={conv}>
        <button
          onClick={() => setSelectedId(conv.id)}
          className={cn(
            'w-full p-3 text-left transition-all rounded-xl mb-1',
            selectedId === conv.id ? 'bg-[#eeecff]' : 'hover:bg-slate-50'
          )}
        >
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">{initials}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm bg-[#25d366]">
                <WhatsAppIcon className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {conv.isStarred && (
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                  )}
                  <span className="font-medium text-sm truncate">{conv.contactName}</span>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatTimeAgo(conv.lastMessageAt)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] px-1.5 py-0 h-4',
                    conv.status === 'open' && 'border-blue-500/30 bg-blue-50 text-blue-700',
                    conv.status === 'pending' &&
                      'border-yellow-500/30 bg-yellow-50 text-yellow-700',
                    conv.status === 'resolved' && 'border-green-500/30 bg-green-50 text-green-700'
                  )}
                >
                  {conv.status === 'open'
                    ? 'Open'
                    : conv.status === 'pending'
                      ? 'Unread'
                      : 'Resolved'}
                </Badge>
                {conv.unreadCount > 0 && (
                  <Badge className="text-[10px] px-1.5 py-0 h-4 bg-primary">
                    {conv.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </button>
      </ConversationContextMenu>
    );
  };

  return (
    <>
      <UnifiedLayout
        hubId="inbox"
        pageTitle="WhatsApp Inbox"
        stats={stats}
        fixedMenu={{
          filters: (
            <div className="p-4 space-y-3">
              {/* Quick Filter Buttons */}
              <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={!bucketFilter ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 flex-1"
                        onClick={() => updateBucketFilter('none')}
                      >
                        <Inbox className={cn('h-4 w-4', !bucketFilter && 'text-white')} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">All Conversations</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={bucketFilter === 'my_chats' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 flex-1 relative"
                        onClick={() => updateBucketFilter('my_chats')}
                      >
                        <UserCheck
                          className={cn('h-4 w-4', bucketFilter === 'my_chats' && 'text-white')}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">My Chats</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={bucketFilter === 'unassigned' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 flex-1 relative"
                        onClick={() => updateBucketFilter('unassigned')}
                      >
                        <Users
                          className={cn('h-4 w-4', bucketFilter === 'unassigned' && 'text-white')}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Unassigned</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ),
          list: (
            <div className="space-y-2 p-4">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Conversations List */}
              {conversationsQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : conversations.length === 0 ? (
                <EmptyState />
              ) : (
                <AnimatePresence mode="popLayout">
                  {conversations.map((conv, index) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      layout
                    >
                      <ConversationCard conv={conv} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          ),
        }}
      >
        {/* Chat Detail View in Content Area */}
        {selectedConversation ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="shrink-0 bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {selectedConversation.contactName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold">{selectedConversation.contactName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.contactPhone}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            toggleStarMutation.mutate(selectedId, {
                              onSuccess: () => {
                                toast({
                                  title: selectedConversation.isStarred ? 'Unstarred' : 'Starred',
                                  description: `Conversation ${selectedConversation.isStarred ? 'removed from' : 'added to'} starred`,
                                });
                              },
                            });
                          }}
                        >
                          <Star
                            className={cn(
                              'h-4 w-4',
                              selectedConversation.isStarred && 'fill-yellow-400 text-yellow-400'
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {selectedConversation.isStarred ? 'Unstar' : 'Star'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setShowSnoozeDialog(true)}
                        >
                          <Clock3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Snooze</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {selectedConversation.status !== 'resolved' && (
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              resolveConversationMutation.mutate(
                                { conversationId: selectedId, force: true },
                                {
                                  onSuccess: () => {
                                    toast({
                                      title: 'Resolved',
                                      description: 'Conversation marked as resolved',
                                    });
                                  },
                                }
                              );
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mark Resolved</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            archiveConversationMutation.mutate(selectedId, {
                              onSuccess: () => {
                                toast({
                                  title: 'Archived',
                                  description: 'Conversation has been archived',
                                });
                                setSelectedId(null);
                              },
                            });
                          }}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Archive</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <AssignButton
                    conversationId={selectedId}
                    currentTeamId={selectedConversation.assignedToTeamId}
                    currentTeamName={selectedConversation.assignedToTeam?.name}
                    variant="ghost"
                    size="sm"
                    className="h-8"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowContactPanel(!showContactPanel)}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#efeae2]">
              {messagesQuery.isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No messages yet</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      contactName={selectedConversation.contactName}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="shrink-0 bg-white border-t p-4">
              <MessageInput
                conversationId={selectedId}
                channelType="whatsapp"
                onSend={handleSendMessage}
                placeholder="Type a message..."
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}

        {/* Contact Panel */}
        {showContactPanel && selectedConversation && (
          <ContactPanel
            conversation={selectedConversation}
            onClose={() => setShowContactPanel(false)}
          />
        )}
      </UnifiedLayout>

      {/* Snooze Dialog */}
      <SnoozeDialog
        open={showSnoozeDialog}
        onOpenChange={setShowSnoozeDialog}
        conversationId={selectedId}
      />
    </>
  );
}
