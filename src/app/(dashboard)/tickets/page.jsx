'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Tag,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Send,
  Loader2,
  Building2,
  UserPlus,
  LayoutList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  useTickets,
  useTicket,
  useCreateTicket,
  useUpdateTicket,
  useResolveTicket,
  useAddTicketComment,
  usePipelines,
  useStages,
} from '@/hooks/use-tickets';
import { useContacts } from '@/hooks/use-contacts';
import { useCompanies } from '@/hooks/use-companies';
import { useToast } from '@/hooks/use-toast';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const statusConfig = {
  OPEN: { label: 'Open', icon: AlertCircle, color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'In Progress', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  PENDING: { label: 'Pending', icon: Clock, color: 'bg-orange-100 text-orange-700' },
  RESOLVED: { label: 'Resolved', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  CLOSED: { label: 'Closed', icon: XCircle, color: 'bg-gray-100 text-gray-700' },
};

const priorityConfig = {
  LOW: { label: 'Low', icon: ArrowDown, color: 'text-green-600' },
  MEDIUM: { label: 'Medium', icon: Minus, color: 'text-yellow-600' },
  HIGH: { label: 'High', icon: ArrowUp, color: 'text-orange-600' },
  URGENT: { label: 'Urgent', icon: AlertCircle, color: 'text-red-600' },
};

const categoryOptions = [
  'Technical Issue',
  'Billing',
  'Feature Request',
  'General Inquiry',
  'Bug Report',
  'Account',
  'Other',
];

function formatTimeAgo(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
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

export default function TicketsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    contactId: '',
    companyId: '',
    priority: 'MEDIUM',
    category: '',
    stageId: '',
  });

  // Queries
  const { data: ticketsResponse, isLoading } = useTickets({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
  });
  const { data: ticketDetails, refetch: refetchTicketDetails } = useTicket(selectedTicket?.id);
  const { data: contactsData } = useContacts();
  const { data: companiesData } = useCompanies();
  const { data: pipelinesData } = usePipelines();

  const tickets = ticketsResponse?.data || [];
  const contacts = contactsData?.data || [];
  const companies = companiesData?.data || [];
  const pipelines = pipelinesData?.data || [];

  // Get Support Pipeline
  const supportPipeline = pipelines.find((p) => p.name === 'Support Pipeline');
  const { data: stagesData } = useStages(supportPipeline?.id);
  const stages = stagesData?.data || [];

  // Mutations
  const createTicketMutation = useCreateTicket();
  const updateTicketMutation = useUpdateTicket();
  const resolveTicketMutation = useResolveTicket();
  const addCommentMutation = useAddTicketComment();

  const openCount = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const breachedCount = tickets.filter(
    (t) =>
      t.resolutionDeadline &&
      new Date(t.resolutionDeadline) < new Date() &&
      t.status !== 'RESOLVED' &&
      t.status !== 'CLOSED'
  ).length;

  const resetForm = () => {
    setFormData({
      subject: '',
      description: '',
      contactId: '',
      companyId: '',
      priority: 'MEDIUM',
      category: '',
      stageId: '',
    });
  };

  const handleCreate = async () => {
    if (!formData.subject) {
      toast({
        title: 'Error',
        description: 'Subject is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Auto-select first stage if not specified
      const stageId = formData.stageId || stages[0]?.id;

      await createTicketMutation.mutateAsync({
        subject: formData.subject,
        description: formData.description || undefined,
        contactId: formData.contactId || undefined,
        companyId: formData.companyId || undefined,
        priority: formData.priority,
        category: formData.category || undefined,
        stageId,
      });
      toast({
        title: 'Success',
        description: 'Ticket created successfully',
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create ticket',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTicket) return;

    setIsSubmitting(true);
    try {
      await updateTicketMutation.mutateAsync({
        id: selectedTicket.id,
        data: {
          subject: formData.subject,
          description: formData.description,
          priority: formData.priority,
          status: formData.status,
        },
      });
      toast({
        title: 'Success',
        description: 'Ticket updated successfully',
      });
      setIsEditOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update ticket',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (ticket) => {
    try {
      await resolveTicketMutation.mutateAsync(ticket.id);
      toast({
        title: 'Success',
        description: 'Ticket resolved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resolve ticket',
        variant: 'destructive',
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTicket) return;

    try {
      await addCommentMutation.mutateAsync({
        id: selectedTicket.id,
        content: newComment,
        isInternal: false,
      });
      setNewComment('');
      refetchTicketDetails();
      toast({
        title: 'Success',
        description: 'Comment added',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      subject: ticket.subject || '',
      description: ticket.description || '',
      contactId: ticket.contactId || '',
      companyId: ticket.companyId || '',
      priority: ticket.priority || 'MEDIUM',
      category: ticket.category || '',
      status: ticket.status || 'OPEN',
    });
    setIsEditOpen(true);
  };

  const ticketDetail = ticketDetails?.data;

  // Compute resolved count
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length;

  // Stats configuration for HubLayout
  const stats = [
    createStat('Open', openCount, AlertCircle, 'blue'),
    createStat('SLA Breached', breachedCount, AlertCircle, 'red'),
    createStat('Total', tickets.length, LayoutList, 'primary'),
    createStat('Resolved', resolvedCount, CheckCircle, 'green'),
  ];

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'create', label: 'Create Ticket', icon: Plus, variant: 'default' }],
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'OPEN', label: 'Open' },
        { id: 'IN_PROGRESS', label: 'In Progress' },
        { id: 'PENDING', label: 'Pending' },
        { id: 'RESOLVED', label: 'Resolved' },
        { id: 'CLOSED', label: 'Closed' },
      ],
    },
  };

  // Empty state component
  const EmptyState = () => (
    <div className="p-12 text-center">
      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No tickets found</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery || statusFilter !== 'all'
          ? 'Try adjusting your filters'
          : 'Create your first ticket to get started'}
      </p>
      {!searchQuery && statusFilter === 'all' && (
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      )}
    </div>
  );

  // Ticket card component
  const TicketCard = ({ ticket }) => {
    const status = statusConfig[ticket.status] || statusConfig.OPEN;
    const priority = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;
    const StatusIcon = status.icon;
    const PriorityIcon = priority.icon;
    const isSLABreached =
      ticket.resolutionDeadline &&
      new Date(ticket.resolutionDeadline) < new Date() &&
      ticket.status !== 'RESOLVED' &&
      ticket.status !== 'CLOSED';

    return (
      <Card
        className={cn(
          'p-4 hover:shadow-md transition-shadow cursor-pointer',
          isSLABreached && 'border-destructive'
        )}
        onClick={() => handleView(ticket)}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn('h-10 w-10 rounded-lg flex items-center justify-center', status.color)}
          >
            <StatusIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">
                    {ticket.ticketNumber}
                  </span>
                  <h3 className="font-medium">{ticket.subject}</h3>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {ticket.stages && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                      {ticket.stages.name}
                    </span>
                  )}
                  {ticket.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {ticket.description}
                    </p>
                  )}
                </div>
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
                      handleView(ticket);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(ticket);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Ticket
                  </DropdownMenuItem>
                  {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolve(ticket);
                        }}
                        className="text-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve Ticket
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
              {ticket.contact && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-4 w-4" />
                  {ticket.contact.firstName} {ticket.contact.lastName}
                </span>
              )}
              {ticket.company && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {ticket.company.name}
                </span>
              )}
              <span className={cn('flex items-center gap-1', priority.color)}>
                <PriorityIcon className="h-4 w-4" />
                {priority.label}
              </span>
              {ticket.category && (
                <span className="px-2 py-0.5 bg-muted rounded text-xs">{ticket.category}</span>
              )}
              {ticket.assignedTo && (
                <span className="text-muted-foreground">
                  Assigned to {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                </span>
              )}
              <span className="text-muted-foreground ml-auto">
                {formatTimeAgo(ticket.createdAt)}
              </span>
              {isSLABreached && (
                <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                  SLA Breached
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <HubLayout
        hubId="service"
        showTopBar={false}
        showSidebar={false}
        title="Tickets"
        description="Manage customer support tickets"
        stats={stats}
        fixedMenuFilters={
          <FixedMenuPanel
            config={fixedMenuConfig}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
            onAction={(id) => id === 'create' && setIsCreateOpen(true)}
            className="p-4"
          />
        }
        fixedMenuList={
          <div className="space-y-2 p-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tickets List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : tickets.length === 0 ? (
              <EmptyState />
            ) : (
              tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
            )}
          </div>
        }
      >
        {/* Ticket Detail View in Content Area */}
        {selectedTicket && ticketDetail && (
          <div className="h-full overflow-y-auto p-6">
            {/* Ticket Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-muted-foreground text-sm">
                  {ticketDetail.ticketNumber}
                </span>
                <h2 className="text-2xl font-bold">{ticketDetail.subject}</h2>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    statusConfig[ticketDetail.status]?.color
                  )}
                >
                  {statusConfig[ticketDetail.status]?.label}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1 text-sm',
                    priorityConfig[ticketDetail.priority]?.color
                  )}
                >
                  {(() => {
                    const Icon = priorityConfig[ticketDetail.priority]?.icon;
                    return Icon ? <Icon className="h-4 w-4" /> : null;
                  })()}
                  {priorityConfig[ticketDetail.priority]?.label} Priority
                </span>
              </div>
            </div>

            {/* Description */}
            {ticketDetail.description && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                <p className="text-sm bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {ticketDetail.description}
                </p>
              </div>
            )}

            {/* Details */}
            <div className="space-y-3 mb-6">
              {ticketDetail.contact && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Contact</span>
                  <span className="font-medium">
                    {ticketDetail.contact.firstName} {ticketDetail.contact.lastName}
                  </span>
                </div>
              )}
              {ticketDetail.company && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Company</span>
                  <span className="font-medium">{ticketDetail.company.name}</span>
                </div>
              )}
              {ticketDetail.category && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="px-2 py-0.5 bg-muted rounded text-sm">
                    {ticketDetail.category}
                  </span>
                </div>
              )}
              {ticketDetail.assignedTo && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Assigned To</span>
                  <span className="font-medium">
                    {ticketDetail.assignedTo.firstName} {ticketDetail.assignedTo.lastName}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Created</span>
                <span>{formatDateTime(ticketDetail.createdAt)}</span>
              </div>
              {ticketDetail.resolutionDeadline && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Resolution Deadline</span>
                  <span
                    className={cn(
                      new Date(ticketDetail.resolutionDeadline) < new Date() &&
                        ticketDetail.status !== 'RESOLVED' &&
                        'text-destructive'
                    )}
                  >
                    {formatDateTime(ticketDetail.resolutionDeadline)}
                  </span>
                </div>
              )}
            </div>

            {/* Comments */}
            <div>
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({ticketDetail.comments?.length || 0})
              </h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
                {ticketDetail.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className={cn(
                      'p-3 rounded-lg',
                      comment.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <User className="h-3 w-3" />
                      {comment.user?.firstName} {comment.user?.lastName}
                      <span>•</span>
                      {formatTimeAgo(comment.createdAt)}
                      {comment.isInternal && (
                        <span className="text-xs bg-yellow-200 px-1.5 py-0.5 rounded">
                          Internal
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
                {(!ticketDetail.comments || ticketDetail.comments.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2 mb-6">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            {ticketDetail.status !== 'RESOLVED' && ticketDetail.status !== 'CLOSED' && (
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => handleEdit(ticketDetail)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-green-600 hover:text-green-700"
                  onClick={() => handleResolve(ticketDetail)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve
                </Button>
              </div>
            )}
          </div>
        )}
      </HubLayout>

      {/* Create Ticket Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of the issue"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact</Label>
                <Select
                  value={formData.contactId}
                  onValueChange={(value) => setFormData({ ...formData, contactId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Company</Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className={cn('flex items-center gap-2', config.color)}>
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stage</Label>
              <Select
                value={formData.stageId}
                onValueChange={(value) => setFormData({ ...formData, stageId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage (defaults to New)" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Ticket Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className={cn('flex items-center gap-2', config.color)}>
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className={cn('flex items-center gap-2')}>
                          <config.icon className={cn('h-4 w-4', config.color.split(' ')[1])} />
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
