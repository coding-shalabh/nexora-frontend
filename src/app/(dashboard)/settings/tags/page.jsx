'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import {
  Tags,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Building2,
  Briefcase,
  Loader2,
  Hash,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '@/hooks/use-tags';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const PRESET_COLORS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Gray', value: '#6b7280' },
];

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#6366f1' });

  const { data: tagsData, isLoading } = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const tags = tagsData?.data || [];

  const handleCreateTag = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    try {
      await createTag.mutateAsync(formData);
      toast.success('Tag created successfully');
      setShowCreateDialog(false);
      setFormData({ name: '', color: '#6366f1' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create tag');
    }
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setFormData({ name: tag.name, color: tag.color || '#6366f1' });
    setShowRightPanel(true);
  };

  const handleClosePanel = () => {
    setShowRightPanel(false);
    setSelectedTag(null);
    setFormData({ name: '', color: '#6366f1' });
  };

  const handleUpdateTag = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    try {
      await updateTag.mutateAsync({ id: selectedTag.id, data: formData });
      toast.success('Tag updated successfully');
      handleClosePanel();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update tag');
    }
  };

  const handleDeleteTag = (tag) => {
    setSelectedTag(tag);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTag = async () => {
    try {
      await deleteTag.mutateAsync(selectedTag.id);
      toast.success('Tag deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedTag(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete tag');
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalContacts = tags.reduce((sum, tag) => sum + (tag._count?.contacts || 0), 0);
  const totalCompanies = tags.reduce((sum, tag) => sum + (tag._count?.companies || 0), 0);
  const totalDeals = tags.reduce((sum, tag) => sum + (tag._count?.deals || 0), 0);

  // Stats for header
  const headerStats = [
    createStat('Total Tags', tags.length.toString(), Hash, 'primary'),
    createStat('Tagged Contacts', totalContacts.toString(), Users, 'blue'),
    createStat('Tagged Companies', totalCompanies.toString(), Building2, 'green'),
    createStat('Tagged Deals', totalDeals.toString(), Briefcase, 'orange'),
  ];

  // Actions for header (icon only, no text)
  const headerActions = [
    createAction(null, Plus, () => setShowCreateDialog(true), { primary: true }),
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <UnifiedLayout
      hubId="settings"
      pageTitle="Tags"
      fixedMenu={null}
      stats={headerStats}
      actions={headerActions}
    >
      <motion.div
        className="flex-1 p-6 space-y-6 overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Search and Tags List */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">All Tags</h2>
              <p className="text-sm text-gray-500">
                {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-gray-50 border-0"
              />
            </div>
          </div>

          {/* Tags List */}
          {filteredTags.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <Tags className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900">No tags found</p>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Create your first tag to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tag
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Table Header */}
              <div className="px-6 py-3 bg-gray-50 grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-4">Tag</div>
                <div className="col-span-2 text-center">Contacts</div>
                <div className="col-span-2 text-center">Companies</div>
                <div className="col-span-2 text-center">Deals</div>
                <div className="col-span-1">Created</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Tag Rows */}
              {filteredTags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleEditTag(tag)}
                >
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${tag.color || '#6366f1'}15` }}
                      >
                        <Hash className="h-4 w-4" style={{ color: tag.color || '#6366f1' }} />
                      </div>
                      <Badge
                        className="font-medium px-3 py-1"
                        style={{
                          backgroundColor: `${tag.color || '#6366f1'}15`,
                          color: tag.color || '#6366f1',
                          border: 'none',
                        }}
                      >
                        {tag.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{tag._count?.contacts || 0}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{tag._count?.companies || 0}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{tag._count?.deals || 0}</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm text-gray-500">
                      {new Date(tag.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="col-span-1 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEditTag(tag)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Tag
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteTag(tag)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Tag
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Create Tag Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Tag</DialogTitle>
              <DialogDescription>Create a new tag to organize your CRM data</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name" className="text-gray-700">
                  Tag Name
                </Label>
                <Input
                  id="tag-name"
                  placeholder="e.g., VIP Customer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Color</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      className={cn(
                        'h-8 w-8 rounded-lg transition-all',
                        formData.color === color.value
                          ? 'ring-2 ring-offset-2 ring-gray-900'
                          : 'hover:ring-2 ring-gray-300'
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      title={color.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Label htmlFor="custom-color" className="text-sm text-gray-500">
                    Custom:
                  </Label>
                  <Input
                    id="custom-color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-8 w-16 p-1 cursor-pointer rounded-lg border-0"
                  />
                  <span className="text-sm text-gray-500 uppercase">{formData.color}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-500">Preview:</span>
                <Badge
                  className="font-medium px-3 py-1"
                  style={{
                    backgroundColor: `${formData.color}15`,
                    color: formData.color,
                    border: 'none',
                  }}
                >
                  {formData.name || 'Tag Name'}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setFormData({ name: '', color: '#6366f1' });
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTag}
                disabled={createTag.isPending}
                className="rounded-xl"
              >
                {createTag.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Tag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Right Sliding Panel for Tag Details */}
        <AnimatePresence>
          {showRightPanel && selectedTag && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={handleClosePanel}
              />

              {/* Sliding Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 overflow-y-auto"
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Edit Tag</h2>
                    <p className="text-sm text-gray-500">Update the tag name and color</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClosePanel}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Tag Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">Contacts</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {selectedTag._count?.contacts || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-green-600">Companies</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        {selectedTag._count?.companies || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-medium text-orange-600">Deals</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-900">
                        {selectedTag._count?.deals || 0}
                      </p>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="panel-tag-name" className="text-gray-700">
                        Tag Name
                      </Label>
                      <Input
                        id="panel-tag-name"
                        placeholder="e.g., VIP Customer"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11 rounded-xl bg-gray-50 border-0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color.value}
                            className={cn(
                              'h-10 w-10 rounded-lg transition-all',
                              formData.color === color.value
                                ? 'ring-2 ring-offset-2 ring-gray-900'
                                : 'hover:ring-2 ring-gray-300'
                            )}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setFormData({ ...formData, color: color.value })}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Label htmlFor="panel-custom-color" className="text-sm text-gray-500">
                          Custom:
                        </Label>
                        <Input
                          id="panel-custom-color"
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="h-8 w-16 p-1 cursor-pointer rounded-lg border-0"
                        />
                        <span className="text-sm text-gray-500 uppercase">{formData.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-500">Preview:</span>
                      <Badge
                        className="font-medium px-3 py-1"
                        style={{
                          backgroundColor: `${formData.color}15`,
                          color: formData.color,
                          border: 'none',
                        }}
                      >
                        {formData.name || 'Tag Name'}
                      </Badge>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Created{' '}
                      {new Date(selectedTag.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClosePanel}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateTag}
                    disabled={updateTag.isPending}
                    className="flex-1 rounded-xl"
                  >
                    {updateTag.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeleteTag(selectedTag);
                      handleClosePanel();
                    }}
                    className="rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the tag &quot;{selectedTag?.name}&quot; and remove it
                from all contacts, companies, and deals. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 rounded-xl"
                onClick={confirmDeleteTag}
                disabled={deleteTag.isPending}
              >
                {deleteTag.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Tag
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </UnifiedLayout>
  );
}
