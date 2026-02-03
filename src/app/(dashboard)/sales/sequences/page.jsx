'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mail,
  Phone,
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  Users,
  Edit,
  Copy,
  Trash2,
  ArrowRight,
  Eye,
  MessageSquare,
  Linkedin,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock sequences data
const mockSequences = [
  {
    id: 1,
    name: 'Enterprise Outbound',
    description: 'Multi-touch sequence for enterprise prospects',
    status: 'active',
    steps: [
      { type: 'email', day: 1 },
      { type: 'linkedin', day: 2 },
      { type: 'email', day: 4 },
      { type: 'call', day: 5 },
      { type: 'email', day: 7 },
    ],
    enrolled: 45,
    completed: 12,
    replied: 8,
    meetings: 3,
    openRate: 62,
    replyRate: 18,
    createdAt: '2024-12-01',
    owner: 'You',
  },
  {
    id: 2,
    name: 'Warm Lead Follow-up',
    description: 'Quick follow-up for warm leads',
    status: 'active',
    steps: [
      { type: 'email', day: 1 },
      { type: 'call', day: 2 },
      { type: 'email', day: 3 },
    ],
    enrolled: 28,
    completed: 15,
    replied: 12,
    meetings: 5,
    openRate: 78,
    replyRate: 43,
    createdAt: '2024-12-10',
    owner: 'You',
  },
  {
    id: 3,
    name: 'Demo No-Show Recovery',
    description: 'Re-engage prospects who missed demos',
    status: 'paused',
    steps: [
      { type: 'email', day: 1 },
      { type: 'call', day: 1 },
      { type: 'email', day: 2 },
      { type: 'linkedin', day: 3 },
    ],
    enrolled: 8,
    completed: 5,
    replied: 3,
    meetings: 2,
    openRate: 55,
    replyRate: 38,
    createdAt: '2024-12-15',
    owner: 'You',
  },
  {
    id: 4,
    name: 'SMB Quick Touch',
    description: 'Fast outreach for SMB segment',
    status: 'active',
    steps: [
      { type: 'email', day: 1 },
      { type: 'email', day: 3 },
      { type: 'call', day: 5 },
    ],
    enrolled: 120,
    completed: 65,
    replied: 22,
    meetings: 8,
    openRate: 45,
    replyRate: 18,
    createdAt: '2024-11-20',
    owner: 'You',
  },
];

// Stats
const stats = {
  totalEnrolled: 201,
  activeSequences: 3,
  avgOpenRate: 60,
  avgReplyRate: 29,
  meetingsBooked: 18,
};

export default function SalesSequencesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const layoutStats = useMemo(
    () => [
      createStat('Enrolled', stats.totalEnrolled, Users, 'blue'),
      createStat('Active', stats.activeSequences, Play, 'green'),
      createStat('Open Rate', `${stats.avgOpenRate}%`, Eye, 'purple'),
      createStat('Meetings', stats.meetingsBooked, MessageSquare, 'orange'),
    ],
    []
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const getStepIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-3 w-3" />;
      case 'call':
        return <Phone className="h-3 w-3" />;
      case 'linkedin':
        return <Linkedin className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  const getStepColor = (type) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-600';
      case 'call':
        return 'bg-green-100 text-green-600';
      case 'linkedin':
        return 'bg-sky-100 text-sky-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredSequences = mockSequences.filter((seq) => {
    const matchesSearch = seq.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || seq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
        </TabsList>
      </Tabs>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Create Sequence
      </Button>
    </div>
  );

  const mainContent = (
    <div className="space-y-4">
      {filteredSequences.map((sequence, index) => (
        <motion.div
          key={sequence.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{sequence.name}</h3>
                    <Badge variant={sequence.status === 'active' ? 'default' : 'secondary'}>
                      {sequence.status === 'active' ? (
                        <Play className="h-3 w-3 mr-1" />
                      ) : (
                        <Pause className="h-3 w-3 mr-1" />
                      )}
                      {sequence.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{sequence.description}</p>

                  {/* Steps visualization */}
                  <div className="flex items-center gap-1 mb-4">
                    {sequence.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className={cn('p-2 rounded-lg', getStepColor(step.type))}>
                          {getStepIcon(step.type)}
                        </div>
                        {idx < sequence.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                        )}
                      </div>
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">
                      {sequence.steps.length} steps over{' '}
                      {sequence.steps[sequence.steps.length - 1].day} days
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Enrolled</p>
                      <p className="font-semibold">{sequence.enrolled}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="font-semibold">{sequence.completed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Open Rate</p>
                      <p className="font-semibold text-blue-600">{sequence.openRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reply Rate</p>
                      <p className="font-semibold text-purple-600">{sequence.replyRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Meetings</p>
                      <p className="font-semibold text-green-600">{sequence.meetings}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Enroll
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
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
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {sequence.status === 'active' ? (
                        <DropdownMenuItem>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {filteredSequences.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Send className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No sequences found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first sequence to automate outreach
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Sequence
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <HubLayout
      title="Sales Sequences"
      description="Automate multi-touch outreach campaigns"
      stats={layoutStats}
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Search sequences..."
      actionButtons={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
