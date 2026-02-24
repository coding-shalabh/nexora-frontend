'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeHtml } from '@/lib/sanitize';
import Link from 'next/link';
import {
  Plus,
  Search,
  Mail,
  Copy,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Grid3x3,
  List,
  Filter,
  Loader2,
  FileText,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  useEmailTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useDuplicateTemplate,
  useTemplateStats,
} from '@/hooks/use-templates';

const categories = [
  { value: 'all', label: 'All Templates' },
  { value: 'general', label: 'General' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'transactional', label: 'Transactional' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
];

export default function EmailTemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'general',
  });

  // Fetch templates
  const { data: templatesData, isLoading } = useEmailTemplates({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  const { data: statsData } = useTemplateStats();

  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();
  const duplicateTemplate = useDuplicateTemplate();

  const templates = templatesData?.data || [];
  const stats = statsData?.data || {};

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      !searchQuery ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = async () => {
    try {
      await createTemplate.mutateAsync({
        ...formData,
        type: 'email',
      });
      toast({
        title: 'Template created',
        description: 'Your email template has been created successfully.',
      });
      setIsCreateOpen(false);
      setFormData({ name: '', subject: '', content: '', category: 'general' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create template',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTemplate = async () => {
    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        ...formData,
      });
      toast({
        title: 'Template updated',
        description: 'Your email template has been updated successfully.',
      });
      setIsEditOpen(false);
      setSelectedTemplate(null);
      setFormData({ name: '', subject: '', content: '', category: 'general' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update template',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTemplate = async () => {
    try {
      await deleteTemplate.mutateAsync(selectedTemplate.id);
      toast({
        title: 'Template deleted',
        description: 'Your email template has been deleted.',
      });
      setIsDeleteOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = async (template) => {
    try {
      await duplicateTemplate.mutateAsync(template.id);
      toast({
        title: 'Template duplicated',
        description: 'A copy of the template has been created.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to duplicate template',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (template) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject || '',
      content: template.content || '',
      category: template.category || 'general',
    });
    setIsEditOpen(true);
  };

  const openPreviewDialog = (template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const openDeleteDialog = (template) => {
    setSelectedTemplate(template);
    setIsDeleteOpen(true);
  };

  const TemplateCard = ({ template }) => (
    <Card className="group relative overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Mail className="h-16 w-16 text-muted-foreground/20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold">{template.name}</h3>
            {template.subject && (
              <p className="text-sm text-muted-foreground line-clamp-1">{template.subject}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="capitalize">
            {template.category}
          </Badge>
          {template.variables?.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {template.variables.length} variables
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => openPreviewDialog(template)}
        >
          <Eye className="mr-2 h-3 w-3" />
          Preview
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => openEditDialog(template)}
        >
          <Edit className="mr-2 h-3 w-3" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleDuplicate(template)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => openDeleteDialog(template)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );

  const TemplateListItem = ({ template }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-32 h-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded flex items-center justify-center flex-shrink-0">
            <Mail className="h-8 w-8 text-muted-foreground/20" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-1">
              <h3 className="font-semibold">{template.name}</h3>
              {template.subject && (
                <p className="text-sm text-muted-foreground">{template.subject}</p>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="capitalize">
                {template.category}
              </Badge>
              {template.variables?.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {template.variables.length} variables
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                Updated {new Date(template.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => openPreviewDialog(template)}>
              <Eye className="mr-2 h-3 w-3" />
              Preview
            </Button>
            <Button size="sm" onClick={() => openEditDialog(template)}>
              <Edit className="mr-2 h-3 w-3" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => openDeleteDialog(template)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Stats for header
  const headerStats = [
    createStat({ label: 'Total', value: stats.total || 0, icon: FileText, color: 'blue' }),
    createStat({ label: 'Active', value: stats.active || 0, icon: Mail, color: 'green' }),
    createStat({ label: 'Email', value: stats.byType?.email || 0, icon: Mail, color: 'purple' }),
    createStat({ label: 'Inactive', value: stats.inactive || 0, icon: FileText, color: 'gray' }),
  ];

  // Actions for header
  const headerActions = [
    createAction({
      label: 'Create Template',
      icon: Plus,
      onClick: () => setIsCreateOpen(true),
    }),
  ];

  if (isLoading) {
    return (
      <UnifiedLayout hubId="marketing" pageTitle="Email Templates" fixedMenu={null}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout
      hubId="marketing"
      pageTitle="Email Templates"
      stats={headerStats}
      actions={headerActions}
      fixedMenu={null}
    >
      <div className="space-y-6 p-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-1 border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <TemplateListItem key={template.id} template={template} />
            ))}
          </div>
        )}

        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Create your first email template to get started'}
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Template Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
              <DialogDescription>
                Create a reusable email template. Use {`{{variableName}}`} for dynamic content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Welcome Email"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.value !== 'all')
                        .map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Welcome to {{company}}!"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Email Content (HTML)</Label>
                <Textarea
                  id="content"
                  placeholder="<p>Hello {{firstName}},</p><p>Welcome to our platform!</p>"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Supported variables: {`{{firstName}}`}, {`{{lastName}}`}, {`{{email}}`},{' '}
                  {`{{company}}`}, {`{{jobTitle}}`}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                disabled={!formData.name || !formData.content || createTemplate.isPending}
              >
                {createTemplate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Template Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Email Template</DialogTitle>
              <DialogDescription>
                Update your email template. Use {`{{variableName}}`} for dynamic content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Template Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.value !== 'all')
                        .map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Email Subject</Label>
                <Input
                  id="edit-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Email Content (HTML)</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTemplate}
                disabled={!formData.name || !formData.content || updateTemplate.isPending}
              >
                {updateTemplate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Template Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{selectedTemplate?.name}</DialogTitle>
              <DialogDescription>
                Subject: {selectedTemplate?.subject || 'No subject'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto border rounded-md p-4 bg-white">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(selectedTemplate?.content || ''),
                }}
              />
            </div>
            {selectedTemplate?.variables?.length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">Template Variables:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((v) => (
                    <Badge key={v} variant="secondary">
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsPreviewOpen(false);
                  openEditDialog(selectedTemplate);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{selectedTemplate?.name}&quot;? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTemplate}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteTemplate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </UnifiedLayout>
  );
}
