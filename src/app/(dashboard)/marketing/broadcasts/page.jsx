'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Send,
  Copy,
  Trash2,
  MoreHorizontal,
  Calendar,
  Users,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  BarChart3,
  Eye,
  Pause,
  Megaphone,
  Loader2,
} from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: AlertCircle },
  SCHEDULED: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Clock },
  SENDING: { label: 'Sending', color: 'bg-yellow-100 text-yellow-700', icon: Loader2 },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500', icon: Pause },
};

const channelConfig = {
  WHATSAPP: { label: 'WhatsApp', icon: MessageSquare, color: 'text-green-600' },
  SMS: { label: 'SMS', icon: Phone, color: 'text-blue-600' },
  EMAIL: { label: 'Email', icon: Mail, color: 'text-purple-600' },
};

export default function BroadcastsPage() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  // Fetch broadcasts
  const { data: broadcastsData, isLoading } = useQuery({
    queryKey: ['broadcasts', statusFilter, channelFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (channelFilter !== 'all') params.append('channel', channelFilter);
      return fetchWithAuth(`/broadcasts?${params.toString()}`);
    },
    enabled: !!token,
  });

  // Fetch channel accounts for WhatsApp
  const { data: channelAccountsData } = useQuery({
    queryKey: ['channel-accounts'],
    queryFn: () => fetchWithAuth('/channels'),
    enabled: !!token,
  });

  // Fetch contacts for audience selection
  const { data: contactsData } = useQuery({
    queryKey: ['contacts-list'],
    queryFn: () => fetchWithAuth('/crm/contacts?limit=1000'),
    enabled: !!token,
  });

  // Create broadcast mutation
  const createMutation = useMutation({
    mutationFn: (data) =>
      fetchWithAuth('/broadcasts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['broadcasts']);
      setIsCreateDialogOpen(false);
      toast.success('Broadcast created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create broadcast');
    },
  });

  // Send broadcast mutation
  const sendMutation = useMutation({
    mutationFn: (id) =>
      fetchWithAuth(`/broadcasts/${id}/send`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['broadcasts']);
      toast.success('Broadcast sent successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send broadcast');
    },
  });

  // Duplicate broadcast mutation
  const duplicateMutation = useMutation({
    mutationFn: (id) =>
      fetchWithAuth(`/broadcasts/${id}/duplicate`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['broadcasts']);
      toast.success('Broadcast duplicated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to duplicate broadcast');
    },
  });

  // Delete broadcast mutation
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetchWithAuth(`/broadcasts/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['broadcasts']);
      toast.success('Broadcast deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete broadcast');
    },
  });

  // Cancel broadcast mutation
  const cancelMutation = useMutation({
    mutationFn: (id) =>
      fetchWithAuth(`/broadcasts/${id}/cancel`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['broadcasts']);
      toast.success('Broadcast cancelled');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel broadcast');
    },
  });

  const broadcasts = broadcastsData?.broadcasts || [];
  const channelAccounts = channelAccountsData?.data || [];
  const contacts = contactsData?.data || [];

  // Filter broadcasts by search
  const filteredBroadcasts = broadcasts.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats cards
  const stats = {
    total: broadcasts.length,
    sent: broadcasts.filter((b) => b.status === 'COMPLETED').length,
    scheduled: broadcasts.filter((b) => b.status === 'SCHEDULED').length,
    draft: broadcasts.filter((b) => b.status === 'DRAFT').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Broadcasts</h1>
          <p className="text-muted-foreground">Send bulk messages via WhatsApp, SMS, or Email</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Broadcast
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Broadcasts</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sent</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.sent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Scheduled</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.scheduled}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-2xl text-gray-600">{stats.draft}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search broadcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
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
            <SelectItem value="SENDING">Sending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Broadcasts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[30px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredBroadcasts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Megaphone className="h-8 w-8" />
                    <p>No broadcasts found</p>
                    <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
                      Create your first broadcast
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBroadcasts.map((broadcast) => {
                const status = statusConfig[broadcast.status] || statusConfig.DRAFT;
                const channel = channelConfig[broadcast.channel];
                const StatusIcon = status.icon;
                const ChannelIcon = channel?.icon || MessageSquare;

                return (
                  <TableRow key={broadcast.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{broadcast.name}</p>
                        {broadcast.templateName && (
                          <p className="text-xs text-muted-foreground">
                            Template: {broadcast.templateName}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ChannelIcon className={cn('h-4 w-4', channel?.color)} />
                        <span className="text-sm">{channel?.label || broadcast.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{broadcast.totalRecipients}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('gap-1', status.color)} variant="secondary">
                        <StatusIcon
                          className={cn('h-3 w-3', status.icon === Loader2 && 'animate-spin')}
                        />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {broadcast.status === 'COMPLETED' ? (
                        <div className="text-sm">
                          <span className="text-green-600">{broadcast.sentCount}</span>
                          {' / '}
                          <span className="text-muted-foreground">{broadcast.totalRecipients}</span>
                          {broadcast.failedCount > 0 && (
                            <span className="text-red-600 ml-1">
                              ({broadcast.failedCount} failed)
                            </span>
                          )}
                        </div>
                      ) : broadcast.scheduledAt ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(broadcast.scheduledAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(broadcast.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {broadcast.status === 'DRAFT' && (
                            <DropdownMenuItem onClick={() => sendMutation.mutate(broadcast.id)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Now
                            </DropdownMenuItem>
                          )}
                          {broadcast.status === 'SCHEDULED' && (
                            <DropdownMenuItem onClick={() => cancelMutation.mutate(broadcast.id)}>
                              <Pause className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                          {broadcast.status === 'COMPLETED' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBroadcast(broadcast);
                                setIsAnalyticsDialogOpen(true);
                              }}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => duplicateMutation.mutate(broadcast.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {broadcast.status === 'DRAFT' && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => deleteMutation.mutate(broadcast.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create Broadcast Dialog */}
      <CreateBroadcastDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        channelAccounts={channelAccounts}
        contacts={contacts}
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />

      {/* Analytics Dialog */}
      {selectedBroadcast && (
        <AnalyticsDialog
          open={isAnalyticsDialogOpen}
          onOpenChange={setIsAnalyticsDialogOpen}
          broadcast={selectedBroadcast}
        />
      )}
    </div>
  );
}

function CreateBroadcastDialog({
  open,
  onOpenChange,
  channelAccounts,
  contacts,
  onSubmit,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    channel: 'WHATSAPP',
    channelAccountId: '',
    templateName: '',
    audienceType: 'CONTACTS',
    contactIds: [],
    scheduledAt: '',
  });
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Filter WhatsApp channel accounts
  const whatsappAccounts = channelAccounts.filter((a) => a.type === 'WHATSAPP');

  // Load templates when channel account is selected
  useEffect(() => {
    if (formData.channelAccountId && formData.channel === 'WHATSAPP') {
      loadTemplates(formData.channelAccountId);
    }
  }, [formData.channelAccountId]);

  const loadTemplates = async (channelAccountId) => {
    setLoadingTemplates(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/v1/broadcasts/templates/${channelAccountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setTemplates(data.approvedTemplates || data.templates || []);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      contactIds: formData.contactIds.length > 0 ? formData.contactIds : undefined,
      scheduledAt: formData.scheduledAt || undefined,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      channel: 'WHATSAPP',
      channelAccountId: '',
      templateName: '',
      audienceType: 'CONTACTS',
      contactIds: [],
      scheduledAt: '',
    });
    setTemplates([]);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Broadcast</DialogTitle>
          <DialogDescription>
            Send bulk messages to your contacts via WhatsApp, SMS, or Email
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Broadcast Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Holiday Promotion"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description for internal reference"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          {/* Channel Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Channel *</Label>
              <Select
                value={formData.channel}
                onValueChange={(v) =>
                  setFormData({ ...formData, channel: v, channelAccountId: '', templateName: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WHATSAPP">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      WhatsApp
                    </div>
                  </SelectItem>
                  <SelectItem value="SMS" disabled>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      SMS (Coming Soon)
                    </div>
                  </SelectItem>
                  <SelectItem value="EMAIL" disabled>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-600" />
                      Email (Coming Soon)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.channel === 'WHATSAPP' && (
              <>
                <div className="space-y-2">
                  <Label>WhatsApp Account *</Label>
                  <Select
                    value={formData.channelAccountId}
                    onValueChange={(v) => setFormData({ ...formData, channelAccountId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select WhatsApp account" />
                    </SelectTrigger>
                    <SelectContent>
                      {whatsappAccounts.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No WhatsApp accounts configured
                        </div>
                      ) : (
                        whatsappAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.phoneNumber})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {formData.channelAccountId && (
                  <div className="space-y-2">
                    <Label>Template *</Label>
                    {loadingTemplates ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading templates...
                      </div>
                    ) : (
                      <Select
                        value={formData.templateName}
                        onValueChange={(v) => setFormData({ ...formData, templateName: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              No approved templates found
                            </div>
                          ) : (
                            templates.map((template) => (
                              <SelectItem key={template.id || template.name} value={template.name}>
                                {template.name} ({template.category})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    <p className="text-xs text-muted-foreground">
                      WhatsApp requires using pre-approved templates for broadcast messages
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Audience Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Audience *</Label>
              <Select
                value={formData.audienceType}
                onValueChange={(v) => setFormData({ ...formData, audienceType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_CONTACTS">All Contacts</SelectItem>
                  <SelectItem value="CONTACTS">Select Contacts</SelectItem>
                  <SelectItem value="SEGMENT" disabled>
                    Segment (Coming Soon)
                  </SelectItem>
                  <SelectItem value="FILTER" disabled>
                    Custom Filter (Coming Soon)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.audienceType === 'CONTACTS' && (
              <div className="space-y-2">
                <Label>Select Contacts ({formData.contactIds.length} selected)</Label>
                <div className="border rounded-lg max-h-48 overflow-y-auto p-2 space-y-1">
                  {contacts.length === 0 ? (
                    <p className="text-muted-foreground text-sm p-2">No contacts available</p>
                  ) : (
                    contacts
                      .filter((c) => c.phone)
                      .map((contact) => (
                        <label
                          key={contact.id}
                          className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.contactIds.includes(contact.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  contactIds: [...formData.contactIds, contact.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  contactIds: formData.contactIds.filter((id) => id !== contact.id),
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">
                            {contact.firstName} {contact.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {contact.phone}
                          </span>
                        </label>
                      ))
                  )}
                </div>
              </div>
            )}

            {formData.audienceType === 'ALL_CONTACTS' && (
              <p className="text-sm text-muted-foreground">
                This will send to all contacts with a phone number (
                {contacts.filter((c) => c.phone).length} contacts)
              </p>
            )}
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Schedule (Optional)</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to save as draft and send manually later
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.name ||
                !formData.channelAccountId ||
                (formData.channel === 'WHATSAPP' && !formData.templateName) ||
                (formData.audienceType === 'CONTACTS' && formData.contactIds.length === 0)
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : formData.scheduledAt ? (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Broadcast
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Draft
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsDialog({ open, onOpenChange, broadcast }) {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['broadcast-analytics', broadcast?.id],
    queryFn: () => fetchWithAuth(`/broadcasts/${broadcast.id}/analytics`),
    enabled: !!broadcast?.id && open,
  });

  const analytics = analyticsData?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Broadcast Analytics</DialogTitle>
          <DialogDescription>{broadcast?.name}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Recipients</CardDescription>
                  <CardTitle className="text-2xl">{analytics.stats.totalRecipients}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Sent</CardDescription>
                  <CardTitle className="text-2xl text-blue-600">
                    {analytics.stats.sentCount}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Delivered</CardDescription>
                  <CardTitle className="text-2xl text-green-600">
                    {analytics.stats.deliveredCount}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Read</CardDescription>
                  <CardTitle className="text-2xl text-purple-600">
                    {analytics.stats.readCount}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Rates */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-semibold">{analytics.stats.deliveryRate}%</p>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-semibold">{analytics.stats.readRate}%</p>
                <p className="text-sm text-muted-foreground">Read Rate</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-semibold text-red-600">
                  {analytics.stats.failureRate}%
                </p>
                <p className="text-sm text-muted-foreground">Failure Rate</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <h4 className="font-medium">Timeline</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Created: {new Date(analytics.broadcast.createdAt).toLocaleString()}</p>
                {analytics.broadcast.startedAt && (
                  <p>Started: {new Date(analytics.broadcast.startedAt).toLocaleString()}</p>
                )}
                {analytics.broadcast.completedAt && (
                  <p>Completed: {new Date(analytics.broadcast.completedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No analytics data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
