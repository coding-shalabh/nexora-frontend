'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UnifiedLayout } from '@/components/layout/unified';
import {
  Zap,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Tag,
  Clock,
  Search,
  Play,
  Pause,
  Activity,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Target,
  Sparkles,
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

// Trigger categories
const triggerCategories = [
  {
    id: 'contact',
    name: 'Contact Events',
    icon: Users,
    color: 'blue',
    triggers: [
      {
        id: 'contact_created',
        name: 'Contact Created',
        description: 'When a new contact is added',
      },
      {
        id: 'contact_updated',
        name: 'Contact Updated',
        description: 'When contact details change',
      },
      { id: 'tag_added', name: 'Tag Added', description: 'When a tag is added to contact' },
    ],
  },
  {
    id: 'message',
    name: 'Message Events',
    icon: MessageSquare,
    color: 'green',
    triggers: [
      { id: 'message_received', name: 'Message Received', description: 'When a message comes in' },
      { id: 'message_sent', name: 'Message Sent', description: 'When a message is sent' },
    ],
  },
  {
    id: 'time',
    name: 'Time-based',
    icon: Clock,
    color: 'purple',
    triggers: [
      { id: 'scheduled', name: 'Scheduled', description: 'At a specific time' },
      { id: 'delay', name: 'After Delay', description: 'After a time period' },
    ],
  },
];

// Active triggers
const activeTriggers = [
  {
    id: 'tr_1',
    name: 'New Contact Welcome',
    trigger: 'Contact Created',
    workflow: 'Welcome New Contacts',
    isActive: true,
    fires: 156,
    lastFired: '2 hours ago',
  },
  {
    id: 'tr_2',
    name: 'Follow-up Timer',
    trigger: 'After Delay (24h)',
    workflow: 'Follow-up Reminder',
    isActive: true,
    fires: 89,
    lastFired: '5 hours ago',
  },
  {
    id: 'tr_3',
    name: 'Message Alert',
    trigger: 'Message Received',
    workflow: 'Notify Sales Team',
    isActive: false,
    fires: 234,
    lastFired: '1 day ago',
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-200/50',
    icon: 'bg-blue-500/10 text-blue-600',
    text: 'text-blue-900',
    subtext: 'text-blue-600/80',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    border: 'border-green-200/50',
    icon: 'bg-green-500/10 text-green-600',
    text: 'text-green-900',
    subtext: 'text-green-600/80',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
    border: 'border-purple-200/50',
    icon: 'bg-purple-500/10 text-purple-600',
    text: 'text-purple-900',
    subtext: 'text-purple-600/80',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-200/50',
    icon: 'bg-amber-500/10 text-amber-600',
    text: 'text-amber-900',
    subtext: 'text-amber-600/80',
  },
};

export default function TriggersPage() {
  const [triggers, setTriggers] = useState(activeTriggers);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTrigger = (id) => {
    setTriggers(triggers.map((tr) => (tr.id === id ? { ...tr, isActive: !tr.isActive } : tr)));
  };

  // Filter triggers based on tab and search
  const filteredTriggers = triggers.filter((tr) => {
    const matchesSearch =
      tr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.workflow.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && tr.isActive) ||
      (activeTab === 'inactive' && !tr.isActive);
    return matchesSearch && matchesTab;
  });

  const activeCount = triggers.filter((t) => t.isActive).length;
  const totalFires = triggers.reduce((acc, t) => acc + t.fires, 0);

  return (
    <UnifiedLayout hubId="settings" pageTitle="Triggers" fixedMenu={null}>
      <motion.div
        className="flex-1 space-y-6 p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900">{triggers.length}</p>
                <p className="text-xs text-yellow-600/80">Total Triggers</p>
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
                <p className="text-2xl font-bold text-purple-900">{totalFires}</p>
                <p className="text-xs text-purple-600/80">Total Fires</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {triggerCategories.reduce((acc, c) => acc + c.triggers.length, 0)}
                </p>
                <p className="text-xs text-blue-600/80">Available Types</p>
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
                  value="active"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
                >
                  <Play className="h-4 w-4" />
                  Active ({activeCount})
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
                >
                  <Zap className="h-4 w-4" />
                  All ({triggers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="available"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
                >
                  <Sparkles className="h-4 w-4" />
                  Available Types
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search triggers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-[250px]"
                  />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Trigger
                </Button>
              </div>
            </div>

            {/* Active Triggers Tab */}
            <TabsContent value="active" className="space-y-4 mt-0">
              <TriggerList triggers={filteredTriggers} toggleTrigger={toggleTrigger} />
            </TabsContent>

            {/* All Triggers Tab */}
            <TabsContent value="all" className="space-y-4 mt-0">
              <TriggerList triggers={filteredTriggers} toggleTrigger={toggleTrigger} />
            </TabsContent>

            {/* Available Types Tab */}
            <TabsContent value="available" className="space-y-4 mt-0">
              <div className="grid gap-4 md:grid-cols-3">
                {triggerCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  const colors = colorClasses[category.color];
                  return (
                    <div
                      key={category.id}
                      className={`${colors.bg} rounded-2xl border ${colors.border} p-5`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`h-10 w-10 rounded-xl ${colors.icon} flex items-center justify-center`}
                        >
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${colors.text}`}>{category.name}</h3>
                          <p className={`text-xs ${colors.subtext}`}>
                            {category.triggers.length} triggers
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {category.triggers.map((trigger) => (
                          <div
                            key={trigger.id}
                            className="p-3 bg-white/60 rounded-xl hover:bg-white/80 cursor-pointer transition-colors"
                          >
                            <p className={`font-medium text-sm ${colors.text}`}>{trigger.name}</p>
                            <p className={`text-xs ${colors.subtext}`}>{trigger.description}</p>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Use Trigger
                      </Button>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Accordion */}
        <motion.div variants={itemVariants}>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem
              value="what-are-triggers"
              className="bg-gradient-to-br from-yellow-50/50 to-amber-50/50 rounded-2xl border border-yellow-200/50 px-6"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-yellow-900">What are Triggers?</h3>
                    <p className="text-sm text-yellow-600/80">Events that start your automations</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid gap-4 md:grid-cols-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 font-semibold text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-yellow-900">Events</p>
                      <p className="text-sm text-yellow-700/70">
                        Triggers fire when specific events happen (contact created, message
                        received)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 font-semibold text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-yellow-900">Conditions</p>
                      <p className="text-sm text-yellow-700/70">
                        Add filters to only fire when certain conditions are met
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 font-semibold text-sm shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-yellow-900">Actions</p>
                      <p className="text-sm text-yellow-700/70">
                        Connect to workflows to execute automated actions
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="best-practices"
              className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl border border-green-200/50 px-6"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-green-900">Best Practices</h3>
                    <p className="text-sm text-green-600/80">Tips for effective trigger setup</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid gap-3 md:grid-cols-2 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-900">
                      Use specific conditions to avoid unwanted fires
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-900">
                      Test triggers with a small dataset first
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-900">
                      Monitor fire counts to ensure expected behavior
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-900">
                      Pause triggers during data imports
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </motion.div>
    </UnifiedLayout>
  );
}

// Trigger List Component
function TriggerList({ triggers, toggleTrigger }) {
  if (triggers.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">No triggers found</p>
          <p className="text-sm text-muted-foreground/80">
            Create a trigger to start automating your workflows
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {triggers.map((trigger) => (
        <motion.div
          key={trigger.id}
          variants={itemVariants}
          className={`rounded-2xl border p-4 transition-all hover:shadow-md ${
            trigger.isActive
              ? 'bg-gradient-to-r from-white to-yellow-50/30 border-yellow-200/50'
              : 'bg-white hover:bg-gray-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  trigger.isActive ? 'bg-yellow-100' : 'bg-gray-100'
                }`}
              >
                <Zap
                  className={`h-6 w-6 ${trigger.isActive ? 'text-yellow-600' : 'text-gray-500'}`}
                />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {trigger.name}
                  <Badge
                    className={
                      trigger.isActive
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                    }
                  >
                    {trigger.isActive ? 'Active' : 'Paused'}
                  </Badge>
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                    {trigger.trigger}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-xs">{trigger.workflow}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {trigger.fires} fires
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last: {trigger.lastFired}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={trigger.isActive}
                onCheckedChange={() => toggleTrigger(trigger.id)}
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
                    <Play className="mr-2 h-4 w-4" />
                    Test Trigger
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
      ))}
    </div>
  );
}
