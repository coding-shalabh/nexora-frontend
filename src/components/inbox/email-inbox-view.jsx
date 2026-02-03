'use client';

/**
 * Email Inbox View - Notion-style compact list
 * Features: Filters, search, bulk actions, tracking badges
 */

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Mail,
  Send,
  Inbox,
  Archive,
  Trash2,
  Star,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  ChevronDown,
  Eye,
  MousePointer,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Building,
  Calendar,
  Loader2,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmails, useDeleteEmail } from '@/hooks/use-emails';
import { formatDistanceToNow, format } from 'date-fns';

// Status badge colors
const STATUS_STYLES = {
  DRAFT: { color: 'text-gray-500', bg: 'bg-gray-100', icon: Clock },
  QUEUED: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
  SENDING: { color: 'text-blue-600', bg: 'bg-blue-50', icon: RefreshCw },
  SENT: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
  DELIVERED: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
  OPENED: { color: 'text-purple-600', bg: 'bg-purple-50', icon: Eye },
  CLICKED: { color: 'text-primary', bg: 'bg-primary/5', icon: MousePointer },
  BOUNCED: { color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle },
  FAILED: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
  SCHEDULED: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Calendar },
};

// Email row component
function EmailRow({ email, isSelected, onSelect, onClick }) {
  const status = STATUS_STYLES[email.status] || STATUS_STYLES.SENT;
  const StatusIcon = status.icon;
  const isOutbound = email.direction === 'OUTBOUND';

  const recipients = Array.isArray(email.toEmails) ? email.toEmails : [email.toEmails];
  const displayRecipient = recipients[0] || 'Unknown';
  const moreRecipients = recipients.length > 1 ? recipients.length - 1 : 0;

  const timeAgo = email.sentAt
    ? formatDistanceToNow(new Date(email.sentAt), { addSuffix: true })
    : email.createdAt
      ? formatDistanceToNow(new Date(email.createdAt), { addSuffix: true })
      : '';

  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 border-b hover:bg-accent/50 cursor-pointer transition-colors',
        isSelected && 'bg-accent'
      )}
      onClick={onClick}
    >
      {/* Checkbox */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />

      {/* Direction indicator */}
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
          isOutbound ? 'bg-blue-100' : 'bg-green-100'
        )}
      >
        {isOutbound ? (
          <ArrowUpRight className="h-3 w-3 text-blue-600" />
        ) : (
          <ArrowDownLeft className="h-3 w-3 text-green-600" />
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {/* From/To */}
          <span className="text-sm font-medium truncate max-w-[180px]">
            {isOutbound ? displayRecipient : email.fromEmail}
          </span>
          {moreRecipients > 0 && (
            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
              +{moreRecipients}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-muted-foreground truncate max-w-[250px]">
            {email.subject || '(no subject)'}
          </span>
        </div>
      </div>

      {/* Tracking stats */}
      {email.trackOpens && email.opensCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{email.opensCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {email.opensCount} open{email.opensCount !== 1 ? 's' : ''}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {email.trackClicks && email.clicksCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MousePointer className="h-3 w-3" />
                <span>{email.clicksCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {email.clicksCount} click{email.clicksCount !== 1 ? 's' : ''}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Status */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn('flex items-center gap-1 text-xs', status.color)}>
              <StatusIcon className="h-3 w-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent>{email.status}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Time */}
      <span className="text-xs text-muted-foreground whitespace-nowrap w-20 text-right">
        {timeAgo}
      </span>

      {/* Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Star className="h-4 w-4 mr-2" />
              Star
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="h-4 w-4 mr-2" />
              Archive
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
  );
}

// Main inbox view
export function EmailInboxView({ onComposeClick, onEmailClick }) {
  const [search, setSearch] = useState('');
  const [direction, setDirection] = useState('all');
  const [status, setStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);

  // Fetch emails
  const { data, isLoading, refetch, isFetching } = useEmails({
    page,
    limit: 25,
    direction: direction !== 'all' ? direction : undefined,
    status: status !== 'all' ? status : undefined,
    search: search || undefined,
  });

  const emails = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1 };

  // Selection handlers
  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === emails.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(emails.map((e) => e.id)));
    }
  };

  const allSelected = emails.length > 0 && selectedIds.size === emails.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < emails.length;

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
          <div className="flex items-center gap-2">
            {/* Checkbox */}
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={selectAll}
            />

            {/* Bulk actions */}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-1 ml-2">
                <Badge variant="secondary" className="text-xs">
                  {selectedIds.size} selected
                </Badge>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <Archive className="h-3.5 w-3.5 mr-1" />
                  Archive
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            )}

            {/* Refresh */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>

            {/* Direction filter */}
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="OUTBOUND">Sent</SelectItem>
                <SelectItem value="INBOUND">Received</SelectItem>
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="OPENED">Opened</SelectItem>
                <SelectItem value="CLICKED">Clicked</SelectItem>
                <SelectItem value="BOUNCED">Bounced</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Compose */}
            <Button size="sm" onClick={onComposeClick}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Compose
            </Button>
          </div>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Mail className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No emails yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Send your first email to get started
              </p>
              <Button size="sm" className="mt-4" onClick={onComposeClick}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Compose Email
              </Button>
            </div>
          ) : (
            <>
              {emails.map((email) => (
                <EmailRow
                  key={email.id}
                  email={email}
                  isSelected={selectedIds.has(email.id)}
                  onSelect={() => toggleSelect(email.id)}
                  onClick={() => onEmailClick?.(email)}
                />
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing {(meta.page - 1) * 25 + 1}-{Math.min(meta.page * 25, meta.total)} of{' '}
              {meta.total}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7"
                disabled={meta.page <= 1}
                onClick={() => setPage(meta.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage(meta.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export default EmailInboxView;
