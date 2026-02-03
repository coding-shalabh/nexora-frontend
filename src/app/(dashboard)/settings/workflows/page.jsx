'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Workflow,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Zap,
  Clock,
  Users,
  Mail,
  MessageSquare,
  Search,
  Filter,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  GitBranch,
  Activity,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Mock workflows data
const workflowsData = [
  {
    id: 'wf_1',
    name: 'Welcome New Contacts',
    description: 'Send welcome message when a new contact is added',
    trigger: 'Contact Created',
    triggerIcon: Users,
    actions: ['Send WhatsApp', 'Add Tag'],
    isActive: true,
    runsCount: 156,
    lastRun: '2 hours ago',
  },
  {
    id: 'wf_2',
    name: 'Follow-up Reminder',
    description: 'Send reminder if no response after 24 hours',
    trigger: 'Time-based',
    triggerIcon: Clock,
    actions: ['Send Email', 'Create Task'],
    isActive: true,
    runsCount: 89,
    lastRun: '5 hours ago',
  },
  {
    id: 'wf_3',
    name: 'Lead Qualification',
    description: 'Auto-assign leads based on score',
    trigger: 'Lead Score Changed',
    triggerIcon: Zap,
    actions: ['Update Contact', 'Assign Owner', 'Send Notification'],
    isActive: false,
    runsCount: 45,
    lastRun: '1 day ago',
  },
  {
    id: 'wf_4',
    name: 'Deal Stage Notification',
    description: 'Notify team when deal moves to negotiation',
    trigger: 'Deal Updated',
    triggerIcon: GitBranch,
    actions: ['Send Email', 'Send Slack'],
    isActive: true,
    runsCount: 234,
    lastRun: '30 mins ago',
  },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(workflowsData);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleWorkflow = (id) => {
    setWorkflows(workflows.map((wf) => (wf.id === id ? { ...wf, isActive: !wf.isActive } : wf)));
  };

  // Filter workflows based on tab and search
  const filteredWorkflows = workflows.filter((wf) => {
    const matchesSearch =
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && wf.isActive) ||
      (activeTab === 'inactive' && !wf.isActive);
    return matchesSearch && matchesTab;
  });

  const activeCount = workflows.filter((w) => w.isActive).length;
  const totalRuns = workflows.reduce((acc, w) => acc + w.runsCount, 0);

  return (
    <motion.div
      className="flex-1 space-y-6 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Workflow className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{workflows.length}</p>
              <p className="text-xs text-blue-600/80">Total Workflows</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Play className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{activeCount}</p>
              <p className="text-xs text-green-600/80">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">{totalRuns}</p>
              <p className="text-xs text-purple-600/80">Total Runs</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">{workflows.length - activeCount}</p>
              <p className="text-xs text-amber-600/80">Paused</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <TabsList className="bg-white rounded-xl p-1 shadow-sm border">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
              >
                <Workflow className="h-4 w-4" />
                All ({workflows.length})
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
              >
                <Play className="h-4 w-4" />
                Active ({activeCount})
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
              >
                <Pause className="h-4 w-4" />
                Paused ({workflows.length - activeCount})
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[250px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4 mt-0">
            <WorkflowList workflows={filteredWorkflows} toggleWorkflow={toggleWorkflow} />
          </TabsContent>
          <TabsContent value="active" className="space-y-4 mt-0">
            <WorkflowList workflows={filteredWorkflows} toggleWorkflow={toggleWorkflow} />
          </TabsContent>
          <TabsContent value="inactive" className="space-y-4 mt-0">
            <WorkflowList workflows={filteredWorkflows} toggleWorkflow={toggleWorkflow} />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Info Accordion */}
      <motion.div variants={itemVariants}>
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem
            value="what-are-workflows"
            className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-200/50 px-6"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-blue-900">What are Workflows?</h3>
                  <p className="text-sm text-blue-600/80">Learn how automation works</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="grid gap-4 md:grid-cols-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Define Triggers</p>
                    <p className="text-sm text-blue-700/70">
                      Choose events that start your workflow (e.g., new contact, deal update)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Add Actions</p>
                    <p className="text-sm text-blue-700/70">
                      Define what happens when triggered (send email, update record, notify team)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Automate & Scale</p>
                    <p className="text-sm text-blue-700/70">
                      Your workflow runs automatically, saving hours of manual work
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="use-cases"
            className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl border border-amber-200/50 px-6"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-amber-900">Popular Use Cases</h3>
                  <p className="text-sm text-amber-600/80">Ideas to get you started</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="grid gap-3 md:grid-cols-2 pt-2">
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />
                  <span className="text-sm text-amber-900">
                    Welcome new leads with personalized emails
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />
                  <span className="text-sm text-amber-900">
                    Auto-assign deals to sales reps by region
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />
                  <span className="text-sm text-amber-900">
                    Send follow-ups after no response for 48 hours
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />
                  <span className="text-sm text-amber-900">
                    Notify team on Slack when high-value deal closes
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </motion.div>
  );
}

// Workflow List Component
function WorkflowList({ workflows, toggleWorkflow }) {
  if (workflows.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Workflow className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">No workflows found</p>
          <p className="text-sm text-muted-foreground/80">
            Try adjusting your search or create a new workflow
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {workflows.map((workflow) => {
        const TriggerIcon = workflow.triggerIcon;
        return (
          <motion.div
            key={workflow.id}
            variants={itemVariants}
            className={`rounded-2xl border p-4 transition-all hover:shadow-md ${
              workflow.isActive
                ? 'bg-gradient-to-r from-white to-green-50/30 border-green-200/50'
                : 'bg-white hover:bg-gray-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    workflow.isActive ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  <Workflow
                    className={`h-6 w-6 ${workflow.isActive ? 'text-green-600' : 'text-gray-500'}`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {workflow.name}
                    <Badge
                      className={
                        workflow.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                      }
                    >
                      {workflow.isActive ? 'Active' : 'Paused'}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full">
                      <TriggerIcon className="h-3 w-3" />
                      {workflow.trigger}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {workflow.runsCount} runs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last: {workflow.lastRun}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={workflow.isActive}
                  onCheckedChange={() => toggleWorkflow(workflow.id)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Play className="mr-2 h-4 w-4" />
                      Run Now
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
