'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  MoreHorizontal,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  Ticket,
  MessageSquare,
  Package,
  Trash2,
  Edit,
  Copy,
  Award,
  Flag,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
} from 'lucide-react';

// Mock data for goals
const mockGoals = [
  {
    id: '1',
    name: 'Q1 Revenue Target',
    description: 'Achieve $500K in new revenue for Q1 2024',
    metric: 'revenue',
    target: 500000,
    current: 385000,
    unit: '$',
    period: 'quarterly',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    status: 'on-track',
    assignedTo: 'Sales Team',
    trend: 12.5,
  },
  {
    id: '2',
    name: 'New Customer Acquisition',
    description: 'Acquire 100 new customers this month',
    metric: 'customers',
    target: 100,
    current: 78,
    unit: '',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'on-track',
    assignedTo: 'Marketing Team',
    trend: 8.3,
  },
  {
    id: '3',
    name: 'Support Response Time',
    description: 'Average first response under 2 hours',
    metric: 'response_time',
    target: 2,
    current: 2.5,
    unit: 'hrs',
    period: 'weekly',
    startDate: '2024-01-15',
    endDate: '2024-01-21',
    status: 'at-risk',
    assignedTo: 'Support Team',
    trend: -5.2,
  },
  {
    id: '4',
    name: 'Lead Conversion Rate',
    description: 'Convert 25% of leads to opportunities',
    metric: 'conversion',
    target: 25,
    current: 22,
    unit: '%',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'on-track',
    assignedTo: 'Sales Team',
    trend: 3.1,
  },
  {
    id: '5',
    name: 'Customer Satisfaction Score',
    description: 'Maintain CSAT score above 4.5',
    metric: 'csat',
    target: 4.5,
    current: 4.7,
    unit: '/5',
    period: 'quarterly',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    status: 'achieved',
    assignedTo: 'Support Team',
    trend: 2.1,
  },
  {
    id: '6',
    name: 'Deals Closed',
    description: 'Close 50 deals this month',
    metric: 'deals',
    target: 50,
    current: 32,
    unit: '',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'behind',
    assignedTo: 'Sales Team',
    trend: -8.5,
  },
];

const metricConfig = {
  revenue: { label: 'Revenue', icon: DollarSign, color: 'text-green-600' },
  customers: { label: 'Customers', icon: Users, color: 'text-blue-600' },
  deals: { label: 'Deals', icon: Target, color: 'text-purple-600' },
  conversion: { label: 'Conversion', icon: TrendingUp, color: 'text-orange-600' },
  response_time: { label: 'Response Time', icon: Clock, color: 'text-red-600' },
  csat: { label: 'CSAT', icon: Award, color: 'text-yellow-600' },
  tickets: { label: 'Tickets', icon: Ticket, color: 'text-pink-600' },
};

const statusConfig = {
  'on-track': { label: 'On Track', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  'at-risk': { label: 'At Risk', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  behind: { label: 'Behind', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  achieved: { label: 'Achieved', color: 'bg-blue-100 text-blue-700', icon: Award },
};

function formatValue(value, unit) {
  if (unit === '$') {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  }
  return `${value}${unit}`;
}

function CreateGoalDialog({ open, onOpenChange, onSubmit, editGoal }) {
  const [formData, setFormData] = useState({
    name: editGoal?.name || '',
    description: editGoal?.description || '',
    metric: editGoal?.metric || 'revenue',
    target: editGoal?.target || '',
    unit: editGoal?.unit || '',
    period: editGoal?.period || 'monthly',
    assignedTo: editGoal?.assignedTo || '',
    startDate: editGoal?.startDate || '',
    endDate: editGoal?.endDate || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      target: parseFloat(formData.target),
    });
    setFormData({
      name: '',
      description: '',
      metric: 'revenue',
      target: '',
      unit: '',
      period: 'monthly',
      assignedTo: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
          <DialogDescription>
            {editGoal ? 'Update your goal settings' : 'Set a measurable goal to track progress'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Q1 Revenue Target"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this goal about?"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Metric</Label>
              <Select
                value={formData.metric}
                onValueChange={(value) => setFormData({ ...formData, metric: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(metricConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Select
                value={formData.period}
                onValueChange={(value) => setFormData({ ...formData, period: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="e.g., 100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., $, %, hrs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="e.g., Sales Team"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editGoal ? 'Save Changes' : 'Create Goal'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function GoalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [goals, setGoals] = useState(mockGoals);

  const filteredGoals = goals.filter((goal) => {
    if (filterStatus !== 'all' && goal.status !== filterStatus) return false;
    if (filterPeriod !== 'all' && goal.period !== filterPeriod) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        goal.name.toLowerCase().includes(query) || goal.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCreateGoal = (formData) => {
    if (editGoal) {
      setGoals(goals.map((g) => (g.id === editGoal.id ? { ...g, ...formData } : g)));
    } else {
      const newGoal = {
        id: Date.now().toString(),
        ...formData,
        current: 0,
        status: 'on-track',
        trend: 0,
      };
      setGoals([newGoal, ...goals]);
    }
    setCreateDialogOpen(false);
    setEditGoal(null);
  };

  const handleDelete = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleDuplicate = (goal) => {
    const duplicate = {
      ...goal,
      id: Date.now().toString(),
      name: `${goal.name} (Copy)`,
      current: 0,
      status: 'on-track',
    };
    setGoals([duplicate, ...goals]);
  };

  // Stats
  const onTrackCount = goals.filter((g) => g.status === 'on-track').length;
  const achievedCount = goals.filter((g) => g.status === 'achieved').length;
  const atRiskCount = goals.filter((g) => g.status === 'at-risk' || g.status === 'behind').length;

  // Layout stats
  const layoutStats = [
    createStat('Total Goals', goals.length.toString(), Target, 'blue'),
    createStat('On Track', onTrackCount.toString(), CheckCircle, 'green'),
    createStat('Achieved', achievedCount.toString(), Award, 'blue'),
    createStat('At Risk', atRiskCount.toString(), AlertCircle, 'red'),
  ];

  const actions = [
    createAction('New Goal', Plus, () => setCreateDialogOpen(true), { primary: true }),
  ];

  return (
    <UnifiedLayout
      hubId="analytics"
      pageTitle="Goals"
      stats={layoutStats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => {
            const MetricIcon = metricConfig[goal.metric]?.icon || Target;
            const StatusIcon = statusConfig[goal.status].icon;
            const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));

            return (
              <Card key={goal.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-10 w-10 rounded-lg flex items-center justify-center',
                          goal.status === 'achieved' ? 'bg-blue-100' : 'bg-primary/10'
                        )}
                      >
                        <MetricIcon
                          className={cn(
                            'h-5 w-5',
                            goal.status === 'achieved' ? 'text-blue-600' : 'text-primary'
                          )}
                        />
                      </div>
                      <Badge className={statusConfig[goal.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[goal.status].label}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditGoal(goal);
                            setCreateDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(goal)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(goal.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-semibold mb-1">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-2xl font-bold">
                        {formatValue(goal.current, goal.unit)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        of {formatValue(goal.target, goal.unit)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm font-medium">{progress}% complete</span>
                      <div className="flex items-center gap-1 text-sm">
                        {goal.trend >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={goal.trend >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {Math.abs(goal.trend)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{goal.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="capitalize">{goal.period}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredGoals.length === 0 && (
          <Card className="p-12 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No goals found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first goal to start tracking progress
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <CreateGoalDialog
          open={createDialogOpen}
          onOpenChange={(open) => {
            setCreateDialogOpen(open);
            if (!open) setEditGoal(null);
          }}
          onSubmit={handleCreateGoal}
          editGoal={editGoal}
        />
      </div>
    </UnifiedLayout>
  );
}
