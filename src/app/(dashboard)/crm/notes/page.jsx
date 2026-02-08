'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  FileText,
  User,
  Building2,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  Loader2,
  StickyNote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useActivities, useCreateActivity } from '@/hooks/use-activities';
import { useToast } from '@/hooks/use-toast';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Note Card Component
function NoteCard({ note, onEdit, onDelete }) {
  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <StickyNote className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{note.title || 'Note'}</h3>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(note)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(note)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4 mb-3">
        {note.description || note.notes}
      </p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground border-t pt-3">
        {note.contact && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {note.contact.displayName || `${note.contact.firstName} ${note.contact.lastName}`}
          </span>
        )}
        {note.company && (
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {note.company.name}
          </span>
        )}
        {note.deal && (
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {note.deal.title}
          </span>
        )}
        {note.createdBy && (
          <span className="flex items-center gap-1 ml-auto">
            By {note.createdBy.name || note.createdBy.email}
          </span>
        )}
      </div>
    </Card>
  );
}

export default function CrmNotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const { toast } = useToast();

  // Fetch notes (activities of type NOTE)
  const { data, isLoading, refetch } = useActivities({
    type: 'NOTE',
    limit: 100,
  });

  const createActivity = useCreateActivity();

  const notes = useMemo(() => {
    const allNotes = data?.data || [];
    if (!searchQuery) return allNotes;
    const query = searchQuery.toLowerCase();
    return allNotes.filter(
      (note) =>
        note.title?.toLowerCase().includes(query) ||
        note.description?.toLowerCase().includes(query) ||
        note.notes?.toLowerCase().includes(query)
    );
  }, [data?.data, searchQuery]);

  // Stats
  const totalNotes = notes.length;
  const todayNotes = notes.filter((n) => {
    if (!n.createdAt) return false;
    const noteDate = new Date(n.createdAt).toDateString();
    const today = new Date().toDateString();
    return noteDate === today;
  }).length;

  const handleOpenAdd = () => {
    setFormData({ title: '', content: '' });
    setShowAddModal(true);
  };

  const handleOpenEdit = (note) => {
    setCurrentNote(note);
    setFormData({
      title: note.title || '',
      content: note.description || note.notes || '',
    });
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    if (!formData.content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Note content is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createActivity.mutateAsync({
        type: 'NOTE',
        title: formData.title || 'Note',
        description: formData.content,
      });
      setShowAddModal(false);
      setFormData({ title: '', content: '' });
      refetch();
      toast({
        title: 'Note Created',
        description: 'Your note has been saved',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create note',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (note) => {
    if (!confirm('Delete this note?')) return;
    toast({
      title: 'Note Deleted',
      description: 'The note has been removed',
    });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notes</h1>
            <p className="text-sm text-muted-foreground">
              {totalNotes} notes, {todayNotes} today
            </p>
          </div>
          <Button onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <StickyNote className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No notes yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? 'No notes match your search' : 'Start by adding your first note'}
            </p>
            {!searchQuery && (
              <Button onClick={handleOpenAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onEdit={handleOpenEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>Create a new note</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your note here..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createActivity.isPending}>
              {createActivity.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Update this note</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note title..."
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your note here..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEditModal(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
