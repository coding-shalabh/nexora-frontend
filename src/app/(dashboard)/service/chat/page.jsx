'use client';

import { useState, useMemo } from 'react';
import {
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Archive,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useResolveConversation,
} from '@/hooks/use-conversations';

export default function LiveChatPage() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations - filter by status to get active chats
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations({
    status: 'open',
  });

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: messagesLoading } = useMessages(selectedChatId);

  const sendMessage = useSendMessage();
  const resolveConversation = useResolveConversation();

  const conversations = conversationsData?.data || [];
  const messages = messagesData?.data || [];

  // Find the selected chat
  const selectedChat = useMemo(() => {
    return conversations.find((c) => c.id === selectedChatId);
  }, [conversations, selectedChatId]);

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.contact?.name?.toLowerCase().includes(query) ||
        c.contact?.email?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  // Calculate stats
  const activeChats = conversations.filter((c) => c.status === 'OPEN').length;
  const waitingChats = conversations.filter((c) => !c.assignedToId && c.status === 'OPEN').length;
  const resolvedToday = 0; // Would need a separate API call for this

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChatId) return;

    await sendMessage.mutateAsync({
      conversationId: selectedChatId,
      content: messageInput,
      type: 'text',
    });
    setMessageInput('');
  };

  const handleResolve = async () => {
    if (!selectedChatId) return;
    await resolveConversation.mutateAsync(selectedChatId);
    setSelectedChatId(null);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Chat</h1>
          <p className="text-muted-foreground">Real-time customer support conversations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Active Chats</div>
              <div className="text-2xl font-bold">{activeChats}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Waiting</div>
              <div className="text-2xl font-bold">{waitingChats}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Resolved Today</div>
              <div className="text-2xl font-bold">{resolvedToday}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Conversations</div>
              <div className="text-2xl font-bold">{conversations.length}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <ScrollArea className="h-[500px]">
            {conversationsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No active conversations</p>
              </div>
            ) : (
              <div className="p-3 space-y-1">
                {filteredConversations.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer transition-colors',
                      selectedChatId === chat.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getInitials(chat.contact?.name || chat.contact?.phone)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {chat.contact?.name || chat.contact?.phone || 'Unknown'}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(chat.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {chat.subject || 'No subject'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              chat.status === 'OPEN'
                                ? 'default'
                                : chat.status === 'RESOLVED'
                                  ? 'outline'
                                  : 'secondary'
                            }
                            className="text-xs"
                          >
                            {chat.status?.toLowerCase()}
                          </Badge>
                          {chat.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(selectedChat.contact?.name || selectedChat.contact?.phone)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {selectedChat.contact?.name || selectedChat.contact?.phone || 'Unknown'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.contact?.email || selectedChat.channel?.name || 'No email'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleResolve}>
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Separator />

              {/* Messages */}
              <ScrollArea className="h-[400px] p-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          message.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.direction === 'INBOUND' && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(selectedChat.contact?.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-[70%] rounded-lg px-4 py-2',
                            message.direction === 'OUTBOUND'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p className="text-sm">{message.content || message.textContent}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={sendMessage.isPending}>
                    {sendMessage.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
