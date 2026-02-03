'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const categories = ['Getting Started', 'Features', 'Account & Billing', 'Integrations', 'Technical Support', 'Troubleshooting'];

export default function NewArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
  });

  const handleSubmit = async (e, status = 'draft') => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast({
        title: 'Error',
        description: 'Title and content are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Success',
        description: `Article ${status === 'published' ? 'published' : 'saved as draft'} successfully`,
      });
      router.push('/service/kb/articles');
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/service/kb/articles">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">New Article</h1>
            <p className="text-muted-foreground">Create a new knowledge base article</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, 'draft')}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., How to get started with Nexora"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the article..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your article content here... (Supports Markdown)"
                rows={20}
                className="font-mono"
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tip: You can use Markdown formatting for headers, lists, links, and more.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href="/service/kb/articles">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish Article
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
