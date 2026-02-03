'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  Building2,
  Edit,
  Trash2,
  X,
  User,
  MessageSquare,
  Linkedin,
  Twitter,
  MapPin,
  Globe,
  Briefcase,
  Facebook,
  Users,
  Target,
  Smartphone,
  Star,
  TrendingUp,
  Clock,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Plus,
  Activity,
  Zap,
  BarChart3,
  Send,
  PhoneCall,
  Video,
  StickyNote,
  ChevronDown,
  ChevronRight,
  Loader2,
  Tag,
  Shield,
  ShieldCheck,
  ShieldX,
  Bell,
  BellOff,
  DollarSign,
  Flame,
  Thermometer,
  Snowflake,
  Home,
  Hash,
  UserCog,
  CalendarDays,
  History,
  ExternalLink,
  Copy,
  Briefcase as DealIcon,
  FileCheck,
  AlertTriangle,
  Info,
  Receipt,
  Award,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  useContactTimeline,
  useContactEngagement,
  useContactScore,
  useContactActivities,
  useCustomFields,
  useCreateActivity,
} from '@/hooks/use-contacts';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';

// Helper to safely render a value (avoids rendering objects)
function safeRender(value, fallback = '') {
  // Extract a safe string from any value
  const getSafeValue = (v) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') {
      // Handle objects - try to extract a displayable string
      if (Array.isArray(v)) return '';
      if (v.name) return String(v.name);
      if (v.label) return String(v.label);
      if (v.title) return String(v.title);
      if (v.value) return String(v.value);
      return ''; // Empty object or unknown structure
    }
    return String(v);
  };

  // Try value first, then fallback
  const safeValue = getSafeValue(value);
  if (safeValue) return safeValue;

  return getSafeValue(fallback);
}

// Activity type icons and colors
const ACTIVITY_CONFIG = {
  CALL: { icon: PhoneCall, color: 'text-blue-600', bg: 'bg-blue-100' },
  EMAIL: { icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100' },
  MEETING: { icon: Video, color: 'text-green-600', bg: 'bg-green-100' },
  TASK: { icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-100' },
  NOTE: { icon: StickyNote, color: 'text-pink-600', bg: 'bg-pink-100' },
  MESSAGE: { icon: MessageSquare, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  PAGE_VIEW: { icon: Globe, color: 'text-slate-600', bg: 'bg-slate-100' },
  FORM_SUBMISSION: { icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  EMAIL_OPEN: { icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  EMAIL_CLICK: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100' },
};

// Rating config
const RATING_CONFIG = {
  HOT: { icon: Flame, color: 'text-red-600', bg: 'bg-red-100', label: 'Hot Lead' },
  WARM: { icon: Thermometer, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Warm Lead' },
  COLD: { icon: Snowflake, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Cold Lead' },
};

// Priority config
const PRIORITY_CONFIG = {
  HIGH: { color: 'bg-red-100 text-red-700 border-red-200', label: 'High' },
  MEDIUM: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Medium' },
  LOW: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Low' },
};

// Collapsible Section Component
function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between py-2 px-1 hover:bg-slate-50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <ChevronRight
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              isOpen && 'rotate-90'
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

// Info Row Component
function InfoRow({ icon: Icon, label, value, copyable, link }) {
  const { toast } = useToast();

  // Handle null, undefined, and empty objects
  const safeValue = safeRender(value);
  if (!safeValue) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(safeValue);
    toast({ title: 'Copied!', description: `${label} copied to clipboard` });
  };

  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline truncate flex items-center gap-1"
            >
              {safeValue}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <p className="text-sm font-medium truncate">{safeValue}</p>
          )}
          {copyable && (
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-slate-100 rounded transition-colors shrink-0"
            >
              <Copy className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Lead Score Gauge Component
function LeadScoreGauge({ score, breakdown }) {
  const percentage = Math.min(100, Math.max(0, typeof score === 'number' ? score : 0));
  const strokeDasharray = `${percentage * 2.51} 251`;

  const getScoreColor = (score) => {
    if (score >= 80) return { stroke: '#22c55e', text: 'text-green-600', label: 'Hot' };
    if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-600', label: 'Warm' };
    if (score >= 40) return { stroke: '#3b82f6', text: 'text-blue-600', label: 'Qualified' };
    return { stroke: '#94a3b8', text: 'text-slate-500', label: 'Cold' };
  };

  const scoreStyle = getScoreColor(percentage);

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={scoreStyle.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-xl font-bold', scoreStyle.text)}>{Math.round(percentage)}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="flex-1">
        <Badge
          variant="secondary"
          className={cn(
            'mb-2',
            percentage >= 80
              ? 'bg-green-100 text-green-700'
              : percentage >= 60
                ? 'bg-amber-100 text-amber-700'
                : percentage >= 40
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-700'
          )}
        >
          {scoreStyle.label} Lead
        </Badge>
        {breakdown && (
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Engagement</span>
              <span className="font-medium">
                {typeof breakdown.engagement === 'number' ? breakdown.engagement : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Fit Score</span>
              <span className="font-medium">
                {typeof breakdown.fit === 'number' ? breakdown.fit : 0}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Engagement Metrics Section
function EngagementMetrics({ engagement, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Emails',
      value: typeof engagement?.emailCount === 'number' ? engagement.emailCount : 0,
      icon: Mail,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Calls',
      value: typeof engagement?.callCount === 'number' ? engagement.callCount : 0,
      icon: PhoneCall,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Meetings',
      value: typeof engagement?.meetingCount === 'number' ? engagement.meetingCount : 0,
      icon: Video,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200"
        >
          <div
            className={cn('h-8 w-8 rounded-lg flex items-center justify-center mb-2', metric.bg)}
          >
            <metric.icon className={cn('h-4 w-4', metric.color)} />
          </div>
          <p className="text-xl font-bold">{metric.value}</p>
          <p className="text-xs text-muted-foreground">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}

// Activity Timeline Item
function TimelineItem({ activity }) {
  const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.NOTE;
  const Icon = config.icon;

  // Safely format the date
  const getTimeAgo = () => {
    try {
      if (!activity.createdAt) return 'Unknown';
      const date = new Date(activity.createdAt);
      if (isNaN(date.getTime())) return 'Unknown';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
      <div
        className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', config.bg)}
      >
        <Icon className={cn('h-4 w-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate">
            {safeRender(activity.title, activity.type || 'Activity')}
          </p>
          <span className="text-xs text-muted-foreground shrink-0">{getTimeAgo()}</span>
        </div>
        {activity.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {safeRender(activity.description)}
          </p>
        )}
        {activity.metadata && (
          <div className="mt-1 flex gap-2 flex-wrap">
            {activity.metadata.duration && (
              <Badge variant="outline" className="text-[10px] h-5">
                {Math.round(activity.metadata.duration / 60)}m
              </Badge>
            )}
            {activity.metadata.outcome && (
              <Badge variant="outline" className="text-[10px] h-5">
                {safeRender(activity.metadata.outcome)}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Activity Timeline Section
function ActivityTimeline({ contactId }) {
  const { data: timelineData, isLoading } = useContactTimeline(contactId);
  const timeline = timelineData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <Activity className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium">No activity yet</p>
        <p className="text-xs text-muted-foreground">
          Activities will appear here as you interact with this contact
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {timeline.slice(0, 10).map((activity, index) => (
        <TimelineItem key={activity.id || `activity-${index}`} activity={activity} />
      ))}
      {timeline.length > 10 && (
        <button className="w-full py-2 text-xs text-primary hover:underline">
          View all {timeline.length} activities
        </button>
      )}
    </div>
  );
}

// Quick Note Form
function QuickNoteForm({ contactId, onSuccess }) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createActivity = useCreateActivity();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!note.trim()) return;

    setIsSubmitting(true);
    try {
      await createActivity.mutateAsync({
        type: 'NOTE',
        title: 'Note',
        description: note,
        contactId,
      });
      setNote('');
      toast({ title: 'Note added', description: 'Your note has been saved.' });
      onSuccess?.();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add note', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[80px] resize-none"
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit} disabled={!note.trim() || isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Plus className="h-4 w-4 mr-1" />
          )}
          Add Note
        </Button>
      </div>
    </div>
  );
}

// Custom Fields Section
function CustomFieldsSection({ contact, customFields }) {
  if (!customFields || customFields.length === 0) return null;

  const contactCustomFields = contact.customFields || {};
  const hasValues = customFields.some((field) => contactCustomFields[field.apiName]);

  if (!hasValues) return null;

  return (
    <CollapsibleSection title="Custom Fields" icon={FileText}>
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
        <div className="grid grid-cols-2 gap-3">
          {customFields.map((field) => {
            const value = contactCustomFields[field.apiName];
            if (!value) return null;
            return (
              <div key={field.id} className="text-sm">
                <p className="text-xs text-muted-foreground">{safeRender(field.name, 'Field')}</p>
                <p className="font-medium truncate">
                  {field.fieldType === 'BOOLEAN' ? (value ? 'Yes' : 'No') : safeRender(value, '-')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </CollapsibleSection>
  );
}

// Deals Section Component
function DealsSection({ deals }) {
  if (!deals || deals.length === 0) {
    return (
      <CollapsibleSection title="Deals & Opportunities" icon={DealIcon} defaultOpen={false}>
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 text-center">
          <DealIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No deals associated</p>
          <Button variant="outline" size="sm" className="mt-2">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Create Deal
          </Button>
        </div>
      </CollapsibleSection>
    );
  }

  const totalValue = deals.reduce((sum, deal) => sum + (parseFloat(deal.amount) || 0), 0);

  return (
    <CollapsibleSection title={`Deals (${deals.length})`} icon={DealIcon}>
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-600">Total Pipeline Value</span>
            <span className="text-lg font-bold text-emerald-700">
              ${totalValue.toLocaleString()}
            </span>
          </div>
        </div>
        {deals.slice(0, 3).map((deal) => (
          <div
            key={deal.id}
            className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 hover:border-primary/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{deal.name || 'Untitled Deal'}</p>
                <p className="text-xs text-muted-foreground">{deal.stage?.name || 'No stage'}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                ${(parseFloat(deal.amount) || 0).toLocaleString()}
              </Badge>
            </div>
          </div>
        ))}
        {deals.length > 3 && (
          <Button variant="ghost" size="sm" className="w-full">
            View all {deals.length} deals
          </Button>
        )}
      </div>
    </CollapsibleSection>
  );
}

// Consent & Preferences Section
function ConsentSection({ contact }) {
  return (
    <CollapsibleSection title="Communication Preferences" icon={Shield} defaultOpen={false}>
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Marketing Emails</span>
            </div>
            {contact.marketingConsent ? (
              <Badge className="bg-green-100 text-green-700 border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Subscribed
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0">
                <BellOff className="h-3 w-3 mr-1" />
                Not Subscribed
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">WhatsApp Messages</span>
            </div>
            {contact.whatsappConsent ? (
              <Badge className="bg-green-100 text-green-700 border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Opted In
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0">
                <BellOff className="h-3 w-3 mr-1" />
                Not Opted In
              </Badge>
            )}
          </div>

          {contact.consentUpdatedAt && !isNaN(new Date(contact.consentUpdatedAt).getTime()) && (
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs text-muted-foreground">
                Consent last updated:{' '}
                {format(new Date(contact.consentUpdatedAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}

// Main Component
export function ContactDetailPanel({ contact, onEdit, onDelete, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Fetch additional data
  const { data: scoreData, isLoading: scoreLoading } = useContactScore(contact?.id);
  const { data: engagementData, isLoading: engagementLoading } = useContactEngagement(contact?.id);
  const { data: customFieldsData } = useCustomFields('CONTACT');

  const score = scoreData?.data;
  const engagement = engagementData?.data;
  const customFields = customFieldsData?.data || [];

  // Empty state
  if (!contact) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-6">
          <Users className="h-12 w-12 text-primary/50" />
        </div>
        <h3 className="font-semibold text-xl mb-2">Contacts</h3>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          Manage your contacts and leads. Select a contact from the list to view their details.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4 max-w-lg">
          <div className="text-center p-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground">Email contacts directly</p>
          </div>
          <div className="text-center p-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground">Track lead stages</p>
          </div>
          <div className="text-center p-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-xs text-muted-foreground">Link to companies</p>
          </div>
        </div>
      </div>
    );
  }

  // Rating badge
  const ratingConfig = contact.rating ? RATING_CONFIG[contact.rating] : null;
  const priorityConfig = contact.priority ? PRIORITY_CONFIG[contact.priority] : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5" />
        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg bg-primary/10 border border-primary/20">
                  {contact.avatarUrl ? (
                    <img
                      src={contact.avatarUrl}
                      alt=""
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-primary">
                      {contact.firstName?.[0] || ''}
                      {contact.lastName?.[0] || ''}
                    </span>
                  )}
                </div>
                {contact.status === 'ACTIVE' && (
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">
                    {contact.displayName ||
                      `${contact.firstName || ''} ${contact.lastName || ''}`.trim() ||
                      'Unknown'}
                  </h2>
                  {ratingConfig && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={cn(
                              'h-6 w-6 rounded-full flex items-center justify-center',
                              ratingConfig.bg
                            )}
                          >
                            <ratingConfig.icon className={cn('h-3.5 w-3.5', ratingConfig.color)} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{ratingConfig.label}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className={cn(
                      contact.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : contact.status === 'BLOCKED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {safeRender(contact.status, 'Unknown')}
                  </Badge>
                  {contact.lifecycleStage && (
                    <Badge variant="outline">{safeRender(contact.lifecycleStage)}</Badge>
                  )}
                  {priorityConfig && (
                    <Badge variant="outline" className={priorityConfig.color}>
                      <Flag className="h-3 w-3 mr-1" />
                      {priorityConfig.label} Priority
                    </Badge>
                  )}
                </div>
                {(contact.jobTitle || contact.company?.name) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {safeRender(contact.jobTitle)}
                    {contact.jobTitle && contact.company?.name && ' at '}
                    {safeRender(contact.company?.name)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => onEdit(contact)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <DealIcon className="h-4 w-4 mr-2" />
                    Create Deal
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileCheck className="h-4 w-4 mr-2" />
                    Create Task
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete(contact)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="h-8">
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Video className="h-3.5 w-3.5 mr-1.5" />
              Meeting
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <StickyNote className="h-3.5 w-3.5 mr-1.5" />
              Note
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start px-5 h-11 bg-transparent border-b rounded-none gap-4">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Notes
          </TabsTrigger>
        </TabsList>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Overview Tab */}
          <TabsContent value="overview" className="m-0 p-5 space-y-5">
            {/* Lead Score */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Lead Score
                </label>
                {contact.lastEngagementDate &&
                  !isNaN(new Date(contact.lastEngagementDate).getTime()) && (
                    <span className="text-xs text-muted-foreground">
                      Last activity:{' '}
                      {formatDistanceToNow(new Date(contact.lastEngagementDate), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
              </div>
              {scoreLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ) : (
                <LeadScoreGauge
                  score={
                    typeof score?.totalScore === 'number'
                      ? score.totalScore
                      : typeof contact.leadScore === 'number'
                        ? contact.leadScore
                        : 0
                  }
                  breakdown={score?.breakdown}
                />
              )}
            </div>

            {/* Engagement Metrics */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Engagement
              </label>
              <EngagementMetrics engagement={engagement} isLoading={engagementLoading} />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-700">
                      {safeRender(contact.lifecycleStage, 'Not set')}
                    </p>
                    <p className="text-[10px] text-blue-600/70">Stage</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-700">
                      {safeRender(contact.leadStatus, 'Not set')}
                    </p>
                    <p className="text-[10px] text-emerald-600/70">Lead Status</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-700">
                      {safeRender(contact.source, 'Unknown')}
                    </p>
                    <p className="text-[10px] text-purple-600/70">Source</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Quick Info */}
            <CollapsibleSection title="Contact Information" icon={User}>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                <div className="space-y-0">
                  <InfoRow icon={Mail} label="Email" value={contact.email} copyable />
                  <InfoRow icon={Phone} label="Phone" value={contact.phone} copyable />
                  <InfoRow icon={Smartphone} label="Mobile" value={contact.mobilePhone} copyable />
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={[contact.city, contact.state, contact.country]
                      .filter(Boolean)
                      .join(', ')}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Company Info */}
            {contact.company?.name && (
              <CollapsibleSection title="Company" icon={Building2}>
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{safeRender(contact.company?.name)}</p>
                      {contact.jobTitle && (
                        <p className="text-sm text-muted-foreground">
                          {safeRender(contact.jobTitle)}
                        </p>
                      )}
                    </div>
                  </div>
                  {contact.department && (
                    <InfoRow icon={Briefcase} label="Department" value={contact.department} />
                  )}
                </div>
              </CollapsibleSection>
            )}

            {/* Deals */}
            <DealsSection deals={contact.deals} />

            {/* Recent Activity Preview */}
            <CollapsibleSection title="Recent Activity" icon={Activity}>
              <ActivityTimeline contactId={contact.id} />
            </CollapsibleSection>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="m-0 p-5 space-y-5">
            {/* Personal Information */}
            <CollapsibleSection title="Personal Information" icon={User}>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                <div className="space-y-0">
                  <InfoRow icon={User} label="First Name" value={contact.firstName} />
                  <InfoRow icon={User} label="Last Name" value={contact.lastName} />
                  <InfoRow icon={User} label="Display Name" value={contact.displayName} />
                  <InfoRow icon={Mail} label="Email" value={contact.email} copyable />
                  <InfoRow icon={Phone} label="Phone" value={contact.phone} copyable />
                  <InfoRow
                    icon={Smartphone}
                    label="Mobile Phone"
                    value={contact.mobilePhone}
                    copyable
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Address */}
            <CollapsibleSection title="Address" icon={MapPin}>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                <div className="space-y-0">
                  <InfoRow icon={Home} label="Street Address" value={contact.address} />
                  <InfoRow icon={MapPin} label="City" value={contact.city} />
                  <InfoRow icon={MapPin} label="State/Province" value={contact.state} />
                  <InfoRow icon={Hash} label="Postal Code" value={contact.postalCode} />
                  <InfoRow icon={Globe} label="Country" value={contact.country} />
                </div>
                {(contact.city || contact.state || contact.country) && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs text-muted-foreground mb-2">Full Address</p>
                    <p className="text-sm">
                      {[
                        contact.address,
                        contact.city,
                        contact.state,
                        contact.postalCode,
                        contact.country,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* Work Information */}
            <CollapsibleSection title="Work Information" icon={Briefcase}>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                <div className="space-y-0">
                  {contact.company?.name && (
                    <InfoRow icon={Building2} label="Company" value={contact.company?.name} />
                  )}
                  <InfoRow icon={Briefcase} label="Job Title" value={contact.jobTitle} />
                  <InfoRow icon={Users} label="Department" value={contact.department} />
                  <InfoRow icon={Receipt} label="GSTIN" value={contact.gstin} />
                </div>
              </div>
            </CollapsibleSection>

            {/* Lead Information */}
            <CollapsibleSection title="Lead Information" icon={Target}>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Lead Score</p>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-bold">
                        {typeof contact.leadScore === 'number' ? contact.leadScore : 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Rating</p>
                    {ratingConfig ? (
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'h-8 w-8 rounded-lg flex items-center justify-center',
                            ratingConfig.bg
                          )}
                        >
                          <ratingConfig.icon className={cn('h-4 w-4', ratingConfig.color)} />
                        </div>
                        <span className="text-sm font-medium">{ratingConfig.label}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not rated</span>
                    )}
                  </div>
                </div>
                <div className="space-y-0">
                  <InfoRow icon={Target} label="Lifecycle Stage" value={contact.lifecycleStage} />
                  <InfoRow icon={TrendingUp} label="Lead Status" value={contact.leadStatus} />
                  <InfoRow icon={Star} label="Source" value={contact.source} />
                  <InfoRow icon={Flag} label="Priority" value={contact.priority} />
                </div>
                {contact.sourceDetails && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs text-muted-foreground mb-2">Source Details</p>
                    <pre className="text-xs bg-slate-100 p-2 rounded overflow-auto">
                      {JSON.stringify(contact.sourceDetails, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* Social Links */}
            <CollapsibleSection title="Social Profiles" icon={Globe}>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                {contact.linkedinUrl || contact.twitterUrl || contact.facebookUrl ? (
                  <div className="flex flex-wrap gap-2">
                    {contact.linkedinUrl && (
                      <a
                        href={contact.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 transition-colors text-sm"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {contact.twitterUrl && (
                      <a
                        href={contact.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1da1f2]/10 text-[#1da1f2] hover:bg-[#1da1f2]/20 transition-colors text-sm"
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {contact.facebookUrl && (
                      <a
                        href={contact.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2]/20 transition-colors text-sm"
                      >
                        <Facebook className="h-4 w-4" />
                        Facebook
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No social profiles linked
                  </p>
                )}
              </div>
            </CollapsibleSection>

            {/* Communication Preferences */}
            <ConsentSection contact={contact} />

            {/* Custom Fields */}
            <CustomFieldsSection contact={contact} customFields={customFields} />

            {/* Tags */}
            {contact.tags?.length > 0 && (
              <CollapsibleSection title="Tags" icon={Tag}>
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag) => (
                      <Badge
                        key={tag.id || Math.random()}
                        variant="secondary"
                        style={{
                          backgroundColor: tag.color ? `${tag.color}20` : undefined,
                          color: tag.color || undefined,
                        }}
                      >
                        {safeRender(tag.name, 'Tag')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* Owner & Metadata */}
            <CollapsibleSection title="Record Information" icon={Info} defaultOpen={false}>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                <div className="space-y-0">
                  <InfoRow
                    icon={UserCog}
                    label="Owner ID"
                    value={contact.ownerId || 'Unassigned'}
                  />
                  <InfoRow
                    icon={CalendarDays}
                    label="Created"
                    value={
                      contact.createdAt && !isNaN(new Date(contact.createdAt).getTime())
                        ? format(new Date(contact.createdAt), 'MMM d, yyyy h:mm a')
                        : null
                    }
                  />
                  <InfoRow
                    icon={History}
                    label="Last Updated"
                    value={
                      contact.updatedAt && !isNaN(new Date(contact.updatedAt).getTime())
                        ? format(new Date(contact.updatedAt), 'MMM d, yyyy h:mm a')
                        : null
                    }
                  />
                  <InfoRow icon={Hash} label="Contact ID" value={contact.id} copyable />
                </div>
              </div>
            </CollapsibleSection>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="m-0 p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Activity Timeline</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Log Activity
                </Button>
              </div>
              <ActivityTimeline contactId={contact.id} />
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="m-0 p-5">
            <div className="space-y-4">
              <h3 className="font-medium">Notes</h3>
              <QuickNoteForm contactId={contact.id} />
              <div className="border-t pt-4">
                <ActivityTimeline contactId={contact.id} />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="p-5 border-t shrink-0 bg-slate-50/50">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-10">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button className="flex-1 h-10" onClick={() => onEdit(contact)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Contact
          </Button>
        </div>
      </div>
    </div>
  );
}
