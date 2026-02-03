'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  Users,
  Mail,
  MessageSquare,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Zap,
  ArrowRight,
  Target,
  Smartphone,
  ArrowUpDown,
  ArrowLeft,
  Copy,
  BarChart3,
  Settings,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useToast } from '@/hooks/use-toast';

// WhatsApp icon
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Mock data for sequences
const mockSequences = [
  {
    id: '1',
    name: 'New Lead Welcome',
    description: 'Onboarding sequence for new leads captured from website',
    targetType: 'LEAD',
    isActive: true,
    steps: [
      { stepType: 'WHATSAPP', channel: 'WHATSAPP', delay: '0h' },
      { stepType: 'EMAIL', channel: 'EMAIL', delay: '24h' },
      { stepType: 'SMS', channel: 'SMS', delay: '48h' },
      { stepType: 'TASK', channel: null, delay: '72h' },
    ],
    stats: {
      enrollments: { active: 156, completed: 423, total: 612 },
      conversionRate: 32.5,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: '2',
    name: 'Deal Follow-up',
    description: 'Follow-up sequence for deals in proposal stage',
    targetType: 'DEAL',
    isActive: true,
    steps: [
      { stepType: 'EMAIL', channel: 'EMAIL', delay: '0h' },
      { stepType: 'CALL', channel: 'VOICE', delay: '48h' },
      { stepType: 'WHATSAPP', channel: 'WHATSAPP', delay: '72h' },
    ],
    stats: {
      enrollments: { active: 45, completed: 189, total: 256 },
      conversionRate: 45.2,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
  },
  {
    id: '3',
    name: 'Re-engagement Campaign',
    description: 'Win back dormant contacts with special offers',
    targetType: 'CONTACT',
    isActive: false,
    steps: [
      { stepType: 'EMAIL', channel: 'EMAIL', delay: '0h' },
      { stepType: 'SMS', channel: 'SMS', delay: '72h' },
      { stepType: 'WHATSAPP', channel: 'WHATSAPP', delay: '120h' },
      { stepType: 'EMAIL', channel: 'EMAIL', delay: '168h' },
    ],
    stats: {
      enrollments: { active: 0, completed: 876, total: 1024 },
      conversionRate: 18.7,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
  },
  {
    id: '4',
    name: 'Product Demo Request',
    description: 'Nurture leads who requested a product demo',
    targetType: 'LEAD',
    isActive: true,
    steps: [
      { stepType: 'WHATSAPP', channel: 'WHATSAPP', delay: '0h' },
      { stepType: 'TASK', channel: null, delay: '1h' },
      { stepType: 'EMAIL', channel: 'EMAIL', delay: '24h' },
    ],
    stats: {
      enrollments: { active: 89, completed: 312, total: 445 },
      conversionRate: 56.3,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
];

const stepTypeIcons = {
  WHATSAPP: WhatsAppIcon,
  SMS: Smartphone,
  EMAIL: Mail,
  CALL: Phone,
  TASK: CheckCircle2,
  WAIT: Clock,
  CONDITION: Zap,
};

const stepTypeColors = {
  WHATSAPP: { text: 'text-green-500', bg: 'bg-green-500/10' },
  SMS: { text: 'text-purple-500', bg: 'bg-purple-500/10' },
  EMAIL: { text: 'text-blue-500', bg: 'bg-blue-500/10' },
  CALL: { text: 'text-orange-500', bg: 'bg-orange-500/10' },
  TASK: { text: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  WAIT: { text: 'text-gray-500', bg: 'bg-gray-500/10' },
  CONDITION: { text: 'text-pink-500', bg: 'bg-pink-500/10' },
};

const targetTypeLabels = {
  CONTACT: 'Contacts',
  LEAD: 'Leads',
  DEAL: 'Deals',
};

const targetTypeColors = {
  CONTACT: { text: 'text-blue-600', bg: 'bg-blue-100' },
  LEAD: { text: 'text-green-600', bg: 'bg-green-100' },
  DEAL: { text: 'text-purple-600', bg: 'bg-purple-100' },
};

function SequencePreview({ sequence, onToggle, onDuplicate, onDelete }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'h-12 w-12 rounded-lg flex items-center justify-center',
              sequence.isActive ? 'bg-green-100' : 'bg-gray-100'
            )}
          >
            <Target
              className={cn('h-6 w-6', sequence.isActive ? 'text-green-600' : 'text-gray-500')}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{sequence.name}</h3>
              <Badge
                className={cn(
                  sequence.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                )}
              >
                {sequence.isActive ? 'Active' : 'Paused'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{sequence.description}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onToggle}>
              {sequence.isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Activate
                </>
              )}
            </DropdownMenuItem>
            <Link href={`/inbox/sequences/${sequence.id}`}>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{sequence.stats.enrollments.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{sequence.stats.enrollments.completed}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{sequence.stats.conversionRate}%</p>
            <p className="text-xs text-muted-foreground">Conversion</p>
          </Card>
        </div>

        {/* Target Type */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Target</h4>
          <Badge
            className={cn(
              targetTypeColors[sequence.targetType]?.bg,
              targetTypeColors[sequence.targetType]?.text
            )}
          >
            {targetTypeLabels[sequence.targetType]}
          </Badge>
        </div>

        {/* Sequence Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Sequence Steps</h4>
          <div className="space-y-2">
            {sequence.steps.map((step, index) => {
              const Icon = stepTypeIcons[step.stepType];
              const colors = stepTypeColors[step.stepType];
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center',
                        colors?.bg
                      )}
                    >
                      <Icon className={cn('h-5 w-5', colors?.text)} />
                    </div>
                    {index < sequence.steps.length - 1 && (
                      <div className="w-0.5 h-4 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.stepType}</p>
                    <p className="text-xs text-muted-foreground">
                      {step.delay === '0h' ? 'Immediately' : `After ${step.delay}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enrollment Progress */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Total Enrollments</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{sequence.stats.enrollments.completed} completed</span>
              <span className="text-muted-foreground">
                {sequence.stats.enrollments.total} total
              </span>
            </div>
            <Progress
              value={
                (sequence.stats.enrollments.completed / sequence.stats.enrollments.total) * 100
              }
              className="h-2"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t shrink-0 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/inbox/sequences/${sequence.id}`}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Sequence
          </Link>
        </Button>
        <Button className="flex-1">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  );
}

export default function SequencesPage() {
  const { toast } = useToast();
  const [sequences, setSequences] = useState(mockSequences);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTarget, setFilterTarget] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSequence, setDeletingSequence] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and sort sequences
  const filteredSequences = useMemo(() => {
    let result = sequences.filter((seq) => {
      const matchesSearch =
        seq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seq.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && seq.isActive) ||
        (filterStatus === 'paused' && !seq.isActive);
      const matchesTarget = filterTarget === 'all' || seq.targetType === filterTarget;
      return matchesSearch && matchesStatus && matchesTarget;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'conversion':
          return b.stats.conversionRate - a.stats.conversionRate;
        case 'enrollments':
          return b.stats.enrollments.total - a.stats.enrollments.total;
        default:
          return 0;
      }
    });

    return result;
  }, [sequences, searchQuery, filterStatus, filterTarget, sortBy]);

  // Stats
  const stats = useMemo(
    () => ({
      total: sequences.length,
      active: sequences.filter((s) => s.isActive).length,
      paused: sequences.filter((s) => !s.isActive).length,
      totalEnrollments: sequences.reduce((sum, s) => sum + s.stats.enrollments.active, 0),
    }),
    [sequences]
  );

  const toggleSequenceStatus = (sequence) => {
    setSequences((prev) =>
      prev.map((seq) => (seq.id === sequence.id ? { ...seq, isActive: !seq.isActive } : seq))
    );
    if (selectedSequence?.id === sequence.id) {
      setSelectedSequence({ ...selectedSequence, isActive: !sequence.isActive });
    }
    toast({
      title: sequence.isActive ? 'Sequence Paused' : 'Sequence Activated',
      description: `"${sequence.name}" has been ${sequence.isActive ? 'paused' : 'activated'}.`,
    });
  };

  const handleDuplicate = (sequence) => {
    const newSequence = {
      ...sequence,
      id: Date.now().toString(),
      name: `${sequence.name} (Copy)`,
      isActive: false,
      stats: { enrollments: { active: 0, completed: 0, total: 0 }, conversionRate: 0 },
      createdAt: new Date(),
    };
    setSequences([newSequence, ...sequences]);
    toast({
      title: 'Sequence Duplicated',
      description: `"${newSequence.name}" has been created.`,
    });
  };

  const handleDelete = async () => {
    if (!deletingSequence) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSequences(sequences.filter((s) => s.id !== deletingSequence.id));
    if (selectedSequence?.id === deletingSequence.id) {
      setSelectedSequence(null);
      setViewMode('list');
    }
    setDeleteDialogOpen(false);
    setIsSubmitting(false);
    toast({
      title: 'Sequence Deleted',
      description: `"${deletingSequence.name}" has been deleted.`,
      variant: 'destructive',
    });
    setDeletingSequence(null);
  };

  const openPreview = (sequence) => {
    setSelectedSequence(sequence);
    setViewMode('preview');
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Top Header with Search */}
      <div className="flex items-center px-4 py-3 shrink-0">
        <div className="relative w-[500px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sequences..."
            className="pl-9 h-10 bg-white border border-gray-200 shadow-sm rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Area - 3 Box Layout */}
      <div className="flex flex-1 gap-2 px-2 pb-2 overflow-hidden">
        {/* Left Panel - Sequence List (320px) */}
        <aside className="relative flex flex-col shrink-0 rounded-3xl w-[320px] bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-5 py-5 border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Sequences</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredSequences.length} sequences
                </p>
              </div>
              <Button size="sm" asChild className="h-8 w-8 p-0" title="Add new sequence">
                <Link href="/inbox/sequences/new">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="px-4 py-2 border-b border-gray-100 shrink-0 grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-lg font-bold">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">{stats.active}</p>
              <p className="text-[10px] text-muted-foreground">Active</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-500">{stats.paused}</p>
              <p className="text-[10px] text-muted-foreground">Paused</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">{stats.totalEnrollments}</p>
              <p className="text-[10px] text-muted-foreground">Enrolled</p>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="px-4 py-2 border-b border-gray-100 shrink-0">
            <Tabs value={filterStatus} onValueChange={setFilterStatus}>
              <TabsList className="w-full h-8 bg-muted/50">
                <TabsTrigger value="all" className="flex-1 text-xs h-7">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="flex-1 text-xs h-7">
                  <Play className="h-3 w-3 mr-1" />
                  Active
                </TabsTrigger>
                <TabsTrigger value="paused" className="flex-1 text-xs h-7">
                  <Pause className="h-3 w-3 mr-1" />
                  Paused
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Target Filter + Sort */}
          <div className="px-4 py-2 border-b border-gray-100 shrink-0 flex gap-2">
            <Select value={filterTarget} onValueChange={setFilterTarget}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Targets
                </SelectItem>
                <SelectItem value="CONTACT" className="text-xs">
                  Contacts
                </SelectItem>
                <SelectItem value="LEAD" className="text-xs">
                  Leads
                </SelectItem>
                <SelectItem value="DEAL" className="text-xs">
                  Deals
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 text-xs w-[100px]">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest" className="text-xs">
                  Newest
                </SelectItem>
                <SelectItem value="name" className="text-xs">
                  Name
                </SelectItem>
                <SelectItem value="conversion" className="text-xs">
                  Conversion
                </SelectItem>
                <SelectItem value="enrollments" className="text-xs">
                  Enrollments
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sequence List */}
          <div className="flex-1 overflow-y-auto">
            {filteredSequences.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No sequences found</p>
                <p className="text-xs mt-1">Create your first sequence</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredSequences.map((sequence) => {
                  const isSelected = selectedSequence?.id === sequence.id && viewMode === 'preview';

                  return (
                    <button
                      key={sequence.id}
                      onClick={() => openPreview(sequence)}
                      className={cn(
                        'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                        isSelected && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                            sequence.isActive ? 'bg-green-100' : 'bg-gray-100'
                          )}
                        >
                          <Target
                            className={cn(
                              'h-4 w-4',
                              sequence.isActive ? 'text-green-600' : 'text-gray-500'
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{sequence.name}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge
                              className={cn(
                                'text-[10px]',
                                sequence.isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              )}
                            >
                              {sequence.isActive ? 'Active' : 'Paused'}
                            </Badge>
                            <Badge
                              className={cn(
                                'text-[10px]',
                                targetTypeColors[sequence.targetType]?.bg,
                                targetTypeColors[sequence.targetType]?.text
                              )}
                            >
                              {targetTypeLabels[sequence.targetType]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {sequence.steps.slice(0, 4).map((step, idx) => {
                              const Icon = stepTypeIcons[step.stepType];
                              const colors = stepTypeColors[step.stepType];
                              return (
                                <div
                                  key={idx}
                                  className={cn(
                                    'h-5 w-5 rounded flex items-center justify-center',
                                    colors?.bg
                                  )}
                                >
                                  <Icon className={cn('h-3 w-3', colors?.text)} />
                                </div>
                              );
                            })}
                            {sequence.steps.length > 4 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{sequence.steps.length - 4}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-0.5">
                              <Users className="h-2.5 w-2.5" />
                              {sequence.stats.enrollments.active} active
                            </span>
                            <span className="flex items-center gap-0.5">
                              <TrendingUp className="h-2.5 w-2.5" />
                              {sequence.stats.conversionRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Right Panel - Content Area */}
        <div className="flex-1 w-full flex flex-col bg-white dark:bg-card min-w-0 min-h-0 rounded-3xl shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === 'preview' && selectedSequence && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <SequencePreview
                  sequence={selectedSequence}
                  onToggle={() => toggleSequenceStatus(selectedSequence)}
                  onDuplicate={() => handleDuplicate(selectedSequence)}
                  onDelete={() => {
                    setDeletingSequence(selectedSequence);
                    setDeleteDialogOpen(true);
                  }}
                />
              </motion.div>
            )}

            {(viewMode === 'list' || (!selectedSequence && viewMode === 'preview')) && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-muted-foreground"
              >
                <Target className="h-16 w-16 mb-4 opacity-30" />
                <h3 className="font-medium text-lg">Select a Sequence</h3>
                <p className="text-sm mt-1">Choose a sequence from the list to preview</p>
                <Button className="mt-4" asChild>
                  <Link href="/inbox/sequences/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Sequence
                  </Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Sequence
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSequence?.name}"? This will also remove all
              enrollments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
