'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  ArrowUp,
  ArrowDown,
  Minus,
  Edit,
  MessageSquare,
  Loader2,
  Building2,
  Mail,
  Phone,
  Send,
  Tag,
  Calendar,
  UserPlus,
  Ticket,
} from 'lucide-react';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils';
import {
  useTicket,
  useUpdateTicket,
  useResolveTicket,
  useAssignTicket,
  useAddTicketComment,
} from '@/hooks/use-tickets';
import { useUsers } from '@/hooks/use-users';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  New: { label: 'New', icon: AlertCircle, color: 'bg-blue-100 text-blue-700' },
  Open: { label: 'Open', icon: AlertCircle, color: 'bg-blue-100 text-blue-700' },
  OPEN: { label: 'Open', icon: AlertCircle, color: 'bg-blue-100 text-blue-700' },
  'In Progress': { label: 'In Progress', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  IN_PROGRESS: { label: 'In Progress', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  Pending: { label: 'Pending', icon: Clock, color: 'bg-orange-100 text-orange-700' },
  PENDING: { label: 'Pending', icon: Clock, color: 'bg-orange-100 text-orange-700' },
  Resolved: { label: 'Resolved', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  RESOLVED: { label: 'Resolved', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  Closed: { label: 'Closed', icon: XCircle, color: 'bg-gray-100 text-gray-700' },
  CLOSED: { label: 'Closed', icon: XCircle, color: 'bg-gray-100 text-gray-700' },
};

const priorityConfig = {
  LOW: { label: 'Low', icon: ArrowDown, color: 'text-green-600', bgColor: 'bg-green-100' },
  MEDIUM: { label: 'Medium', icon: Minus, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  HIGH: { label: 'High', icon: ArrowUp, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  URGENT: { label: 'Urgent', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
};

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const ticketId = params.id;

  // State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [editForm, setEditForm] = useState({
    subject: '',
    description: '',
    priority: '',
    category: '',
  });

  // Queries
  const { data: ticketResponse, isLoading, error } = useTicket(ticketId);
  const { data: usersResponse } = useUsers();

  const ticket = ticketResponse?.data;
  const users = usersResponse?.data || [];

  // Mutations
  const updateTicketMutation = useUpdateTicket();
  const resolveTicketMutation = useResolveTicket();
  const assignTicketMutation = useAssignTicket();
  const addCommentMutation = useAddTicketComment();

  const handleResolve = async () => {
    try {
      await resolveTicketMutation.mutateAsync(ticketId);
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

  const handleEdit = () => {
    if (ticket) {
      setEditForm({
        subject: ticket.subject || '',
        description: ticket.description || '',
        priority: ticket.priority || 'MEDIUM',
        category: ticket.category || '',
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateTicketMutation.mutateAsync({
        id: ticketId,
        data: editForm,
      });
      setShowEditModal(false);
      toast({
        title: 'Success',
        description: 'Ticket updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update ticket',
        variant: 'destructive',
      });
    }
  };

  const handleAssign = async (userId) => {
    try {
      await assignTicketMutation.mutateAsync({
        id: ticketId,
        assignedTo: userId,
      });
      setShowAssignModal(false);
      toast({
        title: 'Success',
        description: 'Ticket assigned successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign ticket',
        variant: 'destructive',
      });
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addCommentMutation.mutateAsync({
        id: ticketId,
        content: commentText,
        isInternal: isInternalComment,
      });
      setCommentText('');
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  const getLayoutStats = () => {
    if (!ticket) return [createStat('Loading', '...', Ticket, 'blue')];
    const status = statusConfig[ticket.status] || statusConfig.Open;
    const priority = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;
    return [
      createStat(
        'Status',
        status.label,
        status.icon,
        ticket.status === 'RESOLVED' || ticket.status === 'Resolved' ? 'green' : 'blue'
      ),
      createStat(
        'Priority',
        priority.label,
        priority.icon,
        ticket.priority === 'URGENT' ? 'red' : 'amber'
      ),
      createStat('Comments', String(ticket.comments?.length || 0), MessageSquare, 'purple'),
    ];
  };

  if (isLoading) {
    return (
      <UnifiedLayout
        hubId="service"
        pageTitle="Ticket Details"
        stats={getLayoutStats()}
        fixedMenu={null}
      >
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </UnifiedLayout>
    );
  }

  if (error || !ticket) {
    return (
      <UnifiedLayout
        hubId="service"
        pageTitle="Ticket Not Found"
        stats={getLayoutStats()}
        fixedMenu={null}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Ticket Not Found</h1>
          </div>
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Ticket not found</h3>
            <p className="text-muted-foreground mb-4">
              The ticket you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
            <Link href="/service/tickets">
              <Button>Back to Tickets</Button>
            </Link>
          </Card>
        </div>
      </UnifiedLayout>
    );
  }

  const status = statusConfig[ticket.status] || statusConfig.Open;
  const priority = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;
  const StatusIcon = status.icon;
  const PriorityIcon = priority.icon;
  const isResolved =
    ticket.status === 'Resolved' ||
    ticket.status === 'RESOLVED' ||
    ticket.status === 'Closed' ||
    ticket.status === 'CLOSED';
  const comments = ticket.comments || [];

  return (
    <UnifiedLayout
      hubId="service"
      pageTitle={ticket.subject || 'Ticket Details'}
      stats={getLayoutStats()}
      fixedMenu={null}
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-muted-foreground">
                  {ticket.ticketNumber || `#${ticketId.slice(0, 8)}`}
                </span>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.color)}>
                  {status.label}
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1">{ticket.subject}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => setShowAssignModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign
            </Button>
            {!isResolved && (
              <Button
                onClick={handleResolve}
                disabled={resolveTicketMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {resolveTicketMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Resolve
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {ticket.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Comments / Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments & Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No comments yet. Add a comment below.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment, index) => (
                      <div
                        key={index}
                        className={cn(
                          'p-4 rounded-lg',
                          comment.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-muted'
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{comment.author || 'System'}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatTimeAgo(comment.createdAt)}
                              </p>
                            </div>
                          </div>
                          {comment.isInternal && (
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                              Internal Note
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Form */}
                <div className="pt-4 border-t">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isInternalComment}
                        onChange={(e) => setIsInternalComment(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      Internal note (only visible to team)
                    </label>
                    <Button
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || addCommentMutation.isPending}
                    >
                      {addCommentMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Add Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span
                    className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.color)}
                  >
                    <StatusIcon className="h-3 w-3 inline mr-1" />
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <span className={cn('flex items-center gap-1', priority.color)}>
                    <PriorityIcon className="h-4 w-4" />
                    {priority.label}
                  </span>
                </div>
                {ticket.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      {ticket.category}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(ticket.createdAt)}
                  </span>
                </div>
                {ticket.updatedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Updated</span>
                    <span className="text-sm">{formatTimeAgo(ticket.updatedAt)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned To */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assigned To
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ticket.assignedToUser ? (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {ticket.assignedToUser.firstName} {ticket.assignedToUser.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">Agent</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Unassigned</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setShowAssignModal(true)}
                    >
                      Assign Agent
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            {ticket.contact && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {ticket.contact.firstName?.[0]?.toUpperCase()}
                        {ticket.contact.lastName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {ticket.contact.firstName} {ticket.contact.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">Customer</p>
                    </div>
                  </div>
                  {ticket.contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${ticket.contact.email}`}
                        className="text-primary hover:underline"
                      >
                        {ticket.contact.email}
                      </a>
                    </div>
                  )}
                  {ticket.contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${ticket.contact.phone}`}
                        className="text-primary hover:underline"
                      >
                        {ticket.contact.phone}
                      </a>
                    </div>
                  )}
                  {ticket.contact.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{ticket.contact.company}</span>
                    </div>
                  )}
                  <Link href={`/crm/contacts/${ticket.contact.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Contact
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Ticket</DialogTitle>
              <DialogDescription>Update the ticket information below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={(value) => setEditForm({ ...editForm, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    placeholder="e.g., Technical, Billing"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={updateTicketMutation.isPending}>
                {updateTicketMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Modal */}
        <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Ticket</DialogTitle>
              <DialogDescription>Select a team member to assign this ticket to.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-2">
                {users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No team members found.</p>
                ) : (
                  users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleAssign(user.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                        'hover:bg-muted',
                        ticket.assignedToId === user.id && 'bg-primary/10 border border-primary'
                      )}
                      disabled={assignTicketMutation.isPending}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.firstName?.[0]?.toUpperCase()}
                          {user.lastName?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      {ticket.assignedToId === user.id && (
                        <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </UnifiedLayout>
  );
}
