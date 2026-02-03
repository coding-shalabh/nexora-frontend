'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Search,
  Download,
  RefreshCw,
  Mail,
  Smartphone,
  PhoneCall,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  CheckCheck,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Calendar,
  User,
  MessageSquare,
  Send,
  Inbox,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Activity,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const channelConfig = {
  whatsapp: {
    icon: WhatsAppIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    label: 'WhatsApp',
  },
  sms: { icon: Smartphone, color: 'text-purple-500', bgColor: 'bg-purple-500/10', label: 'SMS' },
  email: { icon: Mail, color: 'text-blue-500', bgColor: 'bg-blue-500/10', label: 'Email' },
  voice: { icon: PhoneCall, color: 'text-orange-500', bgColor: 'bg-orange-500/10', label: 'Voice' },
};

const statusConfig = {
  sent: { icon: Check, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Sent' },
  delivered: {
    icon: CheckCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Delivered',
  },
  read: { icon: Eye, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Read' },
  failed: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Failed' },
  pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Pending' },
  queued: { icon: Clock, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Queued' },
};

function ChannelIcon({ channel, className }) {
  const config = channelConfig[channel];
  if (!config) return null;
  const Icon = config.icon;
  return <Icon className={cn('h-4 w-4', config.color, className)} />;
}

function StatusBadge({ status }) {
  const config = statusConfig[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <Badge className={cn('gap-1', config.bgColor, config.color)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

// Activity Detail Modal
function ActivityDetail({ activity, onClose }) {
  if (!activity) return null;

  const channelCfg = channelConfig[activity.channel];
  const statusCfg = statusConfig[activity.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4 pb-4 border-b">
        <div
          className={cn(
            'h-12 w-12 rounded-lg flex items-center justify-center',
            channelCfg?.bgColor
          )}
        >
          <ChannelIcon channel={activity.channel} className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{activity.recipientName}</h3>
            <Badge variant="outline" className="text-xs">
              {activity.direction === 'outbound' ? (
                <>
                  <ArrowUpRight className="h-3 w-3 mr-1" /> Outbound
                </>
              ) : (
                <>
                  <ArrowDownLeft className="h-3 w-3 mr-1" /> Inbound
                </>
              )}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{activity.recipient}</p>
        </div>
        <StatusBadge status={activity.status} />
      </div>

      {/* Message Content */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Message Content</h4>
        {activity.subject && (
          <div className="text-sm mb-2">
            <span className="text-muted-foreground">Subject: </span>
            <span className="font-medium">{activity.subject}</span>
          </div>
        )}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm whitespace-pre-wrap">{activity.content}</p>
        </div>
        {activity.template && (
          <p className="text-xs text-muted-foreground">
            Using template: <span className="font-medium">{activity.template}</span>
          </p>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Channel</p>
          <p className="text-sm font-medium flex items-center gap-2">
            <ChannelIcon channel={activity.channel} />
            {channelCfg?.label}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Timestamp</p>
          <p className="text-sm font-medium">{format(activity.timestamp, 'MMM d, yyyy h:mm a')}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Message ID</p>
          <p className="text-sm font-mono text-xs">{activity.messageId || activity.callId}</p>
        </div>
        {activity.sender && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Sent By</p>
            <p className="text-sm font-medium">{activity.sender}</p>
          </div>
        )}
        {activity.duration && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">{activity.duration}</p>
          </div>
        )}
        {activity.cost !== undefined && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Cost</p>
            <p className="text-sm font-medium">${activity.cost.toFixed(2)}</p>
          </div>
        )}
      </div>

      {/* Error Info (if failed) */}
      {activity.status === 'failed' && activity.errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Delivery Failed</p>
              <p className="text-sm text-red-600 mt-1">
                Error Code: <span className="font-mono">{activity.errorCode}</span>
              </p>
              <p className="text-sm text-red-600">{activity.errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {activity.status === 'failed' && (
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        )}
        <Button variant="outline" className="ml-auto">
          <ExternalLink className="h-4 w-4 mr-2" /> View Conversation
        </Button>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch activities from API
  const {
    data: activitiesData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [
      'inbox',
      'activity',
      { selectedChannel, selectedStatus, selectedDirection, selectedPeriod, searchQuery },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedChannel !== 'all') params.set('channel', selectedChannel);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (selectedDirection !== 'all') params.set('direction', selectedDirection);
      if (selectedPeriod !== 'all') params.set('period', selectedPeriod);
      if (searchQuery) params.set('search', searchQuery);
      params.set('page', currentPage.toString());
      params.set('limit', itemsPerPage.toString());

      const response = await api.get(`/inbox/activity?${params.toString()}`);
      return response;
    },
    staleTime: 30000,
  });

  const activities = activitiesData?.data || [];

  // Filter activities (client-side filtering as backup)
  const filteredActivities = activities.filter((a) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        a.content?.toLowerCase().includes(query) ||
        a.recipient?.toLowerCase().includes(query) ||
        a.recipientName?.toLowerCase().includes(query) ||
        a.template?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Pagination
  const totalCount = activitiesData?.pagination?.total || filteredActivities.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedActivities = activitiesData?.pagination
    ? filteredActivities
    : filteredActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats
  const stats = activitiesData?.stats || {
    total: activities.length,
    sent: activities.filter((a) => a.direction === 'outbound').length,
    received: activities.filter((a) => a.direction === 'inbound').length,
    failed: activities.filter((a) => a.status === 'failed').length,
    delivered: activities.filter((a) => a.status === 'delivered' || a.status === 'read').length,
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const openDetail = (activity) => {
    setSelectedActivity(activity);
    setDetailOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedChannel('all');
    setSelectedStatus('all');
    setSelectedDirection('all');
    setSelectedPeriod('today');
  };

  const hasFilters =
    searchQuery ||
    selectedChannel !== 'all' ||
    selectedStatus !== 'all' ||
    selectedDirection !== 'all';

  const layoutStats = useMemo(
    () => [
      createStat('Total', stats.total, MessageSquare, 'blue'),
      createStat('Sent', stats.sent, Send, 'blue'),
      createStat('Received', stats.received, Inbox, 'green'),
      createStat('Delivered', stats.delivered, CheckCheck, 'purple'),
    ],
    [stats]
  );

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isLoading || isRefetching}
      >
        <RefreshCw className={cn('h-4 w-4 mr-2', (isLoading || isRefetching) && 'animate-spin')} />
        Refresh
      </Button>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" /> Export
      </Button>
    </div>
  );

  const mainContent = (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by content, recipient..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {Object.entries(channelConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <config.icon className={cn('h-4 w-4', config.color)} />
                    {config.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDirection} onValueChange={setSelectedDirection}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
              <SelectItem value="inbound">Inbound</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Activity Table */}
      <Card>
        {!isLoading && paginatedActivities.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {paginatedActivities.map((activity, index) => (
                  <motion.tr
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openDetail(activity)}
                  >
                    <TableCell>
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center',
                          activity.direction === 'outbound' ? 'bg-blue-100' : 'bg-green-100'
                        )}
                      >
                        {activity.direction === 'outbound' ? (
                          <ArrowUpRight className={cn('h-4 w-4', 'text-blue-600')} />
                        ) : (
                          <ArrowDownLeft className={cn('h-4 w-4', 'text-green-600')} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{activity.recipientName || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{activity.recipient}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="truncate text-sm">{activity.content}</p>
                      {activity.template && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {activity.template}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ChannelIcon channel={activity.channel} />
                        <span className="text-sm">{channelConfig[activity.channel]?.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={activity.status} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>
                          {activity.timestamp
                            ? format(new Date(activity.timestamp), 'h:mm a')
                            : '—'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp
                            ? formatDistanceToNow(new Date(activity.timestamp), {
                                addSuffix: true,
                              })
                            : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(activity);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" /> View Conversation
                          </DropdownMenuItem>
                          {activity.status === 'failed' && (
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" /> Retry
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of{' '}
              {filteredActivities.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 text-muted-foreground animate-spin" />
            <p className="text-sm text-muted-foreground">Loading activity...</p>
          </div>
        )}

        {!isLoading && filteredActivities.length === 0 && (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium mb-2">No activity found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {hasFilters
                ? 'Try adjusting your filters'
                : 'Connect your messaging channels to start tracking activity. Messages will appear here once you configure WhatsApp, Email, SMS, or Voice channels.'}
            </p>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" /> Clear Filters
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <>
      <HubLayout
        hubId="inbox"
        title="Message Activity"
        description="Track all messages sent and received across all channels"
        stats={layoutStats}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by content, recipient..."
        actions={actionButtons}
        showFixedMenu={false}
      >
        {mainContent}
      </HubLayout>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          <ActivityDetail
            activity={selectedActivity}
            onClose={() => {
              setDetailOpen(false);
              setSelectedActivity(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
