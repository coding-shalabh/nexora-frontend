'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  User,
  Tag,
  FileText,
  Mail,
  Smartphone,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  Mic,
  MicOff,
  Image,
  File,
  Reply,
  Forward,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Loader2,
  RefreshCw,
  X,
  Volume2,
  VolumeX,
  Building2,
  Calendar,
  Link2,
  MapPin,
  Globe,
  Ticket,
  MessageSquare,
  History,
  StickyNote,
  ExternalLink,
  Copy,
  PanelRightClose,
  PanelRight,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  CreditCard,
  Package,
  BookOpen,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Zap,
  Target,
  Sparkles,
  HeartHandshake,
  AlertTriangle,
  Users,
  Pen,
  Pin,
  Share2,
  Settings,
  ChevronUp,
  FileSignature,
  Keyboard,
  Inbox,
  UserCheck,
  Clock3,
  BellOff,
  Download,
  FileImage,
  FileVideo,
  FileAudio,
  FileIcon,
  Maximize2,
  PenSquare,
  SlidersHorizontal,
  Filter,
  CalendarDays,
  CheckCircle,
  UserPlus,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useResolveConversation,
  useChannels,
  useInboxStats,
  useToggleStar,
  useArchiveConversation,
  useAssignConversation,
  useUpdatePurpose,
} from '@/hooks/use-inbox';
import { useSocket, useConversationSocket } from '@/context/socket-context';
import {
  useInitiateCall,
  useEndCall,
  useActiveCalls,
  useHoldCall,
  useResumeCall,
} from '@/hooks/use-dialer';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LinkifiedText } from '@/components/ui/linkified-text';

// Import reusable MessageInput component
import { MessageInput } from '@/components/inbox/message-input';
import { NotesPanel } from '@/components/inbox/notes-panel';
import { SnoozeDialog } from '@/components/inbox/snooze-dialog';
import { KeyboardShortcutsDialog } from '@/components/inbox/keyboard-shortcuts-dialog';
import { AssignButton } from '@/components/inbox/assign-dialog';
import { AISuggestionsPanel } from '@/components/inbox/ai-suggestions';
import { ConversationSummaryPanel } from '@/components/inbox/conversation-summary';
import { ConversationContextMenu } from '@/components/inbox/conversation-context-menu';
import { EmailComposer } from '@/components/inbox/email-composer';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useAuth } from '@/contexts/auth-context';
import { useTelecmi } from '@/providers/telecmi-provider';
import { VoiceInbox } from '@/components/inbox/voice-inbox';
import { ContactPanel } from '@/components/inbox/contact-panel';

// WhatsApp icon component
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
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    label: 'WhatsApp',
  },
  sms: {
    icon: Smartphone,
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    label: 'SMS',
  },
  email: {
    icon: Mail,
    color: 'text-[#800020]',
    bgColor: 'bg-[#800020]/10',
    borderColor: 'border-[#800020]/20',
    label: 'Email',
  },
  voice: {
    icon: PhoneCall,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    label: 'Voice',
  },
};

// Dummy messages for blurred unassigned view
const dummyMessages = [
  {
    id: 1,
    direction: 'inbound',
    content: 'Hi, I need help with my order #12345. It seems to be delayed.',
    time: '10:30 AM',
  },
  {
    id: 2,
    direction: 'outbound',
    content: 'Hello! I would be happy to help you with that. Let me check the status.',
    time: '10:32 AM',
  },
  {
    id: 3,
    direction: 'inbound',
    content: 'Thank you! I placed it last week and was expecting it by now.',
    time: '10:33 AM',
  },
  {
    id: 4,
    direction: 'outbound',
    content: 'I can see your order is currently in transit. It should arrive within 2-3 days.',
    time: '10:35 AM',
  },
  {
    id: 5,
    direction: 'inbound',
    content: 'That is great to hear! Can you also help me update my delivery address?',
    time: '10:36 AM',
  },
  {
    id: 6,
    direction: 'outbound',
    content: 'Of course! Please provide me with the new address details.',
    time: '10:38 AM',
  },
  {
    id: 7,
    direction: 'inbound',
    content: 'The new address is 123 Main Street, Apartment 4B, New York, NY 10001',
    time: '10:40 AM',
  },
  {
    id: 8,
    direction: 'outbound',
    content:
      'Perfect, I have updated your delivery address. Is there anything else I can help you with?',
    time: '10:42 AM',
  },
];

// Blurred view component for unassigned chats
function BlurredUnassignedView({ conversationId, onAssign, isAssigning }) {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Blurred dummy messages background */}
      <div className="absolute inset-0 p-4 overflow-hidden blur-md pointer-events-none select-none">
        <div className="space-y-3">
          {dummyMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex', msg.direction === 'outbound' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[70%] rounded-lg px-4 py-2',
                  msg.direction === 'outbound' ? 'bg-[#005c4b] text-white' : 'bg-white shadow-sm'
                )}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-[10px] opacity-70 text-right mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay with assign button */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
        <div className="text-center p-6 max-w-md">
          <div className="h-16 w-16 rounded-full bg-muted/80 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Unassigned Conversation</h3>
          <p className="text-sm text-muted-foreground mb-6">
            This conversation is not assigned to anyone. Assign it to yourself or a team member to
            view and respond to messages.
          </p>
          <Button onClick={onAssign} disabled={isAssigning} className="gap-2">
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                Assign to Me
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChannelIcon({ channelType, className }) {
  const config = channelConfig[channelType?.toLowerCase()];
  if (!config) return null;
  const Icon = config.icon;
  // If className includes !text-white, don't add the default color
  const hasColorOverride = className?.includes('!text-');
  return <Icon className={cn('h-4 w-4', !hasColorOverride && config.color, className)} />;
}

function formatTimeAgo(date) {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
}

function formatMessageTime(date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
}

// Collapsible Section Component
function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-foreground transition-colors">
        <span className="flex items-center gap-2 text-muted-foreground">
          {Icon && <Icon className="h-4 w-4" />}
          {title}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

// Info Row Component
function InfoRow({ label, value, icon: Icon, copyable = false }) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      toast({ title: 'Copied', description: `${label} copied to clipboard` });
    }
  };

  return (
    <div className="flex items-start justify-between py-1.5 group">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </span>
      <span className="text-xs font-medium text-right flex items-center gap-1">
        {value || '—'}
        {copyable && value && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded"
          >
            <Copy className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </span>
    </div>
  );
}

// ImageGrid Component - WhatsApp-style image grouping
function ImageGrid({ images, variant = 'light', maxDisplay = 4, timestamp }) {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isLight = variant === 'light';

  const displayImages = images.slice(0, maxDisplay);
  const remainingCount = images.length - maxDisplay;

  const getGridLayout = (count) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  const getImageHeight = (count, index) => {
    if (count === 1) return 'h-64';
    if (count === 2) return 'h-40';
    if (count === 3) return index === 0 ? 'h-40 col-span-2' : 'h-32';
    return 'h-32';
  };

  const openGallery = (index) => {
    setSelectedIndex(index);
    setShowGallery(true);
  };

  // Format timestamp
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  return (
    <>
      <div
        className={cn(
          'rounded-lg overflow-hidden relative',
          isLight ? 'bg-white shadow-sm' : 'bg-[#005c4b]'
        )}
        style={{ maxWidth: '280px' }}
      >
        {/* Image grid */}
        <div className={cn('grid gap-0.5', getGridLayout(displayImages.length))}>
          {displayImages.map((img, idx) => {
            const mediaUrl = img.mediaUrl || img.metadata?.url || img.metadata?.link;
            const isLast = idx === maxDisplay - 1 && remainingCount > 0;

            return (
              <div
                key={img.id || idx}
                className={cn(
                  'relative cursor-pointer overflow-hidden',
                  getImageHeight(displayImages.length, idx)
                )}
                onClick={() => openGallery(idx)}
              >
                <img
                  src={mediaUrl}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12">No image</text></svg>';
                  }}
                />
                {/* Show +X overlay on last image if there are more */}
                {isLast && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">+{remainingCount}</span>
                  </div>
                )}
                {/* Hover overlay */}
                {!isLast && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="bg-white/80 rounded-full p-1.5">
                      <Maximize2 className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Timestamp inside the card */}
        {timestamp && (
          <div
            className={cn(
              'absolute bottom-1 right-2 text-[10px] px-1 py-0.5 rounded',
              isLight ? 'text-gray-500 bg-white/80' : 'text-white/80 bg-black/30'
            )}
          >
            {formatTime(timestamp)}
          </div>
        )}
      </div>

      {/* Full Gallery Modal */}
      {showGallery && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setShowGallery(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => setShowGallery(false)}
          >
            <X className="h-8 w-8" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Navigation arrows */}
          {selectedIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/30 hover:bg-black/50 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex - 1);
              }}
            >
              <ChevronRight className="h-6 w-6 rotate-180" />
            </button>
          )}
          {selectedIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/30 hover:bg-black/50 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex + 1);
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Main image */}
          <img
            src={
              images[selectedIndex]?.mediaUrl ||
              images[selectedIndex]?.metadata?.url ||
              images[selectedIndex]?.metadata?.link
            }
            alt={`Image ${selectedIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90vw] overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  className={cn(
                    'w-12 h-12 rounded overflow-hidden flex-shrink-0 border-2 transition-all',
                    selectedIndex === idx
                      ? 'border-white'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(idx);
                  }}
                >
                  <img
                    src={img.mediaUrl || img.metadata?.url || img.metadata?.link}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Open in new tab */}
          <a
            href={
              images[selectedIndex]?.mediaUrl ||
              images[selectedIndex]?.metadata?.url ||
              images[selectedIndex]?.metadata?.link
            }
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </a>
        </div>
      )}
    </>
  );
}

// Helper function to group consecutive images
function groupConsecutiveImages(messages) {
  const result = [];
  let currentImageGroup = [];
  let currentDirection = null;

  messages.forEach((msg, idx) => {
    const isImage = msg.type?.toLowerCase() === 'image';

    if (isImage && (!currentDirection || currentDirection === msg.direction)) {
      // Add to current image group
      currentImageGroup.push(msg);
      currentDirection = msg.direction;
    } else {
      // Flush current image group if any
      if (currentImageGroup.length > 0) {
        result.push({
          type: 'image_group',
          images: [...currentImageGroup],
          direction: currentDirection,
          id: `img-group-${currentImageGroup[0].id}`,
        });
        currentImageGroup = [];
        currentDirection = null;
      }

      // If this message is an image, start a new group
      if (isImage) {
        currentImageGroup.push(msg);
        currentDirection = msg.direction;
      } else {
        // Add non-image message as-is
        result.push({ type: 'message', message: msg });
      }
    }
  });

  // Flush any remaining image group
  if (currentImageGroup.length > 0) {
    result.push({
      type: 'image_group',
      images: [...currentImageGroup],
      direction: currentDirection,
      id: `img-group-${currentImageGroup[0].id}`,
    });
  }

  return result;
}

// Media Content Component for rendering images, videos, documents, audio
function MediaContent({ message, variant = 'light' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const mediaType = message.type?.toLowerCase() || message.mediaType?.toLowerCase();
  const mediaUrl = message.mediaUrl || message.metadata?.url || message.metadata?.link;

  // For documents without URL, still show the file info
  const isDocumentWithoutUrl = (mediaType === 'document' || mediaType === 'file') && !mediaUrl;

  if (!mediaUrl && !isDocumentWithoutUrl) return null;

  const isLight = variant === 'light';

  // Get file name from URL
  const getFileName = (url) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || 'file';
      return decodeURIComponent(filename);
    } catch {
      return 'file';
    }
  };

  // Get file extension
  const getFileExtension = (url) => {
    const filename = getFileName(url);
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  // Handle audio playback
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Render image
  if (mediaType === 'image') {
    return (
      <div className="mb-2">
        {!imageLoaded && !imageError && (
          <div
            className={cn(
              'w-full h-48 rounded-lg flex items-center justify-center animate-pulse',
              isLight ? 'bg-gray-200' : 'bg-white/20'
            )}
          >
            <FileImage className="h-8 w-8 text-gray-400" />
          </div>
        )}
        {imageError ? (
          <div
            className={cn(
              'w-full h-32 rounded-lg flex flex-col items-center justify-center gap-2',
              isLight ? 'bg-gray-100 border border-gray-200' : 'bg-white/10 border border-white/20'
            )}
          >
            <FileImage className="h-6 w-6 text-gray-400" />
            <span className="text-xs text-gray-500">Failed to load image</span>
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Open in new tab
            </a>
          </div>
        ) : (
          <>
            <div className={cn('relative group', !imageLoaded && 'hidden')}>
              <img
                src={mediaUrl}
                alt="Shared image"
                className="max-w-full rounded-lg cursor-pointer transition-opacity"
                style={{ maxHeight: '300px' }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                onClick={() => setShowFullImage(true)}
              />
              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFullImage(true)}
                    className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                    title="View full image"
                  >
                    <Maximize2 className="h-4 w-4 text-gray-700" />
                  </button>
                  <a
                    href={mediaUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                    title="Download image"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-4 w-4 text-gray-700" />
                  </a>
                </div>
              </div>
            </div>
            {/* Full image modal */}
            {showFullImage && (
              <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setShowFullImage(false)}
              >
                <button
                  className="absolute top-4 right-4 text-white hover:text-gray-300"
                  onClick={() => setShowFullImage(false)}
                >
                  <X className="h-8 w-8" />
                </button>
                <img
                  src={mediaUrl}
                  alt="Full image"
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Render video
  if (mediaType === 'video') {
    return (
      <div className="mb-2 relative group">
        <video
          ref={videoRef}
          src={mediaUrl}
          className="max-w-full rounded-lg"
          style={{ maxHeight: '300px' }}
          controls
          preload="metadata"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
        {/* Download button on hover */}
        <a
          href={mediaUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-all"
          title="Download video"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="h-4 w-4 text-white" />
        </a>
        <div
          className={cn(
            'hidden w-full h-32 rounded-lg flex-col items-center justify-center gap-2',
            isLight ? 'bg-gray-100 border border-gray-200' : 'bg-white/10 border border-white/20'
          )}
        >
          <FileVideo className="h-6 w-6 text-gray-400" />
          <span className="text-xs text-gray-500">Video unavailable</span>
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Download video
          </a>
        </div>
      </div>
    );
  }

  // Render audio
  if (mediaType === 'audio') {
    return (
      <div
        className={cn(
          'mb-2 rounded-lg p-3 flex items-center gap-3',
          isLight ? 'bg-gray-100' : 'bg-white/10'
        )}
      >
        <button
          onClick={toggleAudio}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            isLight
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-white/20 text-white hover:bg-white/30'
          )}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <audio
            ref={audioRef}
            src={mediaUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            className="w-full"
            controls
          />
        </div>
      </div>
    );
  }

  // Check if it's a document based on URL extension (for fallback detection)
  const urlExtension = mediaUrl ? getFileExtension(mediaUrl) : '';
  const isDocumentByExtension = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'csv',
    'ppt',
    'pptx',
    'txt',
    'rtf',
    'odt',
    'ods',
    'odp',
    'zip',
    'rar',
    '7z',
    'tar',
    'gz',
  ].includes(urlExtension);

  // Render document/file - also handle 'attachment' type and extension-based detection
  if (
    mediaType === 'document' ||
    mediaType === 'file' ||
    mediaType === 'attachment' ||
    isDocumentByExtension
  ) {
    // Try to get filename from metadata first, then content (which often has filename), then URL
    const metadataFilename = message.metadata?.filename;
    const contentAsFilename =
      message.content && !['[Doc]', '[Document]', '[file]'].includes(message.content)
        ? message.content
        : null;
    const filename =
      metadataFilename || contentAsFilename || (mediaUrl ? getFileName(mediaUrl) : 'Document');
    const extension =
      filename.split('.').pop()?.toLowerCase() || (mediaUrl ? getFileExtension(mediaUrl) : 'pdf');
    const mimeType = message.metadata?.mimeType;

    // Determine file icon based on extension or mime type
    const getFileIcon = () => {
      const ext = extension.toLowerCase();
      const mime = mimeType?.toLowerCase() || '';

      if (['pdf'].includes(ext) || mime.includes('pdf')) return FileText;
      if (
        ['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext) ||
        mime.includes('word') ||
        mime.includes('document')
      )
        return FileText;
      if (
        ['xls', 'xlsx', 'csv', 'ods'].includes(ext) ||
        mime.includes('sheet') ||
        mime.includes('excel')
      )
        return FileText;
      if (
        ['ppt', 'pptx', 'odp'].includes(ext) ||
        mime.includes('presentation') ||
        mime.includes('powerpoint')
      )
        return FileText;
      if (
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext) ||
        mime.includes('image')
      )
        return FileImage;
      if (['mp4', 'mov', 'avi', 'webm', 'mkv', '3gp'].includes(ext) || mime.includes('video'))
        return FileVideo;
      if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'opus'].includes(ext) || mime.includes('audio'))
        return FileAudio;
      if (
        ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) ||
        mime.includes('zip') ||
        mime.includes('compressed')
      )
        return FileIcon;
      return FileIcon;
    };

    // Get file type label
    const getFileTypeLabel = () => {
      const ext = extension.toLowerCase();
      if (['pdf'].includes(ext)) return 'PDF';
      if (['doc', 'docx'].includes(ext)) return 'Word Document';
      if (['xls', 'xlsx'].includes(ext)) return 'Excel Spreadsheet';
      if (['ppt', 'pptx'].includes(ext)) return 'PowerPoint';
      if (['txt'].includes(ext)) return 'Text File';
      if (['csv'].includes(ext)) return 'CSV File';
      if (['zip', 'rar', '7z'].includes(ext)) return 'Archive';
      return ext ? ext.toUpperCase() + ' file' : 'Document';
    };

    const Icon = getFileIcon();

    // Check if it's an image file being sent as document
    const isImageDocument =
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension) ||
      mimeType?.includes('image');

    // Check if it's a PDF
    const isPdf = extension === 'pdf' || mimeType?.includes('pdf');

    // If no URL available, show document info without link
    if (!mediaUrl) {
      return (
        <div
          className={cn(
            'mb-2 rounded-lg border overflow-hidden',
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/10 border-white/20'
          )}
        >
          <div
            className={cn('flex items-center gap-3 p-3', isLight ? 'text-gray-800' : 'text-white')}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                extension === 'pdf'
                  ? 'bg-red-100 text-red-600'
                  : ['doc', 'docx'].includes(extension)
                    ? 'bg-blue-100 text-blue-600'
                    : ['xls', 'xlsx', 'csv'].includes(extension)
                      ? 'bg-green-100 text-green-600'
                      : ['ppt', 'pptx'].includes(extension)
                        ? 'bg-orange-100 text-orange-600'
                        : ['zip', 'rar', '7z'].includes(extension)
                          ? 'bg-purple-100 text-purple-600'
                          : isLight
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-white/20 text-white'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{filename}</p>
              <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/60')}>
                {getFileTypeLabel()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Image document - show preview thumbnail with filename
    if (isImageDocument) {
      const imgExtension = extension.toUpperCase() || 'IMG';
      return (
        <div className="mb-2" style={{ maxWidth: '280px' }}>
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'block relative group cursor-pointer rounded-lg overflow-hidden border',
              isLight ? 'border-gray-200' : 'border-white/20'
            )}
          >
            {/* Image preview */}
            <div className="relative">
              <img
                src={mediaUrl}
                alt={filename}
                className="w-full object-cover transition-opacity group-hover:opacity-90"
                style={{ maxHeight: '180px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className={cn(
                  'hidden w-full h-32 flex-col items-center justify-center gap-2',
                  isLight ? 'bg-gray-100' : 'bg-white/10'
                )}
              >
                <FileImage className="h-8 w-8 text-gray-400" />
              </div>
              {/* Type badge on image */}
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {imgExtension}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 rounded-full p-2 shadow-lg">
                  <ExternalLink className="h-4 w-4 text-gray-700" />
                </div>
              </div>
            </div>
            {/* Filename bar */}
            <div
              className={cn(
                'px-3 py-2 flex items-center gap-2',
                isLight ? 'bg-gray-50' : 'bg-white/5'
              )}
            >
              <FileImage
                className={cn('h-4 w-4 flex-shrink-0', isLight ? 'text-gray-400' : 'text-white/50')}
              />
              <p
                className={cn(
                  'text-xs truncate flex-1',
                  isLight ? 'text-gray-600' : 'text-white/70'
                )}
              >
                {filename}
              </p>
            </div>
          </a>
        </div>
      );
    }

    // Get file type badge color and text
    const getTypeBadge = () => {
      const ext = extension.toLowerCase();
      if (['pdf'].includes(ext)) return { bg: 'bg-red-500', text: 'PDF' };
      if (['doc', 'docx'].includes(ext)) return { bg: 'bg-blue-500', text: 'DOC' };
      if (['xls', 'xlsx'].includes(ext)) return { bg: 'bg-green-600', text: 'XLS' };
      if (['csv'].includes(ext)) return { bg: 'bg-green-500', text: 'CSV' };
      if (['ppt', 'pptx'].includes(ext)) return { bg: 'bg-orange-500', text: 'PPT' };
      if (['txt'].includes(ext)) return { bg: 'bg-gray-500', text: 'TXT' };
      if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext))
        return { bg: 'bg-purple-500', text: 'ZIP' };
      if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return { bg: 'bg-pink-500', text: 'AUDIO' };
      if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return { bg: 'bg-primary', text: 'VIDEO' };
      return { bg: 'bg-gray-500', text: ext.toUpperCase().slice(0, 4) || 'FILE' };
    };

    const typeBadge = getTypeBadge();
    const fileSize = message.metadata?.size || message.metadata?.fileSize;
    const formattedSize = fileSize
      ? fileSize > 1024 * 1024
        ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
        : fileSize > 1024
          ? `${Math.round(fileSize / 1024)} KB`
          : `${fileSize} bytes`
      : null;

    // WhatsApp-style document preview - used for PDF and all other documents
    return (
      <a
        href={mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'mb-2 rounded-lg overflow-hidden block group cursor-pointer transition-all',
          isLight
            ? 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 border border-gray-200'
            : 'bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/20'
        )}
        style={{ maxWidth: '280px' }}
      >
        <div className="flex items-center gap-3 p-3">
          {/* File type icon with badge */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center',
                isPdf
                  ? 'bg-red-100'
                  : ['doc', 'docx'].includes(extension)
                    ? 'bg-blue-100'
                    : ['xls', 'xlsx', 'csv'].includes(extension)
                      ? 'bg-green-100'
                      : ['ppt', 'pptx'].includes(extension)
                        ? 'bg-orange-100'
                        : ['zip', 'rar', '7z'].includes(extension)
                          ? 'bg-purple-100'
                          : isLight
                            ? 'bg-gray-100'
                            : 'bg-white/10'
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6',
                  isPdf
                    ? 'text-red-600'
                    : ['doc', 'docx'].includes(extension)
                      ? 'text-blue-600'
                      : ['xls', 'xlsx', 'csv'].includes(extension)
                        ? 'text-green-600'
                        : ['ppt', 'pptx'].includes(extension)
                          ? 'text-orange-600'
                          : ['zip', 'rar', '7z'].includes(extension)
                            ? 'text-purple-600'
                            : isLight
                              ? 'text-gray-600'
                              : 'text-white/70'
                )}
              />
            </div>
            {/* Type badge - like WhatsApp */}
            <div
              className={cn(
                'absolute -bottom-1 -right-1 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm',
                typeBadge.bg
              )}
            >
              {typeBadge.text}
            </div>
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'text-sm font-medium truncate',
                isLight ? 'text-gray-900' : 'text-white'
              )}
            >
              {filename}
            </p>
            <p className={cn('text-xs mt-0.5', isLight ? 'text-gray-500' : 'text-white/60')}>
              {getFileTypeLabel()}
              {formattedSize ? ` • ${formattedSize}` : ''}
            </p>
          </div>

          {/* Open indicator */}
          <div className={cn('flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity')}>
            <ExternalLink className={cn('h-4 w-4', isLight ? 'text-gray-400' : 'text-white/60')} />
          </div>
        </div>
      </a>
    );
  }

  // Render sticker (animated or static)
  if (mediaType === 'sticker') {
    return (
      <div className="mb-2">
        <img
          src={mediaUrl}
          alt="Sticker"
          className="max-w-[200px] max-h-[200px] rounded-lg"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
        <div
          className={cn(
            'hidden w-32 h-32 rounded-lg flex-col items-center justify-center gap-2',
            isLight ? 'bg-gray-100 border border-gray-200' : 'bg-white/10 border border-white/20'
          )}
        >
          <span className="text-2xl">🎭</span>
          <span className="text-xs text-gray-500">Sticker</span>
        </div>
      </div>
    );
  }

  // Fallback for unknown media types - show as document card
  // Try to extract filename and extension
  const fallbackGetFileName = (url) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || 'attachment';
      return decodeURIComponent(filename);
    } catch {
      return 'attachment';
    }
  };

  const fallbackFilename =
    message.metadata?.filename || message.content || fallbackGetFileName(mediaUrl);
  const fallbackExtension = fallbackFilename.split('.').pop()?.toLowerCase() || '';

  // Determine icon and color based on extension
  const getFallbackIcon = () => {
    if (['pdf'].includes(fallbackExtension))
      return {
        Icon: FileText,
        bg: 'bg-red-100',
        text: 'text-red-600',
        badge: 'bg-red-500',
        label: 'PDF',
      };
    if (['doc', 'docx'].includes(fallbackExtension))
      return {
        Icon: FileText,
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        badge: 'bg-blue-500',
        label: 'DOC',
      };
    if (['xls', 'xlsx', 'csv'].includes(fallbackExtension))
      return {
        Icon: FileText,
        bg: 'bg-green-100',
        text: 'text-green-600',
        badge: 'bg-green-600',
        label: 'XLS',
      };
    if (['ppt', 'pptx'].includes(fallbackExtension))
      return {
        Icon: FileText,
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        badge: 'bg-orange-500',
        label: 'PPT',
      };
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fallbackExtension))
      return {
        Icon: FileImage,
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        badge: 'bg-purple-500',
        label: 'IMG',
      };
    if (['mp4', 'mov', 'avi', 'webm'].includes(fallbackExtension))
      return {
        Icon: FileVideo,
        bg: 'bg-primary/10',
        text: 'text-primary',
        badge: 'bg-primary',
        label: 'VIDEO',
      };
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(fallbackExtension))
      return {
        Icon: FileAudio,
        bg: 'bg-pink-100',
        text: 'text-pink-600',
        badge: 'bg-pink-500',
        label: 'AUDIO',
      };
    if (['zip', 'rar', '7z', 'tar'].includes(fallbackExtension))
      return {
        Icon: FileIcon,
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        badge: 'bg-yellow-500',
        label: 'ZIP',
      };
    return {
      Icon: FileIcon,
      bg: isLight ? 'bg-gray-100' : 'bg-white/10',
      text: isLight ? 'text-gray-600' : 'text-white/70',
      badge: 'bg-gray-500',
      label: fallbackExtension.toUpperCase().slice(0, 4) || 'FILE',
    };
  };

  const {
    Icon: FallbackIcon,
    bg: fallbackBg,
    text: fallbackText,
    badge: fallbackBadge,
    label: fallbackLabel,
  } = getFallbackIcon();

  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'mb-2 rounded-lg overflow-hidden block group cursor-pointer transition-all',
        isLight
          ? 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 border border-gray-200'
          : 'bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/20'
      )}
      style={{ maxWidth: '280px' }}
    >
      <div className="flex items-center gap-3 p-3">
        {/* File type icon with badge */}
        <div className="relative flex-shrink-0">
          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', fallbackBg)}>
            <FallbackIcon className={cn('h-6 w-6', fallbackText)} />
          </div>
          {/* Type badge */}
          <div
            className={cn(
              'absolute -bottom-1 -right-1 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm',
              fallbackBadge
            )}
          >
            {fallbackLabel}
          </div>
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p
            className={cn('text-sm font-medium truncate', isLight ? 'text-gray-900' : 'text-white')}
          >
            {fallbackFilename}
          </p>
          <p className={cn('text-xs mt-0.5', isLight ? 'text-gray-500' : 'text-white/60')}>
            Click to open
          </p>
        </div>

        {/* Open indicator */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className={cn('h-4 w-4', isLight ? 'text-gray-400' : 'text-white/60')} />
        </div>
      </div>
    </a>
  );
}

// WhatsApp Style Message Bubble
// Unified Modern Chat Bubble - Same design for all channels (WhatsApp, SMS, Email)
function UnifiedChatBubble({ message, channelType, onReply }) {
  const isOutbound = message.direction === 'outbound';
  const isFailed = message.status === 'failed';
  const isPending = message.status === 'pending';
  const mediaTypes = ['image', 'video', 'audio', 'document', 'sticker', 'file'];
  const hasMedia =
    message.mediaUrl ||
    (mediaTypes.includes(message.type?.toLowerCase()) && message.type !== 'text');

  // Media placeholder patterns to filter out
  const mediaPlaceholders = [
    '[Image]',
    '[file]',
    '[unsupported]',
    '[Voice message]',
    '[Audio]',
    '[Video]',
    '[Document]',
    '[Sticker]',
    '[Contact shared]',
    '[Order]',
  ];
  const isMediaPlaceholder =
    mediaPlaceholders.includes(message.content) ||
    /^(Image|Photo|Picture|IMG|Img)\s*\d*$/i.test(message.content?.trim());

  // Get status icon
  const getStatusIcon = () => {
    if (isFailed) return <AlertCircle className="h-3.5 w-3.5" />;
    if (isPending) return <Clock className="h-3.5 w-3.5 animate-pulse" />;
    if (message.status === 'read') return <CheckCheck className="h-3.5 w-3.5 text-primary" />;
    if (message.status === 'delivered') return <CheckCheck className="h-3.5 w-3.5" />;
    return <Check className="h-3.5 w-3.5" />;
  };

  return (
    <div className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2.5 relative group',
          isOutbound
            ? isFailed
              ? 'bg-red-500 text-white'
              : 'bg-primary text-white'
            : 'bg-white border border-gray-200 shadow-sm'
        )}
      >
        {/* Sender info for inbound */}
        {!isOutbound && message.senderName && (
          <p className="text-xs font-medium text-primary mb-1">{message.senderName}</p>
        )}

        {/* Media content */}
        {hasMedia && <MediaContent message={message} variant={isOutbound ? 'dark' : 'light'} />}

        {/* Text content */}
        {message.content && !isMediaPlaceholder && (
          <LinkifiedText
            text={message.content}
            className={cn(
              'text-sm leading-relaxed whitespace-pre-wrap',
              isOutbound ? 'text-white' : 'text-gray-800'
            )}
            variant={isOutbound ? 'dark' : 'light'}
            showPreviews={!hasMedia}
          />
        )}

        {/* Footer: Time + Status */}
        <div
          className={cn(
            'flex items-center justify-end gap-1.5 mt-1.5',
            isOutbound ? 'text-white/70' : 'text-gray-400'
          )}
        >
          <span className="text-[11px]">{formatMessageTime(message.sentAt)}</span>
          {isOutbound && getStatusIcon()}
        </div>

        {/* Failed message reason */}
        {isFailed && (
          <div className="flex items-center gap-1 mt-1 text-xs text-white/90 bg-red-600/50 rounded px-2 py-1">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-2">{message.failureReason || 'Failed to send'}</span>
          </div>
        )}

        {/* Hover actions - subtle */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5',
            isOutbound ? '-left-16' : '-right-16'
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
            onClick={() => onReply?.(message)}
          >
            <Reply className="h-3.5 w-3.5 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
            onClick={(e) => {
              navigator.clipboard.writeText(message.content || '');
            }}
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Legacy bubble functions - now all use UnifiedChatBubble
function WhatsAppBubble({ message, onReply }) {
  return <UnifiedChatBubble message={message} channelType="whatsapp" onReply={onReply} />;
}

function SMSBubble({ message, onReply }) {
  return <UnifiedChatBubble message={message} channelType="sms" onReply={onReply} />;
}

function EmailBubble({ message, onReply }) {
  return <UnifiedChatBubble message={message} channelType="email" onReply={onReply} />;
}

// Message Context Menu Wrapper
function MessageWithContextMenu({ children, message, onAction }) {
  const [contextMenuPos, setContextMenuPos] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>

      {/* Context Menu */}
      {contextMenuPos && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setContextMenuPos(null)} />
          <div
            className="fixed z-50 min-w-[180px] bg-white rounded-lg shadow-lg border py-1 animate-in fade-in-0 zoom-in-95"
            style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
          >
            <button
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
              onClick={() => {
                onAction?.('reply', message);
                setContextMenuPos(null);
              }}
            >
              <Reply className="h-4 w-4" /> Reply
            </button>
            <button
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
              onClick={() => {
                onAction?.('forward', message);
                setContextMenuPos(null);
              }}
            >
              <Forward className="h-4 w-4" /> Forward
            </button>
            <button
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
              onClick={() => {
                onAction?.('copy', message);
                setContextMenuPos(null);
              }}
            >
              <Copy className="h-4 w-4" /> Copy
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
              onClick={() => {
                onAction?.('star', message);
                setContextMenuPos(null);
              }}
            >
              <Star className="h-4 w-4" /> Star Message
            </button>
            <button
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
              onClick={() => {
                onAction?.('pin', message);
                setContextMenuPos(null);
              }}
            >
              <Pin className="h-4 w-4" /> Pin
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
              onClick={() => {
                onAction?.('archive', message);
                setContextMenuPos(null);
              }}
            >
              <Archive className="h-4 w-4" /> Archive
            </button>
            <button
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
              onClick={() => {
                onAction?.('delete', message);
                setContextMenuPos(null);
              }}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}

function MessageBubble({ message, channelType, onAction, showSenderLabel = false, contactName }) {
  const isOutbound = message.direction === 'outbound';

  const handleReply = () => onAction?.('reply', message);

  // Render the bubble inside context menu wrapper
  const renderBubble = () => {
    switch (channelType) {
      case 'whatsapp':
        return <WhatsAppBubble message={message} onReply={handleReply} />;
      case 'sms':
        return <SMSBubble message={message} onReply={handleReply} />;
      case 'email':
        return <EmailBubble message={message} onReply={handleReply} />;
      default:
        return <WhatsAppBubble message={message} onReply={handleReply} />;
    }
  };

  return (
    <div className="space-y-0.5">
      {/* Sender label for clarity */}
      {showSenderLabel && (
        <div
          className={cn(
            'text-[10px] font-medium px-1',
            isOutbound ? 'text-right text-blue-600' : 'text-left text-gray-500'
          )}
        >
          {isOutbound ? 'Agent' : contactName || 'Customer'}
        </div>
      )}
      <MessageWithContextMenu message={message} onAction={onAction}>
        {renderBubble()}
      </MessageWithContextMenu>
    </div>
  );
}

// Get unified chat container styles - same for all channels
function getChatContainerStyles(channelType) {
  // Unified light gray background for professional look
  return 'bg-slate-50';
}

// Get channel-specific message spacing
function getMessageSpacing(channelType) {
  switch (channelType) {
    case 'email':
      return 'space-y-4';
    default:
      return 'space-y-2';
  }
}

// Lifecycle stage badge colors
const lifecycleColors = {
  SUBSCRIBER: 'bg-gray-100 text-gray-700 border-gray-300',
  LEAD: 'bg-blue-100 text-blue-700 border-blue-300',
  MQL: 'bg-primary/10 text-primary border-primary/30',
  SQL: 'bg-purple-100 text-purple-700 border-purple-300',
  OPPORTUNITY: 'bg-amber-100 text-amber-700 border-amber-300',
  CUSTOMER: 'bg-green-100 text-green-700 border-green-300',
  EVANGELIST: 'bg-pink-100 text-pink-700 border-pink-300',
  OTHER: 'bg-gray-100 text-gray-700 border-gray-300',
};

// Lead rating badge colors
const ratingColors = {
  HOT: 'bg-red-100 text-red-700 border-red-300',
  WARM: 'bg-orange-100 text-orange-700 border-orange-300',
  COLD: 'bg-blue-100 text-blue-700 border-blue-300',
};

// Priority badge colors
const priorityColors = {
  HIGH: 'bg-red-100 text-red-700 border-red-300',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  LOW: 'bg-green-100 text-green-700 border-green-300',
};

// ContactPanel is imported from @/components/inbox/contact-panel
// It's a unified component for all channels: WhatsApp, SMS, Email, Voice

export default function InboxPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const channelFilter = searchParams.get('channel');
  const bucketParam = searchParams.get('bucket');
  const { toast } = useToast();
  const { user } = useAuth();
  const telecmi = useTelecmi();

  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  // Assignment buckets: 'my_chats', 'unassigned', or null for all
  const [bucketFilter, setBucketFilter] = useState(
    bucketParam === 'my_chats' || bucketParam === 'unassigned' ? bucketParam : null
  );
  // Toggleable filters (can be combined with each other and with assignment bucket)
  const [filterStarred, setFilterStarred] = useState(bucketParam === 'starred');
  const [filterSnoozed, setFilterSnoozed] = useState(bucketParam === 'snoozed');
  const [filterArchived, setFilterArchived] = useState(bucketParam === 'archived');
  // Purpose filter (GENERAL, SALES, SUPPORT, SERVICE, MARKETING)
  const [purposeFilter, setPurposeFilter] = useState(null);

  // Sync filters with URL params
  useEffect(() => {
    if (bucketParam === 'starred') {
      setFilterStarred(true);
      setBucketFilter(null);
    } else if (bucketParam === 'snoozed') {
      setFilterSnoozed(true);
      setBucketFilter(null);
    } else if (bucketParam === 'archived') {
      setFilterArchived(true);
      setBucketFilter(null);
    } else if (bucketParam === 'my_chats' || bucketParam === 'unassigned') {
      setBucketFilter(bucketParam);
    } else {
      setBucketFilter(null);
    }
  }, [bucketParam]);

  // Update URL when bucket changes
  const updateBucketFilter = (value) => {
    const newBucket = value === 'none' ? null : value;
    setBucketFilter(newBucket);
    // Clear toggleable filters when changing assignment bucket
    if (newBucket) {
      setFilterStarred(false);
      setFilterSnoozed(false);
      setFilterArchived(false);
    }

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (newBucket) {
      params.set('bucket', newBucket);
    } else {
      params.delete('bucket');
    }
    // Preserve channel filter
    router.push(`/inbox?${params.toString()}`, { scroll: false });
  };

  // Toggle individual filters (starred, snoozed, archived can be combined)
  const toggleFilter = (filter) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('bucket'); // Clear bucket when using toggleable filters

    switch (filter) {
      case 'starred':
        setFilterStarred(!filterStarred);
        if (!filterStarred) params.set('bucket', 'starred');
        break;
      case 'snoozed':
        setFilterSnoozed(!filterSnoozed);
        if (!filterSnoozed) params.set('bucket', 'snoozed');
        break;
      case 'archived':
        setFilterArchived(!filterArchived);
        if (!filterArchived) params.set('bucket', 'archived');
        break;
    }

    setBucketFilter(null);
    router.push(`/inbox?${params.toString()}`, { scroll: false });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [isPanelPinned, setIsPanelPinned] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState('voice');
  const [callStatus, setCallStatus] = useState('idle');
  const [currentCallId, setCurrentCallId] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [selectedChannelAccountId, setSelectedChannelAccountId] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch channel accounts for dropdown
  const { data: channels } = useChannels();

  // Filter channels by type (only active ones)
  const getChannelsByType = (type) => {
    return channels?.filter((ch) => ch.type === type && ch.status === 'active') || [];
  };

  // Get channels for each type
  const whatsappChannels = getChannelsByType('whatsapp');
  const emailChannels = getChannelsByType('email');
  const smsChannels = getChannelsByType('sms');
  const voiceChannels = getChannelsByType('voice');

  // Get channels for current filter
  const getChannelsForFilter = () => {
    switch (channelFilter) {
      case 'whatsapp':
        return whatsappChannels;
      case 'email':
        return emailChannels;
      case 'sms':
        return smsChannels;
      case 'voice':
        return voiceChannels;
      default:
        return [];
    }
  };

  const currentFilterChannels = getChannelsForFilter();

  // Reset channel account selection when channel filter changes
  useEffect(() => {
    setSelectedChannelAccountId('all');
  }, [channelFilter]);

  const [selectedSignature, setSelectedSignature] = useState('none');
  const [showSignatureMenu, setShowSignatureMenu] = useState(false);
  const textareaRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const searchInputRef = useRef(null);
  const messageInputRef = useRef(null);
  const callTimerRef = useRef(null);

  // Keyboard shortcuts dialogs
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSnoozeDialog, setShowSnoozeDialog] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);

  // Fetch signatures from API
  const signaturesQuery = useQuery({
    queryKey: ['signatures'],
    queryFn: async () => {
      const response = await api.get('/settings/signatures');
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get signatures based on channel type
  const getSignatures = (channelType) => {
    const allSignatures = signaturesQuery.data || [];
    const noSignatureOption = { id: 'none', name: 'No Signature', content: '' };

    // Normalize channel type for comparison
    const normalizedChannel = channelType?.toLowerCase();

    // Filter signatures by channel compatibility
    const filteredSignatures = allSignatures.filter((sig) => {
      if (!sig.isActive) return false;

      // Normalize signature channel for comparison (API returns uppercase)
      const sigChannel = sig.channel?.toLowerCase();

      // Check channel match
      if (sigChannel === 'all') {
        // For 'all' channel, check signature type compatibility
        if (sig.signatureType === 'with_logo' && normalizedChannel !== 'email') {
          return false; // Logo signatures only work in email
        }
        return true;
      }

      // Direct channel match
      if (normalizedChannel === 'email' && sigChannel === 'email') return true;
      if (
        (normalizedChannel === 'whatsapp' || normalizedChannel === 'sms') &&
        sigChannel === 'whatsapp'
      )
        return true;

      return false;
    });

    // Always add "No Signature" option at the end
    return [...filteredSignatures, noSignatureOption];
  };

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150); // Max 150px
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  // API Hooks - Build filter params based on bucket or status filter
  const getConversationFilters = () => {
    const filters = {
      channelType: channelFilter ? channelFilter.toUpperCase() : undefined,
      channelAccountId: selectedChannelAccountId !== 'all' ? selectedChannelAccountId : undefined,
      search: searchQuery || undefined,
      purpose: purposeFilter || undefined, // Purpose filter (SALES, SUPPORT, SERVICE, MARKETING)
    };

    // Handle toggleable filters (starred, snoozed, archived - can be combined)
    if (filterStarred) {
      filters.starred = true;
    }
    if (filterSnoozed) {
      filters.bucket = 'snoozed'; // Snoozed uses bucket since it's a status
    }
    if (filterArchived) {
      filters.bucket = 'archived'; // Archived uses bucket since it's a status
    }

    // Handle assignment bucket filter (my_chats, unassigned)
    if (bucketFilter) {
      if (bucketFilter === 'unassigned') {
        filters.unassigned = true;
      } else if (bucketFilter === 'my_chats') {
        filters.assignedTo = 'me';
      }
    }
    // No default assignedTo filter — "All Conversations" should show all

    // Apply status filter if not 'all' (and not already filtering by snoozed/archived)
    if (statusFilter !== 'all' && !filterSnoozed && !filterArchived) {
      filters.status = statusFilter.toUpperCase();
    }

    return filters;
  };

  const conversationsQuery = useConversations(getConversationFilters());

  // Get inbox stats for filter counts
  const { data: inboxStats } = useInboxStats();

  const messagesQuery = useMessages(selectedId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const resolveConversationMutation = useResolveConversation();
  const toggleStarMutation = useToggleStar();
  const archiveConversationMutation = useArchiveConversation();
  const assignConversationMutation = useAssignConversation();
  const updatePurposeMutation = useUpdatePurpose();

  // Call hooks
  const initiateCallMutation = useInitiateCall();
  const endCallMutation = useEndCall();
  const holdCallMutation = useHoldCall();
  const resumeCallMutation = useResumeCall();
  const { data: activeCalls } = useActiveCalls();

  // WebSocket for real-time messaging
  const { isConnected: wsConnected } = useSocket();
  const { isConnected: conversationConnected } = useConversationSocket(selectedId);

  const conversations = conversationsQuery.data?.data || [];
  const messages = messagesQuery.data || [];
  const selectedConversation = conversations.find((c) => c.id === selectedId);

  // Auto-select default signature when signatures are loaded or channel changes
  useEffect(() => {
    const allSignatures = signaturesQuery.data || [];
    if (allSignatures.length > 0 && selectedConversation) {
      const channelType = selectedConversation?.channelType?.toLowerCase();

      // Filter signatures for this channel (normalize channel for comparison)
      const channelSignatures = allSignatures.filter((sig) => {
        if (!sig.isActive) return false;
        const sigChannel = sig.channel?.toLowerCase();
        if (sigChannel === 'all') {
          if (sig.signatureType === 'with_logo' && channelType !== 'email') return false;
          return true;
        }
        if (channelType === 'email' && sigChannel === 'email') return true;
        if ((channelType === 'whatsapp' || channelType === 'sms') && sigChannel === 'whatsapp')
          return true;
        return false;
      });

      // Find default signature for this channel
      const defaultSig = channelSignatures.find((s) => s.isDefault);
      if (defaultSig) {
        setSelectedSignature(defaultSig.id);
      } else if (channelSignatures.length > 0) {
        // Use first active signature if no default
        setSelectedSignature(channelSignatures[0].id);
      } else {
        setSelectedSignature('none');
      }
    }
  }, [signaturesQuery.data, selectedConversation?.channelType]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    // Navigation - next conversation
    j: () => {
      const currentIndex = conversations.findIndex((c) => c.id === selectedId);
      if (currentIndex < conversations.length - 1) {
        setSelectedId(conversations[currentIndex + 1].id);
      }
    },
    // Navigation - previous conversation
    k: () => {
      const currentIndex = conversations.findIndex((c) => c.id === selectedId);
      if (currentIndex > 0) {
        setSelectedId(conversations[currentIndex - 1].id);
      }
    },
    // Reply - focus message input
    r: () => {
      if (selectedId) {
        messageInputRef.current?.focus();
      }
    },
    // Resolve conversation
    e: () => {
      if (selectedId && selectedConversation?.status !== 'RESOLVED') {
        resolveConversationMutation.mutate(selectedId, {
          onSuccess: () => {
            toast({ title: 'Conversation resolved' });
          },
        });
      }
    },
    // Snooze conversation
    s: () => {
      if (selectedId) {
        setShowSnoozeDialog(true);
      }
    },
    // Search
    '/': () => {
      searchInputRef.current?.focus();
    },
    // Show keyboard shortcuts
    'shift+/': () => {
      setShowKeyboardShortcuts(true);
    },
    // Clear selection / close panels
    escape: () => {
      if (showContactPanel) {
        setShowContactPanel(false);
      } else if (showKeyboardShortcuts) {
        setShowKeyboardShortcuts(false);
      } else if (showSnoozeDialog) {
        setShowSnoozeDialog(false);
      }
    },
    // Toggle contact panel
    i: () => {
      setShowContactPanel((prev) => !prev);
    },
  });

  // Auto-select first conversation (but not when email composer is open)
  useEffect(() => {
    if (!selectedId && conversations.length > 0 && !showEmailComposer) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId, showEmailComposer]);

  // Mark as read when selecting conversation
  useEffect(() => {
    if (selectedId && selectedConversation?.unreadCount > 0) {
      markAsReadMutation.mutate(selectedId);
    }
  }, [selectedId, selectedConversation?.unreadCount]);

  // Scroll to bottom function - uses scrollTop for instant positioning
  const scrollToBottom = (instant = false) => {
    const container = messagesContainerRef.current;
    if (container) {
      if (instant) {
        // Instant scroll - no animation, directly set position
        container.scrollTop = container.scrollHeight;
      } else {
        // Smooth scroll for new messages
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  };

  // Reset initial load flag when conversation changes
  useEffect(() => {
    isInitialLoadRef.current = true;
    lastMessageIdRef.current = null;
  }, [selectedId]);

  // Get the last message ID for comparison
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const lastMessageId = lastMessage?.id;

  // Handle scroll - instant on initial load, smooth on new messages
  useEffect(() => {
    if (messagesQuery.isLoading || messages.length === 0) return;

    if (isInitialLoadRef.current) {
      // Initial load - instant scroll, no animation visible
      requestAnimationFrame(() => {
        scrollToBottom(true);
      });
      isInitialLoadRef.current = false;
      lastMessageIdRef.current = lastMessageId;
    } else if (lastMessageId && lastMessageId !== lastMessageIdRef.current) {
      // New message arrived - smooth scroll
      scrollToBottom(false);
      lastMessageIdRef.current = lastMessageId;
    }
  }, [lastMessageId, messagesQuery.isLoading, messages.length]);

  const handleSendMessage = async (signatureId) => {
    if (!message.trim() || !selectedId) return;

    // Get signature content based on signatureId
    const channelType = selectedConversation?.channelType?.toLowerCase();
    const signatures = getSignatures(channelType);
    const signature = signatures.find((s) => s.id === signatureId);
    const signatureContent = signature?.content || '';

    // Append signature to message
    const finalMessage = message + signatureContent;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedId,
        content: finalMessage,
        type: 'TEXT',
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(selectedSignature);
    }
  };

  // Cleanup call timer on unmount
  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, []);

  // Call handling
  const handleStartCall = (type) => {
    if (!selectedConversation?.contactPhone) {
      toast({
        title: 'No phone number',
        description: 'This contact does not have a phone number',
        variant: 'destructive',
      });
      return;
    }
    setCallType(type);
    setCallStatus('idle');
    setCallDuration(0);
    setIsCallModalOpen(true);
  };

  const handleInitiateCall = async () => {
    if (!selectedConversation) return;

    setCallStatus('initiating');
    try {
      toast({
        title: callType === 'video' ? 'Video Call' : 'Voice Call',
        description: `Calling ${selectedConversation.contactName}...`,
      });

      setTimeout(() => setCallStatus('ringing'), 1000);
      setTimeout(() => {
        setCallStatus('connected');
        const startTime = Date.now();
        if (callTimerRef.current) clearInterval(callTimerRef.current);
        callTimerRef.current = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
      }, 3000);
    } catch (error) {
      toast({
        title: 'Call Failed',
        description: error.message || 'Failed to initiate call',
        variant: 'destructive',
      });
      setCallStatus('idle');
    }
  };

  const handleEndCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setCallStatus('ended');
    toast({
      title: 'Call Ended',
      description: `Call duration: ${formatCallDuration(callDuration)}`,
    });
    setTimeout(() => {
      setIsCallModalOpen(false);
      setCallStatus('idle');
      setCallDuration(0);
      setCurrentCallId(null);
    }, 1500);
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Contact panel action handlers
  const handleCallFromPanel = async (phoneNumber) => {
    if (!phoneNumber) {
      toast({
        title: 'No phone number',
        description: 'Contact has no phone number',
        variant: 'destructive',
      });
      return;
    }
    // Use TeleCMI WebRTC SDK if available
    if (telecmi?.sdkReady && telecmi?.makeCall) {
      try {
        await telecmi.makeCall(phoneNumber);
        toast({ title: 'Calling...', description: `Initiating call to ${phoneNumber}` });
      } catch (err) {
        console.error('Failed to make call:', err);
        toast({ title: 'Call Failed', description: err.message, variant: 'destructive' });
      }
    } else {
      toast({
        title: 'Dialer not ready',
        description: 'Voice calling is not available',
        variant: 'destructive',
      });
    }
  };

  const handleWhatsAppFromPanel = (phoneNumber) => {
    if (!phoneNumber) {
      toast({
        title: 'No phone number',
        description: 'Contact has no phone number',
        variant: 'destructive',
      });
      return;
    }
    // Navigate to WhatsApp channel with this number
    router.push(`/inbox?channel=whatsapp`);
    // Focus on the message input (the conversation should already be selected)
    toast({ title: 'WhatsApp', description: `Ready to message ${phoneNumber}` });
  };

  const handleSmsFromPanel = (phoneNumber) => {
    if (!phoneNumber) {
      toast({
        title: 'No phone number',
        description: 'Contact has no phone number',
        variant: 'destructive',
      });
      return;
    }
    // Navigate to SMS channel
    router.push(`/inbox?channel=sms`);
    toast({ title: 'SMS', description: `Ready to message ${phoneNumber}` });
  };

  const handleEmailFromPanel = (email) => {
    if (!email) {
      toast({
        title: 'No email',
        description: 'Contact has no email address',
        variant: 'destructive',
      });
      return;
    }
    // Open email composer or navigate to email channel
    router.push(`/inbox?channel=email`);
    toast({ title: 'Email', description: `Ready to email ${email}` });
  };

  const handleCreateTicketFromPanel = (contactId, contactName, contactInfo) => {
    if (!contactId) {
      toast({
        title: 'No contact',
        description: 'Cannot create ticket without contact information',
        variant: 'destructive',
      });
      return;
    }
    // Navigate to tickets page with contact pre-filled
    router.push(
      `/tickets/new?contactId=${contactId}&contactName=${encodeURIComponent(contactName || '')}`
    );
    toast({
      title: 'Create Ticket',
      description: `Opening ticket form for ${contactName || contactInfo}`,
    });
  };

  // Voice channel - show dedicated VoiceInbox component
  if (channelFilter === 'voice') {
    return <VoiceInbox />;
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* TOP-BAR: Stats Header - Compact */}
      <div className="shrink-0 bg-white dark:bg-card border-b border-gray-100 dark:border-gray-800 mx-2 mt-2 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Left side - Title and Stats */}
          <div className="flex items-center gap-4">
            {/* Page Header - Compact with Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Inbox Hub</span>
              <span className="text-sm text-gray-400">/</span>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                {channelFilter
                  ? channelConfig[channelFilter]?.label || 'Unknown'
                  : bucketParam === 'my_chats'
                    ? 'My Chats'
                    : bucketParam === 'unassigned'
                      ? 'Unassigned'
                      : filterStarred
                        ? 'Starred'
                        : filterSnoozed
                          ? 'Snoozed'
                          : filterArchived
                            ? 'Archived'
                            : 'All Conversations'}
              </h1>
            </div>

            {/* Stats Row - Compact */}
            <div className="flex items-center gap-2">
              {/* Open */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50">
                <Inbox className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600">{inboxStats?.open || 0}</span>
                <span className="text-[10px] text-blue-600/70">Open</span>
              </div>

              {/* Assigned */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50">
                <UserCheck className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs font-semibold text-green-600">
                  {inboxStats?.assigned || 0}
                </span>
                <span className="text-[10px] text-green-600/70">Assigned</span>
              </div>

              {/* Unassigned */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50">
                <Users className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-600">
                  {inboxStats?.unassigned || 0}
                </span>
                <span className="text-[10px] text-amber-600/70">Unassigned</span>
              </div>

              {/* Resolved */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-50">
                <CheckCircle className="h-3.5 w-3.5 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600">
                  {inboxStats?.resolved || 0}
                </span>
                <span className="text-[10px] text-purple-600/70">Resolved</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Compose Email Button - show for email channel */}
            {channelFilter === 'email' && (
              <Button
                variant="default"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={() => {
                  setSelectedId(null);
                  setShowEmailComposer(true);
                }}
              >
                <PenSquare className="h-3.5 w-3.5" />
                Compose
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => conversationsQuery.refetch()}
              disabled={conversationsQuery.isFetching}
            >
              <RefreshCw
                className={cn('h-3.5 w-3.5', conversationsQuery.isFetching && 'animate-spin')}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 w-full gap-2 p-2 overflow-hidden">
        {/* Conversation List Sidebar (Fixed) */}
        <aside className="relative flex flex-col shrink-0 rounded-3xl w-[320px] bg-white shadow-sm overflow-hidden">
          {/* Quick Filter Icons + Filter Toggle */}
          <div className="px-5 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <TooltipProvider delayDuration={0}>
                <div className="flex items-center gap-1 bg-muted/50 rounded-md h-9 px-1 flex-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          !bucketFilter && !filterStarred && !filterSnoozed && !filterArchived
                            ? 'secondary'
                            : 'ghost'
                        }
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => {
                          updateBucketFilter('none');
                          setFilterStarred(false);
                          setFilterSnoozed(false);
                          setFilterArchived(false);
                        }}
                      >
                        <Inbox
                          className={cn(
                            'h-4 w-4',
                            !bucketFilter &&
                              !filterStarred &&
                              !filterSnoozed &&
                              !filterArchived &&
                              'text-white'
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">All Conversations</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={bucketFilter === 'my_chats' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 relative"
                        onClick={() => updateBucketFilter('my_chats')}
                      >
                        <UserCheck
                          className={cn('h-4 w-4', bucketFilter === 'my_chats' && 'text-white')}
                        />
                        {inboxStats?.assigned > 0 && (
                          <span className="absolute -top-1 -right-1 text-[9px] min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                            {inboxStats?.assigned > 99 ? '99+' : inboxStats?.assigned}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">My Chats</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={bucketFilter === 'unassigned' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 relative"
                        onClick={() => updateBucketFilter('unassigned')}
                      >
                        <Users
                          className={cn('h-4 w-4', bucketFilter === 'unassigned' && 'text-white')}
                        />
                        {inboxStats?.unassigned > 0 && (
                          <span className="absolute -top-1 -right-1 text-[9px] min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-orange-500 text-white">
                            {inboxStats?.unassigned > 99 ? '99+' : inboxStats?.unassigned}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Unassigned</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={filterStarred ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 relative"
                        onClick={() => toggleFilter('starred')}
                      >
                        <Star className={cn('h-4 w-4', filterStarred && 'fill-white text-white')} />
                        {inboxStats?.starred > 0 && (
                          <span className="absolute -top-1 -right-1 text-[9px] min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-yellow-500 text-white">
                            {inboxStats?.starred > 99 ? '99+' : inboxStats?.starred}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {filterStarred ? 'Hide Starred' : 'Show Starred'}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={filterSnoozed ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 relative"
                        onClick={() => toggleFilter('snoozed')}
                      >
                        <Clock3 className={cn('h-4 w-4', filterSnoozed && 'text-white')} />
                        {inboxStats?.snoozed > 0 && (
                          <span className="absolute -top-1 -right-1 text-[9px] min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-blue-500 text-white">
                            {inboxStats?.snoozed > 99 ? '99+' : inboxStats?.snoozed}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {filterSnoozed ? 'Hide Snoozed' : 'Show Snoozed'}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={filterArchived ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 relative"
                        onClick={() => toggleFilter('archived')}
                      >
                        <Archive className={cn('h-4 w-4', filterArchived && 'text-white')} />
                        {inboxStats?.archived > 0 && (
                          <span className="absolute -top-1 -right-1 text-[9px] min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-muted-foreground text-background">
                            {inboxStats?.archived > 99 ? '99+' : inboxStats?.archived}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {filterArchived ? 'Hide Archived' : 'Show Archived'}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-9 px-2 shrink-0',
                  (showFilters || statusFilter !== 'all' || channelFilter) &&
                    'bg-primary/10 text-primary'
                )}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <ChevronDown
                  className={cn('h-3 w-3 ml-1 transition-transform', showFilters && 'rotate-180')}
                />
              </Button>
            </div>
          </div>

          {/* Expandable Filters Section */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-b border-gray-100"
              >
                <div className="px-5 py-3 space-y-3">
                  {/* Status Tabs */}
                  <Tabs
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value);
                      setBucketFilter(null);
                    }}
                  >
                    <TabsList className="w-full h-9 bg-slate-100 p-1">
                      <TabsTrigger value="all" className="flex-1 text-xs h-7 rounded-md">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="open" className="flex-1 text-xs h-7 rounded-md">
                        Open
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="flex-1 text-xs h-7 rounded-md">
                        Pending
                      </TabsTrigger>
                      <TabsTrigger value="resolved" className="flex-1 text-xs h-7 rounded-md">
                        Resolved
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Channel Filter */}
                  <Select
                    value={channelFilter || 'all'}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        router.push('/inbox');
                      } else {
                        // Check if channel has any configured accounts
                        const channelRoutes = {
                          whatsapp: '/settings/whatsapp',
                          email: '/settings/email',
                          sms: '/settings/sms',
                          voice: '/settings/voice',
                        };

                        const hasConfiguredAccounts = () => {
                          switch (value) {
                            case 'whatsapp':
                              return whatsappChannels.length > 0;
                            case 'email':
                              return emailChannels.length > 0;
                            case 'sms':
                              return smsChannels.length > 0;
                            case 'voice':
                              return voiceChannels.length > 0;
                            default:
                              return true;
                          }
                        };

                        if (hasConfiguredAccounts()) {
                          router.push(`/inbox?channel=${value}`);
                        } else {
                          // Redirect to settings if no accounts configured
                          router.push(channelRoutes[value] || '/settings/channels');
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs w-full">
                      <MessageSquare className="h-3.5 w-3.5 mr-2" />
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">
                        All Channels
                      </SelectItem>
                      <SelectItem value="whatsapp" className="text-xs">
                        <span className="flex items-center gap-2">
                          <WhatsAppIcon className="h-3 w-3 text-[#25d366]" />
                          WhatsApp
                        </span>
                      </SelectItem>
                      <SelectItem value="email" className="text-xs">
                        <span className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-[#800020]" />
                          Email
                        </span>
                      </SelectItem>
                      <SelectItem value="sms" className="text-xs">
                        <span className="flex items-center gap-2">
                          <Smartphone className="h-3 w-3 text-slate-500" />
                          SMS
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Date Range Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Date Range</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: 'all', label: 'All Time' },
                        { value: 'today', label: 'Today' },
                        { value: 'week', label: 'This Week' },
                        { value: 'month', label: 'This Month' },
                      ].map((range) => (
                        <Button
                          key={range.value}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => toast({ title: `Date filter: ${range.label}` })}
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Purpose Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Purpose</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: null, label: 'All', icon: Inbox },
                        {
                          value: 'SALES',
                          label: 'Sales',
                          icon: Target,
                          color: 'text-blue-600 bg-blue-50',
                        },
                        {
                          value: 'SUPPORT',
                          label: 'Support',
                          icon: HelpCircle,
                          color: 'text-amber-600 bg-amber-50',
                        },
                        {
                          value: 'SERVICE',
                          label: 'Service',
                          icon: Settings,
                          color: 'text-purple-600 bg-purple-50',
                        },
                        {
                          value: 'MARKETING',
                          label: 'Marketing',
                          icon: Sparkles,
                          color: 'text-pink-600 bg-pink-50',
                        },
                      ].map((purpose) => {
                        const Icon = purpose.icon;
                        const isActive = purposeFilter === purpose.value;
                        return (
                          <Button
                            key={purpose.value || 'all'}
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                              'h-7 text-xs gap-1.5',
                              isActive && purpose.color && purpose.color
                            )}
                            onClick={() => setPurposeFilter(purpose.value)}
                          >
                            <Icon className="h-3 w-3" />
                            {purpose.label}
                            {inboxStats?.byPurpose?.[purpose.value] > 0 && (
                              <span className="ml-1 text-[10px] opacity-70">
                                ({inboxStats.byPurpose[purpose.value]})
                              </span>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(statusFilter !== 'all' || channelFilter || purposeFilter) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-8 text-xs text-muted-foreground"
                      onClick={() => {
                        setStatusFilter('all');
                        setBucketFilter(null);
                        setPurposeFilter(null);
                        router.push('/inbox');
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Channel Filter Indicator & Account Selector */}
          {channelFilter && (
            <div className="px-5 py-3 border-b border-gray-100 space-y-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={channelFilter}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <ChannelIcon channelType={channelFilter} className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    Showing {channelConfig[channelFilter]?.label} only
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Channel Account Selector */}
              {currentFilterChannels.length >= 1 && (
                <Select
                  value={selectedChannelAccountId}
                  onValueChange={(value) => {
                    if (value === 'manage-settings') {
                      // Navigate to specific channel settings
                      const channelRoutes = {
                        whatsapp: '/settings/whatsapp',
                        email: '/settings/email',
                        sms: '/settings/sms',
                        voice: '/settings/voice',
                      };
                      router.push(channelRoutes[channelFilter] || '/settings/channels');
                    } else if (value === 'manage') {
                      router.push('/settings/channels');
                    } else {
                      setSelectedChannelAccountId(value);
                    }
                  }}
                >
                  <SelectTrigger className="h-8 text-xs bg-muted/50 border-0">
                    <div className="flex items-center gap-2">
                      <ChannelIcon channelType={channelFilter} className="h-3.5 w-3.5" />
                      <SelectValue
                        placeholder={`Select ${channelConfig[channelFilter]?.label || 'Account'}`}
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="flex items-center gap-2">
                        <span>All Accounts</span>
                        <Badge variant="secondary" className="text-[10px] px-1 h-4">
                          {currentFilterChannels.length}
                        </Badge>
                      </span>
                    </SelectItem>
                    {currentFilterChannels.map((channel, index) => {
                      // Get a clean display name - prioritize displayName, then extract name without number
                      const getDisplayName = () => {
                        // If displayName exists, use it
                        if (channel.displayName) return channel.displayName;

                        // If name exists and doesn't look like just a phone number
                        if (channel.name) {
                          // Remove phone number patterns from name
                          const cleanName = channel.name
                            .replace(/[-\s]*\d{10,}[-\s]*/g, '') // Remove 10+ digit numbers
                            .replace(/[-\s]*\+?\d{1,4}[-\s]?\d{6,}[-\s]*/g, '') // Remove phone patterns
                            .replace(/\s*-\s*$/, '') // Remove trailing dash
                            .replace(/^\s*-\s*/, '') // Remove leading dash
                            .trim();

                          if (cleanName && cleanName.length > 0) return cleanName;
                        }

                        // Fallback: use channel type + index
                        const typeLabel = channelConfig[channelFilter]?.label || 'Account';
                        return `${typeLabel} ${index + 1}`;
                      };

                      return (
                        <SelectItem key={channel.id} value={channel.id}>
                          {getDisplayName()}
                        </SelectItem>
                      );
                    })}
                    <Separator className="my-1" />
                    <SelectItem value="manage-settings" className="text-primary">
                      <span className="flex items-center gap-2">
                        <Settings className="h-3.5 w-3.5" />
                        {channelConfig[channelFilter]?.label} Settings
                      </span>
                    </SelectItem>
                    <SelectItem value="manage" className="text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Link2 className="h-3.5 w-3.5" />
                        All Channels
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-2">
            {conversationsQuery.isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : conversationsQuery.isError ? (
              <div className="p-4 text-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                <p className="text-sm">Failed to load conversations</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => conversationsQuery.refetch()}
                  className="mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {conversations.map((conv, index) => {
                  const config = channelConfig[conv.channelType];
                  const initials =
                    conv.contactName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() || '?';

                  // Priority colors
                  const priorityConfig = {
                    high: { color: 'bg-red-500', label: 'High Priority' },
                    medium: { color: 'bg-yellow-500', label: 'Medium Priority' },
                    low: { color: 'bg-green-500', label: 'Low Priority' },
                  };

                  // Tag colors - predefined tags
                  const tagColors = {
                    VIP: 'bg-purple-100 text-purple-700 border-purple-200',
                    Bug: 'bg-red-100 text-red-700 border-red-200',
                    Feature: 'bg-blue-100 text-blue-700 border-blue-200',
                    Urgent: 'bg-orange-100 text-orange-700 border-orange-200',
                    'Follow-up': 'bg-cyan-100 text-cyan-700 border-cyan-200',
                    Sales: 'bg-green-100 text-green-700 border-green-200',
                    Support: 'bg-primary/10 text-primary border-primary/20',
                  };

                  // Conversation card
                  return (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      layout
                    >
                      <ConversationContextMenu conversation={conv}>
                        <button
                          onClick={() => setSelectedId(conv.id)}
                          className={cn(
                            'w-full p-3 text-left transition-all rounded-xl mb-1',
                            selectedId === conv.id ? 'bg-[#eeecff]' : 'hover:bg-slate-50'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              {/* Show group avatar for email with multiple participants */}
                              {conv.channelType === 'email' &&
                              (conv.participantCount > 2 || conv.ccParticipants?.length > 0) ? (
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-white">
                                    {initials}
                                  </span>
                                </div>
                              )}
                              <div
                                className={cn(
                                  'absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm',
                                  conv.channelType === 'whatsapp' && 'bg-[#25d366]',
                                  conv.channelType === 'email' && 'bg-[#800020]',
                                  conv.channelType === 'sms' && 'bg-slate-500',
                                  conv.channelType === 'voice' && 'bg-orange-500'
                                )}
                              >
                                <ChannelIcon
                                  channelType={conv.channelType}
                                  className="h-3 w-3 !text-white"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {/* Star indicator */}
                                  {conv.isStarred && (
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                                  )}
                                  {/* For email group, show participants count */}
                                  {conv.channelType === 'email' &&
                                  (conv.participantCount > 2 || conv.ccParticipants?.length > 0) ? (
                                    <span className="font-medium text-sm truncate">
                                      {conv.contactName}
                                      <span className="text-muted-foreground font-normal">
                                        {' '}
                                        +{(conv.participantCount || 3) - 1}
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="font-medium text-sm truncate">
                                      {conv.contactName}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground shrink-0">
                                  {formatTimeAgo(conv.lastMessageAt)}
                                </span>
                              </div>
                              {/* For email, show subject as secondary line */}
                              {conv.channelType === 'email' ? (
                                <p className="text-xs font-medium truncate mt-0.5">
                                  {conv.subject || 'No Subject'}
                                </p>
                              ) : (
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {conv.lastMessage}
                                </p>
                              )}
                              {/* Status and Tags Row */}
                              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                                {/* Status Badge */}
                                <TooltipProvider delayDuration={0}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          'text-[10px] px-1.5 py-0 h-4 cursor-help',
                                          conv.status === 'open' &&
                                            'border-blue-500/30 bg-blue-50 text-blue-700',
                                          conv.status === 'pending' &&
                                            'border-yellow-500/30 bg-yellow-50 text-yellow-700',
                                          conv.status === 'resolved' &&
                                            'border-green-500/30 bg-green-50 text-green-700'
                                        )}
                                      >
                                        {conv.status === 'open'
                                          ? 'Awaiting Reply'
                                          : conv.status === 'pending'
                                            ? 'Unread'
                                            : conv.status === 'resolved'
                                              ? 'Resolved'
                                              : conv.status}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="text-xs">
                                      {conv.status === 'open' && 'Read but not yet replied'}
                                      {conv.status === 'pending' && 'Unread messages from customer'}
                                      {conv.status === 'resolved' && 'Replied and resolved'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                {/* Priority Badge */}
                                {conv.priority && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'text-[10px] px-1.5 py-0 h-4',
                                      conv.priority === 'high' &&
                                        'border-red-500/30 bg-red-50 text-red-700',
                                      conv.priority === 'medium' &&
                                        'border-yellow-500/30 bg-yellow-50 text-yellow-700',
                                      conv.priority === 'low' &&
                                        'border-green-500/30 bg-green-50 text-green-700'
                                    )}
                                  >
                                    {conv.priority === 'high'
                                      ? 'High'
                                      : conv.priority === 'medium'
                                        ? 'Med'
                                        : 'Low'}
                                  </Badge>
                                )}

                                {/* Unread Count */}
                                {conv.unreadCount > 0 && (
                                  <Badge className="text-[10px] px-1.5 py-0 h-4 bg-primary">
                                    {conv.unreadCount}
                                  </Badge>
                                )}

                                {/* Tags/Labels */}
                                {conv.tags && conv.tags.length > 0 && (
                                  <>
                                    {conv.tags.slice(0, 2).map((tag, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className={cn(
                                          'text-[9px] px-1 py-0 h-3.5',
                                          tagColors[tag] ||
                                            'bg-gray-100 text-gray-600 border-gray-200'
                                        )}
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                    {conv.tags.length > 2 && (
                                      <span className="text-[9px] text-muted-foreground">
                                        +{conv.tags.length - 2}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      </ConversationContextMenu>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            {!conversationsQuery.isLoading && conversations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                {!channels || channels.length === 0 ? (
                  <>
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No channels connected</p>
                    <p className="text-xs mt-1">Connect a channel in Settings to start messaging</p>
                  </>
                ) : channelFilter === 'whatsapp' ? (
                  <>
                    <WhatsAppIcon className="h-8 w-8 mx-auto mb-2 opacity-50 text-[#25d366]" />
                    <p className="text-sm font-medium">No WhatsApp conversations</p>
                    <p className="text-xs mt-1">
                      {selectedChannelAccountId !== 'all'
                        ? 'No conversations for this number'
                        : 'Conversations will appear here when customers message you'}
                    </p>
                  </>
                ) : (
                  <>
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations found</p>
                  </>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 w-full flex flex-col bg-white dark:bg-card min-w-0 min-h-0 rounded-3xl shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedConversation ? (
              <motion.div
                key={selectedConversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                {/* Chat Header - Unified modern design */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-white shrink-0">
                  {/* Clickable contact area - opens side panel */}
                  <button
                    className="flex items-center gap-3 -ml-2 pl-2 pr-3 py-1 rounded-lg transition-colors hover:bg-slate-50"
                    onClick={() => setShowContactPanel(true)}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {selectedConversation.contactName
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase() || '?'}
                        </span>
                      </div>
                      {/* Channel badge */}
                      <div
                        className={cn(
                          'absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm',
                          selectedConversation.channelType === 'whatsapp' && 'bg-[#25d366]',
                          selectedConversation.channelType === 'email' && 'bg-[#800020]',
                          selectedConversation.channelType === 'sms' && 'bg-slate-500',
                          selectedConversation.channelType === 'voice' && 'bg-orange-500'
                        )}
                      >
                        <ChannelIcon
                          channelType={selectedConversation.channelType}
                          className="h-3 w-3 !text-white"
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sm text-gray-900 hover:text-primary transition-colors">
                        {selectedConversation.contactName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span>{channelConfig[selectedConversation.channelType]?.label}</span>
                        <span>•</span>
                        <span className="truncate max-w-[200px]">
                          {selectedConversation.channelType === 'email'
                            ? selectedConversation.subject || 'No Subject'
                            : selectedConversation.contactPhone ||
                              selectedConversation.contactEmail}
                        </span>
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    {/* Voice and Video calls - disabled for now
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'h-8 w-8',
                          selectedConversation.channelType === 'whatsapp' && 'text-white hover:bg-white/10 hover:text-white'
                        )}
                        onClick={() => handleStartCall('voice')}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice Call</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'h-8 w-8',
                          selectedConversation.channelType === 'whatsapp' && 'text-white hover:bg-white/10 hover:text-white'
                        )}
                        onClick={() => handleStartCall('video')}
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Video Call</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                */}

                    {/* Quick Actions Bar */}
                    <div className="flex items-center gap-0.5 border-l pl-2 ml-2">
                      {/* Star */}
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-yellow-500"
                              onClick={() => {
                                const wasStarred = selectedConversation.isStarred;
                                toggleStarMutation.mutate(selectedId, {
                                  onSuccess: () => {
                                    toast({
                                      title: wasStarred ? 'Unstarred' : 'Starred',
                                      description: `Conversation ${wasStarred ? 'removed from' : 'added to'} starred`,
                                    });
                                  },
                                });
                              }}
                            >
                              <Star
                                className={cn(
                                  'h-4 w-4',
                                  selectedConversation.isStarred &&
                                    'fill-yellow-400 text-yellow-400'
                                )}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            {selectedConversation.isStarred ? 'Unstar' : 'Star'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Snooze */}
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-primary"
                              onClick={() => setShowSnoozeDialog(true)}
                            >
                              <Clock3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Snooze</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Resolve */}
                      {selectedConversation.status !== 'resolved' && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-green-500"
                                onClick={() => {
                                  resolveConversationMutation.mutate(
                                    { conversationId: selectedId, force: true },
                                    {
                                      onSuccess: () => {
                                        toast({
                                          title: 'Resolved',
                                          description: 'Conversation marked as resolved',
                                        });
                                      },
                                    }
                                  );
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Mark Resolved</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* Archive */}
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-orange-500"
                              onClick={() => {
                                archiveConversationMutation.mutate(selectedId, {
                                  onSuccess: () => {
                                    toast({
                                      title: 'Archived',
                                      description: 'Conversation has been archived',
                                    });
                                    setSelectedId(null);
                                  },
                                });
                              }}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Archive</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Assign to Team Button */}
                    <AssignButton
                      conversationId={selectedId}
                      currentTeamId={selectedConversation.assignedToTeamId}
                      currentTeamName={selectedConversation.assignedToTeam?.name}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-600"
                    />

                    {/* Purpose Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'h-8 px-2 gap-1.5 text-gray-600',
                            selectedConversation.purpose === 'SALES' && 'text-blue-600',
                            selectedConversation.purpose === 'SUPPORT' && 'text-amber-600',
                            selectedConversation.purpose === 'SERVICE' && 'text-purple-600',
                            selectedConversation.purpose === 'MARKETING' && 'text-pink-600'
                          )}
                        >
                          {selectedConversation.purpose === 'SALES' && (
                            <Target className="h-3.5 w-3.5" />
                          )}
                          {selectedConversation.purpose === 'SUPPORT' && (
                            <HelpCircle className="h-3.5 w-3.5" />
                          )}
                          {selectedConversation.purpose === 'SERVICE' && (
                            <Settings className="h-3.5 w-3.5" />
                          )}
                          {selectedConversation.purpose === 'MARKETING' && (
                            <Sparkles className="h-3.5 w-3.5" />
                          )}
                          {(!selectedConversation.purpose ||
                            selectedConversation.purpose === 'GENERAL') && (
                            <Inbox className="h-3.5 w-3.5" />
                          )}
                          <span className="text-xs font-medium">
                            {{
                              GENERAL: 'General',
                              SALES: 'Sales',
                              SUPPORT: 'Support',
                              SERVICE: 'Service',
                              MARKETING: 'Marketing',
                            }[selectedConversation.purpose] || 'General'}
                          </span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuItem
                          onClick={() => {
                            updatePurposeMutation.mutate(
                              { conversationId: selectedId, purpose: 'GENERAL' },
                              {
                                onSuccess: () => {
                                  toast({
                                    title: 'Purpose updated',
                                    description: 'Conversation marked as General',
                                  });
                                },
                              }
                            );
                          }}
                          className={cn(selectedConversation.purpose === 'GENERAL' && 'bg-muted')}
                        >
                          <Inbox className="h-4 w-4 mr-2 text-gray-500" />
                          General
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            updatePurposeMutation.mutate(
                              { conversationId: selectedId, purpose: 'SALES' },
                              {
                                onSuccess: () => {
                                  toast({
                                    title: 'Purpose updated',
                                    description: 'Conversation marked as Sales',
                                  });
                                },
                              }
                            );
                          }}
                          className={cn(selectedConversation.purpose === 'SALES' && 'bg-muted')}
                        >
                          <Target className="h-4 w-4 mr-2 text-blue-600" />
                          Sales
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            updatePurposeMutation.mutate(
                              { conversationId: selectedId, purpose: 'SUPPORT' },
                              {
                                onSuccess: () => {
                                  toast({
                                    title: 'Purpose updated',
                                    description: 'Conversation marked as Support',
                                  });
                                },
                              }
                            );
                          }}
                          className={cn(selectedConversation.purpose === 'SUPPORT' && 'bg-muted')}
                        >
                          <HelpCircle className="h-4 w-4 mr-2 text-amber-600" />
                          Support
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            updatePurposeMutation.mutate(
                              { conversationId: selectedId, purpose: 'SERVICE' },
                              {
                                onSuccess: () => {
                                  toast({
                                    title: 'Purpose updated',
                                    description: 'Conversation marked as Service',
                                  });
                                },
                              }
                            );
                          }}
                          className={cn(selectedConversation.purpose === 'SERVICE' && 'bg-muted')}
                        >
                          <Settings className="h-4 w-4 mr-2 text-purple-600" />
                          Service
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            updatePurposeMutation.mutate(
                              { conversationId: selectedId, purpose: 'MARKETING' },
                              {
                                onSuccess: () => {
                                  toast({
                                    title: 'Purpose updated',
                                    description: 'Conversation marked as Marketing',
                                  });
                                },
                              }
                            );
                          }}
                          className={cn(selectedConversation.purpose === 'MARKETING' && 'bg-muted')}
                        >
                          <Sparkles className="h-4 w-4 mr-2 text-pink-600" />
                          Marketing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            onClick={() => setShowKeyboardShortcuts(true)}
                          >
                            <Keyboard className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Keyboard shortcuts (Shift+?)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {selectedConversation.channelType === 'email' && (
                          <>
                            <DropdownMenuItem onClick={() => setShowParticipants(true)}>
                              <Users className="h-4 w-4 mr-2" />
                              View Participants
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            toggleStarMutation.mutate(selectedId, {
                              onSuccess: () => {
                                toast({
                                  title: selectedConversation.isStarred ? 'Unstarred' : 'Starred',
                                  description: `Conversation ${selectedConversation.isStarred ? 'removed from' : 'added to'} starred`,
                                });
                              },
                            });
                          }}
                        >
                          <Star
                            className={cn(
                              'h-4 w-4 mr-2',
                              selectedConversation.isStarred && 'fill-yellow-400 text-yellow-400'
                            )}
                          />
                          {selectedConversation.isStarred ? 'Unstar' : 'Star'} Conversation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            archiveConversationMutation.mutate(selectedId, {
                              onSuccess: () => {
                                toast({
                                  title: 'Archived',
                                  description: 'Conversation has been archived',
                                });
                                // Clear selection after archiving
                                setSelectedId(null);
                              },
                            });
                          }}
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        {selectedConversation.status !== 'resolved' && (
                          <DropdownMenuItem
                            onClick={() => {
                              resolveConversationMutation.mutate(
                                { conversationId: selectedId, force: true },
                                {
                                  onSuccess: () => {
                                    toast({
                                      title: 'Conversation resolved',
                                      description: 'Conversation has been force resolved',
                                    });
                                  },
                                  onError: (error) => {
                                    toast({
                                      title: 'Failed to resolve',
                                      description:
                                        error?.response?.data?.message ||
                                        error.message ||
                                        'Failed to resolve conversation',
                                      variant: 'destructive',
                                    });
                                  },
                                }
                              );
                            }}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Force Resolve
                          </DropdownMenuItem>
                        )}
                        {/* Delete option - disabled for now
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                    */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Check if conversation is unassigned - show blurred view */}
                {!selectedConversation.assignedToId ? (
                  <BlurredUnassignedView
                    conversationId={selectedId}
                    isAssigning={assignConversationMutation.isPending}
                    onAssign={() => {
                      assignConversationMutation.mutate(
                        { conversationId: selectedId, assignedTo: 'me' },
                        {
                          onSuccess: () => {
                            toast({
                              title: 'Assigned',
                              description: 'Conversation assigned to you',
                            });
                          },
                          onError: (error) => {
                            toast({
                              title: 'Failed to assign',
                              description: error?.message || 'Failed to assign conversation',
                              variant: 'destructive',
                            });
                          },
                        }
                      );
                    }}
                  />
                ) : (
                  <>
                    {/* Messages - Channel-specific styling */}
                    <div
                      ref={messagesContainerRef}
                      className={cn(
                        'flex-1 overflow-auto p-4',
                        getChatContainerStyles(selectedConversation.channelType),
                        getMessageSpacing(selectedConversation.channelType)
                      )}
                    >
                      {messagesQuery.isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : messagesQuery.isError ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <AlertCircle className="h-8 w-8 mb-2 text-destructive" />
                          <p>Failed to load messages</p>
                        </div>
                      ) : (
                        <div className={getMessageSpacing(selectedConversation.channelType)}>
                          {(() => {
                            // Group consecutive images for WhatsApp-style display
                            const groupedMessages = groupConsecutiveImages(messages);
                            let lastDirection = null;

                            return groupedMessages.map((item, idx) => {
                              if (item.type === 'image_group') {
                                // Render grouped images
                                const isOutbound = item.direction === 'outbound';
                                const showSenderLabel = lastDirection !== item.direction;
                                lastDirection = item.direction;

                                return (
                                  <div
                                    key={item.id}
                                    className={cn(
                                      'flex',
                                      isOutbound ? 'justify-end' : 'justify-start',
                                      showSenderLabel ? 'mt-4' : 'mt-1'
                                    )}
                                  >
                                    <ImageGrid
                                      images={item.images}
                                      variant={isOutbound ? 'dark' : 'light'}
                                      maxDisplay={4}
                                      timestamp={item.images[item.images.length - 1]?.createdAt}
                                    />
                                  </div>
                                );
                              } else {
                                // Render normal message
                                const msg = item.message;
                                const showSenderLabel = lastDirection !== msg.direction;
                                lastDirection = msg.direction;

                                return (
                                  <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    channelType={selectedConversation.channelType}
                                    showSenderLabel={showSenderLabel}
                                    contactName={selectedConversation.contactName}
                                    onAction={(action, actionMsg) => {
                                      switch (action) {
                                        case 'reply':
                                          messageInputRef.current?.focus();
                                          break;
                                        case 'forward':
                                          navigator.clipboard.writeText(actionMsg.content || '');
                                          toast({ title: 'Message copied for forwarding' });
                                          break;
                                        case 'copy':
                                          navigator.clipboard.writeText(actionMsg.content || '');
                                          toast({ title: 'Copied to clipboard' });
                                          break;
                                        case 'star':
                                          toggleStarMutation.mutate(selectedId);
                                          break;
                                        case 'archive':
                                          archiveConversationMutation.mutate(selectedId, {
                                            onSuccess: () => {
                                              toast({ title: 'Archived' });
                                              setSelectedId(null);
                                            },
                                          });
                                          break;
                                        case 'delete':
                                          // Delete is destructive — resolve instead
                                          resolveConversationMutation.mutate(
                                            { conversationId: selectedId, force: true },
                                            {
                                              onSuccess: () =>
                                                toast({ title: 'Conversation resolved' }),
                                            }
                                          );
                                          break;
                                      }
                                    }}
                                  />
                                );
                              }
                            });
                          })()}
                          {/* Scroll anchor for auto-scroll to bottom */}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </div>

                    {/* Message Input - Unified Component */}
                    <MessageInput
                      ref={messageInputRef}
                      channelType={selectedConversation.channelType?.toLowerCase() || 'default'}
                      value={message}
                      onChange={setMessage}
                      onSend={({ text, attachments, signature }) => {
                        // Use the text from MessageInput directly
                        if (!text.trim() || !selectedId) return;

                        // Get signature content
                        const channelType = selectedConversation?.channelType?.toLowerCase();
                        const signatures = getSignatures(channelType);
                        const sig = signatures.find((s) => s.id === signature);
                        let signatureContent = sig?.content || '';

                        // Replace signature variables with logged-in user's data (sender info)
                        if (signatureContent && user) {
                          const senderName =
                            `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                            user.displayName ||
                            '';
                          const senderData = {
                            name: senderName,
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            title: user.title || user.jobTitle || '',
                            company: user.tenant?.name || user.companyName || '',
                          };

                          // Replace variables - use regex that matches {{variable}} with optional whitespace
                          signatureContent = signatureContent
                            .replace(/\{\{\s*name\s*\}\}/gi, senderData.name)
                            .replace(/\{\{\s*firstName\s*\}\}/gi, senderData.firstName)
                            .replace(/\{\{\s*lastName\s*\}\}/gi, senderData.lastName)
                            .replace(/\{\{\s*email\s*\}\}/gi, senderData.email)
                            .replace(/\{\{\s*phone\s*\}\}/gi, senderData.phone)
                            .replace(/\{\{\s*title\s*\}\}/gi, senderData.title)
                            .replace(/\{\{\s*company\s*\}\}/gi, senderData.company);
                        }

                        // Append signature links if available
                        if (sig?.links && Object.keys(sig.links).length > 0) {
                          const linkLines = [];
                          const linkLabels = {
                            website: 'Website',
                            linkedin: 'LinkedIn',
                            twitter: 'Twitter',
                            facebook: 'Facebook',
                            instagram: 'Instagram',
                            youtube: 'YouTube',
                          };

                          Object.entries(sig.links).forEach(([key, url]) => {
                            if (url && url.trim()) {
                              // For WhatsApp, just add the URL (it auto-embeds links)
                              linkLines.push(url.trim());
                            }
                          });

                          if (linkLines.length > 0) {
                            signatureContent = signatureContent
                              ? signatureContent + '\n' + linkLines.join('\n')
                              : linkLines.join('\n');
                          }
                        }

                        // Add line breaks before signature if there's content
                        const finalMessage = signatureContent
                          ? text + '\n\n' + signatureContent
                          : text;

                        sendMessageMutation.mutate(
                          {
                            conversationId: selectedId,
                            content: finalMessage,
                            type: 'TEXT',
                          },
                          {
                            onSuccess: () => {
                              setMessage('');
                            },
                            onError: (error) => {
                              console.error('Failed to send message:', error);
                            },
                          }
                        );
                      }}
                      onAttach={(files) => {
                        // Handle file attachments - would upload to server
                      }}
                      isLoading={sendMessageMutation.isPending}
                      signatures={getSignatures(selectedConversation.channelType?.toLowerCase())}
                      selectedSignature={selectedSignature}
                      onSignatureChange={setSelectedSignature}
                      onManageSignatures={() => router.push('/settings/signatures')}
                      showVoice={selectedConversation.channelType?.toLowerCase() !== 'email'}
                      contact={{
                        firstName:
                          selectedConversation.contact?.firstName ||
                          selectedConversation.contactName?.split(' ')[0],
                        lastName:
                          selectedConversation.contact?.lastName ||
                          selectedConversation.contactName?.split(' ').slice(1).join(' '),
                        name: selectedConversation.contact?.firstName
                          ? `${selectedConversation.contact.firstName} ${selectedConversation.contact.lastName || ''}`.trim()
                          : selectedConversation.contactName,
                        email:
                          selectedConversation.contact?.email || selectedConversation.contactEmail,
                        phone:
                          selectedConversation.contact?.phone || selectedConversation.contactPhone,
                        company:
                          selectedConversation.contact?.company ||
                          selectedConversation.contactCompany,
                      }}
                    />
                  </>
                )}
              </motion.div>
            ) : showEmailComposer ? (
              <motion.div
                key="email-composer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col h-full"
              >
                <EmailComposer
                  inline={true}
                  isOpen={true}
                  onClose={() => setShowEmailComposer(false)}
                  defaultTo={[]}
                  defaultSubject=""
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex items-center justify-center text-muted-foreground"
              >
                {!channels || channels.length === 0 ? (
                  <div className="text-center max-w-md px-4">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Settings className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Channels Connected
                    </h3>
                    <p className="text-sm mb-6">
                      Connect a communication channel (WhatsApp, Email, SMS, or Voice) to start
                      messaging with your customers.
                    </p>
                    <Button onClick={() => router.push('/settings/channels')} className="gap-2">
                      <Settings className="h-4 w-4" />
                      Setup Channels
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">Select a conversation to start messaging</p>
                    <Button
                      onClick={() => setShowEmailComposer(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <PenSquare className="h-4 w-4" />
                      Compose Email
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Details Sidebar */}
        <AnimatePresence>
          {showContactPanel && selectedConversation && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 overflow-hidden"
            >
              <ContactPanel
                conversation={selectedConversation}
                channelType={selectedConversation?.channelType || 'whatsapp'}
                onClose={() => !isPanelPinned && setShowContactPanel(false)}
                onViewProfile={(contactId) => {
                  if (contactId) {
                    router.push(`/crm/contacts/${contactId}`);
                  }
                }}
                isPinned={isPanelPinned}
                onTogglePin={() => setIsPanelPinned(!isPanelPinned)}
                onCall={handleCallFromPanel}
                onWhatsApp={handleWhatsAppFromPanel}
                onSms={handleSmsFromPanel}
                onEmail={handleEmailFromPanel}
                onCreateTicket={handleCreateTicketFromPanel}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Participants Dialog - For Email Group Threads */}
        <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Conversation Participants
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* From */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">FROM</p>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {selectedConversation?.contactName?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {selectedConversation?.contactName || 'Customer'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation?.contactEmail || 'email@example.com'}
                    </p>
                  </div>
                </div>
              </div>

              {/* To */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">TO</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      You
                    </div>
                    <div>
                      <p className="font-medium text-sm">You</p>
                      <p className="text-xs text-muted-foreground">you@company.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CC - Mock data */}
              {selectedConversation?.ccParticipants?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">CC</p>
                  <div className="space-y-2">
                    {selectedConversation.ccParticipants.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium">
                          {p.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show sample CC for demo if no actual CC */}
              {!selectedConversation?.ccParticipants?.length &&
                selectedConversation?.channelType === 'email' && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">CC</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-medium">
                          T
                        </div>
                        <div>
                          <p className="font-medium text-sm">Team Lead</p>
                          <p className="text-xs text-muted-foreground">team.lead@company.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="h-10 w-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-medium">
                          S
                        </div>
                        <div>
                          <p className="font-medium text-sm">Support Manager</p>
                          <p className="text-xs text-muted-foreground">support.mgr@company.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowParticipants(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Call Modal */}
        <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {callType === 'video' ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <Phone className="h-5 w-5" />
                )}
                {callType === 'video' ? 'Video Call' : 'Voice Call'}
              </DialogTitle>
            </DialogHeader>

            <div className="py-8">
              <div className="text-center mb-8">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-medium text-primary">
                    {selectedConversation?.contactName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() || '?'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{selectedConversation?.contactName}</h3>
                <p className="text-muted-foreground">{selectedConversation?.contactPhone}</p>
              </div>

              <div className="text-center mb-8">
                {callStatus === 'idle' && <p className="text-muted-foreground">Ready to call</p>}
                {callStatus === 'initiating' && (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </div>
                )}
                {callStatus === 'ringing' && (
                  <div className="flex items-center justify-center gap-2">
                    <PhoneOutgoing className="h-4 w-4 animate-pulse text-green-500" />
                    <span className="text-green-600">Ringing...</span>
                  </div>
                )}
                {callStatus === 'connected' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <PhoneCall className="h-4 w-4" />
                      <span>Connected</span>
                    </div>
                    <div className="text-3xl font-mono font-bold">
                      {formatCallDuration(callDuration)}
                    </div>
                  </div>
                )}
                {callStatus === 'ended' && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <PhoneOff className="h-4 w-4" />
                    <span>Call ended</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4">
                {callStatus === 'idle' && (
                  <Button
                    size="lg"
                    className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600"
                    onClick={handleInitiateCall}
                  >
                    <Phone className="h-6 w-6" />
                  </Button>
                )}

                {(callStatus === 'ringing' || callStatus === 'connected') && (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className={cn(
                        'rounded-full h-14 w-14',
                        isMuted && 'bg-red-100 border-red-200'
                      )}
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <MicOff className="h-5 w-5 text-red-500" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      size="lg"
                      className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600"
                      onClick={handleEndCall}
                    >
                      <PhoneOff className="h-6 w-6" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className={cn('rounded-full h-14 w-14', !isSpeakerOn && 'bg-gray-100')}
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    >
                      {isSpeakerOn ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </>
                )}

                {callStatus === 'initiating' && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-16 w-16"
                    onClick={() => setCallStatus('idle')}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Keyboard Shortcuts Dialog */}
        <KeyboardShortcutsDialog
          open={showKeyboardShortcuts}
          onOpenChange={setShowKeyboardShortcuts}
        />

        {/* Snooze Dialog */}
        <SnoozeDialog
          open={showSnoozeDialog}
          onOpenChange={setShowSnoozeDialog}
          conversationId={selectedId}
          conversationName={
            selectedConversation?.contact?.firstName
              ? `${selectedConversation.contact.firstName} ${selectedConversation.contact.lastName || ''}`.trim()
              : selectedConversation?.contactName || selectedConversation?.contactPhone
          }
        />
      </div>
    </div>
  );
}
