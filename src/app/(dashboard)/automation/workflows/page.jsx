'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Search,
  MoreHorizontal,
  Zap,
  Play,
  Pause,
  Trash2,
  Edit,
  Copy,
  GitBranch,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Mail,
  MessageSquare,
  Tag,
  Calendar,
  DollarSign,
  Ticket,
  Target,
  Filter,
  BarChart3,
  Eye,
  Settings,
  History,
} from 'lucide-react';

// Mock data for workflows
const mockWorkflows = [
  {
    id: '1',
    name: 'Welcome New Contacts',
    description: 'Send welcome message when a new contact is created via WhatsApp',
    trigger: { type: 'contact.created', label: 'Contact Created', icon: User },
    actions: [
      { type: 'send_whatsapp', label: 'Send WhatsApp' },
      { type: 'add_tag', label: 'Add Tag' },
      { type: 'create_task', label: 'Create Task' },
    ],
    status: 'active',
    executionsTotal: 1234,
    executionsToday: 45,
    successRate: 98.5,
    failedToday: 1,
    lastExecutedAt: '2024-01-20T10:30:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-18',
  },
  {
    id: '2',
    name: 'Deal Won Notification',
    description: 'Notify team when a deal is marked as won',
    trigger: { type: 'deal.won', label: 'Deal Won', icon: DollarSign },
    actions: [
      { type: 'send_email', label: 'Send Email' },
      { type: 'create_invoice', label: 'Create Invoice' },
      { type: 'notify_slack', label: 'Slack Notification' },
    ],
    status: 'active',
    executionsTotal: 89,
    executionsToday: 3,
    successRate: 100,
    failedToday: 0,
    lastExecutedAt: '2024-01-20T09:15:00',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'SLA Breach Alert',
    description: 'Escalate ticket when SLA is about to breach',
    trigger: { type: 'ticket.sla_warning', label: 'SLA Warning', icon: Clock },
    actions: [
      { type: 'reassign', label: 'Reassign Ticket' },
      { type: 'send_notification', label: 'Notify Manager' },
      { type: 'update_priority', label: 'Update Priority' },
    ],
    status: 'active',
    executionsTotal: 56,
    executionsToday: 8,
    successRate: 95.2,
    failedToday: 1,
    lastExecutedAt: '2024-01-20T10:45:00',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-19',
  },
  {
    id: '4',
    name: 'Lead Assignment',
    description: 'Auto-assign leads based on territory and availability',
    trigger: { type: 'lead.created', label: 'Lead Created', icon: User },
    actions: [
      { type: 'assign_user', label: 'Assign Owner' },
      { type: 'send_notification', label: 'Notify Owner' },
      { type: 'create_task', label: 'Create Follow-up' },
    ],
    status: 'paused',
    executionsTotal: 456,
    executionsToday: 0,
    successRate: 92.8,
    failedToday: 0,
    lastExecutedAt: '2024-01-18T16:00:00',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-18',
  },
  {
    id: '5',
    name: 'Invoice Reminder',
    description: 'Send reminder for overdue invoices',
    trigger: { type: 'invoice.overdue', label: 'Invoice Overdue', icon: Calendar },
    actions: [
      { type: 'send_email', label: 'Send Reminder' },
      { type: 'create_task', label: 'Follow-up Task' },
    ],
    status: 'draft',
    executionsTotal: 0,
    executionsToday: 0,
    successRate: 0,
    failedToday: 0,
    lastExecutedAt: null,
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19',
  },
  {
    id: '6',
    name: 'Meeting Follow-up',
    description: 'Send summary email after meeting ends',
    trigger: { type: 'meeting.ended', label: 'Meeting Ended', icon: Calendar },
    actions: [
      { type: 'send_email', label: 'Send Summary' },
      { type: 'create_task', label: 'Action Items' },
    ],
    status: 'active',
    executionsTotal: 234,
    executionsToday: 12,
    successRate: 99.1,
    failedToday: 0,
    lastExecutedAt: '2024-01-20T11:00:00',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-20',
  },
];

const triggerOptions = [
  { type: 'contact.created', label: 'Contact Created', icon: User },
  { type: 'contact.updated', label: 'Contact Updated', icon: User },
  { type: 'deal.created', label: 'Deal Created', icon: Target },
  { type: 'deal.stage_changed', label: 'Deal Stage Changed', icon: Target },
  { type: 'deal.won', label: 'Deal Won', icon: DollarSign },
  { type: 'deal.lost', label: 'Deal Lost', icon: XCircle },
  { type: 'ticket.created', label: 'Ticket Created', icon: Ticket },
  { type: 'ticket.sla_warning', label: 'SLA Warning', icon: Clock },
  { type: 'invoice.created', label: 'Invoice Created', icon: Calendar },
  { type: 'invoice.overdue', label: 'Invoice Overdue', icon: Calendar },
  { type: 'lead.created', label: 'Lead Created', icon: User },
  { type: 'meeting.scheduled', label: 'Meeting Scheduled', icon: Calendar },
  { type: 'meeting.ended', label: 'Meeting Ended', icon: Calendar },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700', icon: Pause },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: Edit },
};

function CreateWorkflowDialog({ open, onOpenChange, onSubmit, editWorkflow }) {
  const [formData, setFormData] = useState({
    name: editWorkflow?.name || '',
    description: editWorkflow?.description || '',
    triggerType: editWorkflow?.trigger?.type || 'contact.created',
    status: editWorkflow?.status || 'draft',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trigger = triggerOptions.find((t) => t.type === formData.triggerType);
    onSubmit({
      ...formData,
      trigger: trigger,
    });
    setFormData({
      name: '',
      description: '',
      triggerType: 'contact.created',
      status: 'draft',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editWorkflow ? 'Edit Workflow' : 'Create New Workflow'}</DialogTitle>
          <DialogDescription>
            {editWorkflow
              ? 'Update your workflow settings'
              : 'Automate tasks when specific events occur'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Welcome New Contacts"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What does this workflow do?"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Trigger Event</Label>
            <Select
              value={formData.triggerType}
              onValueChange={(value) => setFormData({ ...formData, triggerType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {triggerOptions.map((trigger) => (
                  <SelectItem key={trigger.type} value={trigger.type}>
                    {trigger.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Initial Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (inactive)</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editWorkflow ? 'Save Changes' : 'Create Workflow'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editWorkflow, setEditWorkflow] = useState(null);
  const [workflows, setWorkflows] = useState(mockWorkflows);

  const filteredWorkflows = workflows.filter((workflow) => {
    if (filterStatus !== 'all' && workflow.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        workflow.name.toLowerCase().includes(query) ||
        workflow.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCreateWorkflow = (formData) => {
    if (editWorkflow) {
      setWorkflows(workflows.map((w) =>
        w.id === editWorkflow.id ? { ...w, ...formData, updatedAt: new Date().toISOString() } : w
      ));
    } else {
      const newWorkflow = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        trigger: formData.trigger,
        actions: [],
        status: formData.status,
        executionsTotal: 0,
        executionsToday: 0,
        successRate: 0,
        failedToday: 0,
        lastExecutedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWorkflows([newWorkflow, ...workflows]);
    }
    setCreateDialogOpen(false);
    setEditWorkflow(null);
  };

  const handleToggleStatus = (id) => {
    setWorkflows(workflows.map((w) => {
      if (w.id === id) {
        const newStatus = w.status === 'active' ? 'paused' : 'active';
        return { ...w, status: newStatus };
      }
      return w;
    }));
  };

  const handleDelete = (id) => {
    setWorkflows(workflows.filter((w) => w.id !== id));
  };

  const handleDuplicate = (workflow) => {
    const duplicate = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      status: 'draft',
      executionsTotal: 0,
      executionsToday: 0,
      lastExecutedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkflows([duplicate, ...workflows]);
  };

  // Stats
  const activeCount = workflows.filter((w) => w.status === 'active').length;
  const totalExecutionsToday = workflows.reduce((sum, w) => sum + w.executionsToday, 0);
  const totalFailed = workflows.reduce((sum, w) => sum + w.failedToday, 0);
  const avgSuccessRate = workflows.filter((w) => w.successRate > 0).length > 0
    ? (workflows.filter((w) => w.successRate > 0).reduce((sum, w) => sum + w.successRate, 0) /
        workflows.filter((w) => w.successRate > 0).length).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Automate business processes with event-driven workflows</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{workflows.length}</div>
              <div className="text-sm text-muted-foreground">Total Workflows</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Play className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalExecutionsToday}</div>
              <div className="text-sm text-muted-foreground">Runs Today</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{avgSuccessRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={filterStatus === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => {
          const TriggerIcon = workflow.trigger.icon;
          const StatusIcon = statusConfig[workflow.status].icon;

          return (
            <Card key={workflow.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <Badge className={statusConfig[workflow.status].color}>
                        {statusConfig[workflow.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>

                    {/* Trigger & Actions */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted rounded-md text-sm">
                        <TriggerIcon className="h-3.5 w-3.5" />
                        <span>{workflow.trigger.label}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <GitBranch className="h-3.5 w-3.5" />
                        <span>{workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Play className="h-3.5 w-3.5" />
                        <span>{workflow.executionsTotal.toLocaleString()} total</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{workflow.executionsToday} today</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        <span>{workflow.successRate}% success</span>
                      </div>
                      {workflow.failedToday > 0 && (
                        <div className="flex items-center gap-1.5 text-red-600">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>{workflow.failedToday} failed</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <History className="h-3.5 w-3.5" />
                        <span>Last: {formatTimeAgo(workflow.lastExecutedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(workflow.id)}
                    disabled={workflow.status === 'draft'}
                  >
                    {workflow.status === 'active' ? (
                      <>
                        <Pause className="h-3.5 w-3.5 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    Configure
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
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditWorkflow(workflow);
                          setCreateDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(workflow)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <History className="h-4 w-4 mr-2" />
                        Execution History
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(workflow.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card className="p-12 text-center">
          <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first workflow to start automating tasks
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <CreateWorkflowDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditWorkflow(null);
        }}
        onSubmit={handleCreateWorkflow}
        editWorkflow={editWorkflow}
      />
    </div>
  );
}
