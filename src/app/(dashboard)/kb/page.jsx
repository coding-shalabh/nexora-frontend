'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  FileText,
  Clock,
  Users,
  TrendingUp,
  Star,
  Filter,
  LayoutGrid,
  List,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

// Mock categories
const mockCategories = [
  { id: '1', name: 'Getting Started', icon: '🚀', articleCount: 12, color: 'bg-blue-100' },
  { id: '2', name: 'Account & Billing', icon: '💳', articleCount: 8, color: 'bg-green-100' },
  { id: '3', name: 'Features & Tools', icon: '⚙️', articleCount: 24, color: 'bg-purple-100' },
  { id: '4', name: 'Integrations', icon: '🔗', articleCount: 15, color: 'bg-orange-100' },
  { id: '5', name: 'API Documentation', icon: '📘', articleCount: 18, color: 'bg-cyan-100' },
  { id: '6', name: 'Troubleshooting', icon: '🔧', articleCount: 20, color: 'bg-red-100' },
];

// Mock articles
const mockArticles = [
  {
    id: '1',
    title: 'How to get started with Nexora',
    category: 'Getting Started',
    status: 'published',
    views: 1250,
    helpful: 45,
    notHelpful: 3,
    author: 'John Doe',
    updatedAt: '2024-12-20T10:00:00Z',
    featured: true,
  },
  {
    id: '2',
    title: 'Setting up your WhatsApp Business Account',
    category: 'Getting Started',
    status: 'published',
    views: 890,
    helpful: 32,
    notHelpful: 2,
    author: 'Jane Smith',
    updatedAt: '2024-12-19T14:30:00Z',
    featured: true,
  },
  {
    id: '3',
    title: 'Understanding billing and invoices',
    category: 'Account & Billing',
    status: 'published',
    views: 567,
    helpful: 28,
    notHelpful: 1,
    author: 'John Doe',
    updatedAt: '2024-12-18T09:15:00Z',
    featured: false,
  },
  {
    id: '4',
    title: 'API Authentication Guide',
    category: 'API Documentation',
    status: 'published',
    views: 432,
    helpful: 22,
    notHelpful: 4,
    author: 'Dev Team',
    updatedAt: '2024-12-17T16:45:00Z',
    featured: false,
  },
  {
    id: '5',
    title: 'Troubleshooting message delivery issues',
    category: 'Troubleshooting',
    status: 'published',
    views: 789,
    helpful: 38,
    notHelpful: 5,
    author: 'Support Team',
    updatedAt: '2024-12-16T11:20:00Z',
    featured: false,
  },
  {
    id: '6',
    title: 'Integrating with Zapier',
    category: 'Integrations',
    status: 'draft',
    views: 0,
    helpful: 0,
    notHelpful: 0,
    author: 'Jane Smith',
    updatedAt: '2024-12-22T08:00:00Z',
    featured: false,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'draft':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'archived':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('articles');

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalViews = mockArticles.reduce((acc, a) => acc + a.views, 0);
  const totalHelpful = mockArticles.reduce((acc, a) => acc + a.helpful, 0);

  // Stats for HubLayout
  const stats = [
    createStat('Total Articles', mockArticles.length.toString(), FileText, 'blue'),
    createStat('Categories', mockCategories.length.toString(), FolderOpen, 'purple'),
    createStat('Total Views', totalViews.toLocaleString(), Eye, 'green'),
    createStat('Helpful Votes', totalHelpful.toString(), ThumbsUp, 'orange'),
  ];

  return (
    <HubLayout
      hubId="kb"
      title="Knowledge Base"
      description="Create and manage help articles for your customers"
      stats={stats}
      showFixedMenu={false}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/kb/categories">
            <Button variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" />
              Categories
            </Button>
          </Link>
          <Link href="/kb/articles/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </Link>
        </div>
      }
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Articles Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                          {article.featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Public
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-base mt-2 line-clamp-2">{article.title}</CardTitle>
                      <CardDescription>
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" /> {article.helpful}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredArticles.map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{article.title}</h3>
                              {article.featured && (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {article.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getStatusColor(article.status)}`}
                              >
                                {article.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {article.views} views
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(article.updatedAt).toLocaleDateString()}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No articles found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Create your first article to get started'}
                </p>
                <Link href="/kb/articles/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    New Article
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockCategories.map((category) => (
                <Card
                  key={category.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-2xl`}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.articleCount} articles
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add Category Card */}
              <Card className="border-dashed hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="pt-6 flex flex-col items-center justify-center text-center min-h-[100px]">
                  <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Add Category</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Viewed Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockArticles
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((article, index) => (
                        <div key={article.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold text-muted-foreground w-6">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium line-clamp-1">{article.title}</p>
                              <p className="text-xs text-muted-foreground">{article.category}</p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {article.views.toLocaleString()} views
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Helpful Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockArticles
                      .filter((a) => a.helpful > 0)
                      .sort((a, b) => b.helpful - a.helpful)
                      .slice(0, 5)
                      .map((article, index) => (
                        <div key={article.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold text-muted-foreground w-6">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium line-clamp-1">{article.title}</p>
                              <p className="text-xs text-muted-foreground">{article.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{article.helpful}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HubLayout>
  );
}
