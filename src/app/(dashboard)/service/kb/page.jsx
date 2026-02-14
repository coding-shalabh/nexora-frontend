'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  BookOpen,
  FolderOpen,
  FileText,
  Eye,
  ThumbsUp,
  TrendingUp,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useKBStats, useKBCategories, useKBArticles } from '@/hooks/use-knowledge-base';

// Category icons mapping
const categoryIcons = {
  rocket: '🚀',
  'credit-card': '💳',
  wrench: '🔧',
  sparkles: '✨',
  plug: '🔌',
  search: '🔍',
  book: '📖',
  default: '📁',
};

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: stats, isLoading: statsLoading } = useKBStats();
  const { data: categories, isLoading: categoriesLoading } = useKBCategories({ isPublished: true });
  const { data: articlesData, isLoading: articlesLoading } = useKBArticles({
    isPublished: true,
    orderBy: 'popular',
    limit: 5,
  });
  const { data: recentData } = useKBArticles({
    isPublished: true,
    orderBy: 'recent',
    limit: 4,
  });

  const popularArticles = articlesData?.articles || [];
  const recentArticles = recentData?.articles || [];

  const isLoading = statsLoading || categoriesLoading || articlesLoading;

  const layoutStats = [
    createStat('Total Articles', String(stats?.totalArticles || 0), FileText, 'blue'),
    createStat('Categories', String(stats?.totalCategories || 0), FolderOpen, 'purple'),
    createStat(
      'Total Views',
      stats?.totalViews >= 1000
        ? `${(stats.totalViews / 1000).toFixed(1)}K`
        : String(stats?.totalViews || 0),
      Eye,
      'green'
    ),
    createStat('Helpful Votes', String(stats?.helpfulYes || 0), ThumbsUp, 'amber'),
  ];

  if (isLoading) {
    return (
      <UnifiedLayout
        hubId="service"
        pageTitle="Knowledge Base"
        stats={layoutStats}
        fixedMenu={null}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout hubId="service" pageTitle="Knowledge Base" stats={layoutStats} fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">Help center and documentation</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/service/kb/categories">
              <Button variant="outline">
                <FolderOpen className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/service/kb/articles/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Articles</div>
                <div className="text-2xl font-bold">{stats?.totalArticles || 0}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FolderOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Categories</div>
                <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Views</div>
                <div className="text-2xl font-bold">
                  {stats?.totalViews >= 1000
                    ? `${(stats.totalViews / 1000).toFixed(1)}K`
                    : stats?.totalViews || 0}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ThumbsUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Helpful Votes</div>
                <div className="text-2xl font-bold">
                  {stats?.helpfulYes >= 1000
                    ? `${(stats.helpfulYes / 1000).toFixed(1)}K`
                    : stats?.helpfulYes || 0}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
        </Card>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Browse by Category</h2>
            <Link href="/service/kb/articles">
              <Button variant="ghost" size="sm">
                View All Articles
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <Link key={category.id} href={`/service/kb/articles?category=${category.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">
                        {categoryIcons[category.icon] || categoryIcons.default}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.articleCount} articles
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular & Recent Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Articles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {popularArticles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No articles yet. Create your first article!
                </p>
              ) : (
                popularArticles.map((article) => (
                  <Link key={article.id} href={`/service/kb/articles/${article.id}`}>
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium mb-2 hover:text-primary">{article.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {article.category && (
                          <Badge variant="secondary" className="text-xs">
                            {article.category.name}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {article.helpfulYes}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recently Added
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentArticles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No articles yet. Create your first article!
                </p>
              ) : (
                recentArticles.map((article) => (
                  <Link key={article.id} href={`/service/kb/articles/${article.id}`}>
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium mb-2 hover:text-primary">{article.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {article.category && (
                          <Badge variant="secondary" className="text-xs">
                            {article.category.name}
                          </Badge>
                        )}
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedLayout>
  );
}
