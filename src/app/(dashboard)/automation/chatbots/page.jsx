'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Plus,
  Bot,
  Trash2,
  Play,
  Pause,
  Settings,
  MessageSquare,
  Users,
  BarChart3,
  Zap,
  GitBranch,
  Clock,
  CheckCircle2,
  Copy,
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const chatbotsData = [
  {
    id: '1',
    name: 'Welcome Bot',
    description: 'Greets new visitors and collects basic information',
    status: 'active',
    triggerType: 'first_message',
    channels: ['whatsapp', 'sms'],
    stats: {
      conversations: 1245,
      handoffs: 89,
      resolutionRate: 93,
      avgResponseTime: '< 1s',
    },
    flows: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    lastModified: '2 days ago',
  },
  {
    id: '2',
    name: 'FAQ Assistant',
    description: 'Answers frequently asked questions using AI',
    status: 'active',
    triggerType: 'keyword',
    channels: ['whatsapp', 'email'],
    stats: {
      conversations: 3567,
      handoffs: 234,
      resolutionRate: 87,
      avgResponseTime: '1.2s',
    },
    flows: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
    lastModified: '5 hours ago',
  },
  {
    id: '3',
    name: 'Lead Qualifier',
    description: 'Qualifies leads and schedules appointments',
    status: 'active',
    triggerType: 'new_contact',
    channels: ['whatsapp'],
    stats: {
      conversations: 892,
      handoffs: 445,
      resolutionRate: 75,
      avgResponseTime: '1.5s',
    },
    flows: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    lastModified: '1 day ago',
  },
  {
    id: '4',
    name: 'Order Status Bot',
    description: 'Provides order tracking and delivery updates',
    status: 'paused',
    triggerType: 'keyword',
    channels: ['whatsapp', 'sms'],
    stats: {
      conversations: 2134,
      handoffs: 56,
      resolutionRate: 97,
      avgResponseTime: '0.8s',
    },
    flows: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    lastModified: '1 week ago',
  },
  {
    id: '5',
    name: 'After Hours Bot',
    description: 'Handles messages outside business hours',
    status: 'active',
    triggerType: 'schedule',
    channels: ['whatsapp', 'email', 'sms'],
    stats: {
      conversations: 567,
      handoffs: 123,
      resolutionRate: 82,
      avgResponseTime: '0.5s',
    },
    flows: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    lastModified: '3 days ago',
  },
];

const triggerTypes = {
  first_message: {
    label: 'First Message',
    icon: MessageSquare,
    color: 'bg-blue-100 text-blue-700',
  },
  keyword: { label: 'Keyword Match', icon: Zap, color: 'bg-purple-100 text-purple-700' },
  new_contact: { label: 'New Contact', icon: Users, color: 'bg-green-100 text-green-700' },
  schedule: { label: 'Schedule-based', icon: Clock, color: 'bg-orange-100 text-orange-700' },
};

function ChatbotPreview({ chatbot, onToggle, onDuplicate, onDelete }) {
  const trigger = triggerTypes[chatbot.triggerType];
  const TriggerIcon = trigger?.icon || Zap;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'h-12 w-12 rounded-lg flex items-center justify-center',
              chatbot.status === 'active' ? 'bg-primary/10' : 'bg-gray-100'
            )}
          >
            <Bot
              className={cn(
                'h-6 w-6',
                chatbot.status === 'active' ? 'text-primary' : 'text-gray-500'
              )}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{chatbot.name}</h3>
              <Badge
                className={cn(
                  chatbot.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {chatbot.status === 'active' ? 'Active' : 'Paused'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{chatbot.description}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onToggle}>
              {chatbot.status === 'active' ? (
                <>
                  <Pause className="h-4 w-4 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <MessageSquare className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{chatbot.stats.conversations.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Conversations</p>
          </Card>
          <Card className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{chatbot.stats.handoffs}</p>
            <p className="text-xs text-muted-foreground">Handoffs</p>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-green-600">{chatbot.stats.resolutionRate}%</p>
            <p className="text-xs text-muted-foreground">Resolution</p>
          </Card>
          <Card className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{chatbot.stats.avgResponseTime}</p>
            <p className="text-xs text-muted-foreground">Response</p>
          </Card>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Configuration</h4>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    trigger?.color?.split(' ')[0]
                  )}
                >
                  <TriggerIcon className={cn('h-5 w-5', trigger?.color?.split(' ')[1])} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trigger</p>
                  <p className="font-medium">{trigger?.label}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <GitBranch className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flows</p>
                  <p className="font-medium">{chatbot.flows} conversation flows</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Channels</h4>
          <div className="flex flex-wrap gap-2">
            {chatbot.channels.map((channel) => (
              <Badge key={channel} variant="outline" className="capitalize">
                {channel}
              </Badge>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Resolution Rate</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{chatbot.stats.resolutionRate}% resolved automatically</span>
              <span className="text-muted-foreground">{chatbot.stats.handoffs} handoffs</span>
            </div>
            <Progress value={chatbot.stats.resolutionRate} className="h-2" />
          </div>
        </div>

        {/* Metadata */}
        <div className="text-xs text-muted-foreground">Last modified: {chatbot.lastModified}</div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t shrink-0 flex gap-2">
        <Button variant="outline" className="flex-1">
          <Settings className="h-4 w-4 mr-2" />
          Edit Bot
        </Button>
        <Button className="flex-1">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  );
}

export default function ChatbotsPage() {
  const { toast } = useToast();
  const [chatbots, setChatbots] = useState(chatbotsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [triggerFilter, setTriggerFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingChatbot, setDeletingChatbot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and sort chatbots
  const filteredChatbots = useMemo(() => {
    let result = chatbots.filter((bot) => {
      if (statusFilter !== 'all' && bot.status !== statusFilter) return false;
      if (triggerFilter !== 'all' && bot.triggerType !== triggerFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          bot.name.toLowerCase().includes(query) || bot.description.toLowerCase().includes(query)
        );
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'conversations':
          return b.stats.conversations - a.stats.conversations;
        case 'resolution':
          return b.stats.resolutionRate - a.stats.resolutionRate;
        default:
          return 0;
      }
    });

    return result;
  }, [chatbots, statusFilter, triggerFilter, searchQuery, sortBy]);

  // Stats
  const stats = useMemo(
    () => ({
      total: chatbots.length,
      active: chatbots.filter((b) => b.status === 'active').length,
      paused: chatbots.filter((b) => b.status === 'paused').length,
      totalConversations: chatbots.reduce((sum, b) => sum + b.stats.conversations, 0),
    }),
    [chatbots]
  );

  const toggleChatbotStatus = (chatbot) => {
    setChatbots((prev) =>
      prev.map((bot) =>
        bot.id === chatbot.id
          ? { ...bot, status: bot.status === 'active' ? 'paused' : 'active' }
          : bot
      )
    );
    if (selectedChatbot?.id === chatbot.id) {
      setSelectedChatbot({
        ...selectedChatbot,
        status: chatbot.status === 'active' ? 'paused' : 'active',
      });
    }
    toast({
      title: chatbot.status === 'active' ? 'Chatbot Paused' : 'Chatbot Activated',
      description: `"${chatbot.name}" has been ${chatbot.status === 'active' ? 'paused' : 'activated'}.`,
    });
  };

  const handleDuplicate = (chatbot) => {
    const newChatbot = {
      ...chatbot,
      id: Date.now().toString(),
      name: `${chatbot.name} (Copy)`,
      status: 'paused',
      stats: { conversations: 0, handoffs: 0, resolutionRate: 0, avgResponseTime: '-' },
      createdAt: new Date(),
      lastModified: 'Just now',
    };
    setChatbots([newChatbot, ...chatbots]);
    toast({
      title: 'Chatbot Duplicated',
      description: `"${newChatbot.name}" has been created.`,
    });
  };

  const handleDelete = async () => {
    if (!deletingChatbot) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setChatbots(chatbots.filter((b) => b.id !== deletingChatbot.id));
    if (selectedChatbot?.id === deletingChatbot.id) {
      setSelectedChatbot(null);
      setViewMode('list');
    }
    setDeleteDialogOpen(false);
    setIsSubmitting(false);
    toast({
      title: 'Chatbot Deleted',
      description: `"${deletingChatbot.name}" has been deleted.`,
      variant: 'destructive',
    });
    setDeletingChatbot(null);
  };

  const openPreview = (chatbot) => {
    setSelectedChatbot(chatbot);
    setViewMode('preview');
  };

  const layoutStats = useMemo(
    () => [
      createStat('Total', stats.total, Bot, 'blue'),
      createStat('Active', stats.active, Play, 'green'),
      createStat('Paused', stats.paused, Pause, 'gray'),
      createStat(
        'Convos',
        `${(stats.totalConversations / 1000).toFixed(1)}k`,
        MessageSquare,
        'purple'
      ),
    ],
    [stats]
  );

  const actionButtons = (
    <Button size="sm">
      <Plus className="h-4 w-4 mr-2" />
      New Chatbot
    </Button>
  );

  const mainContent = (
    <div className="flex flex-1 gap-2 px-2 pb-2 overflow-hidden">
      {/* Left Panel - Chatbot List (320px) */}
      <aside className="relative flex flex-col shrink-0 rounded-3xl w-[320px] bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Chatbots</h2>
              <p className="text-xs text-muted-foreground mt-1">{filteredChatbots.length} bots</p>
            </div>
            <Button size="sm" className="h-8 w-8 p-0" title="Add new chatbot">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-4 py-2 border-b border-gray-100 shrink-0 grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-lg font-bold">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">{stats.active}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-500">{stats.paused}</p>
            <p className="text-[10px] text-muted-foreground">Paused</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">
              {(stats.totalConversations / 1000).toFixed(1)}k
            </p>
            <p className="text-[10px] text-muted-foreground">Convos</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-4 py-2 border-b border-gray-100 shrink-0">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="w-full h-8 bg-muted/50">
              <TabsTrigger value="all" className="flex-1 text-xs h-7">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="flex-1 text-xs h-7">
                <Play className="h-3 w-3 mr-1" />
                Active
              </TabsTrigger>
              <TabsTrigger value="paused" className="flex-1 text-xs h-7">
                <Pause className="h-3 w-3 mr-1" />
                Paused
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Trigger Filter + Sort */}
        <div className="px-4 py-2 border-b border-gray-100 shrink-0 flex gap-2">
          <Select value={triggerFilter} onValueChange={setTriggerFilter}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Trigger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Triggers
              </SelectItem>
              <SelectItem value="first_message" className="text-xs">
                First Message
              </SelectItem>
              <SelectItem value="keyword" className="text-xs">
                Keyword Match
              </SelectItem>
              <SelectItem value="new_contact" className="text-xs">
                New Contact
              </SelectItem>
              <SelectItem value="schedule" className="text-xs">
                Schedule
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 text-xs w-[100px]">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="text-xs">
                Newest
              </SelectItem>
              <SelectItem value="name" className="text-xs">
                Name
              </SelectItem>
              <SelectItem value="conversations" className="text-xs">
                Conversations
              </SelectItem>
              <SelectItem value="resolution" className="text-xs">
                Resolution
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chatbot List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChatbots.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No chatbots found</p>
              <p className="text-xs mt-1">Create your first chatbot</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredChatbots.map((chatbot) => {
                const isSelected = selectedChatbot?.id === chatbot.id && viewMode === 'preview';
                const trigger = triggerTypes[chatbot.triggerType];
                const TriggerIcon = trigger?.icon || Zap;

                return (
                  <button
                    key={chatbot.id}
                    onClick={() => openPreview(chatbot)}
                    className={cn(
                      'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                      isSelected && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                          chatbot.status === 'active' ? 'bg-primary/10' : 'bg-gray-100'
                        )}
                      >
                        <Bot
                          className={cn(
                            'h-4 w-4',
                            chatbot.status === 'active' ? 'text-primary' : 'text-gray-500'
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{chatbot.name}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge
                            className={cn(
                              'text-[10px]',
                              chatbot.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            )}
                          >
                            {chatbot.status === 'active' ? 'Active' : 'Paused'}
                          </Badge>
                          <Badge className={cn('text-[10px]', trigger?.color)}>
                            <TriggerIcon className="h-2.5 w-2.5 mr-0.5" />
                            {trigger?.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {chatbot.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <MessageSquare className="h-2.5 w-2.5" />
                            {chatbot.stats.conversations.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            {chatbot.stats.resolutionRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Right Panel - Content Area */}
      <div className="flex-1 w-full flex flex-col bg-white dark:bg-card min-w-0 min-h-0 rounded-3xl shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'preview' && selectedChatbot && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <ChatbotPreview
                chatbot={selectedChatbot}
                onToggle={() => toggleChatbotStatus(selectedChatbot)}
                onDuplicate={() => handleDuplicate(selectedChatbot)}
                onDelete={() => {
                  setDeletingChatbot(selectedChatbot);
                  setDeleteDialogOpen(true);
                }}
              />
            </motion.div>
          )}

          {(viewMode === 'list' || (!selectedChatbot && viewMode === 'preview')) && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-muted-foreground"
            >
              <Bot className="h-16 w-16 mb-4 opacity-30" />
              <h3 className="font-medium text-lg">Select a Chatbot</h3>
              <p className="text-sm mt-1">Choose a chatbot from the list to preview</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create New Chatbot
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <HubLayout
        hubId="automation"
        title="Chatbots"
        description="Create and manage automated chatbots for customer engagement"
        stats={layoutStats}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search chatbots..."
        actions={actionButtons}
        showFixedMenu={false}
      >
        {mainContent}
      </HubLayout>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Chatbot
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingChatbot?.name}"? This will remove all
              conversation flows. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
