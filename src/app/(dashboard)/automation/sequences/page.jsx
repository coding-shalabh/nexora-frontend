'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  Send,
  Play,
  Pause,
  Trash2,
  Edit,
  Copy,
  Users,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Eye,
  BarChart3,
  TrendingUp,
  UserPlus,
  UserMinus,
  RefreshCw,
} from 'lucide-react';

// WhatsApp icon component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Mock data for sequences
const mockSequences = [
  {
    id: '1',
    name: 'Welcome Drip Campaign',
    description: 'Onboard new customers with a 5-step welcome series',
    type: 'email',
    steps: 5,
    status: 'active',
    enrolled: 234,
    completed: 156,
    inProgress: 78,
    openRate: 45.2,
    clickRate: 12.8,
    replyRate: 8.5,
    exitedEarly: 23,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-18',
  },
  {
    id: '2',
    name: 'Lead Nurturing',
    description: 'Multi-channel lead nurturing over 14 days',
    type: 'multi',
    steps: 8,
    status: 'active',
    enrolled: 567,
    completed: 234,
    inProgress: 289,
    openRate: 52.1,
    clickRate: 18.3,
    replyRate: 15.2,
    exitedEarly: 44,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Sales Follow-up',
    description: 'Automated follow-up after demo calls',
    type: 'email',
    steps: 4,
    status: 'active',
    enrolled: 89,
    completed: 67,
    inProgress: 22,
    openRate: 68.5,
    clickRate: 24.1,
    replyRate: 32.5,
    exitedEarly: 8,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-19',
  },
  {
    id: '4',
    name: 'WhatsApp Reminders',
    description: 'Appointment reminders via WhatsApp',
    type: 'whatsapp',
    steps: 3,
    status: 'active',
    enrolled: 345,
    completed: 312,
    inProgress: 33,
    openRate: 92.3,
    clickRate: 45.6,
    replyRate: 28.9,
    exitedEarly: 12,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-20',
  },
  {
    id: '5',
    name: 'Re-engagement Campaign',
    description: 'Win back inactive customers',
    type: 'multi',
    steps: 6,
    status: 'paused',
    enrolled: 123,
    completed: 45,
    inProgress: 0,
    openRate: 28.5,
    clickRate: 8.2,
    replyRate: 4.1,
    exitedEarly: 78,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-15',
  },
  {
    id: '6',
    name: 'SMS Order Updates',
    description: 'Order status updates via SMS',
    type: 'sms',
    steps: 4,
    status: 'draft',
    enrolled: 0,
    completed: 0,
    inProgress: 0,
    openRate: 0,
    clickRate: 0,
    replyRate: 0,
    exitedEarly: 0,
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19',
  },
];

const typeConfig = {
  email: { label: 'Email', icon: Mail, color: 'bg-blue-100 text-blue-700' },
  sms: { label: 'SMS', icon: Smartphone, color: 'bg-purple-100 text-purple-700' },
  whatsapp: { label: 'WhatsApp', icon: WhatsAppIcon, color: 'bg-green-100 text-green-700' },
  multi: { label: 'Multi-channel', icon: Send, color: 'bg-orange-100 text-orange-700' },
};

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700' },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
};

function CreateSequenceDialog({ open, onOpenChange, onSubmit, editSequence }) {
  const [formData, setFormData] = useState({
    name: editSequence?.name || '',
    description: editSequence?.description || '',
    type: editSequence?.type || 'email',
    status: editSequence?.status || 'draft',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      type: 'email',
      status: 'draft',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editSequence ? 'Edit Sequence' : 'Create New Sequence'}</DialogTitle>
          <DialogDescription>
            {editSequence
              ? 'Update your sequence settings'
              : 'Create an automated multi-step messaging sequence'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Sequence Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Welcome Drip Campaign"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this sequence for?"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Channel Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Only</SelectItem>
                  <SelectItem value="sms">SMS Only</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp Only</SelectItem>
                  <SelectItem value="multi">Multi-channel</SelectItem>
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editSequence ? 'Save Changes' : 'Create Sequence'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SequencesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editSequence, setEditSequence] = useState(null);
  const [sequences, setSequences] = useState(mockSequences);

  const filteredSequences = sequences.filter((sequence) => {
    if (filterStatus !== 'all' && sequence.status !== filterStatus) return false;
    if (filterType !== 'all' && sequence.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        sequence.name.toLowerCase().includes(query) ||
        sequence.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCreateSequence = (formData) => {
    if (editSequence) {
      setSequences(sequences.map((s) =>
        s.id === editSequence.id ? { ...s, ...formData, updatedAt: new Date().toISOString() } : s
      ));
    } else {
      const newSequence = {
        id: Date.now().toString(),
        ...formData,
        steps: 0,
        enrolled: 0,
        completed: 0,
        inProgress: 0,
        openRate: 0,
        clickRate: 0,
        replyRate: 0,
        exitedEarly: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSequences([newSequence, ...sequences]);
    }
    setCreateDialogOpen(false);
    setEditSequence(null);
  };

  const handleToggleStatus = (id) => {
    setSequences(sequences.map((s) => {
      if (s.id === id) {
        const newStatus = s.status === 'active' ? 'paused' : 'active';
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const handleDelete = (id) => {
    setSequences(sequences.filter((s) => s.id !== id));
  };

  const handleDuplicate = (sequence) => {
    const duplicate = {
      ...sequence,
      id: Date.now().toString(),
      name: `${sequence.name} (Copy)`,
      status: 'draft',
      enrolled: 0,
      completed: 0,
      inProgress: 0,
      exitedEarly: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSequences([duplicate, ...sequences]);
  };

  // Stats
  const activeCount = sequences.filter((s) => s.status === 'active').length;
  const totalEnrolled = sequences.reduce((sum, s) => sum + s.enrolled, 0);
  const totalInProgress = sequences.reduce((sum, s) => sum + s.inProgress, 0);
  const avgOpenRate = sequences.filter((s) => s.openRate > 0).length > 0
    ? (sequences.filter((s) => s.openRate > 0).reduce((sum, s) => sum + s.openRate, 0) /
        sequences.filter((s) => s.openRate > 0).length).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sequences</h1>
          <p className="text-muted-foreground">Automated multi-step messaging campaigns</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Sequence
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{sequences.length}</div>
              <div className="text-sm text-muted-foreground">Total Sequences</div>
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
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalInProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{avgOpenRate}%</div>
              <div className="text-sm text-muted-foreground">Avg Open Rate</div>
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
              placeholder="Search sequences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {Object.entries(typeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      {/* Sequences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSequences.map((sequence) => {
          const TypeIcon = typeConfig[sequence.type].icon;
          const completionRate = sequence.enrolled > 0
            ? Math.round((sequence.completed / sequence.enrolled) * 100)
            : 0;

          return (
            <Card key={sequence.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Send className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{sequence.name}</h3>
                        <Badge className={statusConfig[sequence.status].color}>
                          {statusConfig[sequence.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="gap-1">
                          <TypeIcon className="h-3 w-3" />
                          {typeConfig[sequence.type].label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {sequence.steps} steps
                        </span>
                      </div>
                    </div>
                  </div>
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
                          setEditSequence(sequence);
                          setCreateDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(sequence)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Enroll Contacts
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(sequence.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{sequence.description}</p>

                {/* Enrollment Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold">{sequence.enrolled}</div>
                    <div className="text-xs text-muted-foreground">Enrolled</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{sequence.inProgress}</div>
                    <div className="text-xs text-blue-600">In Progress</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{sequence.completed}</div>
                    <div className="text-xs text-green-600">Completed</div>
                  </div>
                </div>

                {/* Completion Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>

                {/* Performance Metrics */}
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <span>Open: <span className="font-medium text-foreground">{sequence.openRate}%</span></span>
                    <span>Click: <span className="font-medium text-foreground">{sequence.clickRate}%</span></span>
                    <span>Reply: <span className="font-medium text-foreground">{sequence.replyRate}%</span></span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(sequence.id)}
                    disabled={sequence.status === 'draft'}
                  >
                    {sequence.status === 'active' ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredSequences.length === 0 && (
        <Card className="p-12 text-center">
          <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No sequences found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first sequence to start automated messaging
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Sequence
          </Button>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <CreateSequenceDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditSequence(null);
        }}
        onSubmit={handleCreateSequence}
        editSequence={editSequence}
      />
    </div>
  );
}
