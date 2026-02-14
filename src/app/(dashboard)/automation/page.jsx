'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Zap,
  Play,
  Pause,
  Clock,
  CheckCircle,
  XCircle,
  GitBranch,
  ArrowRight,
  MessageSquare,
  Mail,
  Tag,
  User,
  Calendar,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700' },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
};

// Mock data
const workflows = [
  {
    id: '1',
    name: 'Welcome New Contacts',
    description: 'Send welcome message when a new contact is created via WhatsApp',
    trigger: 'contact.created',
    triggerIcon: User,
    status: 'active',
    executionsTotal: 1234,
    executionsToday: 45,
    successRate: 98.5,
    lastExecutedAt: '2024-01-20T10:30:00',
    actions: ['Send WhatsApp message', 'Add tag', 'Create task'],
  },
  {
    id: '2',
    name: 'Deal Won Notification',
    description: 'Notify team when a deal is marked as won',
    trigger: 'deal.won',
    triggerIcon: CheckCircle,
    status: 'active',
    executionsTotal: 89,
    executionsToday: 3,
    successRate: 100,
    lastExecutedAt: '2024-01-20T09:15:00',
    actions: ['Send email', 'Create invoice', 'Notify Slack'],
  },
  {
    id: '3',
    name: 'SLA Breach Alert',
    description: 'Escalate ticket when SLA is about to breach',
    trigger: 'ticket.sla_warning',
    triggerIcon: Clock,
    status: 'active',
    executionsTotal: 56,
    executionsToday: 8,
    successRate: 95.2,
    lastExecutedAt: '2024-01-20T10:45:00',
    actions: ['Reassign ticket', 'Send notification', 'Update priority'],
  },
  {
    id: '4',
    name: 'Lead Nurturing Sequence',
    description: 'Multi-step nurturing campaign for new leads',
    trigger: 'lead.created',
    triggerIcon: User,
    status: 'paused',
    executionsTotal: 456,
    executionsToday: 0,
    successRate: 92.8,
    lastExecutedAt: '2024-01-18T16:00:00',
    actions: ['Wait 1 day', 'Send email', 'Wait 3 days', 'Send WhatsApp'],
  },
  {
    id: '5',
    name: 'Invoice Reminder',
    description: 'Send reminder for overdue invoices',
    trigger: 'invoice.overdue',
    triggerIcon: Calendar,
    status: 'draft',
    executionsTotal: 0,
    executionsToday: 0,
    successRate: 0,
    lastExecutedAt: null,
    actions: ['Send email reminder', 'Create task'],
  },
];

const templates = [
  { id: '1', name: 'Welcome Series', category: 'Onboarding', icon: Mail },
  { id: '2', name: 'Lead Scoring', category: 'Sales', icon: Tag },
  { id: '3', name: 'Support Escalation', category: 'Support', icon: Zap },
  { id: '4', name: 'WhatsApp Autoresponder', category: 'Messaging', icon: MessageSquare },
];

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

export default function AutomationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredWorkflows = workflows.filter((wf) => {
    if (statusFilter !== 'all' && wf.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return wf.name.toLowerCase().includes(query) || wf.description.toLowerCase().includes(query);
    }
    return true;
  });

  const activeCount = workflows.filter((w) => w.status === 'active').length;
  const totalExecutions = workflows.reduce((sum, w) => sum + w.executionsToday, 0);
  const avgSuccessRate = (
    workflows.filter((w) => w.successRate > 0).reduce((sum, w) => sum + w.successRate, 0) /
    workflows.filter((w) => w.successRate > 0).length
  ).toFixed(1);

  // Stats for HubLayout
  const stats = [
    createStat('Total Workflows', workflows.length.toString(), Zap, 'purple'),
    createStat('Active', activeCount.toString(), Play, 'green'),
    createStat('Executions Today', totalExecutions.toString(), Activity, 'blue'),
    createStat('Avg. Success Rate', `${avgSuccessRate}%`, CheckCircle, 'emerald'),
  ];

  const actions = [createAction('Create Workflow', Plus, () => {}, { primary: true })];

  return (
    <UnifiedLayout
      hubId="automation"
      pageTitle="Automation Overview"
      stats={stats}
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
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              {Object.keys(statusConfig).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {statusConfig[status].label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredWorkflows.map((workflow) => {
              const TriggerIcon = workflow.triggerIcon;
              return (
                <Card key={workflow.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{workflow.name}</h3>
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              statusConfig[workflow.status].color
                            )}
                          >
                            {statusConfig[workflow.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>

                        {/* Trigger & Actions */}
                        <div className="flex items-center gap-2 mt-3 text-sm">
                          <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded">
                            <TriggerIcon className="h-3 w-3" />
                            <span>{workflow.trigger}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {workflow.actions.length} action
                            {workflow.actions.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span>{workflow.executionsTotal.toLocaleString()} total runs</span>
                          <span>•</span>
                          <span>{workflow.executionsToday} today</span>
                          <span>•</span>
                          <span>{workflow.successRate}% success</span>
                          <span>•</span>
                          <span>Last: {formatTimeAgo(workflow.lastExecutedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {workflow.status === 'active' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Templates Sidebar */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Start Templates</h3>
              <div className="space-y-3">
                {templates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">{template.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Browse All Templates
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Execution Log</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Welcome New Contacts</span>
                  <span className="text-muted-foreground ml-auto">2m ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>SLA Breach Alert</span>
                  <span className="text-muted-foreground ml-auto">5m ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>Lead Nurturing</span>
                  <span className="text-muted-foreground ml-auto">15m ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Deal Won Notification</span>
                  <span className="text-muted-foreground ml-auto">1h ago</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View All Logs
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
}
