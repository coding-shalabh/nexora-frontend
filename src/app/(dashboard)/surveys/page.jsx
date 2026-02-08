'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Send,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Filter,
  Calendar,
  Mail,
  MessageSquare,
  Smile,
  Meh,
  Frown,
  Copy,
  ExternalLink,
  Play,
  Pause,
} from 'lucide-react';

import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Mock surveys data
const mockSurveys = [
  {
    id: '1',
    name: 'Post-Purchase NPS',
    type: 'nps',
    status: 'active',
    responses: 245,
    sent: 500,
    npsScore: 42,
    promoters: 58,
    passives: 26,
    detractors: 16,
    lastResponse: '2024-12-23T10:30:00Z',
    createdAt: '2024-11-01T09:00:00Z',
  },
  {
    id: '2',
    name: 'Support Ticket CSAT',
    type: 'csat',
    status: 'active',
    responses: 189,
    sent: 350,
    csatScore: 4.2,
    distribution: { 5: 45, 4: 30, 3: 15, 2: 7, 1: 3 },
    lastResponse: '2024-12-23T09:15:00Z',
    createdAt: '2024-10-15T14:00:00Z',
  },
  {
    id: '3',
    name: 'Onboarding Experience',
    type: 'nps',
    status: 'active',
    responses: 67,
    sent: 120,
    npsScore: 55,
    promoters: 65,
    passives: 25,
    detractors: 10,
    lastResponse: '2024-12-22T16:45:00Z',
    createdAt: '2024-12-01T11:00:00Z',
  },
  {
    id: '4',
    name: 'Product Feature CSAT',
    type: 'csat',
    status: 'paused',
    responses: 98,
    sent: 200,
    csatScore: 3.8,
    distribution: { 5: 35, 4: 28, 3: 20, 2: 12, 1: 5 },
    lastResponse: '2024-12-20T12:00:00Z',
    createdAt: '2024-11-20T10:00:00Z',
  },
  {
    id: '5',
    name: 'Annual Customer Survey',
    type: 'nps',
    status: 'draft',
    responses: 0,
    sent: 0,
    npsScore: null,
    promoters: 0,
    passives: 0,
    detractors: 0,
    lastResponse: null,
    createdAt: '2024-12-22T15:00:00Z',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'paused':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'draft':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getNPSColor = (score) => {
  if (score >= 50) return 'text-green-600';
  if (score >= 0) return 'text-yellow-600';
  return 'text-red-600';
};

const getCSATColor = (score) => {
  if (score >= 4) return 'text-green-600';
  if (score >= 3) return 'text-yellow-600';
  return 'text-red-600';
};

export default function SurveysPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('surveys');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredSurveys = mockSurveys.filter((survey) => {
    const matchesSearch = survey.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || survey.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate overall metrics
  const npsSurveys = mockSurveys.filter((s) => s.type === 'nps' && s.npsScore !== null);
  const csatSurveys = mockSurveys.filter((s) => s.type === 'csat');
  const avgNPS =
    npsSurveys.length > 0
      ? Math.round(npsSurveys.reduce((acc, s) => acc + s.npsScore, 0) / npsSurveys.length)
      : 0;
  const avgCSAT =
    csatSurveys.length > 0
      ? (csatSurveys.reduce((acc, s) => acc + s.csatScore, 0) / csatSurveys.length).toFixed(1)
      : 0;
  const totalResponses = mockSurveys.reduce((acc, s) => acc + s.responses, 0);
  const responseRate = Math.round(
    (totalResponses / mockSurveys.reduce((acc, s) => acc + s.sent, 0)) * 100
  );

  // Build stats array
  const stats = [
    createStat('Average NPS', `${avgNPS > 0 ? '+' : ''}${avgNPS}`, TrendingUp, 'blue'),
    createStat('Average CSAT', `${avgCSAT}/5`, Star, 'green'),
    createStat('Total Responses', totalResponses, Users, 'purple'),
    createStat('Response Rate', `${responseRate}%`, BarChart3, 'amber'),
  ];

  // Dialog for creating survey
  const createSurveyDialog = (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Survey
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogDescription>Choose a survey type and configure your survey</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Survey Name</Label>
            <Input placeholder="e.g., Post-Purchase NPS Survey" />
          </div>
          <div className="space-y-2">
            <Label>Survey Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:border-primary border-2">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 mx-auto mb-3 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">NPS Survey</h4>
                  <p className="text-xs text-muted-foreground mt-1">Net Promoter Score (0-10)</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-primary border-2 border-transparent">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 mx-auto mb-3 flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold">CSAT Survey</h4>
                  <p className="text-xs text-muted-foreground mt-1">Customer Satisfaction (1-5)</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Survey Question</Label>
            <Textarea
              placeholder="How likely are you to recommend us to a friend or colleague?"
              defaultValue="How likely are you to recommend us to a friend or colleague?"
            />
          </div>
          <div className="space-y-2">
            <Label>Follow-up Question (Optional)</Label>
            <Textarea placeholder="What's the primary reason for your score?" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowCreateDialog(false)}>Create Survey</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <HubLayout
      hubId="surveys"
      title="Customer Surveys"
      description="Measure customer satisfaction with NPS and CSAT surveys"
      stats={stats}
      actions={createSurveyDialog}
      showFixedMenu={false}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-4 pb-2">
            <TabsList>
              <TabsTrigger value="surveys">All Surveys</TabsTrigger>
              <TabsTrigger value="nps">NPS Analysis</TabsTrigger>
              <TabsTrigger value="csat">CSAT Analysis</TabsTrigger>
            </TabsList>
          </div>

          {/* Surveys List */}
          <TabsContent value="surveys" className="flex-1 overflow-y-auto px-6 mt-0">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-4 pt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search surveys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="nps">NPS</SelectItem>
                  <SelectItem value="csat">CSAT</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Surveys Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-6">
              {filteredSurveys.map((survey) => (
                <Card key={survey.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(survey.status)}>
                          {survey.status === 'active' && <Play className="h-3 w-3 mr-1" />}
                          {survey.status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
                          {survey.status}
                        </Badge>
                        <Badge variant="secondary">{survey.type.toUpperCase()}</Badge>
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
                            View Results
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Survey
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Send Survey
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg mt-2">{survey.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Score Display */}
                    <div className="text-center py-4 border-y mb-4">
                      {survey.type === 'nps' ? (
                        survey.npsScore !== null ? (
                          <>
                            <p className={`text-4xl font-bold ${getNPSColor(survey.npsScore)}`}>
                              {survey.npsScore > 0 ? '+' : ''}
                              {survey.npsScore}
                            </p>
                            <p className="text-sm text-muted-foreground">NPS Score</p>
                            <div className="flex justify-center gap-4 mt-3 text-sm">
                              <span className="text-green-600">
                                <ThumbsUp className="h-3 w-3 inline mr-1" />
                                {survey.promoters}%
                              </span>
                              <span className="text-gray-500">
                                <Minus className="h-3 w-3 inline mr-1" />
                                {survey.passives}%
                              </span>
                              <span className="text-red-600">
                                <ThumbsDown className="h-3 w-3 inline mr-1" />
                                {survey.detractors}%
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="text-muted-foreground">No responses yet</p>
                        )
                      ) : (
                        <>
                          <p className={`text-4xl font-bold ${getCSATColor(survey.csatScore)}`}>
                            {survey.csatScore}
                          </p>
                          <p className="text-sm text-muted-foreground">out of 5</p>
                          <div className="flex justify-center gap-1 mt-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(survey.csatScore)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xl font-semibold">{survey.responses}</p>
                        <p className="text-xs text-muted-foreground">Responses</p>
                      </div>
                      <div>
                        <p className="text-xl font-semibold">
                          {survey.sent > 0 ? Math.round((survey.responses / survey.sent) * 100) : 0}
                          %
                        </p>
                        <p className="text-xs text-muted-foreground">Response Rate</p>
                      </div>
                    </div>

                    {survey.lastResponse && (
                      <div className="flex items-center justify-center gap-1 mt-4 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Last response: {new Date(survey.lastResponse).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSurveys.length === 0 && (
              <div className="text-center py-12">
                <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No surveys found</h3>
                <p className="text-muted-foreground">
                  Create your first survey to start collecting feedback
                </p>
                <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Survey
                </Button>
              </div>
            )}
          </TabsContent>

          {/* NPS Analysis */}
          <TabsContent value="nps" className="flex-1 overflow-y-auto px-6 mt-0">
            <div className="grid gap-6 md:grid-cols-2 py-4">
              <Card>
                <CardHeader>
                  <CardTitle>NPS Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of promoters, passives, and detractors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Smile className="h-4 w-4 text-green-600" />
                          Promoters (9-10)
                        </span>
                        <span className="text-sm font-medium text-green-600">58%</span>
                      </div>
                      <Progress value={58} className="h-3 bg-green-100" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Meh className="h-4 w-4 text-yellow-600" />
                          Passives (7-8)
                        </span>
                        <span className="text-sm font-medium text-yellow-600">26%</span>
                      </div>
                      <Progress value={26} className="h-3 bg-yellow-100" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Frown className="h-4 w-4 text-red-600" />
                          Detractors (0-6)
                        </span>
                        <span className="text-sm font-medium text-red-600">16%</span>
                      </div>
                      <Progress value={16} className="h-3 bg-red-100" />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Overall NPS Score</p>
                    <p className={`text-4xl font-bold ${getNPSColor(42)}`}>+42</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Promoters (58%) - Detractors (16%)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>NPS Trend</CardTitle>
                  <CardDescription>Score changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: 'Dec 2024', score: 42, change: 5 },
                      { month: 'Nov 2024', score: 37, change: -3 },
                      { month: 'Oct 2024', score: 40, change: 8 },
                      { month: 'Sep 2024', score: 32, change: 2 },
                      { month: 'Aug 2024', score: 30, change: 0 },
                    ].map((item) => (
                      <div
                        key={item.month}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <span className="text-sm">{item.month}</span>
                        <div className="flex items-center gap-4">
                          <span className={`text-lg font-bold ${getNPSColor(item.score)}`}>
                            {item.score > 0 ? '+' : ''}
                            {item.score}
                          </span>
                          {item.change !== 0 && (
                            <Badge
                              variant={item.change > 0 ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {item.change > 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {item.change > 0 ? '+' : ''}
                              {item.change}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CSAT Analysis */}
          <TabsContent value="csat" className="flex-1 overflow-y-auto px-6 mt-0">
            <div className="grid gap-6 md:grid-cols-2 py-4">
              <Card>
                <CardHeader>
                  <CardTitle>CSAT Distribution</CardTitle>
                  <CardDescription>Rating breakdown from 1 to 5</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percentage = { 5: 45, 4: 30, 3: 15, 2: 7, 1: 3 }[rating];
                      return (
                        <div key={rating}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium flex items-center gap-2">
                              {[...Array(rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              ))}
                            </span>
                            <span className="text-sm">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Average CSAT Score</p>
                    <div className="flex justify-center items-center gap-2 mt-2">
                      <p className="text-4xl font-bold text-green-600">4.2</p>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                    <div className="flex justify-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CSAT by Channel</CardTitle>
                  <CardDescription>Satisfaction scores across support channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { channel: 'WhatsApp', score: 4.5, icon: MessageSquare, responses: 89 },
                      { channel: 'Email', score: 4.1, icon: Mail, responses: 156 },
                      { channel: 'Live Chat', score: 4.3, icon: MessageSquare, responses: 67 },
                      { channel: 'Phone', score: 3.9, icon: MessageSquare, responses: 45 },
                    ].map((item) => (
                      <div
                        key={item.channel}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{item.channel}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.responses} responses
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= Math.round(item.score)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`font-semibold ${getCSATColor(item.score)}`}>
                            {item.score}
                          </span>
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
