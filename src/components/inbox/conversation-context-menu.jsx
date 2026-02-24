'use client';

import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuShortcut,
} from '@/components/ui/context-menu';
import {
  Clock,
  Star,
  Archive,
  Trash2,
  UserPlus,
  MessageSquare,
  Tag,
  Pin,
  BellOff,
  Mail,
  Phone,
  Copy,
  ExternalLink,
  MailPlus,
  Forward,
  Reply,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Users,
  RefreshCw,
  Send,
  FileText,
  Link2,
} from 'lucide-react';
import { SnoozeDialog } from './snooze-dialog';
import {
  useToggleStar,
  useArchiveConversation,
  useUnarchiveConversation,
  useAssignConversation,
  useMarkAsRead,
  useResolveConversation,
  useReopenConversation,
} from '@/hooks/use-inbox';
import { useSnoozeConversation, useUnsnoozeConversation } from '@/hooks/use-inbox-agent';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

export function ConversationContextMenu({ children, conversation, onOpenChange }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showSnoozeDialog, setShowSnoozeDialog] = useState(false);

  const toggleStar = useToggleStar();
  const archiveConversation = useArchiveConversation();
  const unarchiveConversation = useUnarchiveConversation();
  const assignConversation = useAssignConversation();
  const markAsRead = useMarkAsRead();
  const resolveConversation = useResolveConversation();
  const reopenConversation = useReopenConversation();
  const unsnoozeConversation = useUnsnoozeConversation();

  const channelType = conversation?.channelType?.toLowerCase();
  const isStarred = conversation?.isStarred;
  const isSnoozed = conversation?.snoozedUntil && new Date(conversation.snoozedUntil) > new Date();
  const isArchived = conversation?.status === 'archived';
  const isResolved = conversation?.status === 'resolved';
  const isAssignedToMe = conversation?.assignedToId === user?.id;

  // Handle star toggle
  const handleToggleStar = async () => {
    try {
      await toggleStar.mutateAsync(conversation.id);
      toast({
        title: isStarred ? 'Removed from starred' : 'Added to starred',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  // Handle archive
  const handleArchive = async () => {
    try {
      if (isArchived) {
        await unarchiveConversation.mutateAsync(conversation.id);
      } else {
        await archiveConversation.mutateAsync(conversation.id);
      }
      toast({
        title: isArchived ? 'Conversation unarchived' : 'Conversation archived',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  // Handle assign to me
  const handleAssignToMe = async () => {
    try {
      await assignConversation.mutateAsync({
        conversationId: conversation.id,
        assignedTo: user.id,
      });
      toast({
        title: 'Conversation assigned to you',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  // Handle mark as read/unread
  const handleMarkAsRead = async (read = true) => {
    try {
      await markAsRead.mutateAsync(conversation.id);
      toast({
        title: read ? 'Marked as read' : 'Marked as unread',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  // Handle resolve/reopen
  const handleResolve = async () => {
    try {
      if (isResolved) {
        await reopenConversation.mutateAsync(conversation.id);
      } else {
        await resolveConversation.mutateAsync({ conversationId: conversation.id });
      }
      toast({
        title: isResolved ? 'Conversation reopened' : 'Conversation resolved',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  // Handle unsnooze
  const handleUnsnooze = async () => {
    try {
      await unsnoozeConversation.mutateAsync(conversation.id);
      toast({
        title: 'Snooze removed',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  // Copy contact info
  const handleCopyContact = () => {
    const text = conversation.contactPhone || conversation.contactEmail || conversation.contactName;
    if (text) {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copied to clipboard' });
    }
  };

  // Get channel-specific menu items
  const getChannelSpecificItems = () => {
    switch (channelType) {
      case 'whatsapp':
        return (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem disabled>
              <Send className="mr-2 h-4 w-4" />
              Send Template
            </ContextMenuItem>
            <ContextMenuItem disabled>
              <FileText className="mr-2 h-4 w-4" />
              View Media
            </ContextMenuItem>
          </>
        );

      case 'email':
        return (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem disabled>
              <Reply className="mr-2 h-4 w-4" />
              Reply
              <ContextMenuShortcut>R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled>
              <Forward className="mr-2 h-4 w-4" />
              Forward
              <ContextMenuShortcut>F</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled>
              <MailPlus className="mr-2 h-4 w-4" />
              Reply All
            </ContextMenuItem>
          </>
        );

      case 'sms':
        return (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem disabled>
              <Send className="mr-2 h-4 w-4" />
              Send Quick Reply
            </ContextMenuItem>
          </>
        );

      case 'voice':
        return (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem disabled>
              <Phone className="mr-2 h-4 w-4" />
              Call Back
            </ContextMenuItem>
            <ContextMenuItem disabled>
              <FileText className="mr-2 h-4 w-4" />
              View Call History
            </ContextMenuItem>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ContextMenu onOpenChange={onOpenChange}>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          {/* Primary actions */}
          <ContextMenuItem onClick={handleToggleStar}>
            <Star
              className={`mr-2 h-4 w-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`}
            />
            {isStarred ? 'Remove Star' : 'Add Star'}
            <ContextMenuShortcut>S</ContextMenuShortcut>
          </ContextMenuItem>

          {isSnoozed ? (
            <ContextMenuItem onClick={handleUnsnooze}>
              <BellOff className="mr-2 h-4 w-4" />
              Remove Snooze
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={() => setShowSnoozeDialog(true)}>
              <Clock className="mr-2 h-4 w-4" />
              Snooze
              <ContextMenuShortcut>Z</ContextMenuShortcut>
            </ContextMenuItem>
          )}

          <ContextMenuSeparator />

          {/* Assignment */}
          {!isAssignedToMe && (
            <ContextMenuItem onClick={handleAssignToMe}>
              <UserPlus className="mr-2 h-4 w-4" />
              Assign to Me
              <ContextMenuShortcut>A</ContextMenuShortcut>
            </ContextMenuItem>
          )}

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Users className="mr-2 h-4 w-4" />
              Assign to...
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem disabled>
                <span className="text-muted-foreground text-xs">Loading team members...</span>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          {/* Read status */}
          {conversation?.unreadCount > 0 ? (
            <ContextMenuItem onClick={() => handleMarkAsRead(true)}>
              <Eye className="mr-2 h-4 w-4" />
              Mark as Read
              <ContextMenuShortcut>M</ContextMenuShortcut>
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={() => handleMarkAsRead(false)}>
              <EyeOff className="mr-2 h-4 w-4" />
              Mark as Unread
              <ContextMenuShortcut>U</ContextMenuShortcut>
            </ContextMenuItem>
          )}

          {/* Resolve/Reopen */}
          <ContextMenuItem onClick={handleResolve}>
            {isResolved ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reopen
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Resolved
                <ContextMenuShortcut>E</ContextMenuShortcut>
              </>
            )}
          </ContextMenuItem>

          {/* Channel-specific actions */}
          {getChannelSpecificItems()}

          <ContextMenuSeparator />

          {/* Priority */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <span className="mr-2 h-4 w-4 flex items-center justify-center">
                {conversation?.priority === 'high' && (
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                )}
                {conversation?.priority === 'medium' && (
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                )}
                {conversation?.priority === 'low' && (
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                )}
                {!conversation?.priority && <span className="h-2 w-2 rounded-full bg-gray-300" />}
              </span>
              Priority
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-40">
              <ContextMenuItem onClick={() => toast({ title: 'Priority set to High' })}>
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                High
                {conversation?.priority === 'high' && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast({ title: 'Priority set to Medium' })}>
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                Medium
                {conversation?.priority === 'medium' && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast({ title: 'Priority set to Low' })}>
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                Low
                {conversation?.priority === 'low' && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => toast({ title: 'Priority cleared' })}>
                <XCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                Clear Priority
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          {/* Labels/Tags */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Tag className="mr-2 h-4 w-4" />
              Labels
              {conversation?.tags?.length > 0 && (
                <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">
                  {conversation.tags.length}
                </span>
              )}
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem onClick={() => toast({ title: 'Added VIP label' })}>
                <span className="h-2 w-2 rounded-full bg-purple-500 mr-2" />
                VIP
                {conversation?.tags?.includes('VIP') && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast({ title: 'Added Urgent label' })}>
                <span className="h-2 w-2 rounded-full bg-orange-500 mr-2" />
                Urgent
                {conversation?.tags?.includes('Urgent') && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast({ title: 'Added Bug label' })}>
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                Bug
                {conversation?.tags?.includes('Bug') && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast({ title: 'Added Feature label' })}>
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                Feature
                {conversation?.tags?.includes('Feature') && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast({ title: 'Added Follow-up label' })}>
                <span className="h-2 w-2 rounded-full bg-cyan-500 mr-2" />
                Follow-up
                {conversation?.tags?.includes('Follow-up') && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast({ title: 'Added Sales label' })}>
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                Sales
                {conversation?.tags?.includes('Sales') && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast({ title: 'Added Support label' })}>
                <span className="h-2 w-2 rounded-full bg-primary mr-2" />
                Support
                {conversation?.tags?.includes('Support') && (
                  <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                )}
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem disabled className="text-muted-foreground text-xs">
                <Tag className="mr-2 h-3 w-3" />
                Manage Labels...
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          {/* Copy actions */}
          <ContextMenuItem onClick={handleCopyContact}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Contact Info
          </ContextMenuItem>

          <ContextMenuItem disabled>
            <Link2 className="mr-2 h-4 w-4" />
            Copy Link
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* Archive/Delete */}
          <ContextMenuItem onClick={handleArchive}>
            <Archive className="mr-2 h-4 w-4" />
            {isArchived ? 'Unarchive' : 'Archive'}
            <ContextMenuShortcut>#</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuItem disabled className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Snooze Dialog */}
      <SnoozeDialog
        open={showSnoozeDialog}
        onOpenChange={setShowSnoozeDialog}
        conversationId={conversation?.id}
        conversationName={conversation?.contactName}
      />
    </>
  );
}
