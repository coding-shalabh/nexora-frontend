'use client';

import { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const mockArticles = [
  {
    id: 1,
    title: 'Getting Started Guide',
    category: 'Onboarding',
    status: 'published',
    views: 1245,
    lastUpdated: '2024-03-10',
  },
  {
    id: 2,
    title: 'How to Reset Password',
    category: 'Account',
    status: 'published',
    views: 892,
    lastUpdated: '2024-03-09',
  },
  {
    id: 3,
    title: 'API Integration Guide',
    category: 'Technical',
    status: 'draft',
    views: 0,
    lastUpdated: '2024-03-08',
  },
  {
    id: 4,
    title: 'Billing FAQ',
    category: 'Billing',
    status: 'published',
    views: 567,
    lastUpdated: '2024-03-07',
  },
  {
    id: 5,
    title: 'Troubleshooting Common Issues',
    category: 'Technical',
    status: 'published',
    views: 723,
    lastUpdated: '2024-03-06',
  },
];

export default function KBArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = mockArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    createStat('Total Articles', mockArticles.length, FileText, 'primary'),
    createStat(
      'Published',
      mockArticles.filter((a) => a.status === 'published').length,
      CheckCircle,
      'green'
    ),
    createStat('Drafts', mockArticles.filter((a) => a.status === 'draft').length, Clock, 'amber'),
    createStat(
      'Total Views',
      mockArticles.reduce((sum, a) => sum + a.views, 0).toLocaleString(),
      Eye,
      'blue'
    ),
  ];

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-amber-100 text-amber-700',
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  return (
    <UnifiedLayout hubId="home" pageTitle="Knowledge Base Articles" stats={stats} fixedMenu={null}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              All Articles
            </CardTitle>
            <CardDescription>Manage your knowledge base content</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
                    <TableCell>{article.views.toLocaleString()}</TableCell>
                    <TableCell>{new Date(article.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
