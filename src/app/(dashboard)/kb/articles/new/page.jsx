'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Lock,
  Star,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const categories = [
  { id: '1', name: 'Getting Started', icon: '🚀' },
  { id: '2', name: 'Account & Billing', icon: '💳' },
  { id: '3', name: 'Features & Tools', icon: '⚙️' },
  { id: '4', name: 'Integrations', icon: '🔗' },
  { id: '5', name: 'API Documentation', icon: '📘' },
  { id: '6', name: 'Troubleshooting', icon: '🔧' },
];

export default function NewArticlePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('editor');

  const [article, setArticle] = useState({
    title: '',
    slug: '',
    category: '',
    content: '',
    excerpt: '',
    status: 'draft',
    visibility: 'public',
    featured: false,
    allowComments: true,
    metaTitle: '',
    metaDescription: '',
    tags: [],
  });

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value) => {
    setArticle({
      ...article,
      title: value,
      slug: generateSlug(value),
    });
  };

  const ToolbarButton = ({ icon: Icon, onClick, active = false }) => (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/kb')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {article.title || 'New Article'}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{article.status}</Badge>
                {article.visibility === 'public' ? (
                  <Globe className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                {article.featured && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline">
              Save Draft
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Input
                placeholder="Article title..."
                value={article.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>kb.crm360.io/</span>
                <Input
                  value={article.slug}
                  onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                  className="max-w-xs h-7 text-sm"
                  placeholder="article-slug"
                />
              </div>
            </div>

            {/* Rich Text Toolbar */}
            <Card>
              <CardContent className="p-2">
                <div className="flex flex-wrap items-center gap-1">
                  <ToolbarButton icon={Undo} />
                  <ToolbarButton icon={Redo} />
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <ToolbarButton icon={Heading1} />
                  <ToolbarButton icon={Heading2} />
                  <ToolbarButton icon={Heading3} />
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <ToolbarButton icon={Bold} />
                  <ToolbarButton icon={Italic} />
                  <ToolbarButton icon={Underline} />
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <ToolbarButton icon={List} />
                  <ToolbarButton icon={ListOrdered} />
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <ToolbarButton icon={AlignLeft} />
                  <ToolbarButton icon={AlignCenter} />
                  <ToolbarButton icon={AlignRight} />
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <ToolbarButton icon={LinkIcon} />
                  <ToolbarButton icon={Image} />
                  <ToolbarButton icon={Code} />
                  <ToolbarButton icon={Quote} />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Textarea
              placeholder="Start writing your article content here...

You can use markdown syntax for formatting:

# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- Bullet points
- Another point

1. Numbered list
2. Another item

> Blockquote

`inline code`

```
code block
```

[Link text](url)
![Image alt](image-url)"
              value={article.content}
              onChange={(e) => setArticle({ ...article, content: e.target.value })}
              className="min-h-[500px] font-mono text-sm"
            />

            {/* Excerpt */}
            <div className="space-y-2">
              <Label>Article Excerpt</Label>
              <Textarea
                placeholder="Brief summary of the article (shown in search results and article lists)..."
                value={article.excerpt}
                onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                className="h-24"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="editor" className="flex-1">Settings</TabsTrigger>
              <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="p-4 space-y-6">
              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={article.status}
                  onValueChange={(value) => setArticle({ ...article, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={article.category}
                  onValueChange={(value) => setArticle({ ...article, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={article.visibility}
                  onValueChange={(value) => setArticle({ ...article, visibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Public
                      </span>
                    </SelectItem>
                    <SelectItem value="private">
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Private (Logged in users)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Featured */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured Article</Label>
                  <p className="text-xs text-muted-foreground">
                    Show in featured section
                  </p>
                </div>
                <Switch
                  checked={article.featured}
                  onCheckedChange={(checked) => setArticle({ ...article, featured: checked })}
                />
              </div>

              {/* Comments */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Comments</Label>
                  <p className="text-xs text-muted-foreground">
                    Users can leave feedback
                  </p>
                </div>
                <Switch
                  checked={article.allowComments}
                  onCheckedChange={(checked) => setArticle({ ...article, allowComments: checked })}
                />
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input placeholder="Add tags (comma separated)" />
                <div className="flex flex-wrap gap-1">
                  {['Getting Started', 'Tutorial', 'API'].map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="p-4 space-y-6">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={article.metaTitle || article.title}
                  onChange={(e) => setArticle({ ...article, metaTitle: e.target.value })}
                  placeholder="SEO title (defaults to article title)"
                />
                <p className="text-xs text-muted-foreground">
                  {(article.metaTitle || article.title).length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={article.metaDescription || article.excerpt}
                  onChange={(e) => setArticle({ ...article, metaDescription: e.target.value })}
                  placeholder="SEO description (defaults to excerpt)"
                  className="h-24"
                />
                <p className="text-xs text-muted-foreground">
                  {(article.metaDescription || article.excerpt).length}/160 characters
                </p>
              </div>

              {/* SEO Preview */}
              <div className="space-y-2">
                <Label>Search Preview</Label>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {article.metaTitle || article.title || 'Article Title'}
                    </p>
                    <p className="text-green-700 text-sm">
                      kb.crm360.io/{article.slug || 'article-slug'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {article.metaDescription || article.excerpt || 'Article description will appear here...'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
