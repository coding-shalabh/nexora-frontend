'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  Calendar,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Mock data
const mockArticles = [
  {
    id: 1,
    title: 'How to get started with Nexora',
    excerpt: 'Learn the basics of setting up and using Nexora for your business',
    category: 'Getting Started',
    author: 'John Doe',
    publishedAt: '2024-01-15',
    views: 1254,
    likes: 89,
    dislikes: 5,
    status: 'published',
  },
  {
    id: 2,
    title: 'Setting up your first project',
    excerpt: 'A step-by-step guide to creating your first project in Nexora',
    category: 'Getting Started',
    author: 'Jane Smith',
    publishedAt: '2024-01-10',
    views: 987,
    likes: 67,
    dislikes: 3,
    status: 'published',
  },
  {
    id: 3,
    title: 'Managing team permissions',
    excerpt: 'How to set up roles and permissions for your team members',
    category: 'Features',
    author: 'Mike Johnson',
    publishedAt: '2024-01-08',
    views: 856,
    likes: 54,
    dislikes: 2,
    status: 'published',
  },
  {
    id: 4,
    title: 'Billing and subscription FAQ',
    excerpt: 'Common questions about billing, subscriptions, and payments',
    category: 'Account & Billing',
    author: 'Sarah Williams',
    publishedAt: '2024-01-05',
    views: 742,
    likes: 43,
    dislikes: 8,
    status: 'published',
  },
  {
    id: 5,
    title: 'Integrating with third-party tools',
    excerpt: 'Connect Nexora with your favorite tools and services',
    category: 'Integrations',
    author: 'John Doe',
    publishedAt: '2024-01-03',
    views: 689,
    likes: 38,
    dislikes: 1,
    status: 'draft',
  },
];

const categories = [
  'All',
  'Getting Started',
  'Features',
  'Account & Billing',
  'Integrations',
  'Technical Support',
];
const statusOptions = ['All', 'Published', 'Draft'];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function KBArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [articles] = useState(mockArticles);

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = articles.reduce((sum, a) => sum + a.likes, 0);

  const layoutStats = useMemo(
    () => [
      createStat('Articles', articles.length, FileText, 'blue'),
      createStat('Published', publishedCount, Eye, 'green'),
      createStat('Views', totalViews.toLocaleString(), Eye, 'purple'),
      createStat('Helpful', totalLikes, ThumbsUp, 'orange'),
    ],
    [articles.length, publishedCount, totalViews, totalLikes]
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || article.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All' || article.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (articleId) => {
    if (confirm('Are you sure you want to delete this article?')) {
      // Implement delete logic
    }
  };

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Link href="/service/kb/articles/new">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </Link>
    </div>
  );

  const mainContent = (
    <div className="space-y-4">
      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || categoryFilter !== 'All' || statusFilter !== 'All'
              ? 'Try adjusting your filters'
              : 'Create your first article to get started'}
          </p>
          {!searchQuery && categoryFilter === 'All' && statusFilter === 'All' && (
            <Link href="/service/kb/articles/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link href={`/service/kb/articles/${article.id}`}>
                        <h3 className="font-medium hover:text-primary mb-1">{article.title}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <Badge
                          variant={article.status === 'published' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {article.status}
                        </Badge>
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <User className="h-3 w-3" />
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {article.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <ThumbsUp className="h-3 w-3" />
                          {article.likes}
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                          <ThumbsDown className="h-3 w-3" />
                          {article.dislikes}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/service/kb/articles/${article.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/service/kb/articles/${article.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(article.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <UnifiedLayout
      hubId="service"
      pageTitle="Knowledge Base Articles"
      stats={layoutStats}
      actions={[]}
      fixedMenu={null}
    >
      {mainContent}
    </UnifiedLayout>
  );
}
