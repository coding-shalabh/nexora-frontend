'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Zap,
  Play,
  Pause,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  Mail,
  MessageSquare,
  Phone,
  Tag,
  CheckCircle2,
  Clock,
  GitBranch,
  Smartphone,
  Target,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Copy,
  FileText,
} from 'lucide-react';

// WhatsApp icon
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Mock data
const mockWorkflows = [
  {
    id: '1',
    name: 'New Lead Welcome',
    description: 'Send welcome message when a new lead is created',
    trigger: { type: 'lead.created', label: 'Lead Created' },
    actions: [
      { type: 'send_whatsapp', icon: WhatsAppIcon, color: 'text-green-500' },
      { type: 'wait', icon: Clock, color: 'text-gray-500' },
      { type: 'send_email', icon: Mail, color: 'text-blue-500' },
      { type: 'add_tag', icon: Tag, color: 'text-purple-500' },
    ],
    status: 'ACTIVE',
    executionCount: 1234,
    lastExecutedAt: new Date(Date.now() - 3600000),
    successRate: 98.5,
  },
  {
    id: '2',
    name: 'Deal Won Celebration',
    description: 'Send thank you message and create follow-up task when deal is won',
    trigger: { type: 'deal.won', label: 'Deal Won' },
    actions: [
      { type: 'send_whatsapp', icon: WhatsAppIcon, color: 'text-green-500' },
      { type: 'send_email', icon: Mail, color: 'text-blue-500' },
      { type: 'create_task', icon: CheckCircle2, color: 'text-yellow-500' },
    ],
    status: 'ACTIVE',
    executionCount: 456,
    lastExecutedAt: new Date(Date.now() - 7200000),
    successRate: 100,
  },
  {
    id: '3',
    name: 'Lead Score Update',
    description: 'Enroll in sequence when lead score exceeds threshold',
    trigger: { type: 'lead.score_changed', label: 'Lead Score Changed' },
    actions: [
      { type: 'condition', icon: GitBranch, color: 'text-pink-500' },
      { type: 'enroll_sequence', icon: Zap, color: 'text-yellow-500' },
      { type: 'assign_owner', icon: Users, color: 'text-primary' },
    ],
    status: 'PAUSED',
    executionCount: 89,
    lastExecutedAt: new Date(Date.now() - 86400000),
    successRate: 95.2,
  },
  {
    id: '4',
    name: 'Follow-up Reminder',
    description: 'Send SMS reminder for upcoming meetings',
    trigger: { type: 'scheduled', label: 'Scheduled' },
    actions: [
      { type: 'send_sms', icon: Smartphone, color: 'text-purple-500' },
    ],
    status: 'ACTIVE',
    executionCount: 567,
    lastExecutedAt: new Date(Date.now() - 1800000),
    successRate: 99.1,
  },
];

const triggerCategories = [
  {
    label: 'Contact',
    triggers: [
      { type: 'contact.created', label: 'Contact Created', icon: Users },
      { type: 'contact.updated', label: 'Contact Updated', icon: Users },
      { type: 'contact.tag_added', label: 'Tag Added', icon: Tag },
    ],
  },
  {
    label: 'Lead',
    triggers: [
      { type: 'lead.created', label: 'Lead Created', icon: Target },
      { type: 'lead.status_changed', label: 'Status Changed', icon: Target },
      { type: 'lead.score_changed', label: 'Score Changed', icon: TrendingUp },
    ],
  },
  {
    label: 'Deal',
    triggers: [
      { type: 'deal.created', label: 'Deal Created', icon: FileText },
      { type: 'deal.stage_changed', label: 'Stage Changed', icon: ArrowRight },
      { type: 'deal.won', label: 'Deal Won', icon: CheckCircle2 },
      { type: 'deal.lost', label: 'Deal Lost', icon: AlertCircle },
    ],
  },
  {
    label: 'Message',
    triggers: [
      { type: 'message.received', label: 'Message Received', icon: MessageSquare },
      { type: 'message.replied', label: 'Message Replied', icon: MessageSquare },
    ],
  },
];

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);

  const filteredWorkflows = workflows.filter((wf) => {
    const matchesSearch =
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && wf.status === 'ACTIVE') ||
      (filterStatus === 'paused' && wf.status === 'PAUSED');
    return matchesSearch && matchesStatus;
  });

  const toggleWorkflowStatus = (id) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id
          ? { ...wf, status: wf.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
          : wf
      )
    );
  };

  const stats = {
    total: workflows.length,
    active: workflows.filter((w) => w.status === 'ACTIVE').length,
    totalExecutions: workflows.reduce((sum, w) => sum + w.executionCount, 0),
    avgSuccessRate: (
      workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length
    ).toFixed(1),
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Automations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visual workflow builder for cross-channel automation
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowNewWorkflow(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Workflow
        </motion.button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 border-b border-border/50 bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Workflows</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <Play className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Target className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalExecutions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Executions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.avgSuccessRate}%</p>
            <p className="text-xs text-muted-foreground">Avg Success Rate</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 border-b border-border/50 px-6 py-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/50 bg-muted/30 py-2 pl-9 pr-4 text-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'paused'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                filterStatus === status
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <AnimatePresence>
            {filteredWorkflows.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg"
              >
                {/* Status Indicator */}
                <div
                  className={cn(
                    'absolute left-0 top-0 h-full w-1 transition-all',
                    workflow.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'
                  )}
                />

                <div className="p-5 pl-6">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                            workflow.status === 'ACTIVE'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-gray-500/10 text-gray-500'
                          )}
                        >
                          {workflow.status}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {workflow.trigger.label}
                        </span>
                      </div>
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {workflow.description}
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setSelectedWorkflow(
                            selectedWorkflow === workflow.id ? null : workflow.id
                          )
                        }
                        className="rounded-lg p-1 text-muted-foreground transition-all hover:bg-muted/50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      <AnimatePresence>
                        {selectedWorkflow === workflow.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-lg border border-border/50 bg-popover shadow-lg"
                          >
                            <button
                              onClick={() => toggleWorkflowStatus(workflow.id)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50"
                            >
                              {workflow.status === 'ACTIVE' ? (
                                <>
                                  <Pause className="h-4 w-4" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </button>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50">
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50">
                              <Copy className="h-4 w-4" />
                              Duplicate
                            </button>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Actions Flow */}
                  <div className="mb-4 flex items-center gap-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <ArrowRight className="mx-0.5 h-3 w-3 text-muted-foreground/50" />
                    {workflow.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center">
                        <div
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-lg',
                            action.color.replace('text-', 'bg-').replace('500', '500/10')
                          )}
                        >
                          <action.icon className={cn('h-3.5 w-3.5', action.color)} />
                        </div>
                        {actionIndex < workflow.actions.length - 1 && (
                          <ArrowRight className="mx-0.5 h-3 w-3 text-muted-foreground/50" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 border-t border-border/50 pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Executions</p>
                      <p className="text-lg font-semibold">{workflow.executionCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <p className="text-lg font-semibold text-green-500">{workflow.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Run</p>
                      <p className="text-lg font-semibold">{formatTimeAgo(workflow.lastExecutedAt)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No workflows found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Create your first automation workflow'}
            </p>
            {!searchQuery && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewWorkflow(true)}
                className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                Create Workflow
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* New Workflow Modal */}
      <AnimatePresence>
        {showNewWorkflow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setShowNewWorkflow(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl border border-border/50 bg-card p-6 shadow-xl"
            >
              <h2 className="mb-4 text-xl font-bold">Create New Workflow</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Choose a trigger to start your automation workflow.
              </p>

              <div className="space-y-6">
                {triggerCategories.map((category) => (
                  <div key={category.label}>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                      {category.label} Triggers
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {category.triggers.map((trigger) => (
                        <button
                          key={trigger.type}
                          className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-muted/30 p-4 text-center transition-all hover:border-primary/50 hover:bg-primary/5"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <trigger.icon className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-xs font-medium">{trigger.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewWorkflow(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
