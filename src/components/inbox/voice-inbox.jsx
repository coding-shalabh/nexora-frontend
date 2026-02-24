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
  Grid3X3,
  Delete,
  Headphones,
  LogOut,
  Key,
  History,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  useCallLogs,
  useCallStats,
  useActiveCalls,
  useSetCallDisposition,
  useAddCallNote,
  useInitiateCall,
} from '@/hooks/use-dialer';
import { useChannels } from '@/hooks/use-inbox';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useTelecmi } from '@/providers/telecmi-provider';
import { useTelecmiStore, useLoginTelecmiAgent, useLogoutTelecmiAgent } from '@/hooks/use-telecmi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContactPanel } from '@/components/inbox/contact-panel';

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

// Dialer Pad Component
function DialerPad({ isOpen, onClose, onCall }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const dialPadButtons = [
    { digit: '1', letters: '' },
    { digit: '2', letters: 'ABC' },
    { digit: '3', letters: 'DEF' },
    { digit: '4', letters: 'GHI' },
    { digit: '5', letters: 'JKL' },
    { digit: '6', letters: 'MNO' },
    { digit: '7', letters: 'PQRS' },
    { digit: '8', letters: 'TUV' },
    { digit: '9', letters: 'WXYZ' },
    { digit: '*', letters: '' },
    { digit: '0', letters: '+' },
    { digit: '#', letters: '' },
  ];

  const handleDigitPress = (digit) => {
    setPhoneNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (!phoneNumber || phoneNumber.length < 10) return;
    setIsCalling(true);
    try {
      await onCall(phoneNumber);
      onClose();
      setPhoneNumber('');
    } catch (error) {
      console.error('Call failed:', error);
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-center">Make a Call</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Phone Number Display */}
          <div className="w-full px-4">
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+*#]/g, ''))}
                placeholder="Enter phone number"
                className="border-0 bg-transparent text-xl font-mono text-center focus-visible:ring-0"
              />
              {phoneNumber && (
                <Button variant="ghost" size="icon" onClick={handleBackspace}>
                  <Delete className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Dial Pad Grid */}
          <div className="grid grid-cols-3 gap-3 w-full px-4">
            {dialPadButtons.map(({ digit, letters }) => (
              <Button
                key={digit}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-0 hover:bg-primary/10"
                onClick={() => handleDigitPress(digit)}
              >
                <span className="text-2xl font-semibold">{digit}</span>
                {letters && <span className="text-[10px] text-muted-foreground">{letters}</span>}
              </Button>
            ))}
          </div>

          {/* Call Button */}
          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700"
              disabled={!phoneNumber || phoneNumber.length < 10 || isCalling}
              onClick={handleCall}
            >
              {isCalling ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Phone className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
function TranscriptPanel({ call, currentTime }) {
  if (!call) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Select a call to view transcript
      </div>
    );
  }

  if (!call.transcription) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <Mic className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No transcript available for this call</p>
        <p className="text-xs text-muted-foreground mt-1">
          Transcription will appear here once processed
        </p>
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
    return transcription;
  };

  const transcript = parseTranscript(call.transcription);

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Transcript
        </h4>
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          <Copy className="h-3 w-3 mr-1" />
          Copy
        </Button>
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

// ContactPanel is imported from @/components/inbox/contact-panel
// It's a unified component for all channels: WhatsApp, SMS, Email, Voice

// Group calls by phone number
function groupCallsByPhoneNumber(calls) {
  const grouped = {};

  calls.forEach((call) => {
    // Determine the "other party" phone number
    const phoneNumber =
      call.direction?.toLowerCase() === 'outbound' ? call.toNumber : call.fromNumber;

    if (!phoneNumber) return;

    if (!grouped[phoneNumber]) {
      grouped[phoneNumber] = {
        phoneNumber,
        contact: call.contact,
        calls: [],
        lastCall: call,
        totalCalls: 0,
        missedCalls: 0,
        totalDuration: 0,
      };
    }

    grouped[phoneNumber].calls.push(call);
    grouped[phoneNumber].totalCalls++;

    if (call.status?.toLowerCase() === 'missed' || call.status?.toLowerCase() === 'no_answer') {
      grouped[phoneNumber].missedCalls++;
    }

    grouped[phoneNumber].totalDuration += call.duration || 0;

    // Update lastCall if this call is more recent
    if (new Date(call.createdAt) > new Date(grouped[phoneNumber].lastCall.createdAt)) {
      grouped[phoneNumber].lastCall = call;
      grouped[phoneNumber].contact = call.contact || grouped[phoneNumber].contact;
    }
  });

  // Convert to array and sort by most recent call
  return Object.values(grouped).sort(
    (a, b) => new Date(b.lastCall.createdAt) - new Date(a.lastCall.createdAt)
  );
}

// Phone Number List Item Component (grouped)
function PhoneNumberListItem({ group, isSelected, onClick }) {
  const { phoneNumber, contact, lastCall, totalCalls, missedCalls, totalDuration } = group;

  // Get contact name
  const contactName = contact
    ? contact.displayName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || null
    : null;

  // Get initials
  const initials = contactName
    ? contactName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : phoneNumber?.slice(-2) || '??';

  // Get last call direction config
  const dirConfig = directionConfig[lastCall.direction?.toLowerCase()] || directionConfig.outbound;

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
        {/* Avatar */}
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
              {lastCall.createdAt
                ? formatDistanceToNow(new Date(lastCall.createdAt), { addSuffix: true })
                : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground truncate">{phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge
              className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200"
              variant="outline"
            >
              {totalCalls} call{totalCalls !== 1 ? 's' : ''}
            </Badge>
            {missedCalls > 0 && (
              <Badge
                className="text-[10px] px-1.5 py-0 h-4 bg-red-50 text-red-700 border-red-200"
                variant="outline"
              >
                {missedCalls} missed
              </Badge>
            )}
            {totalDuration > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(totalDuration)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// Main Voice Inbox Component
export function VoiceInbox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const [selectedCallId, setSelectedCallId] = useState(searchParams.get('callId') || null);
  const [showContactPanel, setShowContactPanel] = useState(true);
  const [isPanelPinned, setIsPanelPinned] = useState(true);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [selectedDisposition, setSelectedDisposition] = useState('');
  const [showDialer, setShowDialer] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('voice');

  // Fetch data
  const {
    data: logsData,
    isLoading,
    refetch,
    isRefetching,
  } = useCallLogs({
    direction: selectedDirection !== 'all' ? selectedDirection : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    limit: 100,
    allUsers: true,
  });

  const { data: statsData } = useCallStats('today');
  const { data: channelsData } = useChannels();
  const setDisposition = useSetCallDisposition();
  const addNote = useAddCallNote();
  const initiateCall = useInitiateCall();

  // TeleCMI WebRTC hooks
  const telecmi = useTelecmi();
  const { isLoggedIn: isAgentLoggedIn, agentInfo } = useTelecmiStore();
  const loginAgent = useLoginTelecmiAgent();
  const logoutAgent = useLogoutTelecmiAgent();
  const [agentExtension, setAgentExtension] = useState('100');
  const [agentPassword, setAgentPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Get the voice channel account
  const voiceChannel = channelsData?.find?.(
    (ch) => ch.type?.toLowerCase() === 'voice' || ch.channelType?.toLowerCase() === 'voice'
  );

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

  // Group calls by phone number
  const groupedNumbers = groupCallsByPhoneNumber(filteredLogs);

  // Get selected phone number group
  const selectedGroup = selectedPhoneNumber
    ? groupedNumbers.find((g) => g.phoneNumber === selectedPhoneNumber)
    : groupedNumbers[0];

  // Get calls for selected phone number (recent 5)
  const callsForSelectedNumber = selectedGroup?.calls?.slice(0, 5) || [];

  // Get selected call (most recent for the number)
  const selectedCall = selectedCallId
    ? callsForSelectedNumber.find((c) => c.id === selectedCallId)
    : callsForSelectedNumber[0];

  // Update disposition when call changes
  useEffect(() => {
    if (selectedCall) {
      setSelectedDisposition(selectedCall.disposition || '');
    }
  }, [selectedCall?.id]);

  // Handle phone number selection
  const handleSelectPhoneNumber = (group) => {
    setSelectedPhoneNumber(group.phoneNumber);
    setSelectedCallId(group.lastCall.id);
    setShowContactPanel(true);
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('phone', group.phoneNumber);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Handle call selection from history
  const handleSelectCall = (call) => {
    setSelectedCallId(call.id);
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

  // Handle making a call
  const handleMakeCall = async (phoneNumber) => {
    // Try WebRTC SDK first (direct browser call - no API balance needed)
    if (telecmi?.sdkReady && telecmi?.makeCall) {
      try {
        // Making WebRTC call via PIOPIY SDK
        await telecmi.makeCall(phoneNumber);
        refetch();
        return;
      } catch (err) {
        console.error('[Voice] WebRTC call failed, falling back to API:', err);
      }
    }

    // Fallback to API click2call
    if (!voiceChannel?.id) {
      console.error('No voice channel configured');
      toast({ title: 'No voice channel configured', variant: 'destructive' });
      return;
    }
    // Making call via API
    await initiateCall.mutateAsync({
      channelAccountId: voiceChannel.id,
      toNumber: phoneNumber,
    });
    refetch();
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Stats Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold">Voice Conversations</h1>
              <p className="text-sm text-muted-foreground">Manage your call conversations</p>
            </div>
            {/* Channel Dropdown */}
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voice">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-orange-500" />
                    Voice Calls
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    WhatsApp
                  </div>
                </SelectItem>
                <SelectItem value="sms">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-500" />
                    SMS
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-500" />
                    Email
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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

              <Button
                variant="default"
                size="sm"
                onClick={() => setShowDialer(true)}
                className="gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Dial
              </Button>

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

      {/* Dialer Pad Modal */}
      <DialerPad isOpen={showDialer} onClose={() => setShowDialer(false)} onCall={handleMakeCall} />

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

          {/* Phone Number List (Grouped) */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : groupedNumbers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Phone className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium">No calls found</p>
                <p className="text-xs text-muted-foreground">Calls will appear here</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {groupedNumbers.map((group) => (
                  <PhoneNumberListItem
                    key={group.phoneNumber}
                    group={group}
                    isSelected={group.phoneNumber === selectedGroup?.phoneNumber}
                    onClick={() => handleSelectPhoneNumber(group)}
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
                callHistory={callsForSelectedNumber}
                channelType="voice"
                onClose={() => !isPanelPinned && setShowContactPanel(false)}
                isPinned={isPanelPinned}
                onTogglePin={() => setIsPanelPinned(!isPanelPinned)}
                onSelectCall={handleSelectCall}
                onCall={handleMakeCall}
                onWhatsApp={(phone) => {
                  router.push(`/inbox?channel=whatsapp`);
                  toast({ title: 'WhatsApp', description: `Ready to message ${phone}` });
                }}
                onSms={(phone) => {
                  router.push(`/inbox?channel=sms`);
                  toast({ title: 'SMS', description: `Ready to message ${phone}` });
                }}
                onEmail={(email) => {
                  router.push(`/inbox?channel=email`);
                  toast({ title: 'Email', description: `Ready to email ${email}` });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VoiceInbox;
