'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  StickyNote,
  Pin,
  Trash2,
  Edit2,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  useConversationNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from '@/hooks/use-inbox-agent';

function formatTimeAgo(date) {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
}

function NoteCard({ note, onEdit, onDelete, onTogglePin, isDeleting }) {
  const isPinned = note.isPinned;
  const isPrivate = note.isPrivate;
  const author = note.user || { firstName: 'U', lastName: '', displayName: 'Unknown' };
  const initials =
    `${author.firstName?.[0] || ''}${author.lastName?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <div
      className={cn(
        'p-2 rounded-lg relative group',
        isPrivate ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50' : 'bg-muted/30',
        isPinned && 'ring-1 ring-primary/30'
      )}
    >
      {isPinned && <Pin className="absolute -top-1 -right-1 h-3 w-3 text-primary fill-primary" />}
      <div className="flex items-center gap-1.5 mb-1">
        <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-[7px] font-medium text-primary">{initials}</span>
        </div>
        <span className="text-[10px] font-medium">
          {author.displayName || `${author.firstName} ${author.lastName}`.trim()}
        </span>
        {isPrivate && (
          <Badge className="text-[8px] h-3.5 px-1 bg-amber-100 text-amber-700 border-0">
            Private
          </Badge>
        )}
        <span className="text-[9px] text-muted-foreground ml-auto">
          {formatTimeAgo(note.createdAt)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onEdit(note)} className="text-xs">
              <Edit2 className="h-3 w-3 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTogglePin(note)} className="text-xs">
              <Pin className="h-3 w-3 mr-2" /> {isPinned ? 'Unpin' : 'Pin'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(note)}
              className="text-xs text-destructive focus:text-destructive"
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-[11px] whitespace-pre-wrap">{note.content}</p>
      {note.mentions?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {note.mentions.map((mention, idx) => (
            <Badge key={idx} variant="secondary" className="text-[9px] h-4 px-1">
              @{mention}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function NotesPanel({ threadId, compact = false }) {
  const { toast } = useToast();
  const [noteContent, setNoteContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);

  // API hooks
  const { data: notesData, isLoading, isError, refetch } = useConversationNotes(threadId);

  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();

  const notes = notesData || [];

  // Sort notes: pinned first, then by date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    try {
      await createNoteMutation.mutateAsync({
        threadId,
        content: noteContent.trim(),
        isPrivate,
      });
      setNoteContent('');
      setIsPrivate(false);
      toast({
        title: 'Note added',
        description: 'Your note has been saved.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add note',
      });
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setIsPrivate(note.isPrivate);
  };

  const handleUpdateNote = async () => {
    if (!noteContent.trim() || !editingNote) return;

    try {
      await updateNoteMutation.mutateAsync({
        threadId,
        noteId: editingNote.id,
        content: noteContent.trim(),
        isPrivate,
      });
      setEditingNote(null);
      setNoteContent('');
      setIsPrivate(false);
      toast({
        title: 'Note updated',
        description: 'Your note has been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update note',
      });
    }
  };

  const handleDeleteNote = async () => {
    if (!deletingNote) return;

    try {
      await deleteNoteMutation.mutateAsync({
        threadId,
        noteId: deletingNote.id,
      });
      setDeletingNote(null);
      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete note',
      });
    }
  };

  const handleTogglePin = async (note) => {
    try {
      await updateNoteMutation.mutateAsync({
        threadId,
        noteId: note.id,
        isPinned: !note.isPinned,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update pin status',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setNoteContent('');
    setIsPrivate(false);
  };

  const isSubmitting = createNoteMutation.isPending || updateNoteMutation.isPending;

  if (isError) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground mb-2">Failed to load notes</p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Add/Edit Note Form */}
      <div className="space-y-1.5">
        <textarea
          placeholder={editingNote ? 'Edit your note...' : 'Add a note...'}
          className="w-full h-14 p-2 text-xs border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              className="h-3 w-3 rounded border-gray-300"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={isSubmitting}
            />
            Private (only you)
          </label>
          <div className="flex items-center gap-1">
            {editingNote && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] px-2"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            )}
            <Button
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={editingNote ? handleUpdateNote : handleAddNote}
              disabled={!noteContent.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  {editingNote ? 'Saving...' : 'Adding...'}
                </>
              ) : (
                <>
                  {editingNote ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Update
                    </>
                  ) : (
                    <>
                      <StickyNote className="h-3 w-3 mr-1" /> Add
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-1.5 pt-2 border-t">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-2 bg-muted/30 rounded-lg animate-pulse">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-4 w-4 rounded-full bg-muted" />
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-3 w-12 ml-auto bg-muted rounded" />
                </div>
                <div className="h-8 w-full bg-muted rounded" />
              </div>
            ))}
          </>
        ) : sortedNotes.length === 0 ? (
          <div className="text-center py-4">
            <StickyNote className="h-6 w-6 mx-auto mb-1 text-muted-foreground/50" />
            <p className="text-[10px] text-muted-foreground">
              No notes yet. Add a note to keep track of important details.
            </p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={setDeletingNote}
              onTogglePin={handleTogglePin}
              isDeleting={deleteNoteMutation.isPending}
            />
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingNote} onOpenChange={(open) => !open && setDeletingNote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteNoteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
