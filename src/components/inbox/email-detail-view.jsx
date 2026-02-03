'use client';

/**
 * Email Detail View - Shows full email content with tracking events
 */

import { cn } from '@/lib/utils';
import {
  X,
  Reply,
  ReplyAll,
  Forward,
  Trash2,
  Archive,
  Star,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  MousePointer,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Paperclip,
  ExternalLink,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useEmail, useDeleteEmail } from '@/hooks/use-emails';
import { formatDistanceToNow, format } from 'date-fns';
import { useState } from 'react';

// Status badge colors
const STATUS_CONFIG = {
  DRAFT: { label: 'Draft', color: 'text-gray-500', bg: 'bg-gray-100' },
  QUEUED: { label: 'Queued', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  SENDING: { label: 'Sending', color: 'text-blue-600', bg: 'bg-blue-50' },
  SENT: { label: 'Sent', color: 'text-green-600', bg: 'bg-green-50' },
  DELIVERED: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50' },
  OPENED: { label: 'Opened', color: 'text-purple-600', bg: 'bg-purple-50' },
  CLICKED: { label: 'Clicked', color: 'text-primary', bg: 'bg-primary/5' },
  BOUNCED: { label: 'Bounced', color: 'text-orange-600', bg: 'bg-orange-50' },
  FAILED: { label: 'Failed', color: 'text-red-600', bg: 'bg-red-50' },
  SCHEDULED: { label: 'Scheduled', color: 'text-blue-600', bg: 'bg-blue-50' },
};

// Tracking event row
function TrackingEvent({ event }) {
  const time = formatDistanceToNow(new Date(event.createdAt), { addSuffix: true });
  const isOpen = event.eventType === 'open';
  const isClick = event.eventType === 'click';

  return (
    <div className="flex items-start gap-3 py-2">
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
          isOpen ? 'bg-purple-100' : isClick ? 'bg-primary/10' : 'bg-gray-100'
        )}
      >
        {isOpen ? (
          <Eye className="h-3 w-3 text-purple-600" />
        ) : isClick ? (
          <MousePointer className="h-3 w-3 text-primary" />
        ) : (
          <Clock className="h-3 w-3 text-gray-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          {isOpen ? 'Email opened' : isClick ? 'Link clicked' : event.eventType}
        </p>
        {isClick && event.eventData?.url && (
          <p className="text-xs text-muted-foreground truncate">{event.eventData.url}</p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
      </div>
      {event.ipAddress && <span className="text-xs text-muted-foreground">{event.ipAddress}</span>}
    </div>
  );
}

// Main detail view
export function EmailDetailView({ emailId, onClose, onReply, onForward }) {
  const [showTracking, setShowTracking] = useState(true);
  const { data, isLoading } = useEmail(emailId);
  const deleteEmail = useDeleteEmail();

  const email = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm">Email not found</p>
      </div>
    );
  }

  const status = STATUS_CONFIG[email.status] || STATUS_CONFIG.SENT;
  const isOutbound = email.direction === 'OUTBOUND';
  const toEmails = Array.isArray(email.toEmails) ? email.toEmails : [email.toEmails];
  const ccEmails = email.ccEmails || [];
  const bccEmails = email.bccEmails || [];
  const trackingEvents = email.trackingEvents || [];

  const sentTime = email.sentAt
    ? format(new Date(email.sentAt), 'MMM d, yyyy h:mm a')
    : email.createdAt
      ? format(new Date(email.createdAt), 'MMM d, yyyy h:mm a')
      : '';

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this email?')) {
      await deleteEmail.mutateAsync(email.id);
      onClose?.();
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Badge className={cn('text-xs', status.color, status.bg)}>{status.label}</Badge>
            {email.trackOpens && (
              <Badge variant="outline" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                {email.opensCount || 0} opens
              </Badge>
            )}
            {email.trackClicks && (
              <Badge variant="outline" className="text-xs">
                <MousePointer className="h-3 w-3 mr-1" />
                {email.clicksCount || 0} clicks
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Star</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Archive className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Email content */}
        <div className="flex-1 overflow-y-auto">
          {/* Subject */}
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">{email.subject || '(no subject)'}</h2>
          </div>

          {/* From/To */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {(email.fromName || email.fromEmail || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{email.fromName || email.fromEmail}</span>
                  {email.fromName && (
                    <span className="text-sm text-muted-foreground">&lt;{email.fromEmail}&gt;</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-sm text-muted-foreground">
                  <span>To:</span>
                  {toEmails.map((to, i) => (
                    <span key={i}>
                      {to}
                      {i < toEmails.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                {ccEmails.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>Cc:</span>
                    {ccEmails.join(', ')}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{sentTime}</span>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            {email.bodyHtml ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
              />
            ) : email.bodyText ? (
              <pre className="text-sm whitespace-pre-wrap font-sans">{email.bodyText}</pre>
            ) : (
              <p className="text-sm text-muted-foreground italic">No content</p>
            )}
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="px-4 py-3 border-t">
              <p className="text-sm font-medium mb-2">
                <Paperclip className="h-4 w-4 inline mr-1" />
                Attachments ({email.attachments.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((att) => (
                  <Button key={att.id} variant="outline" size="sm" className="text-xs" asChild>
                    <a href={att.url} target="_blank" rel="noopener noreferrer">
                      {att.filename}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Tracking events */}
          {trackingEvents.length > 0 && (
            <Collapsible open={showTracking} onOpenChange={setShowTracking}>
              <div className="px-4 py-3 border-t">
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                  <ChevronDown
                    className={cn('h-4 w-4 transition-transform', showTracking && 'rotate-180')}
                  />
                  <span className="text-sm font-medium">Activity ({trackingEvents.length})</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 space-y-1">
                    {trackingEvents.map((event) => (
                      <TrackingEvent key={event.id} event={event} />
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}
        </div>

        {/* Actions footer */}
        <div className="flex items-center gap-2 px-4 py-3 border-t bg-muted/20">
          <Button variant="outline" size="sm" onClick={() => onReply?.(email)}>
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>
          <Button variant="outline" size="sm">
            <ReplyAll className="h-4 w-4 mr-1" />
            Reply All
          </Button>
          <Button variant="outline" size="sm" onClick={() => onForward?.(email)}>
            <Forward className="h-4 w-4 mr-1" />
            Forward
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default EmailDetailView;
