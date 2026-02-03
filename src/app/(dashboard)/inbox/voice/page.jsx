'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Search,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneOff,
  Play,
  Pause,
  Clock,
  User,
  MoreHorizontal,
  X,
  Loader2,
  RefreshCw,
  Volume2,
  Download,
  Building2,
  Mail,
  MapPin,
  Link2,
  Ticket,
  ExternalLink,
  Star,
  Archive,
  Pin,
  Target,
  Sparkles,
  FileText,
  MessageSquare,
  Voicemail,
  Filter,
  ChevronDown,
  ChevronRight,
  Smartphone,
  Copy,
  Check,
  Bot,
  Mic,
  AlertCircle,
  PanelRight,
  PanelRightClose,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useCallLogs,
  useCallStats,
  useActiveCalls,
  useSetCallDisposition,
  useAddCallNote,
  useInitiateCall,
} from '@/hooks/use-dialer';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useTelecmi } from '@/providers/telecmi-provider';
import {
  useTelecmiStore,
  useLoginTelecmiAgent,
  useLogoutTelecmiAgent,
  useRequestTranscription,
  useTelecmiTranscription,
  useTelecmiActiveCalls,
  useListenToCall,
  useWhisperToAgent,
  useBargeIntoCall,
} from '@/hooks/use-telecmi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Headphones, LogOut, Key, Eye, MessageCircle, UserPlus, Radio } from 'lucide-react';

// Direction config
const directionConfig = {
  outbound: {
    icon: PhoneOutgoing,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Outbound',
  },
  inbound: {
    icon: PhoneIncoming,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Inbound',
  },
};

// Status config
const statusConfig = {
  completed: {
    icon: Phone,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Completed',
  },
  missed: {
    icon: PhoneMissed,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Missed',
  },
  busy: {
    icon: PhoneOff,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Busy',
  },
  no_answer: {
    icon: PhoneMissed,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'No Answer',
  },
  voicemail: {
    icon: Voicemail,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Voicemail',
  },
  failed: {
    icon: PhoneOff,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Failed',
  },
  in_progress: {
    icon: PhoneCall,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'In Progress',
  },
  ringing: {
    icon: Phone,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    label: 'Ringing',
  },
};

// Disposition config
const dispositionConfig = {
  INTERESTED: { color: 'bg-green-100 text-green-700', label: 'Interested' },
  NOT_INTERESTED: { color: 'bg-red-100 text-red-700', label: 'Not Interested' },
  CALLBACK_REQUESTED: { color: 'bg-blue-100 text-blue-700', label: 'Callback Requested' },
  WRONG_NUMBER: { color: 'bg-gray-100 text-gray-700', label: 'Wrong Number' },
  DO_NOT_CALL: { color: 'bg-red-100 text-red-700', label: 'Do Not Call' },
  LEFT_VOICEMAIL: { color: 'bg-purple-100 text-purple-700', label: 'Left Voicemail' },
  NO_DISPOSITION: { color: 'bg-gray-100 text-gray-600', label: 'No Disposition' },
};

// Lifecycle colors
const lifecycleColors = {
  LEAD: 'bg-blue-100 text-blue-700 border-blue-300',
  MQL: 'bg-primary/10 text-primary border-primary/30',
  SQL: 'bg-purple-100 text-purple-700 border-purple-300',
  OPPORTUNITY: 'bg-orange-100 text-orange-700 border-orange-300',
  CUSTOMER: 'bg-green-100 text-green-700 border-green-300',
  EVANGELIST: 'bg-pink-100 text-pink-700 border-pink-300',
};

// Rating colors
const ratingColors = {
  HOT: 'bg-red-100 text-red-700 border-red-300',
  WARM: 'bg-orange-100 text-orange-700 border-orange-300',
  COLD: 'bg-blue-100 text-blue-700 border-blue-300',
};

function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function StatusBadge({ status }) {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.completed;
  const Icon = config.icon;
  return (
    <Badge className={cn('gap-1', config.bgColor, config.color)} variant="outline">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function DirectionIcon({ direction, size = 'md' }) {
  const config = directionConfig[direction?.toLowerCase()] || directionConfig.outbound;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  return (
    <div
      className={cn('rounded-full flex items-center justify-center', sizeClasses, config.bgColor)}
    >
      <Icon className={cn(iconSize, config.color)} />
    </div>
  );
}

// Audio Player Component
function AudioPlayer({ recordingUrl, onTimeUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      onTimeUpdate?.(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!recordingUrl) {
    return (
      <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <Volume2 className="h-4 w-4" />
        No recording available
      </div>
    );
  }

  return (
    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
      <audio
        ref={audioRef}
        src={recordingUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-orange-500 text-white hover:bg-orange-600"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>

        <div className="flex-1 space-y-1">
          <div
            className="h-2 bg-muted rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>

        <Select
          value={playbackRate.toString()}
          onValueChange={(v) => setPlaybackRate(parseFloat(v))}
        >
          <SelectTrigger className="w-16 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5">0.5x</SelectItem>
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="1.5">1.5x</SelectItem>
            <SelectItem value="2">2x</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href={recordingUrl} download>
            <Download className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

// Collapsible Section Component
function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </div>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
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
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-right truncate max-w-[140px]">{value || 'Not set'}</span>
        {copyable && value && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-2.5 w-2.5 text-green-500" />
            ) : (
              <Copy className="h-2.5 w-2.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Call List Item Component
function CallListItem({ call, isSelected, onClick }) {
  const dirConfig = directionConfig[call.direction?.toLowerCase()] || directionConfig.outbound;
  const statConfig = statusConfig[call.status?.toLowerCase()] || statusConfig.completed;

  // Get contact display name
  const contactName = call.contact
    ? call.contact.displayName ||
      `${call.contact.firstName || ''} ${call.contact.lastName || ''}`.trim() ||
      null
    : null;

  // Get phone number based on direction
  const phoneNumber =
    call.direction?.toLowerCase() === 'outbound' ? call.toNumber : call.fromNumber;

  // Get initials for avatar
  const initials = contactName
    ? contactName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'w-full p-3 text-left rounded-lg transition-all',
        isSelected
          ? 'bg-orange-50 border border-orange-200'
          : 'hover:bg-muted/50 border border-transparent'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar with direction indicator */}
        <div className="relative shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">{initials}</span>
          </div>
          <div
            className={cn(
              'absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center border-2 border-white',
              dirConfig.bgColor
            )}
          >
            <dirConfig.icon className={cn('h-2.5 w-2.5', dirConfig.color)} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm truncate">
              {contactName || phoneNumber || 'Unknown'}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {call.createdAt
                ? formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })
                : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground truncate">{phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge
              className={cn('text-[10px] px-1.5 py-0 h-4', statConfig.bgColor, statConfig.color)}
              variant="outline"
            >
              {statConfig.label}
            </Badge>
            {call.duration > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(call.duration)}
              </span>
            )}
            {call.disposition && (
              <Badge
                className="text-[10px] px-1.5 py-0 h-4 bg-purple-50 text-purple-700 border-purple-200"
                variant="outline"
              >
                {call.disposition.replace(/_/g, ' ')}
              </Badge>
            )}
            {call.metadata?.callScore && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0 h-4 rounded font-medium flex items-center',
                  call.metadata.callScore >= 90
                    ? 'bg-green-100 text-green-700'
                    : call.metadata.callScore >= 70
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                )}
              >
                {call.metadata.callScore}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// AI Summary Panel Component
function AISummaryPanel({ call }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(null);

  // Get AI summary from call metadata if available
  const existingSummary = call?.metadata?.aiSummary;
  const summary = existingSummary || generatedSummary;

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call for generating summary
    setTimeout(() => {
      setGeneratedSummary({
        overview:
          'Customer called to inquire about product pricing and availability. The agent provided detailed information and addressed all questions.',
        keyPoints: [
          'Customer interested in solution',
          'Discussed pricing options',
          'Answered technical questions',
          'Follow-up scheduled',
        ],
        sentiment: 'positive',
        callPurpose: 'Sales Inquiry',
        actionItems: ['Send pricing proposal via email', 'Schedule follow-up call'],
      });
      setIsGenerating(false);
    }, 2000);
  };

  if (!call) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Select a call to view summary
      </div>
    );
  }

  if (!summary && !call.transcription) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <Bot className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground mb-3">
          No transcription available for AI summary
        </p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <Sparkles className="h-10 w-10 text-orange-500/50 mb-3" />
        <p className="text-sm text-muted-foreground mb-3">Generate an AI summary of this call</p>
        <Button onClick={handleGenerate} disabled={isGenerating} size="sm">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Summary
            </>
          )}
        </Button>
      </div>
    );
  }

  // Sentiment badge color mapping
  const sentimentColors = {
    positive: 'bg-green-50 text-green-700 border-green-200',
    negative: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  // Customer mood icon mapping
  const moodIcons = {
    excited: '😊',
    interested: '👍',
    satisfied: '✅',
    busy: '⏰',
    frustrated: '😟',
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {/* Header with sentiment and call purpose */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange-500" />
          AI Summary
        </h4>
        <div className="flex items-center gap-2">
          {summary.callPurpose && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {summary.callPurpose}
            </Badge>
          )}
          {summary.sentiment && (
            <Badge
              variant="outline"
              className={cn('text-xs capitalize', sentimentColors[summary.sentiment])}
            >
              {summary.sentiment}
            </Badge>
          )}
        </div>
      </div>

      {/* Overview */}
      <p className="text-sm text-muted-foreground">{summary.overview}</p>

      {/* Customer Mood & Call Score */}
      {(summary.customerMood || call.metadata?.callScore) && (
        <div className="flex items-center gap-4 p-2 bg-slate-50 rounded-lg">
          {summary.customerMood && (
            <div className="flex items-center gap-2">
              <span className="text-lg">{moodIcons[summary.customerMood] || '😐'}</span>
              <div>
                <p className="text-xs text-muted-foreground">Customer Mood</p>
                <p className="text-sm font-medium capitalize">{summary.customerMood}</p>
              </div>
            </div>
          )}
          {call.metadata?.callScore && (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold',
                  call.metadata.callScore >= 90
                    ? 'bg-green-100 text-green-700'
                    : call.metadata.callScore >= 70
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                )}
              >
                {call.metadata.callScore}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Call Score</p>
                <p className="text-sm font-medium">
                  {call.metadata.callScore >= 90
                    ? 'Excellent'
                    : call.metadata.callScore >= 70
                      ? 'Good'
                      : 'Needs Review'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Talk-Listen Ratio */}
      {summary.talkListenRatio && (
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Talk-to-Listen Ratio</h5>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{ width: `${summary.talkListenRatio.agent}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Agent {summary.talkListenRatio.agent}% / Customer {summary.talkListenRatio.customer}%
            </span>
          </div>
        </div>
      )}

      {/* Key Points */}
      {summary.keyPoints?.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Key Points</h5>
          <ul className="space-y-1">
            {summary.keyPoints.map((point, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Items */}
      {summary.actionItems?.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Action Items</h5>
          <ul className="space-y-1">
            {summary.actionItems.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-3.5 w-3.5 text-yellow-600 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      {summary.keywords?.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Keywords</h5>
          <div className="flex flex-wrap gap-1">
            {summary.keywords.map((keyword, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Transcript Panel Component
function TranscriptPanel({ call, currentTime, onTranscriptionRequested }) {
  const { toast } = useToast();
  const requestTranscription = useRequestTranscription();

  // Fetch transcription from TeleCMI if we have a call ID
  const {
    data: telecmiTranscription,
    isLoading: isLoadingTranscription,
    refetch: refetchTranscription,
  } = useTelecmiTranscription(call?.telecmiCallId || call?.externalCallId);

  if (!call) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Select a call to view transcript
      </div>
    );
  }

  // Use TeleCMI transcription if available, otherwise use local
  const transcriptionData = telecmiTranscription?.transcription || call.transcription;

  const handleRequestTranscription = async () => {
    const callId = call.telecmiCallId || call.externalCallId;
    if (!callId) {
      toast({
        title: 'Cannot request transcription',
        description: 'No TeleCMI call ID found for this call',
        variant: 'destructive',
      });
      return;
    }

    try {
      await requestTranscription.mutateAsync({ callId, language: 'en-IN' });
      toast({
        title: 'Transcription requested',
        description: 'The transcription will be available in a few minutes',
      });
      // Refetch after a short delay
      setTimeout(() => refetchTranscription(), 30000);
      onTranscriptionRequested?.();
    } catch (error) {
      toast({
        title: 'Failed to request transcription',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleCopyTranscript = () => {
    if (transcriptionData) {
      const text =
        typeof transcriptionData === 'string'
          ? transcriptionData
          : transcriptionData.map((e) => `${e.speaker}: ${e.text}`).join('\n');
      navigator.clipboard.writeText(text);
      toast({ title: 'Transcript copied to clipboard' });
    }
  };

  if (!transcriptionData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <Mic className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No transcript available for this call</p>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          Request transcription from TeleCMI
        </p>
        <Button
          size="sm"
          onClick={handleRequestTranscription}
          disabled={requestTranscription.isPending}
        >
          {requestTranscription.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Requesting...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Request Transcription
            </>
          )}
        </Button>
      </div>
    );
  }

  // Parse transcription - handle both string and structured formats
  const parseTranscript = (transcription) => {
    if (typeof transcription === 'string') {
      // Simple string - split by newlines
      return transcription
        .split('\n')
        .filter(Boolean)
        .map((line, i) => ({
          id: i,
          speaker: i % 2 === 0 ? 'Agent' : 'Customer',
          text: line,
          time: null,
        }));
    }
    if (Array.isArray(transcription)) {
      return transcription.map((entry, i) => ({
        id: entry.id || i,
        speaker: entry.speaker || (i % 2 === 0 ? 'Agent' : 'Customer'),
        text: entry.text || entry.content || '',
        time: entry.time || entry.timestamp || null,
      }));
    }
    return [];
  };

  const transcript = parseTranscript(transcriptionData);

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Transcript
          {isLoadingTranscription && <Loader2 className="h-3 w-3 animate-spin" />}
        </h4>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => refetchTranscription()}
            disabled={isLoadingTranscription}
          >
            <RefreshCw className={cn('h-3 w-3 mr-1', isLoadingTranscription && 'animate-spin')} />
            Refresh
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCopyTranscript}>
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {transcript.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              'p-3 rounded-lg text-sm',
              entry.speaker === 'Agent' ? 'bg-blue-50 ml-4' : 'bg-gray-50 mr-4'
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  entry.speaker === 'Agent' ? 'text-blue-600' : 'text-gray-600'
                )}
              >
                {entry.speaker}
              </span>
              {entry.time && <span className="text-xs text-muted-foreground">{entry.time}</span>}
            </div>
            <p className="text-sm">{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Contact Panel Component
function ContactPanel({ call, onClose, isPinned, onTogglePin }) {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get contact name from call
  const callContactName = call?.contact
    ? call.contact.displayName ||
      `${call.contact.firstName || ''} ${call.contact.lastName || ''}`.trim() ||
      null
    : null;

  // Get phone number based on direction
  const phoneNumber =
    call?.direction?.toLowerCase() === 'outbound' ? call?.toNumber : call?.fromNumber;

  useEffect(() => {
    // Prefer embedded contact from API response (already loaded with call data)
    if (call?.contact) {
      setContact(call.contact);
      setLoading(false);
      return;
    }

    // Only fetch separately if contactId exists but embedded contact is missing
    if (call?.contactId) {
      setLoading(true);
      api
        .get(`/crm/contacts/${call.contactId}`)
        .then((response) => {
          if (response.success && response.data) {
            setContact(response.data);
          } else if (response.id) {
            // Response is the contact data directly
            setContact(response);
          }
          setLoading(false);
        })
        .catch(() => {
          setContact(null);
          setLoading(false);
        });
    } else {
      setContact(null);
      setLoading(false);
    }
  }, [call?.contactId, call?.contact]);

  if (!call) return null;

  return (
    <div className="w-full bg-white dark:bg-card flex flex-col h-full rounded-3xl shadow-sm ml-2 overflow-hidden">
      {/* Header with gradient - matching WhatsApp inbox design */}
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
              <span className="text-sm font-semibold text-white">
                {(callContactName || '')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || '?'}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center border-2 border-primary shadow-sm bg-orange-500">
              <Phone className="h-3 w-3 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-white truncate">{callContactName || 'Unknown'}</h4>
              {contact?.rating === 'HOT' && (
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-indigo-100 truncate">{phoneNumber || 'No phone'}</p>
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
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Call</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Email</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Message</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={!call.contactId}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">View Profile</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Ticket className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Ticket</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-orange-500">
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Archive</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Tabs - Single scroll container */}
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
          <TabsContent value="info" className="px-3 py-2 space-y-2 m-0">
            <CollapsibleSection title="Contact Information" icon={User} defaultOpen>
              <div className="space-y-0.5">
                <InfoRow label="Phone" value={phoneNumber} icon={Phone} copyable />
                <InfoRow label="Email" value={contact?.email} icon={Mail} copyable />
                {contact?.mobilePhone && (
                  <InfoRow label="Mobile" value={contact.mobilePhone} icon={Smartphone} copyable />
                )}
                <InfoRow
                  label="Company"
                  value={contact?.company?.name || 'Not set'}
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

            {/* Lead & Lifecycle */}
            {contact && (
              <>
                <CollapsibleSection title="Lead Information" icon={Target} defaultOpen>
                  <div className="space-y-0.5">
                    <InfoRow
                      label="Lifecycle"
                      value={
                        contact.lifecycleStage ? (
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] px-1.5 py-0',
                              lifecycleColors[contact.lifecycleStage]
                            )}
                          >
                            {contact.lifecycleStage}
                          </Badge>
                        ) : (
                          'Not set'
                        )
                      }
                    />
                    {contact.leadStatus && (
                      <InfoRow label="Lead Status" value={contact.leadStatus.replace(/_/g, ' ')} />
                    )}
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
                              style={{ width: `${contact.leadScore || 0}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium">{contact.leadScore || 0}</span>
                        </div>
                      }
                    />
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
                    {contact.owner && (
                      <InfoRow
                        label="Owner"
                        value={
                          <span className="flex items-center gap-1.5">
                            <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-[7px] font-medium text-primary">
                                {contact.owner.firstName?.[0]}
                                {contact.owner.lastName?.[0]}
                              </span>
                            </div>
                            <span className="text-xs">{contact.owner.displayName}</span>
                          </span>
                        }
                      />
                    )}
                  </div>
                </CollapsibleSection>
                <Separator />
              </>
            )}

            {/* Engagement Stats */}
            {contact &&
              (contact.emailCount > 0 || contact.callCount > 0 || contact.meetingCount > 0) && (
                <>
                  <CollapsibleSection title="Engagement" icon={Sparkles} defaultOpen={false}>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold">{contact.emailCount || 0}</div>
                        <div className="text-[9px] text-muted-foreground">Emails</div>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold">{contact.callCount || 0}</div>
                        <div className="text-[9px] text-muted-foreground">Calls</div>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold">{contact.meetingCount || 0}</div>
                        <div className="text-[9px] text-muted-foreground">Meetings</div>
                      </div>
                    </div>
                    {contact.lastEngagementDate && (
                      <div className="mt-2 text-[10px] text-muted-foreground">
                        Last: {contact.lastEngagementType} •{' '}
                        {formatDistanceToNow(new Date(contact.lastEngagementDate), {
                          addSuffix: true,
                        })}
                      </div>
                    )}
                  </CollapsibleSection>
                  <Separator />
                </>
              )}

            <CollapsibleSection title="Call Details" icon={Phone} defaultOpen>
              <div className="space-y-0.5">
                <InfoRow
                  label="Direction"
                  value={call.direction}
                  icon={call.direction === 'inbound' ? PhoneIncoming : PhoneOutgoing}
                />
                <InfoRow
                  label="Status"
                  value={statusConfig[call.status?.toLowerCase()]?.label || call.status}
                  icon={Phone}
                />
                <InfoRow label="Duration" value={formatDuration(call.duration)} icon={Clock} />
                <InfoRow
                  label="Date"
                  value={
                    call.createdAt ? format(new Date(call.createdAt), 'MMM d, yyyy h:mm a') : 'N/A'
                  }
                  icon={Clock}
                />
              </div>
            </CollapsibleSection>
          </TabsContent>

          <TabsContent value="activity" className="px-3 py-2 m-0">
            <p className="text-sm text-muted-foreground text-center py-8">
              Call history will appear here
            </p>
          </TabsContent>

          <TabsContent value="notes" className="px-3 py-2 m-0">
            {call.notes && call.notes.length > 0 ? (
              <div className="space-y-2">
                {call.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm">
                    <p>{note.content || note}</p>
                    {note.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No notes yet</p>
            )}
          </TabsContent>

          <TabsContent value="ai" className="px-3 py-2 m-0">
            {call.metadata?.aiSummary ? (
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h5 className="text-xs font-medium text-orange-700 mb-1">AI Summary</h5>
                  <p className="text-sm">{call.metadata.aiSummary.overview}</p>
                </div>
                {call.metadata.aiSummary.keyPoints?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-2">Key Points</h5>
                    <ul className="space-y-1">
                      {call.metadata.aiSummary.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No AI insights available
              </p>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Live Monitoring Panel Component
function LiveMonitoringPanel({ supervisorExtension }) {
  const { toast } = useToast();
  const { data: activeCalls, isLoading, refetch } = useTelecmiActiveCalls();
  const listenToCall = useListenToCall();
  const whisperToAgent = useWhisperToAgent();
  const bargeIntoCall = useBargeIntoCall();

  const handleListen = async (callId) => {
    if (!supervisorExtension) {
      toast({
        title: 'Login required',
        description: 'Please login as an agent to monitor calls',
        variant: 'destructive',
      });
      return;
    }

    try {
      await listenToCall.mutateAsync({ callId, supervisorExtension });
      toast({ title: 'Now listening to call', description: 'Silent monitoring enabled' });
    } catch (error) {
      toast({
        title: 'Failed to listen',
        description: error.message || 'Could not connect to call',
        variant: 'destructive',
      });
    }
  };

  const handleWhisper = async (callId) => {
    if (!supervisorExtension) {
      toast({
        title: 'Login required',
        description: 'Please login as an agent to whisper',
        variant: 'destructive',
      });
      return;
    }

    try {
      await whisperToAgent.mutateAsync({ callId, supervisorExtension });
      toast({ title: 'Whisper mode enabled', description: 'Only the agent can hear you' });
    } catch (error) {
      toast({
        title: 'Failed to whisper',
        description: error.message || 'Could not connect to agent',
        variant: 'destructive',
      });
    }
  };

  const handleBarge = async (callId) => {
    if (!supervisorExtension) {
      toast({
        title: 'Login required',
        description: 'Please login as an agent to barge in',
        variant: 'destructive',
      });
      return;
    }

    try {
      await bargeIntoCall.mutateAsync({ callId, supervisorExtension });
      toast({ title: 'Barged into call', description: 'All parties can now hear you' });
    } catch (error) {
      toast({
        title: 'Failed to barge',
        description: error.message || 'Could not connect to call',
        variant: 'destructive',
      });
    }
  };

  const calls = activeCalls?.calls || [];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Radio className="h-4 w-4 text-red-500" />
          Live Calls
          {calls.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {calls.length} active
            </Badge>
          )}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={cn('h-3 w-3 mr-1', isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : calls.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No active calls</p>
          <p className="text-xs">Live calls will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {calls.map((call) => (
            <div
              key={call.id || call.callId}
              className="p-3 border rounded-lg bg-muted/30 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <PhoneCall className="h-4 w-4 text-green-600 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {call.agentName || `Ext: ${call.extension}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {call.direction === 'inbound' ? call.fromNumber : call.toNumber}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700 border-green-200"
                >
                  {call.duration ? formatDuration(call.duration) : 'In Progress'}
                </Badge>
              </div>

              <div className="flex items-center gap-1 pt-2 border-t">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 flex-1 text-xs"
                        onClick={() => handleListen(call.id || call.callId)}
                        disabled={listenToCall.isPending}
                      >
                        {listenToCall.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        <span className="ml-1">Listen</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Silent monitoring - hear both parties</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 flex-1 text-xs"
                        onClick={() => handleWhisper(call.id || call.callId)}
                        disabled={whisperToAgent.isPending}
                      >
                        {whisperToAgent.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <MessageCircle className="h-3 w-3" />
                        )}
                        <span className="ml-1">Whisper</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Speak to agent only</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 flex-1 text-xs"
                        onClick={() => handleBarge(call.id || call.callId)}
                        disabled={bargeIntoCall.isPending}
                      >
                        {bargeIntoCall.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserPlus className="h-3 w-3" />
                        )}
                        <span className="ml-1">Barge</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Join the call - all parties hear you</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function VoiceConversationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCallId, setSelectedCallId] = useState(searchParams.get('callId') || null);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [showMonitoringPanel, setShowMonitoringPanel] = useState(false);
  const [isPanelPinned, setIsPanelPinned] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [selectedDisposition, setSelectedDisposition] = useState('');

  // Fetch data
  const {
    data: logsData,
    isLoading,
    refetch,
    isRefetching,
  } = useCallLogs({
    direction: selectedDirection !== 'all' ? selectedDirection : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    limit: 50,
    allUsers: true,
  });

  const { data: statsData } = useCallStats('today');
  const setDisposition = useSetCallDisposition();
  const addNote = useAddCallNote();

  // TeleCMI WebRTC hooks
  const telecmi = useTelecmi();
  const { isLoggedIn: isAgentLoggedIn, agentInfo } = useTelecmiStore();
  const loginAgent = useLoginTelecmiAgent();
  const logoutAgent = useLogoutTelecmiAgent();
  const [agentExtension, setAgentExtension] = useState('100');
  const [agentPassword, setAgentPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // API returns { calls, pagination } for logs
  const logs = logsData?.calls || [];
  // API returns stats directly (not wrapped in data)
  const stats = statsData || {};

  // Helper to get contact display name from call
  const getContactName = (call) => {
    if (!call?.contact) return null;
    return (
      call.contact.displayName ||
      `${call.contact.firstName || ''} ${call.contact.lastName || ''}`.trim() ||
      null
    );
  };

  // Filter logs by search
  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const contactName = getContactName(log);
    return (
      log.toNumber?.toLowerCase().includes(query) ||
      log.fromNumber?.toLowerCase().includes(query) ||
      contactName?.toLowerCase().includes(query)
    );
  });

  // Get selected call
  const selectedCall = filteredLogs.find((c) => c.id === selectedCallId) || filteredLogs[0];

  // Update disposition when call changes
  useEffect(() => {
    if (selectedCall) {
      setSelectedDisposition(selectedCall.disposition || '');
    }
  }, [selectedCall?.id]);

  // Handle call selection
  const handleSelectCall = (call) => {
    setSelectedCallId(call.id);
    setShowContactPanel(true);
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('callId', call.id);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Handle disposition change
  const handleSetDisposition = async () => {
    if (selectedDisposition && selectedCall) {
      try {
        await setDisposition.mutateAsync({
          callId: selectedCall.id,
          disposition: selectedDisposition,
        });
        toast({ title: 'Disposition updated' });
      } catch (error) {
        toast({ title: 'Failed to update disposition', variant: 'destructive' });
      }
    }
  };

  // Handle add note
  const handleAddNote = async () => {
    if (noteText.trim() && selectedCall) {
      try {
        await addNote.mutateAsync({
          callId: selectedCall.id,
          note: noteText,
        });
        setNoteText('');
        toast({ title: 'Note added' });
        refetch();
      } catch (error) {
        toast({ title: 'Failed to add note', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Stats Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Voice Conversations</h1>
            <p className="text-sm text-muted-foreground">Manage your call conversations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{stats.totalCalls || 0}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <PhoneIncoming className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{stats.completedCalls || 0}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{formatDuration(stats.avgDuration || 0)}</p>
                  <p className="text-xs text-muted-foreground">Avg Duration</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <PhoneMissed className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{stats.missedCalls || 0}</p>
                  <p className="text-xs text-muted-foreground">Missed</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* TeleCMI Agent Status */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={isAgentLoggedIn && telecmi?.sdkReady ? 'outline' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2',
                      isAgentLoggedIn && telecmi?.sdkReady
                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Headphones className="h-4 w-4" />
                    {isAgentLoggedIn ? (
                      telecmi?.sdkReady ? (
                        <>
                          <Check className="h-3 w-3" />
                          Ready
                        </>
                      ) : (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Connecting
                        </>
                      )
                    ) : (
                      'Login'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  {isAgentLoggedIn ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <PhoneCall className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{agentInfo?.name || 'Agent'}</p>
                            <p className="text-xs text-muted-foreground">
                              Ext: {agentInfo?.extension || agentInfo?.id?.split('_')[0]}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            telecmi?.sdkReady
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          )}
                        >
                          {telecmi?.sdkReady ? 'Ready' : 'Connecting...'}
                        </Badge>
                      </div>
                      {telecmi?.error && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{telecmi.error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <p className="text-xs text-muted-foreground">WebRTC calls enabled</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => logoutAgent.mutate()}
                          disabled={logoutAgent.isPending}
                        >
                          {logoutAgent.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LogOut className="h-4 w-4" />
                          )}
                          <span className="ml-2">Logout</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setLoginError('');
                        try {
                          await loginAgent.mutateAsync({
                            extension: agentExtension,
                            password: agentPassword,
                          });
                          setAgentPassword('');
                        } catch (err) {
                          setLoginError(err.message || 'Login failed');
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">TeleCMI Agent Login</h4>
                        <p className="text-xs text-muted-foreground">
                          Login to enable browser-based WebRTC calls
                        </p>
                      </div>
                      {loginError && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{loginError}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="agent-ext">Extension</Label>
                        <Input
                          id="agent-ext"
                          placeholder="e.g., 100"
                          value={agentExtension}
                          onChange={(e) => setAgentExtension(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agent-pwd">Password</Label>
                        <Input
                          id="agent-pwd"
                          type="password"
                          placeholder="Your TeleCMI password"
                          value={agentPassword}
                          onChange={(e) => setAgentPassword(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loginAgent.isPending}>
                        {loginAgent.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          <>
                            <PhoneCall className="h-4 w-4 mr-2" />
                            Login
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </PopoverContent>
              </Popover>

              {/* Live Monitoring Button */}
              <Popover open={showMonitoringPanel} onOpenChange={setShowMonitoringPanel}>
                <PopoverTrigger asChild>
                  <Button
                    variant={showMonitoringPanel ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                  >
                    <Radio className="h-4 w-4" />
                    Monitor
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <LiveMonitoringPanel
                    supervisorExtension={agentInfo?.extension || agentInfo?.id?.split('_')[0]}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading || isRefetching}
              >
                <RefreshCw
                  className={cn('h-4 w-4 mr-2', (isLoading || isRefetching) && 'animate-spin')}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex flex-1 w-full gap-2 p-2 overflow-hidden">
        {/* Left Panel - Call List */}
        <div className="w-80 flex flex-col bg-white dark:bg-card rounded-3xl shadow-sm overflow-hidden shrink-0">
          {/* Filters */}
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search calls..."
                className="pl-10 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="no_answer">No Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Call List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Phone className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium">No calls found</p>
                <p className="text-xs text-muted-foreground">Calls will appear here</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((call) => (
                  <CallListItem
                    key={call.id}
                    call={call}
                    isSelected={call.id === selectedCall?.id}
                    onClick={() => handleSelectCall(call)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Middle Panel - Call Detail with 2 columns */}
        <div className="flex-1 w-full flex flex-col bg-white dark:bg-card min-w-0 min-h-0 rounded-3xl shadow-sm overflow-hidden">
          {selectedCall ? (
            <>
              {/* Call Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {(getContactName(selectedCall) || '')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2) || '?'}
                      </span>
                    </div>
                    <DirectionIcon direction={selectedCall.direction} size="sm" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{getContactName(selectedCall) || 'Unknown'}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedCall.direction?.toLowerCase() === 'outbound'
                        ? selectedCall.toNumber
                        : selectedCall.fromNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedCall.status} />
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                          onClick={() => setShowContactPanel(!showContactPanel)}
                        >
                          {showContactPanel ? (
                            <PanelRightClose className="h-4 w-4" />
                          ) : (
                            <PanelRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {showContactPanel ? 'Hide Contact' : 'Show Contact'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Two Column Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Column - Call Details & Recording */}
                <div className="w-1/2 border-r flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Call Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Started</p>
                        <p className="text-sm font-medium">
                          {selectedCall.createdAt
                            ? format(new Date(selectedCall.createdAt), 'MMM d, yyyy h:mm a')
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDuration(selectedCall.duration)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Agent</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {selectedCall.agentName || 'System'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Direction</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          {selectedCall.direction === 'inbound' ? (
                            <PhoneIncoming className="h-4 w-4 text-green-600" />
                          ) : (
                            <PhoneOutgoing className="h-4 w-4 text-blue-600" />
                          )}
                          {directionConfig[selectedCall.direction?.toLowerCase()]?.label ||
                            selectedCall.direction}
                        </p>
                      </div>
                    </div>

                    {/* Recording */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Recording
                      </h4>
                      <AudioPlayer
                        recordingUrl={selectedCall.recordingUrl}
                        onTimeUpdate={setCurrentAudioTime}
                      />
                    </div>

                    {/* Disposition */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Disposition</h4>
                      <div className="flex items-center gap-2">
                        <Select value={selectedDisposition} onValueChange={setSelectedDisposition}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select disposition" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(dispositionConfig).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleSetDisposition}
                          disabled={!selectedDisposition || setDisposition.isPending}
                          size="sm"
                        >
                          {setDisposition.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Save'
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Add Note</h4>
                      <Textarea
                        placeholder="Add a note about this call..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button
                        onClick={handleAddNote}
                        disabled={!noteText.trim() || addNote.isPending}
                        className="w-full"
                        size="sm"
                      >
                        {addNote.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <MessageSquare className="h-4 w-4 mr-2" />
                        )}
                        Add Note
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column - AI Summary (top) & Transcript (bottom) */}
                <div className="w-1/2 flex flex-col overflow-hidden">
                  {/* AI Summary - Top Half */}
                  <div className="h-1/2 border-b overflow-hidden">
                    <AISummaryPanel call={selectedCall} />
                  </div>
                  {/* Transcript - Bottom Half */}
                  <div className="h-1/2 overflow-hidden">
                    <TranscriptPanel call={selectedCall} currentTime={currentAudioTime} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Phone className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-medium">Select a call</p>
                <p className="text-sm text-muted-foreground">
                  Choose a call from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Contact Details (Collapsible) */}
        <AnimatePresence>
          {showContactPanel && selectedCall && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 overflow-hidden"
            >
              <ContactPanel
                call={selectedCall}
                onClose={() => !isPanelPinned && setShowContactPanel(false)}
                isPinned={isPanelPinned}
                onTogglePin={() => setIsPanelPinned(!isPanelPinned)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
