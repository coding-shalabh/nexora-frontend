'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Megaphone,
  Copy,
  Trash2,
  MoreHorizontal,
  Calendar,
  Users,
  MessageSquare,
  Mail,
  Phone,
  Mic,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Play,
  Pause,
  BarChart3,
  Target,
  Zap,
  RefreshCw,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: AlertCircle },
  SCHEDULED: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Clock },
  ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700', icon: Play },
  PAUSED: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700', icon: Pause },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500', icon: XCircle },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-400', icon: AlertCircle },
};

const typeConfig = {
  BROADCAST: { label: 'Broadcast', icon: Megaphone, color: 'text-purple-600' },
  DRIP: { label: 'Drip', icon: RefreshCw, color: 'text-blue-600' },
  NURTURE: { label: 'Nurture', icon: TrendingUp, color: 'text-green-600' },
  PROMOTIONAL: { label: 'Promotional', icon: Target, color: 'text-orange-600' },
  ONBOARDING: { label: 'Onboarding', icon: Users, color: 'text-cyan-600' },
  REENGAGEMENT: { label: 'Re-engagement', icon: Zap, color: 'text-yellow-600' },
  EVENT: { label: 'Event', icon: Calendar, color: 'text-pink-600' },
  CUSTOM: { label: 'Custom', icon: Megaphone, color: 'text-gray-600' },
};

const channelIcons = {
  whatsapp: { icon: MessageSquare, color: 'text-green-600', label: 'WhatsApp' },
  email: { icon: Mail, color: 'text-blue-600', label: 'Email' },
  sms: { icon: Phone, color: 'text-purple-600', label: 'SMS' },
  voice: { icon: Mic, color: 'text-orange-600', label: 'Voice' },
};

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Create form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'BROADCAST',
    channels: [],
    goal: '',
    targetAudience: 'ALL_CONTACTS',
    segmentId: '',
    startDate: '',
    endDate: '',
    budget: '',
    tags: [],
  });

  // Fetch campaigns
  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ['campaigns', statusFilter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      return api.get(`/campaigns?${params.toString()}`);
    },
    enabled: !!token,
  });

  // Fetch marketing stats
  const { data: statsData } = useQuery({
    queryKey: ['campaigns-stats'],
    queryFn: () => api.get('/campaigns/stats'),
    enabled: !!token,
  });

  // Fetch segments for targeting
  const { data: segmentsData } = useQuery({
    queryKey: ['segments-list'],
    queryFn: () => api.get('/crm/segments'),
    enabled: !!token,
  });

  // Create campaign mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/campaigns', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Campaign created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create campaign',
        variant: 'destructive',
      });
    },
  });

  // Activate campaign mutation
  const activateMutation = useMutation({
    mutationFn: (id) => api.post(`/campaigns/${id}/activate`),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      toast({
        title: 'Success',
        description: 'Campaign activated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to activate campaign',
        variant: 'destructive',
      });
    },
  });

  // Pause campaign mutation
  const pauseMutation = useMutation({
    mutationFn: (id) => api.post(`/campaigns/${id}/pause`),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      toast({
        title: 'Success',
        description: 'Campaign paused',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to pause campaign',
        variant: 'destructive',
      });
    },
  });

  // Complete campaign mutation
  const completeMutation = useMutation({
    mutationFn: (id) => api.post(`/campaigns/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      toast({
        title: 'Success',
        description: 'Campaign marked as completed',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete campaign',
        variant: 'destructive',
      });
    },
  });

  // Duplicate campaign mutation
  const duplicateMutation = useMutation({
    mutationFn: (id) => api.post(`/campaigns/${id}/duplicate`),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      toast({
        title: 'Success',
        description: 'Campaign duplicated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to duplicate campaign',
        variant: 'destructive',
      });
    },
  });

  // Delete campaign mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/campaigns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      toast({
        title: 'Success',
        description: 'Campaign deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete campaign',
        variant: 'destructive',
      });
    },
  });

  // Fetch campaign analytics
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['campaign-analytics', selectedCampaign?.id],
    queryFn: () => api.get(`/campaigns/${selectedCampaign?.id}/analytics`),
    enabled: !!selectedCampaign?.id && isAnalyticsDialogOpen,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'BROADCAST',
      channels: [],
      goal: '',
      targetAudience: 'ALL_CONTACTS',
      segmentId: '',
      startDate: '',
      endDate: '',
      budget: '',
      tags: [],
    });
  };

  const handleChannelToggle = (channel) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!formData.name || formData.channels.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate({
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : null,
    });
  };

  const handleViewAnalytics = (campaign) => {
    setSelectedCampaign(campaign);
    setIsAnalyticsDialogOpen(true);
  };

  const campaigns = campaignsData?.data || [];
  const counts = campaignsData?.counts || {};
  const apiStats = statsData?.data || {};

  // Filter campaigns by search
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats for UnifiedLayout
  const stats = [
    createStat('Active', counts.active || 0, Play, 'purple'),
    createStat('Messages Sent', apiStats.campaigns?.sent || 0, Users, 'blue'),
    createStat('Opened', apiStats.campaigns?.opened || 0, TrendingUp, 'green'),
    createStat('Conversions', apiStats.campaigns?.converted || 0, Target, 'orange'),
  ];

  const actions = [
    createAction('New Campaign', Plus, () => setIsCreateDialogOpen(true), { primary: true }),
  ];

  // Campaign card component
  const CampaignCard = ({ campaign }) => {
    const status = statusConfig[campaign.status] || statusConfig.DRAFT;
    const type = typeConfig[campaign.type] || typeConfig.CUSTOM;
    const StatusIcon = status.icon;
    const TypeIcon = type.icon;

    return (
      <Card
        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setSelectedCampaign(campaign)}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center',
              type.color
            )}
          >
            <TypeIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{campaign.name}</h3>
                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {campaign.description || 'No description'}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAnalytics(campaign);
                    }}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </DropdownMenuItem>
                  {campaign.status === 'DRAFT' && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        activateMutation.mutate(campaign.id);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  {campaign.status === 'ACTIVE' && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        pauseMutation.mutate(campaign.id);
                      }}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </DropdownMenuItem>
                  )}
                  {campaign.status === 'PAUSED' && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        activateMutation.mutate(campaign.id);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </DropdownMenuItem>
                  )}
                  {['ACTIVE', 'PAUSED'].includes(campaign.status) && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        completeMutation.mutate(campaign.id);
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Complete
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateMutation.mutate(campaign.id);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  {campaign.status === 'DRAFT' && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(campaign.id);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <Badge variant="outline">{type.label}</Badge>
              <Badge className={cn('gap-1', status.color)}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
              <div className="flex gap-1">
                {(campaign.channels || []).map((ch) => {
                  const channel = channelIcons[ch.toLowerCase()];
                  if (!channel) return null;
                  const ChannelIcon = channel.icon;
                  return (
                    <div
                      key={ch}
                      className={cn('p-1 rounded', channel.color)}
                      title={channel.label}
                    >
                      <ChannelIcon className="h-3 w-3" />
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-muted-foreground ml-auto">
                <span className="font-medium">{campaign.sentCount?.toLocaleString() || 0}</span>{' '}
                sent
                {campaign.openedCount > 0 && (
                  <>
                    <span className="mx-1">·</span>
                    <span className="font-medium">
                      {campaign.openedCount.toLocaleString()}
                    </span>{' '}
                    opened
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <UnifiedLayout
        hubId="marketing"
        pageTitle="Campaigns"
        stats={stats}
        actions={actions}
        fixedMenu={null}
      >
        <div className="h-full overflow-auto p-6 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BROADCAST">Broadcast</SelectItem>
                <SelectItem value="DRIP">Drip</SelectItem>
                <SelectItem value="NURTURE">Nurture</SelectItem>
                <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                <SelectItem value="ONBOARDING">Onboarding</SelectItem>
                <SelectItem value="REENGAGEMENT">Re-engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaigns List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="p-12 text-center">
              <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first marketing campaign to engage your audience'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </UnifiedLayout>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Set up a new marketing campaign across multiple channels
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Summer Sale 2024"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the campaign"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="type">Campaign Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BROADCAST">Broadcast (One-time)</SelectItem>
                    <SelectItem value="DRIP">Drip (Automated sequence)</SelectItem>
                    <SelectItem value="NURTURE">Nurture (Lead nurturing)</SelectItem>
                    <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                    <SelectItem value="ONBOARDING">Onboarding</SelectItem>
                    <SelectItem value="REENGAGEMENT">Re-engagement</SelectItem>
                    <SelectItem value="EVENT">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="goal">Campaign Goal</Label>
                <Select
                  value={formData.goal}
                  onValueChange={(value) => setFormData({ ...formData, goal: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="retention">Retention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Channels *</Label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {Object.entries(channelIcons).map(([key, channel]) => {
                    const ChannelIcon = channel.icon;
                    const isSelected = formData.channels.includes(key);
                    const isDisabled = key === 'voice';
                    return (
                      <div
                        key={key}
                        onClick={() => !isDisabled && handleChannelToggle(key)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all',
                          isSelected && 'border-primary bg-primary/5',
                          !isSelected && !isDisabled && 'border-gray-200 hover:border-gray-300',
                          isDisabled && 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                        )}
                      >
                        <ChannelIcon className={cn('h-5 w-5', channel.color)} />
                        <span className="text-xs font-medium">{channel.label}</span>
                        {isDisabled && (
                          <Badge variant="secondary" className="text-xs">
                            Soon
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_CONTACTS">All Contacts</SelectItem>
                    <SelectItem value="SEGMENT">Specific Segment</SelectItem>
                    <SelectItem value="CONTACTS">Filter-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.targetAudience === 'SEGMENT' && (
                <div>
                  <Label htmlFor="segmentId">Select Segment</Label>
                  <Select
                    value={formData.segmentId}
                    onValueChange={(value) => setFormData({ ...formData, segmentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {(segmentsData?.data || []).map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name} ({segment.contactCount} contacts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Campaign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.name} - Analytics</DialogTitle>
            <DialogDescription>{selectedCampaign?.description}</DialogDescription>
          </DialogHeader>
          {isLoadingAnalytics ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : analyticsData?.data ? (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">
                      {analyticsData.data.stats?.sent?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Sent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">
                      {analyticsData.data.stats?.delivered?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">
                      {analyticsData.data.stats?.opened?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Opened</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">
                      {analyticsData.data.stats?.clicked?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Clicked</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Performance Rates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Delivery Rate</span>
                      <span className="font-medium">
                        {analyticsData.data.rates?.deliveryRate || 0}%
                      </span>
                    </div>
                    <Progress value={parseFloat(analyticsData.data.rates?.deliveryRate) || 0} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Open Rate</span>
                      <span className="font-medium">
                        {analyticsData.data.rates?.openRate || 0}%
                      </span>
                    </div>
                    <Progress value={parseFloat(analyticsData.data.rates?.openRate) || 0} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Click Rate</span>
                      <span className="font-medium">
                        {analyticsData.data.rates?.clickRate || 0}%
                      </span>
                    </div>
                    <Progress value={parseFloat(analyticsData.data.rates?.clickRate) || 0} />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No analytics data available</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
