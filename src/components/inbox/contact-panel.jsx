'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Phone,
  Mail,
  MessageSquare,
  Smartphone,
  User,
  Building2,
  MapPin,
  Link2,
  ExternalLink,
  Star,
  Archive,
  Pin,
  Target,
  Sparkles,
  Zap,
  Tag,
  X,
  Clock,
  Calendar,
  Ticket,
  History,
  TrendingUp,
  CreditCard,
  CheckCircle,
  ChevronDown,
  Loader2,
  PhoneIncoming,
  PhoneOutgoing,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { NotesPanel } from './notes-panel';
import { AISuggestionsPanel } from './ai-suggestions';
import { ConversationSummaryPanel } from './conversation-summary';

// Channel icons
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Channel config
const channelConfig = {
  whatsapp: {
    icon: WhatsAppIcon,
    color: 'text-[#25d366]',
    bgColor: 'bg-[#25d366]',
    label: 'WhatsApp',
  },
  email: {
    icon: Mail,
    color: 'text-[#800020]',
    bgColor: 'bg-[#800020]',
    label: 'Email',
  },
  sms: {
    icon: Smartphone,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500',
    label: 'SMS',
  },
  voice: {
    icon: Phone,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    label: 'Voice',
  },
};

// Lifecycle colors
const lifecycleColors = {
  SUBSCRIBER: 'border-slate-500/30 bg-slate-50 text-slate-700',
  LEAD: 'border-blue-500/30 bg-blue-50 text-blue-700',
  MQL: 'border-purple-500/30 bg-purple-50 text-purple-700',
  SQL: 'border-orange-500/30 bg-orange-50 text-orange-700',
  OPPORTUNITY: 'border-yellow-500/30 bg-yellow-50 text-yellow-700',
  CUSTOMER: 'border-green-500/30 bg-green-50 text-green-700',
  EVANGELIST: 'border-pink-500/30 bg-pink-50 text-pink-700',
};

// Rating colors
const ratingColors = {
  HOT: 'border-red-500/30 bg-red-50 text-red-700',
  WARM: 'border-orange-500/30 bg-orange-50 text-orange-700',
  COLD: 'border-blue-500/30 bg-blue-50 text-blue-700',
};

// Activity channel config for dropdown
const activityChannelConfig = {
  voice: {
    icon: Phone,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    label: 'Voice Calls',
  },
  whatsapp: {
    icon: MessageSquare,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    label: 'WhatsApp',
  },
  sms: {
    icon: Smartphone,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    label: 'SMS',
  },
  email: {
    icon: Mail,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    label: 'Email',
  },
};

// Call status config
const callStatusConfig = {
  completed: { label: 'Completed', bgColor: 'bg-green-50', color: 'text-green-700' },
  missed: { label: 'Missed', bgColor: 'bg-red-50', color: 'text-red-700' },
  no_answer: { label: 'No Answer', bgColor: 'bg-yellow-50', color: 'text-yellow-700' },
  busy: { label: 'Busy', bgColor: 'bg-orange-50', color: 'text-orange-700' },
  failed: { label: 'Failed', bgColor: 'bg-red-50', color: 'text-red-700' },
  ringing: { label: 'Ringing', bgColor: 'bg-blue-50', color: 'text-blue-700' },
  in_progress: { label: 'In Progress', bgColor: 'bg-blue-50', color: 'text-blue-700' },
};

// Call direction config
const callDirectionConfig = {
  inbound: { icon: PhoneIncoming, color: 'text-green-600', bgColor: 'bg-green-100' },
  outbound: { icon: PhoneOutgoing, color: 'text-blue-600', bgColor: 'bg-blue-100' },
};

// Collapsible Section Component
function CollapsibleSection({ title, icon: Icon, defaultOpen = true, children }) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-1.5 text-[10px] uppercase font-medium text-muted-foreground hover:text-foreground">
        <span className="flex items-center gap-1.5">
          {Icon && <Icon className="h-3 w-3" />}
          {title}
        </span>
        <ChevronDown className="h-3 w-3" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1">{children}</CollapsibleContent>
    </Collapsible>
  );
}

// Info Row Component
function InfoRow({ label, value, icon: Icon, copyable }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value && typeof value === 'string') {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-between py-1 group">
      <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </span>
      <div className="flex items-center gap-1">
        <span className="text-[11px] font-medium text-right max-w-[150px] truncate">
          {value || 'Not set'}
        </span>
        {copyable && value && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <ExternalLink className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Format duration helper
function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Channel Icon Component
function ChannelIcon({ channelType, className }) {
  const config = channelConfig[channelType?.toLowerCase()];
  if (!config) return <MessageSquare className={className} />;
  const IconComponent = config.icon;
  return <IconComponent className={cn(className, config.color)} />;
}

/**
 * Unified Contact Panel Component
 * Works for all channels: WhatsApp, SMS, Email, Voice
 *
 * Props:
 * - contactId: Direct contact ID to fetch
 * - conversation: Conversation object (for WhatsApp, SMS, Email)
 * - call: Call object (for Voice)
 * - callHistory: Array of calls for this contact (for Voice)
 * - channelType: 'whatsapp' | 'sms' | 'email' | 'voice'
 * - onClose: Close panel callback
 * - onViewProfile: View full profile callback
 * - isPinned: Panel pinned state
 * - onTogglePin: Toggle pin callback
 * - onSelectCall: Callback when selecting a call from history (for Voice)
 */
export function ContactPanel({
  contactId: propContactId,
  conversation,
  call,
  callHistory = [],
  channelType: propChannelType,
  onClose,
  onViewProfile,
  isPinned,
  onTogglePin,
  onSelectCall,
  onCall,
  onEmail,
  onWhatsApp,
  onSms,
  onCreateTicket,
}) {
  const [contact, setContact] = useState(null);
  const [contactLoading, setContactLoading] = useState(true);
  const [activityChannel, setActivityChannel] = useState(propChannelType || 'whatsapp');
  const [channelActivities, setChannelActivities] = useState({
    voice: callHistory,
    whatsapp: [],
    sms: [],
    email: [],
  });
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Determine channel type
  const channelType = propChannelType || conversation?.channelType || 'whatsapp';
  const config = channelConfig[channelType?.toLowerCase()] || channelConfig.whatsapp;

  // Extract contact info from conversation or call
  const contactName =
    conversation?.contactName ||
    (call?.contact
      ? call.contact.displayName ||
        `${call.contact.firstName || ''} ${call.contact.lastName || ''}`.trim()
      : null) ||
    'Unknown';

  const contactPhone =
    conversation?.contactPhone ||
    (call?.direction?.toLowerCase() === 'outbound' ? call?.toNumber : call?.fromNumber) ||
    '';

  const contactEmail = conversation?.contactEmail || call?.contact?.email || '';

  const contactId =
    propContactId || conversation?.contactId || call?.contactId || call?.contact?.id;

  // Get initials
  const initials = contactName
    ? contactName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  // Fetch contact data
  useEffect(() => {
    if (contactId) {
      setContactLoading(true);
      api
        .get(`/crm/contacts/${contactId}`)
        .then((response) => {
          if (response.success && response.data) {
            setContact(response.data);
          } else if (response.id) {
            setContact(response);
          }
          setContactLoading(false);
        })
        .catch(() => {
          setContact(null);
          setContactLoading(false);
        });
    } else if (conversation?.contact || call?.contact) {
      setContact(conversation?.contact || call?.contact);
      setContactLoading(false);
    } else {
      setContact(null);
      setContactLoading(false);
    }
  }, [contactId, conversation?.contact, call?.contact]);

  // Update voice calls from props (separate effect to avoid infinite loop)
  useEffect(() => {
    setChannelActivities((prev) => {
      // Only update if call history actually changed
      if (JSON.stringify(prev.voice) === JSON.stringify(callHistory)) {
        return prev;
      }
      return { ...prev, voice: callHistory };
    });
  }, [callHistory]);

  // Fetch activities for other channels
  useEffect(() => {
    let isCancelled = false;

    const fetchChannelActivities = async () => {
      if (!contactPhone && !contactId) return;

      setLoadingActivities(true);
      try {
        const params = new URLSearchParams();
        if (contactPhone) {
          params.append('search', contactPhone);
        }
        params.append('limit', '5');

        const response = await api.get(`/inbox/conversations?${params.toString()}`);
        if (isCancelled) return;

        const conversations = response?.data || response?.conversations || [];

        const whatsappConvos = conversations
          .filter(
            (c) =>
              c.channel?.toLowerCase() === 'whatsapp' || c.channelType?.toLowerCase() === 'whatsapp'
          )
          .slice(0, 5);

        const smsConvos = conversations
          .filter(
            (c) => c.channel?.toLowerCase() === 'sms' || c.channelType?.toLowerCase() === 'sms'
          )
          .slice(0, 5);

        const emailConvos = conversations
          .filter(
            (c) => c.channel?.toLowerCase() === 'email' || c.channelType?.toLowerCase() === 'email'
          )
          .slice(0, 5);

        if (!isCancelled) {
          setChannelActivities((prev) => ({
            ...prev,
            whatsapp: whatsappConvos,
            sms: smsConvos,
            email: emailConvos,
          }));
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to fetch channel activities:', error);
        }
      } finally {
        if (!isCancelled) {
          setLoadingActivities(false);
        }
      }
    };

    fetchChannelActivities();

    return () => {
      isCancelled = true;
    };
  }, [contactId, contactPhone]);

  // Set initial activity channel based on current channel type
  useEffect(() => {
    setActivityChannel(channelType?.toLowerCase() || 'whatsapp');
  }, [channelType]);

  if (!conversation && !call && !propContactId) return null;

  return (
    <div className="w-80 bg-white dark:bg-card flex flex-col h-full rounded-3xl shadow-sm ml-2 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-indigo-100">Contact Details</span>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-6 w-6 text-white/70 hover:text-white hover:bg-white/10',
                      isPinned && 'text-white bg-white/20'
                    )}
                    onClick={onTogglePin}
                  >
                    <Pin className={cn('h-3.5 w-3.5', isPinned && 'fill-current')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isPinned ? 'Unpin Panel' : 'Pin Panel'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
              <span className="text-sm font-semibold text-white">{initials}</span>
            </div>
            <div
              className={cn(
                'absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center border-2 border-primary shadow-sm',
                config.bgColor
              )}
            >
              <ChannelIcon channelType={channelType} className="h-3 w-3 !text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-white truncate">{contactName}</h4>
              {contact?.rating === 'HOT' && (
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-indigo-100 truncate">
              {contactEmail || contactPhone || 'No contact info'}
            </p>
          </div>
        </div>
      </div>

      {/* Badges Row */}
      <div className="px-4 py-2 border-b bg-slate-50 flex items-center gap-1.5 flex-wrap">
        {contact?.lifecycleStage && (
          <Badge
            variant="outline"
            className={cn('text-[10px] px-1.5 py-0 h-5', lifecycleColors[contact.lifecycleStage])}
          >
            {contact.lifecycleStage}
          </Badge>
        )}
        {contact?.rating && (
          <Badge
            variant="outline"
            className={cn('text-[10px] px-1.5 py-0 h-5', ratingColors[contact.rating])}
          >
            {contact.rating}
          </Badge>
        )}
        {contact?.expectedRevenue > 0 && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 border-primary/30 text-primary"
          >
            ${(contact.expectedRevenue / 1000).toFixed(0)}K Expected
          </Badge>
        )}
        {!contact?.lifecycleStage && !contact?.rating && !contact?.expectedRevenue && (
          <span className="text-xs text-muted-foreground">No tags</span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <TooltipProvider delayDuration={0}>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onCall && onCall(contactPhone)}
                    disabled={!contactPhone || !onCall}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Call</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onSms && onSms(contactPhone)}
                    disabled={!contactPhone || !onSms}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">SMS</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onEmail && onEmail(contact?.email)}
                    disabled={!contact?.email || !onEmail}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Email</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onWhatsApp && onWhatsApp(contactPhone)}
                    disabled={!contactPhone || !onWhatsApp}
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25d366]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">WhatsApp</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onViewProfile && onViewProfile(contactId)}
                    disabled={!contactId}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">View Profile</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() =>
                      onCreateTicket &&
                      onCreateTicket(contactId, contactName, contactEmail || contactPhone)
                    }
                    disabled={!contactId || !onCreateTicket}
                  >
                    <Ticket className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Create Ticket</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activity" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full rounded-none border-b bg-transparent h-8 p-0 shrink-0">
          <TabsTrigger
            value="info"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full text-xs"
          >
            Info
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full text-xs"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full text-xs"
          >
            Notes
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full text-xs"
          >
            AI
          </TabsTrigger>
        </TabsList>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Info Tab */}
          <TabsContent value="info" className="px-3 py-2 space-y-2 m-0">
            <CollapsibleSection title="Contact Information" icon={User} defaultOpen>
              <div className="space-y-0.5">
                <InfoRow
                  label="Email"
                  value={contact?.email || contactEmail}
                  icon={Mail}
                  copyable
                />
                <InfoRow
                  label="Phone"
                  value={contact?.phone || contactPhone}
                  icon={Phone}
                  copyable
                />
                {contact?.mobilePhone && (
                  <InfoRow label="Mobile" value={contact.mobilePhone} icon={Smartphone} copyable />
                )}
                <InfoRow
                  label="Company"
                  value={contact?.company?.name || conversation?.companyName || 'Not set'}
                  icon={Building2}
                />
                <InfoRow label="Job Title" value={contact?.jobTitle || 'Not set'} icon={User} />
                {contact?.billingCity && contact?.billingState && (
                  <InfoRow
                    label="Location"
                    value={`${contact.billingCity}, ${contact.billingState}`}
                    icon={MapPin}
                  />
                )}
                {contact?.linkedinUrl && (
                  <InfoRow
                    label="LinkedIn"
                    value={
                      <a
                        href={contact.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Profile <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    }
                    icon={Link2}
                  />
                )}
              </div>
            </CollapsibleSection>

            <Separator />

            {/* Lead Information */}
            {contact && (
              <>
                <CollapsibleSection title="Lead Information" icon={Target} defaultOpen>
                  <div className="space-y-0.5">
                    {contact.lifecycleStage && (
                      <InfoRow
                        label="Lifecycle"
                        value={
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] px-1.5 py-0',
                              lifecycleColors[contact.lifecycleStage]
                            )}
                          >
                            {contact.lifecycleStage}
                          </Badge>
                        }
                      />
                    )}
                    {contact.leadStatus && (
                      <InfoRow label="Lead Status" value={contact.leadStatus.replace(/_/g, ' ')} />
                    )}
                    {contact.leadScore !== undefined && (
                      <InfoRow
                        label="Lead Score"
                        value={
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  contact.leadScore >= 70
                                    ? 'bg-green-500'
                                    : contact.leadScore >= 40
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                )}
                                style={{ width: `${contact.leadScore}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-medium">{contact.leadScore}</span>
                          </div>
                        }
                      />
                    )}
                    {contact.rating && (
                      <InfoRow
                        label="Rating"
                        value={
                          <Badge
                            variant="outline"
                            className={cn('text-[10px] px-1.5 py-0', ratingColors[contact.rating])}
                          >
                            {contact.rating}
                          </Badge>
                        }
                      />
                    )}
                    {contact.source && (
                      <InfoRow label="Source" value={contact.source.replace(/_/g, ' ')} />
                    )}
                  </div>
                </CollapsibleSection>
                <Separator />
              </>
            )}

            {/* Channel History */}
            <CollapsibleSection title="Channel History" icon={History} defaultOpen={false}>
              <div className="space-y-2">
                {Object.entries(channelConfig).map(([type, channelCfg]) => {
                  const IconComp = channelCfg.icon;
                  return (
                    <div
                      key={type}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-lg',
                        type === channelType?.toLowerCase()
                          ? `${channelCfg.bgColor}/20`
                          : 'bg-muted/30'
                      )}
                    >
                      <span className="flex items-center gap-2 text-xs">
                        <IconComp className={cn('h-3.5 w-3.5', channelCfg.color)} />
                        {channelCfg.label}
                      </span>
                      {type === channelType?.toLowerCase() ? (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          Active
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          {channelActivities[type]?.length || 0}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CollapsibleSection>

            <Separator />

            {/* Tags */}
            <CollapsibleSection title="Tags" icon={Tag} defaultOpen={false}>
              <div className="flex flex-wrap gap-1">
                {contact?.tags?.length > 0 ? (
                  contact.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No tags</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground"
                >
                  + Add Tag
                </Button>
              </div>
            </CollapsibleSection>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="px-3 py-2 m-0">
            <div className="space-y-3">
              {/* Channel Selector */}
              <Select value={activityChannel} onValueChange={setActivityChannel}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {activityChannelConfig[activityChannel] && (
                        <>
                          {(() => {
                            const ChannelIconComp = activityChannelConfig[activityChannel].icon;
                            return (
                              <ChannelIconComp
                                className={cn(
                                  'h-3.5 w-3.5',
                                  activityChannelConfig[activityChannel].color
                                )}
                              />
                            );
                          })()}
                          <span>{activityChannelConfig[activityChannel].label}</span>
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 ml-auto">
                            {channelActivities[activityChannel]?.length || 0}
                          </Badge>
                        </>
                      )}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityChannelConfig).map(([key, cfg]) => {
                    const IconComp = cfg.icon;
                    const count = channelActivities[key]?.length || 0;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2 w-full">
                          <IconComp className={cn('h-3.5 w-3.5', cfg.color)} />
                          <span>{cfg.label}</span>
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 ml-auto">
                            {count}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Loading State */}
              {loadingActivities && activityChannel !== 'voice' && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Voice Calls */}
              {activityChannel === 'voice' && (
                <>
                  {channelActivities.voice.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No call history
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {channelActivities.voice.map((historyCall) => {
                        const isSelected = historyCall.id === call?.id;
                        const dirConfig =
                          callDirectionConfig[historyCall.direction?.toLowerCase()] ||
                          callDirectionConfig.outbound;
                        const statConfig =
                          callStatusConfig[historyCall.status?.toLowerCase()] ||
                          callStatusConfig.completed;
                        const DirIcon = dirConfig.icon;

                        return (
                          <button
                            key={historyCall.id}
                            onClick={() => onSelectCall?.(historyCall)}
                            className={cn(
                              'w-full p-2 rounded-lg text-left transition-all border',
                              isSelected
                                ? 'bg-orange-50 border-orange-200'
                                : 'hover:bg-muted/50 border-transparent'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  'h-6 w-6 rounded-full flex items-center justify-center',
                                  dirConfig.bgColor
                                )}
                              >
                                <DirIcon className={cn('h-3 w-3', dirConfig.color)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <Badge
                                    className={cn(
                                      'text-[9px] px-1 py-0 h-4',
                                      statConfig.bgColor,
                                      statConfig.color
                                    )}
                                    variant="outline"
                                  >
                                    {statConfig.label}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground">
                                    {historyCall.createdAt
                                      ? formatDistanceToNow(new Date(historyCall.createdAt), {
                                          addSuffix: true,
                                        })
                                      : ''}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {historyCall.duration > 0 && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                      <Clock className="h-2.5 w-2.5" />
                                      {formatDuration(historyCall.duration)}
                                    </span>
                                  )}
                                  {historyCall.disposition && (
                                    <span className="text-[10px] text-purple-600">
                                      {historyCall.disposition.replace(/_/g, ' ')}
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
                </>
              )}

              {/* WhatsApp Messages */}
              {activityChannel === 'whatsapp' && !loadingActivities && (
                <>
                  {channelActivities.whatsapp.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No WhatsApp conversations
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {channelActivities.whatsapp.map((convo) => (
                        <a
                          key={convo.id}
                          href={`/inbox?conversationId=${convo.id}`}
                          className="block w-full p-2 rounded-lg text-left transition-all border hover:bg-green-50 hover:border-green-200 border-transparent"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full flex items-center justify-center bg-green-100">
                              <MessageSquare className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium truncate">
                                  {convo.lastMessage?.substring(0, 30) || 'No message'}...
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {convo.lastMessageAt
                                    ? formatDistanceToNow(new Date(convo.lastMessageAt), {
                                        addSuffix: true,
                                      })
                                    : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {convo.unreadCount > 0 && (
                                  <Badge className="text-[9px] px-1 py-0 h-4 bg-green-500 text-white">
                                    {convo.unreadCount} new
                                  </Badge>
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                  {convo.status || 'Active'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* SMS Messages */}
              {activityChannel === 'sms' && !loadingActivities && (
                <>
                  {channelActivities.sms.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No SMS conversations
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {channelActivities.sms.map((convo) => (
                        <a
                          key={convo.id}
                          href={`/inbox?channel=sms&conversationId=${convo.id}`}
                          className="block w-full p-2 rounded-lg text-left transition-all border hover:bg-blue-50 hover:border-blue-200 border-transparent"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full flex items-center justify-center bg-blue-100">
                              <Smartphone className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium truncate">
                                  {convo.lastMessage?.substring(0, 30) || 'No message'}...
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {convo.lastMessageAt
                                    ? formatDistanceToNow(new Date(convo.lastMessageAt), {
                                        addSuffix: true,
                                      })
                                    : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {convo.unreadCount > 0 && (
                                  <Badge className="text-[9px] px-1 py-0 h-4 bg-blue-500 text-white">
                                    {convo.unreadCount} new
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Email Messages */}
              {activityChannel === 'email' && !loadingActivities && (
                <>
                  {channelActivities.email.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No email conversations
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {channelActivities.email.map((convo) => (
                        <a
                          key={convo.id}
                          href={`/inbox?channel=email&conversationId=${convo.id}`}
                          className="block w-full p-2 rounded-lg text-left transition-all border hover:bg-purple-50 hover:border-purple-200 border-transparent"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full flex items-center justify-center bg-purple-100">
                              <Mail className="h-3 w-3 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium truncate">
                                  {convo.subject ||
                                    convo.lastMessage?.substring(0, 30) ||
                                    'No subject'}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {convo.lastMessageAt
                                    ? formatDistanceToNow(new Date(convo.lastMessageAt), {
                                        addSuffix: true,
                                      })
                                    : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {convo.unreadCount > 0 && (
                                  <Badge className="text-[9px] px-1 py-0 h-4 bg-purple-500 text-white">
                                    {convo.unreadCount} new
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="px-3 py-2 m-0">
            <NotesPanel threadId={conversation?.id || call?.id} contactId={contactId} />
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="px-3 py-2 m-0 space-y-3">
            {conversation?.id ? (
              <>
                <AISuggestionsPanel
                  conversationId={conversation?.id}
                  lastCustomerMessage={null}
                  onSelectSuggestion={() => {}}
                />
                <ConversationSummaryPanel conversationId={conversation?.id} />
              </>
            ) : call ? (
              <div className="space-y-3">
                {call.metadata?.aiSummary ? (
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h5 className="text-xs font-medium text-orange-700 mb-1">AI Summary</h5>
                    <p className="text-sm">{call.metadata.aiSummary.overview}</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No AI summary available</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI insights will appear here once the call is analyzed
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No AI insights available</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default ContactPanel;
