'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Phone,
  PhoneCall,
  PhoneForwarded,
  Voicemail,
  MessageSquare,
  Clock,
  Users,
  Play,
  Pause,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  Volume2,
  Keyboard,
  Loader2,
  HelpCircle,
  Copy,
  MoreHorizontal,
  GitBranch,
} from 'lucide-react';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// IVR Node Types
const nodeTypes = {
  greeting: {
    icon: Volume2,
    color: 'bg-blue-500',
    label: 'Greeting',
    description: 'Play welcome message',
  },
  menu: {
    icon: Keyboard,
    color: 'bg-purple-500',
    label: 'Menu',
    description: 'DTMF menu options',
  },
  queue: {
    icon: Users,
    color: 'bg-green-500',
    label: 'Queue',
    description: 'Route to queue',
  },
  transfer: {
    icon: PhoneForwarded,
    color: 'bg-orange-500',
    label: 'Transfer',
    description: 'Transfer to agent/number',
  },
  voicemail: {
    icon: Voicemail,
    color: 'bg-red-500',
    label: 'Voicemail',
    description: 'Record voicemail',
  },
  hours: {
    icon: Clock,
    color: 'bg-yellow-500',
    label: 'Business Hours',
    description: 'Check business hours',
  },
  message: {
    icon: MessageSquare,
    color: 'bg-teal-500',
    label: 'Message',
    description: 'Play message and hang up',
  },
};

// Sample IVR Flow
const sampleFlow = {
  id: 'main',
  name: 'Main IVR',
  isActive: true,
  nodes: [
    {
      id: 'greeting-1',
      type: 'greeting',
      config: {
        message: 'Welcome to Acme Corp. Your call is important to us.',
        audioUrl: null,
      },
      next: 'hours-1',
    },
    {
      id: 'hours-1',
      type: 'hours',
      config: {
        timezone: 'Asia/Kolkata',
        schedule: {
          monday: { start: '09:00', end: '18:00' },
          tuesday: { start: '09:00', end: '18:00' },
          wednesday: { start: '09:00', end: '18:00' },
          thursday: { start: '09:00', end: '18:00' },
          friday: { start: '09:00', end: '18:00' },
        },
      },
      branches: {
        open: 'menu-1',
        closed: 'voicemail-1',
      },
    },
    {
      id: 'menu-1',
      type: 'menu',
      config: {
        message: 'Press 1 for Sales, Press 2 for Support, Press 0 to speak with an operator.',
        timeout: 10,
        maxRetries: 3,
        options: [
          { digit: '1', label: 'Sales', next: 'queue-sales' },
          { digit: '2', label: 'Support', next: 'queue-support' },
          { digit: '0', label: 'Operator', next: 'transfer-operator' },
        ],
      },
      defaultNext: 'voicemail-1',
    },
    {
      id: 'queue-sales',
      type: 'queue',
      config: {
        queueId: 'sales-queue',
        queueName: 'Sales Queue',
        holdMusic: 'default',
        maxWaitTime: 300,
        announcePosition: true,
      },
      next: 'voicemail-1',
    },
    {
      id: 'queue-support',
      type: 'queue',
      config: {
        queueId: 'support-queue',
        queueName: 'Support Queue',
        holdMusic: 'default',
        maxWaitTime: 300,
        announcePosition: true,
      },
      next: 'voicemail-1',
    },
    {
      id: 'transfer-operator',
      type: 'transfer',
      config: {
        type: 'agent',
        agentId: null,
        number: null,
        ringTimeout: 30,
      },
      next: 'voicemail-1',
    },
    {
      id: 'voicemail-1',
      type: 'voicemail',
      config: {
        message: 'Sorry, we are unable to take your call. Please leave a message after the beep.',
        maxDuration: 120,
        transcribe: true,
        notifyEmail: 'support@company.com',
      },
      next: null,
    },
  ],
};

// Node Editor Component
function NodeEditor({ node, onUpdate, onDelete, onClose }) {
  const [config, setConfig] = useState(node.config || {});
  const nodeType = nodeTypes[node.type];

  const handleSave = () => {
    onUpdate({ ...node, config });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b">
        <div
          className={cn(
            'h-10 w-10 rounded-lg flex items-center justify-center text-white',
            nodeType.color
          )}
        >
          <nodeType.icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">{nodeType.label}</h3>
          <p className="text-sm text-muted-foreground">{nodeType.description}</p>
        </div>
      </div>

      {/* Greeting Node Config */}
      {node.type === 'greeting' && (
        <div className="space-y-4">
          <div>
            <Label>Greeting Message</Label>
            <Textarea
              value={config.message || ''}
              onChange={(e) => setConfig({ ...config, message: e.target.value })}
              placeholder="Enter welcome message..."
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label>Or upload audio file</Label>
            <Input type="file" accept="audio/*" className="mt-1" />
          </div>
        </div>
      )}

      {/* Menu Node Config */}
      {node.type === 'menu' && (
        <div className="space-y-4">
          <div>
            <Label>Menu Message</Label>
            <Textarea
              value={config.message || ''}
              onChange={(e) => setConfig({ ...config, message: e.target.value })}
              placeholder="Press 1 for Sales, Press 2 for Support..."
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Timeout (seconds)</Label>
              <Input
                type="number"
                value={config.timeout || 10}
                onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Max Retries</Label>
              <Input
                type="number"
                value={config.maxRetries || 3}
                onChange={(e) => setConfig({ ...config, maxRetries: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Menu Options</Label>
            <div className="space-y-2 mt-2">
              {(config.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option.digit}
                    className="w-16"
                    placeholder="#"
                    onChange={(e) => {
                      const newOptions = [...config.options];
                      newOptions[index].digit = e.target.value;
                      setConfig({ ...config, options: newOptions });
                    }}
                  />
                  <Input
                    value={option.label}
                    className="flex-1"
                    placeholder="Option label"
                    onChange={(e) => {
                      const newOptions = [...config.options];
                      newOptions[index].label = e.target.value;
                      setConfig({ ...config, options: newOptions });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newOptions = config.options.filter((_, i) => i !== index);
                      setConfig({ ...config, options: newOptions });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [
                    ...(config.options || []),
                    { digit: '', label: '', next: null },
                  ];
                  setConfig({ ...config, options: newOptions });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Queue Node Config */}
      {node.type === 'queue' && (
        <div className="space-y-4">
          <div>
            <Label>Queue Name</Label>
            <Input
              value={config.queueName || ''}
              onChange={(e) => setConfig({ ...config, queueName: e.target.value })}
              placeholder="e.g., Sales Queue"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Max Wait Time (seconds)</Label>
              <Input
                type="number"
                value={config.maxWaitTime || 300}
                onChange={(e) => setConfig({ ...config, maxWaitTime: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Hold Music</Label>
              <Select
                value={config.holdMusic || 'default'}
                onValueChange={(value) => setConfig({ ...config, holdMusic: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="custom">Custom Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Announce Queue Position</Label>
            <Switch
              checked={config.announcePosition || false}
              onCheckedChange={(checked) => setConfig({ ...config, announcePosition: checked })}
            />
          </div>
        </div>
      )}

      {/* Transfer Node Config */}
      {node.type === 'transfer' && (
        <div className="space-y-4">
          <div>
            <Label>Transfer To</Label>
            <Select
              value={config.type || 'agent'}
              onValueChange={(value) => setConfig({ ...config, type: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Specific Agent</SelectItem>
                <SelectItem value="number">Phone Number</SelectItem>
                <SelectItem value="queue">Queue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {config.type === 'number' && (
            <div>
              <Label>Phone Number</Label>
              <Input
                value={config.number || ''}
                onChange={(e) => setConfig({ ...config, number: e.target.value })}
                placeholder="+1234567890"
                className="mt-1"
              />
            </div>
          )}
          <div>
            <Label>Ring Timeout (seconds)</Label>
            <Input
              type="number"
              value={config.ringTimeout || 30}
              onChange={(e) => setConfig({ ...config, ringTimeout: parseInt(e.target.value) })}
              className="mt-1"
            />
          </div>
        </div>
      )}

      {/* Voicemail Node Config */}
      {node.type === 'voicemail' && (
        <div className="space-y-4">
          <div>
            <Label>Voicemail Prompt</Label>
            <Textarea
              value={config.message || ''}
              onChange={(e) => setConfig({ ...config, message: e.target.value })}
              placeholder="Please leave a message after the beep..."
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Max Duration (seconds)</Label>
              <Input
                type="number"
                value={config.maxDuration || 120}
                onChange={(e) => setConfig({ ...config, maxDuration: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Notify Email</Label>
              <Input
                type="email"
                value={config.notifyEmail || ''}
                onChange={(e) => setConfig({ ...config, notifyEmail: e.target.value })}
                placeholder="notify@company.com"
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Transcribe Voicemail</Label>
            <Switch
              checked={config.transcribe || false}
              onCheckedChange={(checked) => setConfig({ ...config, transcribe: checked })}
            />
          </div>
        </div>
      )}

      {/* Hours Node Config */}
      {node.type === 'hours' && (
        <div className="space-y-4">
          <div>
            <Label>Timezone</Label>
            <Select
              value={config.timezone || 'Asia/Kolkata'}
              onValueChange={(value) => setConfig({ ...config, timezone: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                <SelectItem value="America/New_York">US Eastern</SelectItem>
                <SelectItem value="America/Los_Angeles">US Pacific</SelectItem>
                <SelectItem value="Europe/London">UK (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Business Hours</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Configure when calls are routed to the "open" branch
            </p>
            <div className="space-y-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
                (day) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="w-24 text-sm capitalize">{day}</span>
                    <Input
                      type="time"
                      className="w-28"
                      value={config.schedule?.[day]?.start || ''}
                      onChange={(e) => {
                        const schedule = { ...config.schedule };
                        schedule[day] = { ...schedule[day], start: e.target.value };
                        setConfig({ ...config, schedule });
                      }}
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      className="w-28"
                      value={config.schedule?.[day]?.end || ''}
                      onChange={(e) => {
                        const schedule = { ...config.schedule };
                        schedule[day] = { ...schedule[day], end: e.target.value };
                        setConfig({ ...config, schedule });
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message Node Config */}
      {node.type === 'message' && (
        <div className="space-y-4">
          <div>
            <Label>Message to Play</Label>
            <Textarea
              value={config.message || ''}
              onChange={(e) => setConfig({ ...config, message: e.target.value })}
              placeholder="Thank you for calling. Goodbye."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Node
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// IVR Flow Node Component
function IVRNode({ node, isSelected, onClick, onAddNode }) {
  const nodeType = nodeTypes[node.type];
  if (!nodeType) return null;

  return (
    <div className="relative group">
      <div
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
          'hover:shadow-md',
          isSelected ? 'border-primary shadow-md' : 'border-border'
        )}
      >
        <div
          className={cn(
            'h-10 w-10 rounded-lg flex items-center justify-center text-white',
            nodeType.color
          )}
        >
          <nodeType.icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{nodeType.label}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {node.config?.message?.substring(0, 50) ||
              node.config?.queueName ||
              nodeType.description}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Connection arrow */}
      {node.next && (
        <div className="flex justify-center py-2">
          <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
        </div>
      )}

      {/* Add node button */}
      <div className="flex justify-center py-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddNode(node.id);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Step
        </Button>
      </div>
    </div>
  );
}

export default function IVRSetupPage() {
  const [flow, setFlow] = useState(sampleFlow);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addNodeDialogOpen, setAddNodeDialogOpen] = useState(false);
  const [addAfterNodeId, setAddAfterNodeId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setEditDialogOpen(true);
  };

  const handleUpdateNode = (updatedNode) => {
    setFlow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)),
    }));
  };

  const handleDeleteNode = (nodeId) => {
    setFlow((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== nodeId),
    }));
    setEditDialogOpen(false);
    setSelectedNode(null);
  };

  const handleAddNode = (afterNodeId) => {
    setAddAfterNodeId(afterNodeId);
    setAddNodeDialogOpen(true);
  };

  const handleCreateNode = (type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      config: {},
      next: null,
    };

    setFlow((prev) => {
      const nodes = [...prev.nodes];
      if (addAfterNodeId) {
        const index = nodes.findIndex((n) => n.id === addAfterNodeId);
        if (index !== -1) {
          const afterNode = nodes[index];
          newNode.next = afterNode.next;
          afterNode.next = newNode.id;
          nodes.splice(index + 1, 0, newNode);
        }
      } else {
        nodes.push(newNode);
      }
      return { ...prev, nodes };
    });

    setAddNodeDialogOpen(false);
    setSelectedNode(newNode);
    setEditDialogOpen(true);
  };

  const handleSaveFlow = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const layoutStats = useMemo(
    () => [
      createStat('Steps', flow.nodes.length, GitBranch, 'blue'),
      createStat(
        'Active',
        flow.status === 'active' ? 'Yes' : 'No',
        Phone,
        flow.status === 'active' ? 'green' : 'gray'
      ),
      createStat('Menus', flow.nodes.filter((n) => n.type === 'menu').length, Keyboard, 'purple'),
      createStat('Queues', flow.nodes.filter((n) => n.type === 'queue').length, Users, 'orange'),
    ],
    [flow]
  );

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Play className="h-4 w-4 mr-2" />
        Test IVR
      </Button>
      <Button onClick={handleSaveFlow} disabled={isSaving} size="sm">
        {isSaving ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save Changes
      </Button>
    </div>
  );

  const mainContent = (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Flow Info */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Input
                value={flow.name}
                onChange={(e) => setFlow({ ...flow, name: e.target.value })}
                className="font-semibold text-lg border-0 p-0 h-auto focus-visible:ring-0"
              />
              <p className="text-sm text-muted-foreground">{flow.nodes.length} steps configured</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Active</Label>
              <Switch
                checked={flow.isActive}
                onCheckedChange={(checked) => setFlow({ ...flow, isActive: checked })}
              />
            </div>
            <Badge variant={flow.isActive ? 'default' : 'secondary'}>
              {flow.isActive ? 'Live' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* IVR Flow Builder */}
      <div className="grid grid-cols-3 gap-6">
        {/* Flow Canvas */}
        <div className="col-span-2">
          <Card className="p-6 min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Call Flow</h2>
              <Button variant="outline" size="sm" onClick={() => handleAddNode(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Step
              </Button>
            </div>

            {/* Flow Visualization */}
            <div className="space-y-2">
              {flow.nodes.map((node) => (
                <IVRNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onClick={() => handleNodeClick(node)}
                  onAddNode={handleAddNode}
                />
              ))}

              {flow.nodes.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-medium mb-2">No steps configured</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first IVR step to get started
                  </p>
                  <Button onClick={() => handleAddNode(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Add Panel */}
        <div className="col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Add Node</h3>
            <div className="space-y-2">
              {Object.entries(nodeTypes).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => handleCreateNode(type)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center text-white',
                      config.color
                    )}
                  >
                    <config.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Help Section */}
          <Card className="p-4 mt-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Start with a greeting to welcome callers</li>
              <li>• Use business hours to route after-hours calls</li>
              <li>• Keep menu options to 5 or fewer choices</li>
              <li>• Always provide a voicemail fallback</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <UnifiedLayout
        hubId="inbox"
        pageTitle="IVR Setup"
        stats={layoutStats}
        actions={actionButtons}
        fixedMenu={null}
      >
        {mainContent}
      </UnifiedLayout>

      {/* Node Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          {selectedNode && (
            <NodeEditor
              node={selectedNode}
              onUpdate={handleUpdateNode}
              onDelete={() => handleDeleteNode(selectedNode.id)}
              onClose={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Node Dialog */}
      <Dialog open={addNodeDialogOpen} onOpenChange={setAddNodeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Step</DialogTitle>
            <DialogDescription>Select the type of step to add to your IVR flow</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {Object.entries(nodeTypes).map(([type, config]) => (
              <button
                key={type}
                onClick={() => handleCreateNode(type)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 hover:border-primary transition-colors"
              >
                <div
                  className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center text-white',
                    config.color
                  )}
                >
                  <config.icon className="h-5 w-5" />
                </div>
                <p className="font-medium text-sm">{config.label}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
