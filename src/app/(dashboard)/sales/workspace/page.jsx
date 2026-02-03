'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Target,
  ListTodo,
  TrendingUp,
  Calendar,
  Zap,
  Phone,
  Mail,
  Video,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  MoreHorizontal,
  ChevronRight,
  Timer,
  AlertCircle,
  Flame,
  Trophy,
  Star,
  MessageSquare,
  FileText,
  Plus,
  Filter,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for daily goals
const dailyGoals = [
  { id: 1, title: 'Calls Made', current: 12, target: 20, icon: Phone, color: 'text-blue-500' },
  { id: 2, title: 'Emails Sent', current: 25, target: 30, icon: Mail, color: 'text-green-500' },
  { id: 3, title: 'Meetings Booked', current: 3, target: 5, icon: Calendar, color: 'text-purple-500' },
  { id: 4, title: 'Deals Created', current: 2, target: 3, icon: DollarSign, color: 'text-amber-500' },
];

// Mock data for task queue
const taskQueue = [
  {
    id: 1,
    type: 'call',
    title: 'Follow-up call with Acme Corp',
    contact: 'John Smith',
    company: 'Acme Corp',
    priority: 'high',
    dueTime: '10:00 AM',
    dealValue: 45000,
  },
  {
    id: 2,
    type: 'email',
    title: 'Send proposal to TechStart',
    contact: 'Sarah Johnson',
    company: 'TechStart Inc',
    priority: 'high',
    dueTime: '11:30 AM',
    dealValue: 32000,
  },
  {
    id: 3,
    type: 'meeting',
    title: 'Demo with Global Industries',
    contact: 'Mike Wilson',
    company: 'Global Industries',
    priority: 'medium',
    dueTime: '2:00 PM',
    dealValue: 78000,
  },
  {
    id: 4,
    type: 'task',
    title: 'Update deal notes for Nexus Co',
    contact: 'Emily Brown',
    company: 'Nexus Co',
    priority: 'low',
    dueTime: '4:00 PM',
    dealValue: 15000,
  },
];

// Mock data for active deals
const activeDeals = [
  {
    id: 1,
    name: 'Enterprise License - Acme Corp',
    company: 'Acme Corp',
    value: 125000,
    stage: 'Proposal',
    probability: 75,
    closeDate: '2025-01-15',
    lastActivity: '2 hours ago',
    owner: { name: 'You', avatar: null },
    health: 'good',
  },
  {
    id: 2,
    name: 'Annual Contract - TechStart',
    company: 'TechStart Inc',
    value: 48000,
    stage: 'Negotiation',
    probability: 60,
    closeDate: '2025-01-20',
    lastActivity: '1 day ago',
    owner: { name: 'You', avatar: null },
    health: 'at-risk',
  },
  {
    id: 3,
    name: 'Platform Upgrade - Global Ltd',
    company: 'Global Industries',
    value: 95000,
    stage: 'Discovery',
    probability: 40,
    closeDate: '2025-02-01',
    lastActivity: '3 hours ago',
    owner: { name: 'You', avatar: null },
    health: 'good',
  },
];

// Mock data for recent activities
const recentActivities = [
  { id: 1, type: 'email', description: 'Email opened by John Smith', time: '5 min ago', contact: 'John Smith' },
  { id: 2, type: 'call', description: 'Call completed with Sarah Johnson', time: '1 hour ago', contact: 'Sarah Johnson' },
  { id: 3, type: 'deal', description: 'Deal moved to Proposal stage', time: '2 hours ago', contact: 'Acme Corp' },
  { id: 4, type: 'meeting', description: 'Meeting scheduled with Mike Wilson', time: '3 hours ago', contact: 'Mike Wilson' },
  { id: 5, type: 'note', description: 'Note added to Global Industries deal', time: '4 hours ago', contact: 'Global Industries' },
];

// Performance metrics
const performanceMetrics = {
  thisWeek: {
    calls: 45,
    emails: 120,
    meetings: 8,
    dealsWon: 2,
    revenue: 73000,
  },
  lastWeek: {
    calls: 38,
    emails: 98,
    meetings: 6,
    dealsWon: 1,
    revenue: 45000,
  },
};

export default function SalesWorkspacePage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [completedTasks, setCompletedTasks] = useState([]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Video;
      default: return FileText;
    }
  };

  const getTaskColor = (type) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600';
      case 'email': return 'bg-green-100 text-green-600';
      case 'meeting': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-amber-500 bg-amber-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'good': return <Flame className="h-4 w-4 text-green-500" />;
      case 'at-risk': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'deal': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleCompleteTask = (taskId) => {
    setCompletedTasks([...completedTasks, taskId]);
  };

  const pendingTasks = taskQueue.filter(task => !completedTasks.includes(task.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Workspace</h1>
          <p className="text-muted-foreground">
            Good morning! You have {pendingTasks.length} tasks for today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Log
          </Button>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dailyGoals.map((goal, index) => {
          const Icon = goal.icon;
          const progress = (goal.current / goal.target) * 100;
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("p-2 rounded-lg", goal.color.replace('text-', 'bg-').replace('500', '100'))}>
                      <Icon className={cn("h-4 w-4", goal.color)} />
                    </div>
                    <span className="text-sm font-medium">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{goal.title}</p>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Queue */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5" />
                    Task Queue
                  </CardTitle>
                  <CardDescription>Your prioritized tasks for today</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-amber-500 mb-3" />
                    <p className="font-medium">All tasks completed!</p>
                    <p className="text-sm text-muted-foreground">Great job today</p>
                  </div>
                ) : (
                  pendingTasks.map((task) => {
                    const TaskIcon = getTaskIcon(task.type);
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className={cn("p-2 rounded-lg", getTaskColor(task.type))}>
                          <TaskIcon className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">{task.title}</span>
                            <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{task.contact}</span>
                            <span>•</span>
                            <span>{task.company}</span>
                            <span>•</span>
                            <span className="text-green-600 font-medium">{formatCurrency(task.dealValue)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {task.dueTime}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Play className="h-4 w-4 mr-2" />
                                Start Task
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Clock className="h-4 w-4 mr-2" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Add Note
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Deals */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Active Deals
                  </CardTitle>
                  <CardDescription>Your deals closing this month</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/pipeline/deals">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{deal.name}</span>
                        {getHealthIcon(deal.health)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span>{deal.company}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">{deal.stage}</Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(deal.value)}</p>
                      <p className="text-xs text-muted-foreground">
                        {deal.probability}% • Close: {new Date(deal.closeDate).toLocaleDateString()}
                      </p>
                    </div>

                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/pipeline/deals/${deal.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity & Performance */}
        <div className="space-y-6">
          {/* Performance Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{performanceMetrics.thisWeek.calls}</p>
                  <p className="text-xs text-muted-foreground">Calls</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+18%</span>
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{performanceMetrics.thisWeek.emails}</p>
                  <p className="text-xs text-muted-foreground">Emails</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+22%</span>
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{performanceMetrics.thisWeek.meetings}</p>
                  <p className="text-xs text-muted-foreground">Meetings</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+33%</span>
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{performanceMetrics.thisWeek.dealsWon}</p>
                  <p className="text-xs text-muted-foreground">Deals Won</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+100%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Revenue This Week</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(performanceMetrics.thisWeek.revenue)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto flex-col py-4">
                <Phone className="h-5 w-5 mb-1" />
                <span className="text-xs">Make Call</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <Mail className="h-5 w-5 mb-1" />
                <span className="text-xs">Send Email</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <Calendar className="h-5 w-5 mb-1" />
                <span className="text-xs">Book Meeting</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <FileText className="h-5 w-5 mb-1" />
                <span className="text-xs">Create Note</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
