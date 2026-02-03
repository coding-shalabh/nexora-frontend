'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Edit,
  MessageSquare,
  Loader2,
  Building2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTickets, useResolveTicket } from '@/hooks/use-tickets';
import { useToast } from '@/hooks/use-toast';

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

export default function ServiceTicketsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Queries
  const { data: ticketsResponse, isLoading } = useTickets({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
  });

  const tickets = ticketsResponse?.data || [];

  // Mutations
  const resolveTicketMutation = useResolveTicket();

  const openCount = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const breachedCount = tickets.filter(
    (t) =>
      t.resolutionDeadline &&
      new Date(t.resolutionDeadline) < new Date() &&
      t.status !== 'RESOLVED' &&
      t.status !== 'CLOSED'
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length;

  const layoutStats = useMemo(
    () => [
      {
        label: 'Open',
        value: openCount,
        icon: AlertCircle,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
      },
      {
        label: 'Breached',
        value: breachedCount,
        icon: Clock,
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
      },
      {
        label: 'Total',
        value: tickets.length,
        icon: MessageSquare,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
      },
      {
        label: 'Resolved',
        value: resolvedCount,
        icon: CheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
      },
    ],
    [openCount, breachedCount, tickets.length, resolvedCount]
  );

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

  const mainContent = (
    <div className="space-y-4">
      {/* Tickets List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : tickets.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tickets found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first ticket to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link href="/service/tickets/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
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
                key={ticket.id}
                className={cn(
                  'p-4 hover:shadow-md transition-shadow',
                  isSLABreached && 'border-destructive'
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-lg flex items-center justify-center',
                      status.color
                    )}
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
                          <Link href={`/service/tickets/${ticket.id}`}>
                            <h3 className="font-medium hover:text-primary">{ticket.subject}</h3>
                          </Link>
                        </div>
                        {ticket.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {ticket.description}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/service/tickets/${ticket.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/service/tickets/${ticket.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Ticket
                            </Link>
                          </DropdownMenuItem>
                          {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleResolve(ticket)}
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
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">
                          {ticket.category}
                        </span>
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
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Manage customer support tickets</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/service/tickets/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {layoutStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                  <Icon className={cn('h-5 w-5', stat.textColor)} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 border rounded-lg p-1 overflow-x-auto">
          <Button
            variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          {Object.entries(statusConfig).map(([status, config]) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tickets Content */}
      {mainContent}
    </div>
  );
}
