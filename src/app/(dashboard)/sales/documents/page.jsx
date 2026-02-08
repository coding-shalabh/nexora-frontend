'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Eye,
  Share2,
  BarChart3,
  Plus,
  MoreHorizontal,
  Download,
  Copy,
  Trash2,
  Upload,
  File,
  Presentation,
  FileSpreadsheet,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock documents data
const mockDocuments = [
  {
    id: 1,
    name: 'Enterprise Proposal Template',
    type: 'pdf',
    size: '2.4 MB',
    folder: 'Proposals',
    views: 45,
    uniqueViewers: 12,
    avgViewTime: '4:32',
    lastViewed: '2 hours ago',
    sharedWith: 8,
    status: 'active',
    createdAt: '2024-12-01',
  },
  {
    id: 2,
    name: 'Product Demo Deck',
    type: 'presentation',
    size: '8.1 MB',
    folder: 'Presentations',
    views: 89,
    uniqueViewers: 34,
    avgViewTime: '12:15',
    lastViewed: '30 min ago',
    sharedWith: 15,
    status: 'active',
    createdAt: '2024-11-15',
  },
  {
    id: 3,
    name: 'Pricing Calculator',
    type: 'spreadsheet',
    size: '456 KB',
    folder: 'Sales Tools',
    views: 156,
    uniqueViewers: 45,
    avgViewTime: '8:45',
    lastViewed: '1 hour ago',
    sharedWith: 22,
    status: 'active',
    createdAt: '2024-10-20',
  },
  {
    id: 4,
    name: 'Case Study - Acme Corp',
    type: 'pdf',
    size: '1.2 MB',
    folder: 'Case Studies',
    views: 34,
    uniqueViewers: 18,
    avgViewTime: '3:20',
    lastViewed: '1 day ago',
    sharedWith: 5,
    status: 'active',
    createdAt: '2024-12-10',
  },
  {
    id: 5,
    name: 'Standard Contract',
    type: 'document',
    size: '890 KB',
    folder: 'Contracts',
    views: 23,
    uniqueViewers: 8,
    avgViewTime: '6:10',
    lastViewed: '3 days ago',
    sharedWith: 3,
    status: 'draft',
    createdAt: '2024-12-05',
  },
];

const folders = [
  { name: 'Proposals', count: 12, icon: FileText, color: 'bg-blue-100 text-blue-600' },
  { name: 'Presentations', count: 8, icon: Presentation, color: 'bg-purple-100 text-purple-600' },
  { name: 'Case Studies', count: 6, icon: File, color: 'bg-green-100 text-green-600' },
  { name: 'Contracts', count: 4, icon: FileText, color: 'bg-amber-100 text-amber-600' },
  { name: 'Sales Tools', count: 3, icon: FileSpreadsheet, color: 'bg-cyan-100 text-cyan-600' },
];

const stats = {
  totalDocs: 33,
  totalViews: 347,
  activeLinks: 53,
  avgEngagement: 68,
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('all');

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'presentation':
        return <Presentation className="h-5 w-5" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-600';
      case 'presentation':
        return 'bg-orange-100 text-orange-600';
      case 'spreadsheet':
        return 'bg-green-100 text-green-600';
      case 'image':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const filteredDocuments = mockDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.folder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const layoutStats = useMemo(
    () => [
      createStat('Documents', stats.totalDocs, FileText, 'blue'),
      createStat('Views', stats.totalViews, Eye, 'green'),
      createStat('Links', stats.activeLinks, Link2, 'purple'),
      createStat('Engagement', `${stats.avgEngagement}%`, BarChart3, 'orange'),
    ],
    []
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button variant="outline">
        <Upload className="h-4 w-4 mr-2" />
        Upload
      </Button>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Create Link
      </Button>
    </div>
  );

  const mainContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="space-y-4">
          <h3 className="font-semibold">Folders</h3>
          <div className="space-y-2">
            {folders.map((folder) => {
              const Icon = folder.icon;
              return (
                <button
                  key={folder.name}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className={cn('p-2 rounded-lg', folder.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">{folder.count} files</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <div className="divide-y">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className={cn('p-3 rounded-lg', getFileColor(doc.type))}>
                    {getFileIcon(doc.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{doc.name}</span>
                      <Badge
                        variant={doc.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{doc.folder}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{doc.views}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{doc.uniqueViewers}</p>
                      <p className="text-xs text-muted-foreground">viewers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{doc.avgViewTime}</p>
                      <p className="text-xs text-muted-foreground">avg time</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{doc.sharedWith}</p>
                      <p className="text-xs text-muted-foreground">shared</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {filteredDocuments.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first document to start tracking
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <HubLayout
      hubId="sales"
      title="Sales Documents"
      description="Share and track engagement with your sales content"
      showSidebar={false}
      showTopBar={false}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
