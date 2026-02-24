'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Webhook,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Copy,
  Eye,
  Send,
  Activity,
  Search,
  Zap,
  Shield,
  FileJson,
} from 'lucide-react';

import { UnifiedLayout } from '@/components/layout/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Mock webhooks data
const webhooksData = [
  {
    id: 'wh_001',
    name: 'CRM Sync',
    url: 'https://crm.example.com/webhooks/crm360',
    status: 'active',
    events: ['contact.created', 'contact.updated', 'message.received'],
    createdAt: '2024-01-01T00:00:00Z',
    lastTriggered: '2024-01-15T14:30:00Z',
    successRate: 98.5,
    totalDeliveries: 1542,
    failedDeliveries: 23,
  },
  {
    id: 'wh_002',
    name: 'Slack Notifications',
    url: 'https://hooks.slack.com/services/xxx/yyy/zzz',
    status: 'active',
    events: ['conversation.assigned', 'conversation.resolved', 'sla.breached'],
    createdAt: '2024-01-05T00:00:00Z',
    lastTriggered: '2024-01-15T13:15:00Z',
    successRate: 100,
    totalDeliveries: 856,
    failedDeliveries: 0,
  },
  {
    id: 'wh_003',
    name: 'Analytics Pipeline',
    url: 'https://analytics.example.com/ingest',
    status: 'paused',
    events: ['message.sent', 'campaign.completed'],
    createdAt: '2024-01-10T00:00:00Z',
    lastTriggered: '2024-01-12T09:00:00Z',
    successRate: 95.2,
    totalDeliveries: 2341,
    failedDeliveries: 112,
  },
];

// Mock delivery logs
const deliveryLogs = [
  {
    id: 'del_001',
    webhookId: 'wh_001',
    webhookName: 'CRM Sync',
    event: 'contact.created',
    status: 'success',
    statusCode: 200,
    duration: 245,
    timestamp: '2024-01-15T14:30:00Z',
  },
  {
    id: 'del_002',
    webhookId: 'wh_002',
    webhookName: 'Slack Notifications',
    event: 'conversation.assigned',
    status: 'success',
    statusCode: 200,
    duration: 189,
    timestamp: '2024-01-15T14:28:00Z',
  },
  {
    id: 'del_003',
    webhookId: 'wh_001',
    webhookName: 'CRM Sync',
    event: 'message.received',
    status: 'failed',
    statusCode: 500,
    duration: 5000,
    timestamp: '2024-01-15T14:15:00Z',
    error: 'Connection timeout',
  },
  {
    id: 'del_004',
    webhookId: 'wh_001',
    webhookName: 'CRM Sync',
    event: 'contact.updated',
    status: 'success',
    statusCode: 200,
    duration: 312,
    timestamp: '2024-01-15T13:45:00Z',
  },
];

const availableEvents = [
  {
    category: 'Contacts',
    events: ['contact.created', 'contact.updated', 'contact.deleted'],
  },
  {
    category: 'Messages',
    events: ['message.received', 'message.sent', 'message.delivered', 'message.read'],
  },
  {
    category: 'Conversations',
    events: [
      'conversation.created',
      'conversation.assigned',
      'conversation.resolved',
      'conversation.reopened',
    ],
  },
  {
    category: 'Campaigns',
    events: ['campaign.started', 'campaign.completed', 'campaign.failed'],
  },
  { category: 'SLA', events: ['sla.warning', 'sla.breached'] },
];

export default function WebhooksPage() {
  const [activeTab, setActiveTab] = useState('webhooks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [showEditWebhook, setShowEditWebhook] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTestWebhook, setShowTestWebhook] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const activeWebhooks = webhooksData.filter((w) => w.status === 'active');
  const totalDeliveries = webhooksData.reduce((sum, w) => sum + w.totalDeliveries, 0);
  const failedDeliveries = webhooksData.reduce((sum, w) => sum + w.failedDeliveries, 0);

  const filteredWebhooks = webhooksData.filter(
    (webhook) =>
      webhook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (webhook) => {
    setSelectedWebhook(webhook);
    setSelectedEvents(webhook.events);
    setShowEditWebhook(true);
  };

  const handleDelete = (webhook) => {
    setSelectedWebhook(webhook);
    setShowDeleteConfirm(true);
  };

  const handleTest = (webhook) => {
    setSelectedWebhook(webhook);
    setShowTestWebhook(true);
  };

  const toggleEvent = (event) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <UnifiedLayout hubId="settings" pageTitle="Webhooks" fixedMenu={null}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-6 p-6"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between relative z-10"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
            <p className="text-muted-foreground">
              Configure webhooks to receive real-time event notifications
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedEvents([]);
              setShowCreateWebhook(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Webhook
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Webhook className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{webhooksData.length}</p>
                <p className="text-xs text-blue-600/80">Total Webhooks</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{activeWebhooks.length}</p>
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
                <p className="text-2xl font-bold text-purple-900">
                  {totalDeliveries.toLocaleString()}
                </p>
                <p className="text-xs text-purple-600/80">Total Deliveries</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-900">{failedDeliveries}</p>
                <p className="text-xs text-red-600/80">Failed Deliveries</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-gray-100/80">
                <TabsTrigger
                  value="webhooks"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  <Webhook className="h-4 w-4" />
                  Webhooks
                  <Badge variant="secondary" className="ml-1 bg-gray-200">
                    {webhooksData.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  <FileJson className="h-4 w-4" />
                  Delivery Logs
                  <Badge variant="secondary" className="ml-1 bg-gray-200">
                    {deliveryLogs.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search webhooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <TabsContent value="webhooks" className="space-y-4">
              <div className="grid gap-4">
                {filteredWebhooks.map((webhook) => (
                  <Card
                    key={webhook.id}
                    className={`rounded-2xl hover:shadow-md transition-all ${webhook.status === 'paused' ? 'opacity-70' : ''}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                              webhook.status === 'active'
                                ? 'bg-gradient-to-br from-green-100 to-emerald-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            <Webhook
                              className={`h-6 w-6 ${webhook.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{webhook.name}</h3>
                              {webhook.status === 'active' ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-gray-500">
                                  Paused
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                {webhook.url}
                              </code>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {webhook.events.map((event) => (
                                <Badge
                                  key={event}
                                  variant="outline"
                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {event}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p
                              className={`text-sm font-medium ${
                                webhook.successRate >= 95 ? 'text-green-600' : 'text-orange-600'
                              }`}
                            >
                              {webhook.successRate}%
                            </p>
                            <p className="text-xs text-muted-foreground">Success Rate</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {webhook.totalDeliveries.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Deliveries</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {formatTimeAgo(webhook.lastTriggered)}
                            </p>
                            <p className="text-xs text-muted-foreground">Last triggered</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(webhook)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTest(webhook)}>
                                <Send className="mr-2 h-4 w-4" />
                                Send Test
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {webhook.status === 'active' ? (
                                  <>
                                    <Pause className="mr-2 h-4 w-4" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(webhook)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <div className="grid gap-3">
                {deliveryLogs.map((log) => (
                  <Card key={log.id} className="rounded-2xl hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                              log.status === 'success'
                                ? 'bg-gradient-to-br from-green-100 to-emerald-100'
                                : 'bg-gradient-to-br from-red-100 to-rose-100'
                            }`}
                          >
                            {log.status === 'success' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{log.webhookName}</span>
                              <Badge variant="outline" className="text-xs">
                                {log.event}
                              </Badge>
                            </div>
                            {log.error && (
                              <p className="text-xs text-red-600 mt-0.5">{log.error}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <code
                              className={`text-sm font-mono ${
                                log.statusCode >= 200 && log.statusCode < 300
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {log.statusCode}
                            </code>
                            <p className="text-xs text-muted-foreground">Status</p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-sm font-medium ${log.duration > 2000 ? 'text-orange-600' : ''}`}
                            >
                              {log.duration}ms
                            </p>
                            <p className="text-xs text-muted-foreground">Duration</p>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <p className="text-sm font-medium">{formatTimeAgo(log.timestamp)}</p>
                            <p className="text-xs text-muted-foreground">Time</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {log.status === 'failed' && (
                              <Button variant="ghost" size="sm">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Accordion */}
        <motion.div variants={itemVariants}>
          <Accordion type="single" collapsible className="bg-white rounded-2xl border">
            <AccordionItem value="about" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Webhook className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">What are Webhooks?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>
                    Webhooks allow you to receive real-time HTTP notifications when events happen in
                    Nexora. Instead of polling for changes, webhooks push data to your application
                    instantly when events occur.
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Subscribe to specific events you care about</li>
                    <li>Receive JSON payloads with event data</li>
                    <li>Use webhook secrets to verify authenticity</li>
                    <li>Monitor delivery logs for troubleshooting</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="security" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Webhook Security</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use HTTPS endpoints for encrypted transmission</li>
                    <li>Verify webhook signatures using the secret key</li>
                    <li>Respond with 2xx status within 30 seconds</li>
                    <li>Implement idempotency for duplicate deliveries</li>
                    <li>Failed deliveries are retried with exponential backoff</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="events" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Available Events</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-3 text-muted-foreground">
                  {availableEvents.map((category) => (
                    <div key={category.category}>
                      <p className="font-medium text-foreground">{category.category}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {category.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Create/Edit Webhook Dialog */}
        <Dialog
          open={showCreateWebhook || showEditWebhook}
          onOpenChange={(open) => {
            if (!open) {
              setShowCreateWebhook(false);
              setShowEditWebhook(false);
            }
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{showEditWebhook ? 'Edit Webhook' : 'Create Webhook'}</DialogTitle>
              <DialogDescription>Configure webhook endpoint and events</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  placeholder="e.g., CRM Integration"
                  defaultValue={selectedWebhook?.name || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://example.com/webhook"
                  defaultValue={selectedWebhook?.url || ''}
                />
              </div>

              <div className="space-y-2">
                <Label>Events</Label>
                <div className="border rounded-xl p-3 max-h-[200px] overflow-y-auto space-y-4">
                  {availableEvents.map((category) => (
                    <div key={category.category}>
                      <p className="text-sm font-medium mb-2">{category.category}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {category.events.map((event) => (
                          <div key={event} className="flex items-center space-x-2">
                            <Checkbox
                              id={event}
                              checked={selectedEvents.includes(event)}
                              onCheckedChange={() => toggleEvent(event)}
                            />
                            <label htmlFor={event} className="text-sm cursor-pointer">
                              {event}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret">Secret (Optional)</Label>
                <Input id="secret" type="password" placeholder="Used to sign webhook payloads" />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateWebhook(false);
                  setShowEditWebhook(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowCreateWebhook(false);
                  setShowEditWebhook(false);
                }}
              >
                {showEditWebhook ? 'Save Changes' : 'Create Webhook'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Test Webhook Dialog */}
        <Dialog open={showTestWebhook} onOpenChange={setShowTestWebhook}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Test Webhook</DialogTitle>
              <DialogDescription>Send a test event to {selectedWebhook?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Event</Label>
                <Select defaultValue={selectedWebhook?.events[0]}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedWebhook?.events.map((event) => (
                      <SelectItem key={event} value={event}>
                        {event}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Payload Preview</Label>
                <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto">
                  {`{
  "event": "contact.created",
  "timestamp": "${new Date().toISOString()}",
  "data": {
    "id": "contact_test_123",
    "name": "Test Contact",
    "email": "test@example.com"
  }
}`}
                </pre>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTestWebhook(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowTestWebhook(false)}>
                <Send className="mr-2 h-4 w-4" />
                Send Test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Webhook?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the webhook "{selectedWebhook?.name}". You will no
                longer receive event notifications at this endpoint.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Delete Webhook
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </UnifiedLayout>
  );
}
