'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Plus,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  ChevronRight,
  Play,
  Star,
  Clock,
  Eye,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock playbooks data
const mockPlaybooks = [
  {
    id: 1,
    title: 'Discovery Call Framework',
    description: 'Structured approach for effective discovery calls with prospects',
    category: 'calls',
    type: 'script',
    views: 245,
    likes: 32,
    lastUpdated: '2 days ago',
    author: 'Sales Team',
    featured: true,
    sections: ['Introduction', 'Pain Discovery', 'Budget Qualification', 'Next Steps'],
  },
  {
    id: 2,
    title: 'Enterprise Demo Playbook',
    description: 'How to run winning product demos for enterprise prospects',
    category: 'demos',
    type: 'guide',
    views: 189,
    likes: 28,
    lastUpdated: '1 week ago',
    author: 'Sales Team',
    featured: true,
    sections: ['Pre-Demo Research', 'Demo Flow', 'Objection Handling', 'Close'],
  },
  {
    id: 3,
    title: 'Competitor Battlecard: Acme',
    description: 'Positioning and objection handling vs Acme competitor',
    category: 'competitive',
    type: 'battlecard',
    views: 156,
    likes: 19,
    lastUpdated: '3 days ago',
    author: 'Product Marketing',
    featured: false,
    sections: ['Overview', 'Strengths', 'Weaknesses', 'Talk Tracks'],
  },
  {
    id: 4,
    title: 'BANT Qualification Guide',
    description: 'Budget, Authority, Need, Timeline qualification framework',
    category: 'qualification',
    type: 'framework',
    views: 312,
    likes: 45,
    lastUpdated: '5 days ago',
    author: 'Sales Enablement',
    featured: true,
    sections: ['Budget Questions', 'Authority Mapping', 'Need Assessment', 'Timeline'],
  },
  {
    id: 5,
    title: 'Common Objection Responses',
    description: 'Proven responses to the most common sales objections',
    category: 'objections',
    type: 'guide',
    views: 423,
    likes: 67,
    lastUpdated: '1 day ago',
    author: 'Sales Team',
    featured: true,
    sections: ['Price Objections', 'Timing', 'Competition', 'Authority'],
  },
  {
    id: 6,
    title: 'Negotiation Tactics',
    description: 'Strategies for successful deal negotiations',
    category: 'negotiation',
    type: 'guide',
    views: 98,
    likes: 15,
    lastUpdated: '2 weeks ago',
    author: 'Sales Leadership',
    featured: false,
    sections: ['Preparation', 'Opening', 'Bargaining', 'Closing'],
  },
];

const playbookStats = {
  totalPlaybooks: 6,
  totalViews: 1423,
  featured: 4,
  totalLikes: 206,
};

export default function PlaybooksPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');

  const getTypeColor = (type) => {
    switch (type) {
      case 'script':
        return 'bg-blue-100 text-blue-700';
      case 'guide':
        return 'bg-green-100 text-green-700';
      case 'battlecard':
        return 'bg-red-100 text-red-700';
      case 'framework':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPlaybooks = mockPlaybooks.filter((playbook) => {
    return categoryFilter === 'all' || playbook.category === categoryFilter;
  });

  const featuredPlaybooks = filteredPlaybooks.filter((p) => p.featured);
  const regularPlaybooks = filteredPlaybooks.filter((p) => !p.featured);

  const stats = [
    createStat('Playbooks', playbookStats.totalPlaybooks, BookOpen, 'blue'),
    createStat('Views', playbookStats.totalViews, Eye, 'green'),
    createStat('Featured', playbookStats.featured, Star, 'orange'),
    createStat('Likes', playbookStats.totalLikes, ThumbsUp, 'purple'),
  ];

  const actions = [
    createAction('Create Playbook', Plus, () => console.log('create'), { primary: true }),
  ];

  return (
    <UnifiedLayout
      hubId="sales"
      pageTitle="Sales Playbooks"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6">
        {/* Category Filter */}
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
          <TabsList className="flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="demos">Demos</TabsTrigger>
            <TabsTrigger value="competitive">Battlecards</TabsTrigger>
            <TabsTrigger value="qualification">Qualification</TabsTrigger>
            <TabsTrigger value="objections">Objections</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Featured Playbooks */}
        {featuredPlaybooks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPlaybooks.map((playbook, index) => (
                <motion.div
                  key={playbook.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className={getTypeColor(playbook.type)}>
                          {playbook.type}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{playbook.title}</CardTitle>
                      <CardDescription>{playbook.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {playbook.sections.slice(0, 3).map((section, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                        {playbook.sections.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{playbook.sections.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {playbook.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {playbook.likes}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {playbook.lastUpdated}
                        </span>
                      </div>
                      <Button className="w-full" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Open Playbook
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Playbooks */}
        {regularPlaybooks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">All Playbooks</h2>
            <Card>
              <div className="divide-y">
                {regularPlaybooks.map((playbook) => (
                  <div
                    key={playbook.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{playbook.title}</span>
                        <Badge variant="outline" className={getTypeColor(playbook.type)}>
                          {playbook.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{playbook.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {playbook.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {playbook.likes}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Open
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {filteredPlaybooks.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No playbooks found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first playbook to help your team sell better
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Playbook
              </Button>
            </div>
          </Card>
        )}
      </div>
    </UnifiedLayout>
  );
}
