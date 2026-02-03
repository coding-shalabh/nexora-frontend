'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  FolderOpen,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with actual API calls
const mockCategories = [
  { id: 1, name: 'Getting Started', description: 'Basic guides and tutorials', articleCount: 12, icon: '🚀' },
  { id: 2, name: 'Account & Billing', description: 'Account management and billing information', articleCount: 8, icon: '💳' },
  { id: 3, name: 'Technical Support', description: 'Technical help and troubleshooting', articleCount: 24, icon: '🔧' },
  { id: 4, name: 'Features', description: 'Product features and capabilities', articleCount: 18, icon: '✨' },
  { id: 5, name: 'Integrations', description: 'Third-party integrations and APIs', articleCount: 15, icon: '🔌' },
  { id: 6, name: 'Troubleshooting', description: 'Common issues and solutions', articleCount: 20, icon: '🔍' },
];

export default function KBCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState(mockCategories);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newCategory = {
        id: categories.length + 1,
        ...formData,
        articleCount: 0,
      };
      setCategories([...categories, newCategory]);
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      setIsCreateOpen(false);
      resetForm();
      setIsSubmitting(false);
    }, 500);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, ...formData }
            : cat
        )
      );
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      setIsEditOpen(false);
      setIsSubmitting(false);
    }, 500);
  };

  const handleDelete = (category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      setCategories(categories.filter((cat) => cat.id !== category.id));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/service/kb">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">KB Categories</h1>
            <p className="text-muted-foreground">Organize knowledge base articles</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{category.icon}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(category)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-semibold mb-2">{category.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{category.articleCount} articles</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Getting Started"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., 🚀"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Category'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                <Input
                  id="edit-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  maxLength={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
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
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
