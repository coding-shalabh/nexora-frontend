'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Plus,
  Radio,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Trash2,
  MoreHorizontal,
  Users,
  MessageSquare,
  Mail,
  Smartphone,
  Calendar,
  Target,
  Copy,
  BarChart3,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Zap,
  ArrowUpDown,
  ArrowLeft,
  Filter,
  FileText,
} from 'lucide-react';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const channelConfig = {
  whatsapp: {
    icon: WhatsAppIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    label: 'WhatsApp',
  },
  sms: { icon: Smartphone, color: 'text-purple-500', bgColor: 'bg-purple-500/10', label: 'SMS' },
  email: { icon: Mail, color: 'text-blue-500', bgColor: 'bg-blue-500/10', label: 'Email' },
};

const statusConfig = {
  draft: { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Draft' },
  scheduled: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Scheduled' },
  sending: { icon: Send, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Sending' },
  completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Completed',
  },
  paused: { icon: Pause, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Paused' },
  failed: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Failed' },
};

const initialBroadcasts = [
  {
    id: '1',
    name: 'Black Friday Sale Announcement',
    channel: 'whatsapp',
    status: 'completed',
    template: 'Promotional Offer',
    audience: { type: 'segment', name: 'Active Customers', count: 2500 },
    stats: { sent: 2500, delivered: 2450, read: 1890, failed: 50 },
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    createdBy: 'John Doe',
    cost: 125.0,
  },
  {
    id: '2',
    name: 'Monthly Newsletter - December',
    channel: 'email',
    status: 'scheduled',
    template: 'Newsletter Template',
    audience: { type: 'all', name: 'All Subscribers', count: 15000 },
    stats: { sent: 0, delivered: 0, read: 0, failed: 0 },
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    createdBy: 'Sarah Smith',
    cost: 150.0,
  },
  {
    id: '3',
    name: 'Payment Reminder Batch',
    channel: 'sms',
    status: 'sending',
    template: 'Payment Reminder',
    audience: { type: 'filter', name: 'Overdue Payments', count: 850 },
    stats: { sent: 420, delivered: 415, read: 0, failed: 5 },
    scheduledAt: new Date(Date.now() - 1000 * 60 * 30),
    createdBy: 'Finance Team',
    progress: 49,
    cost: 8.5,
  },
  {
    id: '4',
    name: 'New Year Greetings',
    channel: 'whatsapp',
    status: 'draft',
    template: 'Holiday Greeting',
    audience: { type: 'all', name: 'All Contacts', count: 5000 },
    stats: { sent: 0, delivered: 0, read: 0, failed: 0 },
    createdBy: 'Marketing Team',
    cost: 250.0,
  },
];

const segments = [
  { id: 'all', name: 'All Contacts', count: 5000 },
  { id: 'active', name: 'Active Customers', count: 2500 },
  { id: 'leads', name: 'New Leads', count: 1200 },
  { id: 'vip', name: 'VIP Customers', count: 350 },
  { id: 'inactive', name: 'Inactive (30+ days)', count: 890 },
];

const templates = [
  { id: '1', name: 'Welcome Message', channel: 'whatsapp' },
  { id: '2', name: 'Promotional Offer', channel: 'whatsapp' },
  { id: '3', name: 'Payment Reminder', channel: 'sms' },
  { id: '4', name: 'Newsletter Template', channel: 'email' },
  { id: '5', name: 'Holiday Greeting', channel: 'whatsapp' },
];

function ChannelIcon({ channel, className }) {
  const config = channelConfig[channel];
  if (!config) return null;
  const Icon = config.icon;
  return <Icon className={cn('h-4 w-4', config.color, className)} />;
}

function StatusBadge({ status }) {
  const config = statusConfig[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <Badge className={cn('gap-1', config.bgColor, config.color)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function BroadcastForm({ broadcast, onSubmit, onCancel, isSubmitting }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: broadcast?.name || '',
    channel: broadcast?.channel || 'whatsapp',
    template: broadcast?.template || '',
    audienceId: 'all',
    scheduleType: 'now',
    scheduledAt: '',
  });

  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSegment = segments.find((s) => s.id === formData.audienceId);
    onSubmit({
      ...formData,
      audience: {
        type: formData.audienceId === 'all' ? 'all' : 'segment',
        name: selectedSegment?.name || 'All Contacts',
        count: selectedSegment?.count || 5000,
      },
    });
  };

  const filteredTemplates = templates.filter((t) => t.channel === formData.channel);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={cn('w-12 h-0.5 mx-2', step > s ? 'bg-primary' : 'bg-muted')} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Campaign Details</h3>
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Black Friday Sale"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Channel *</Label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(channelConfig).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, channel: key, template: '' })}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                    formData.channel === key
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/50'
                  )}
                >
                  <config.icon className={cn('h-6 w-6', config.color)} />
                  <span className="text-sm font-medium">{config.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Template *</Label>
            <Select
              value={formData.template}
              onValueChange={(value) => setFormData({ ...formData, template: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {filteredTemplates.map((t) => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Select Audience</h3>
          <div className="space-y-3">
            {segments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                onClick={() => setFormData({ ...formData, audienceId: segment.id })}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors text-left',
                  formData.audienceId === segment.id
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      formData.audienceId === segment.id ? 'bg-primary/10' : 'bg-muted'
                    )}
                  >
                    <Users
                      className={cn(
                        'h-5 w-5',
                        formData.audienceId === segment.id
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{segment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {segment.count.toLocaleString()} contacts
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                    formData.audienceId === segment.id
                      ? 'border-primary bg-primary'
                      : 'border-muted'
                  )}
                >
                  {formData.audienceId === segment.id && (
                    <CheckCircle className="h-4 w-4 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Schedule Broadcast</h3>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, scheduleType: 'now' })}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors text-left',
                formData.scheduleType === 'now'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground/50'
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center',
                  formData.scheduleType === 'now' ? 'bg-primary/10' : 'bg-muted'
                )}
              >
                <Zap
                  className={cn(
                    'h-5 w-5',
                    formData.scheduleType === 'now' ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
              </div>
              <div>
                <p className="font-medium">Send Now</p>
                <p className="text-sm text-muted-foreground">Start sending immediately</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, scheduleType: 'later' })}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors text-left',
                formData.scheduleType === 'later'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground/50'
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center',
                  formData.scheduleType === 'later' ? 'bg-primary/10' : 'bg-muted'
                )}
              >
                <Calendar
                  className={cn(
                    'h-5 w-5',
                    formData.scheduleType === 'later' ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
              </div>
              <div>
                <p className="font-medium">Schedule for Later</p>
                <p className="text-sm text-muted-foreground">Choose a specific date and time</p>
              </div>
            </button>
            {formData.scheduleType === 'later' && (
              <div className="pl-14">
                <Input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>
          <div className="bg-muted/50 rounded-lg p-4 mt-4 space-y-2">
            <h4 className="font-medium text-sm">Campaign Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name: </span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Channel: </span>
                <span className="font-medium">{channelConfig[formData.channel]?.label}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Template: </span>
                <span className="font-medium">{formData.template}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Recipients: </span>
                <span className="font-medium">
                  {segments.find((s) => s.id === formData.audienceId)?.count.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {step > 1 && (
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!formData.name || !formData.template}
          >
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {formData.scheduleType === 'now' ? 'Start Broadcast' : 'Schedule Broadcast'}
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}

function BroadcastStats({ broadcast }) {
  const { stats } = broadcast;
  const total = stats.sent || 1;
  const deliveryRate = ((stats.delivered / total) * 100).toFixed(1);
  const readRate = ((stats.read / total) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center">
        <p className="text-2xl font-bold">{stats.sent.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">Sent</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">{stats.delivered.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">Delivered ({deliveryRate}%)</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-purple-600">{stats.read.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">Read ({readRate}%)</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-red-600">{stats.failed.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">Failed</p>
      </div>
    </div>
  );
}

function BroadcastPreview({ broadcast, onEdit, onDuplicate, onDelete, onPause }) {
  const config = channelConfig[broadcast.channel];
  const statusConf = statusConfig[broadcast.status];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={cn('h-12 w-12 rounded-lg flex items-center justify-center', config?.bgColor)}
          >
            <ChannelIcon channel={broadcast.channel} className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{broadcast.name}</h3>
              <StatusBadge status={broadcast.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{broadcast.template}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(broadcast.status === 'sending' || broadcast.status === 'paused') && (
              <DropdownMenuItem onClick={onPause}>
                {broadcast.status === 'paused' ? (
                  <>
                    <Play className="h-4 w-4 mr-2" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" /> Pause
                  </>
                )}
              </DropdownMenuItem>
            )}
            {broadcast.status === 'completed' && (
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" /> Duplicate
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Progress Bar (for sending broadcasts) */}
        {broadcast.status === 'sending' && broadcast.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{broadcast.progress}%</span>
            </div>
            <Progress value={broadcast.progress} className="h-3" />
          </div>
        )}

        {/* Stats */}
        {(broadcast.status === 'completed' || broadcast.status === 'sending') && (
          <Card className="p-4">
            <h4 className="font-medium text-sm mb-4">Delivery Statistics</h4>
            <BroadcastStats broadcast={broadcast} />
          </Card>
        )}

        {/* Campaign Details */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Campaign Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Audience</p>
                  <p className="font-medium">{broadcast.audience.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {broadcast.audience.count.toLocaleString()} recipients
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="font-medium">
                    {broadcast.scheduledAt
                      ? format(new Date(broadcast.scheduledAt), 'MMM d, yyyy')
                      : 'Not scheduled'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {broadcast.scheduledAt
                      ? format(new Date(broadcast.scheduledAt), 'h:mm a')
                      : '-'}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Est. Cost</p>
                  <p className="font-medium">${broadcast.cost}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{broadcast.createdBy}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t shrink-0 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </Button>
        <Button className="flex-1">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  );
}

export default function BroadcastsPage() {
  const { toast } = useToast();
  const [broadcasts, setBroadcasts] = useState(initialBroadcasts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'preview', 'create'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBroadcast, setDeletingBroadcast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and sort broadcasts
  const filteredBroadcasts = useMemo(() => {
    let result = broadcasts.filter((b) => {
      if (selectedChannel !== 'all' && b.channel !== selectedChannel) return false;
      if (selectedStatus !== 'all' && b.status !== selectedStatus) return false;
      if (searchQuery) {
        return (
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.template?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.scheduledAt) - new Date(a.scheduledAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'audience':
          return b.audience.count - a.audience.count;
        default:
          return 0;
      }
    });

    return result;
  }, [broadcasts, selectedChannel, selectedStatus, searchQuery, sortBy]);

  // Stats
  const stats = useMemo(
    () => ({
      total: broadcasts.length,
      active: broadcasts.filter((b) => b.status === 'sending').length,
      scheduled: broadcasts.filter((b) => b.status === 'scheduled').length,
      completed: broadcasts.filter((b) => b.status === 'completed').length,
    }),
    [broadcasts]
  );

  const handleCreate = async (data) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newBroadcast = {
      id: Date.now().toString(),
      name: data.name,
      channel: data.channel,
      status: data.scheduleType === 'now' ? 'sending' : 'scheduled',
      template: data.template,
      audience: data.audience,
      stats: { sent: 0, delivered: 0, read: 0, failed: 0 },
      scheduledAt: data.scheduleType === 'now' ? new Date() : new Date(data.scheduledAt),
      createdBy: 'Current User',
      progress: data.scheduleType === 'now' ? 0 : undefined,
      cost: (data.audience.count * 0.05).toFixed(2),
    };
    setBroadcasts([newBroadcast, ...broadcasts]);
    setViewMode('list');
    setIsSubmitting(false);
    toast({
      title: data.scheduleType === 'now' ? 'Broadcast Started' : 'Broadcast Scheduled',
      description: `"${data.name}" has been ${data.scheduleType === 'now' ? 'started' : 'scheduled'}.`,
    });
  };

  const handleDelete = async () => {
    if (!deletingBroadcast) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setBroadcasts(broadcasts.filter((b) => b.id !== deletingBroadcast.id));
    if (selectedBroadcast?.id === deletingBroadcast.id) {
      setSelectedBroadcast(null);
      setViewMode('list');
    }
    setDeleteDialogOpen(false);
    setIsSubmitting(false);
    toast({
      title: 'Broadcast Deleted',
      description: `"${deletingBroadcast.name}" has been deleted.`,
      variant: 'destructive',
    });
    setDeletingBroadcast(null);
  };

  const handlePause = (broadcast) => {
    setBroadcasts(
      broadcasts.map((b) =>
        b.id === broadcast.id ? { ...b, status: b.status === 'paused' ? 'sending' : 'paused' } : b
      )
    );
    if (selectedBroadcast?.id === broadcast.id) {
      setSelectedBroadcast({
        ...selectedBroadcast,
        status: broadcast.status === 'paused' ? 'sending' : 'paused',
      });
    }
    toast({
      title: broadcast.status === 'paused' ? 'Broadcast Resumed' : 'Broadcast Paused',
      description: `"${broadcast.name}" has been ${broadcast.status === 'paused' ? 'resumed' : 'paused'}.`,
    });
  };

  const handleDuplicate = (broadcast) => {
    const newBroadcast = {
      ...broadcast,
      id: Date.now().toString(),
      name: `${broadcast.name} (Copy)`,
      status: 'draft',
      stats: { sent: 0, delivered: 0, read: 0, failed: 0 },
      scheduledAt: null,
    };
    setBroadcasts([newBroadcast, ...broadcasts]);
    toast({
      title: 'Broadcast Duplicated',
      description: `"${newBroadcast.name}" has been created.`,
    });
  };

  const openPreview = (broadcast) => {
    setSelectedBroadcast(broadcast);
    setViewMode('preview');
  };

  const openCreate = () => {
    setSelectedBroadcast(null);
    setViewMode('create');
  };

  const layoutStats = useMemo(
    () => [
      createStat('Total', stats.total, Radio, 'blue'),
      createStat('Sending', stats.active, Send, 'green'),
      createStat('Scheduled', stats.scheduled, Clock, 'yellow'),
      createStat('Completed', stats.completed, CheckCircle, 'purple'),
    ],
    [stats]
  );

  const actionButtons = (
    <Button size="sm" onClick={openCreate}>
      <Plus className="h-4 w-4 mr-2" />
      New Broadcast
    </Button>
  );

  const mainContent = (
    <div className="flex flex-1 gap-2 px-2 pb-2 overflow-hidden">
      {/* Left Panel - Broadcast List (320px) */}
      <aside className="relative flex flex-col shrink-0 rounded-3xl w-[320px] bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Broadcasts</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredBroadcasts.length} campaigns
              </p>
            </div>
            <Button
              size="sm"
              onClick={openCreate}
              className="h-8 w-8 p-0"
              title="Add new broadcast"
            >
              <Plus className="h-4 w-4" />
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
            <p className="text-lg font-bold text-yellow-600">{stats.active}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600">{stats.scheduled}</p>
            <p className="text-[10px] text-muted-foreground">Scheduled</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">{stats.completed}</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-4 py-2 border-b border-gray-100 shrink-0">
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
            <TabsList className="w-full h-8 bg-muted/50">
              <TabsTrigger value="all" className="flex-1 text-xs h-7">
                All
              </TabsTrigger>
              <TabsTrigger value="draft" className="flex-1 text-xs h-7">
                Draft
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="flex-1 text-xs h-7">
                Scheduled
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 text-xs h-7">
                Done
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Channel Filter + Sort */}
        <div className="px-4 py-2 border-b border-gray-100 shrink-0 flex gap-2">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Channels
              </SelectItem>
              {Object.entries(channelConfig).map(([key, config]) => (
                <SelectItem key={key} value={key} className="text-xs">
                  {config.label}
                </SelectItem>
              ))}
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
              <SelectItem value="audience" className="text-xs">
                Audience
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Broadcast List */}
        <div className="flex-1 overflow-y-auto">
          {filteredBroadcasts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Radio className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No broadcasts found</p>
              <p className="text-xs mt-1">Create your first broadcast</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredBroadcasts.map((broadcast) => {
                const config = channelConfig[broadcast.channel];
                const isSelected = selectedBroadcast?.id === broadcast.id && viewMode === 'preview';

                return (
                  <button
                    key={broadcast.id}
                    onClick={() => openPreview(broadcast)}
                    className={cn(
                      'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                      isSelected && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                          config?.bgColor
                        )}
                      >
                        <ChannelIcon channel={broadcast.channel} className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{broadcast.name}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <StatusBadge status={broadcast.status} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {broadcast.template} • {broadcast.audience.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Users className="h-2.5 w-2.5" />
                            {broadcast.audience.count.toLocaleString()}
                          </span>
                          {broadcast.scheduledAt && (
                            <span className="flex items-center gap-0.5">
                              <Calendar className="h-2.5 w-2.5" />
                              {format(new Date(broadcast.scheduledAt), 'MMM d')}
                            </span>
                          )}
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
          {viewMode === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold">Create New Broadcast</h3>
              </div>
              <div className="flex-1 overflow-auto">
                <BroadcastForm
                  onSubmit={handleCreate}
                  onCancel={() => setViewMode('list')}
                  isSubmitting={isSubmitting}
                />
              </div>
            </motion.div>
          )}

          {viewMode === 'preview' && selectedBroadcast && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <BroadcastPreview
                broadcast={selectedBroadcast}
                onEdit={() => {}}
                onDuplicate={() => handleDuplicate(selectedBroadcast)}
                onDelete={() => {
                  setDeletingBroadcast(selectedBroadcast);
                  setDeleteDialogOpen(true);
                }}
                onPause={() => handlePause(selectedBroadcast)}
              />
            </motion.div>
          )}

          {(viewMode === 'list' || (!selectedBroadcast && viewMode === 'preview')) && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-muted-foreground"
            >
              <Radio className="h-16 w-16 mb-4 opacity-30" />
              <h3 className="font-medium text-lg">Select a Broadcast</h3>
              <p className="text-sm mt-1">Choose a broadcast from the list to preview</p>
              <Button className="mt-4" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Broadcast
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <UnifiedLayout
        hubId="inbox"
        pageTitle="Broadcasts"
        stats={layoutStats}
        actions={actionButtons}
        fixedMenu={null}
      >
        {mainContent}
      </UnifiedLayout>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Broadcast
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingBroadcast?.name}"? This action cannot be
              undone.
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
    </>
  );
}
