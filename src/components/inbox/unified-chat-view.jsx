'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  User,
  Star,
  Archive,
  Pin,
  Mail,
  Smartphone,
  PhoneCall,
  Mic,
  Image as ImageIcon,
  File,
  X,
  Play,
  Pause,
  ChevronDown,
  Sparkles,
  MessageSquare,
  UserPlus,
  Bell,
  BellOff,
  Search,
  MoreHorizontal,
  Reply,
  Forward,
  Copy,
  Trash2,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// WhatsApp icon component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Channel configuration with our design system colors
const channelConfig = {
  whatsapp: {
    icon: WhatsAppIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    label: 'WhatsApp',
    badgeBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
  },
  sms: {
    icon: Smartphone,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    label: 'SMS',
    badgeBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  },
  email: {
    icon: Mail,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    label: 'Email',
    badgeBg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
  },
  voice: {
    icon: PhoneCall,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    label: 'Voice',
    badgeBg: 'bg-gradient-to-r from-orange-500 to-red-500',
  },
};

// Channel Badge Component - Modern Style
function ChannelBadge({ channel = 'whatsapp' }) {
  const config = channelConfig[channel] || channelConfig.whatsapp;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg',
        config.badgeBg
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
}

// Message Status Icon
function MessageStatus({ status }) {
  switch (status) {
    case 'sent':
      return <Check className="h-3.5 w-3.5 text-emerald-200" />;
    case 'delivered':
      return <CheckCheck className="h-3.5 w-3.5 text-emerald-200" />;
    case 'read':
      return <CheckCheck className="h-3.5 w-3.5 text-blue-300" />;
    case 'pending':
      return <Clock className="h-3.5 w-3.5 text-emerald-200" />;
    default:
      return null;
  }
}

// Single Message Bubble Component - Modern Design
function MessageBubble({ message, isOutgoing, showAvatar = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2.5 max-w-[80%] group', isOutgoing ? 'ml-auto flex-row-reverse' : '')}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar for incoming messages */}
      {!isOutgoing && showAvatar && (
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md">
            {message.senderAvatar ? (
              <img
                src={message.senderAvatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-white">
                {message.senderName?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
        </div>
      )}

      {/* Message Content */}
      <div className="relative">
        <div
          className={cn(
            'relative rounded-2xl px-4 py-3 shadow-sm',
            isOutgoing
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-tr-sm'
              : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100 shadow-md'
          )}
        >
          {/* Sender name for group chats */}
          {!isOutgoing && message.senderName && (
            <p className="text-xs font-semibold text-primary mb-1">{message.senderName}</p>
          )}

          {/* Media content */}
          {message.mediaType === 'image' && message.mediaUrl && (
            <div className="mb-2 -mx-2 -mt-1 rounded-xl overflow-hidden">
              <img
                src={message.mediaUrl}
                alt=""
                className="max-w-full cursor-pointer hover:opacity-95 transition-opacity"
                style={{ maxHeight: '280px' }}
              />
            </div>
          )}

          {/* Audio message */}
          {message.mediaType === 'audio' && (
            <div className="flex items-center gap-3 min-w-[220px]">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                  isOutgoing
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600'
                )}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-1 rounded-full',
                        isOutgoing ? 'bg-white/40' : 'bg-emerald-200'
                      )}
                      style={{ height: `${Math.random() * 16 + 8}px` }}
                    />
                  ))}
                </div>
                <span
                  className={cn(
                    'text-xs mt-1 block',
                    isOutgoing ? 'text-emerald-100' : 'text-gray-500'
                  )}
                >
                  {message.duration || '0:30'}
                </span>
              </div>
            </div>
          )}

          {/* Poll/Interactive message */}
          {message.type === 'poll' && (
            <div className="space-y-2.5 min-w-[240px]">
              <p className={cn('font-semibold', isOutgoing ? 'text-white' : 'text-gray-800')}>
                {message.pollQuestion}
              </p>
              {message.pollOptions?.map((option, idx) => (
                <button
                  key={idx}
                  className={cn(
                    'w-full text-left px-3.5 py-2.5 rounded-xl border-2 transition-all font-medium text-sm',
                    isOutgoing
                      ? 'border-white/30 hover:bg-white/10 text-white'
                      : 'border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700'
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        'w-4 h-4 rounded-full border-2',
                        isOutgoing ? 'border-white/50' : 'border-emerald-300'
                      )}
                    />
                    {option}
                  </span>
                </button>
              ))}
              <p
                className={cn(
                  'text-xs text-center pt-1',
                  isOutgoing ? 'text-emerald-100' : 'text-gray-500'
                )}
              >
                {message.pollVotes || 0} votes · Vote to see results
              </p>
            </div>
          )}

          {/* Text content */}
          {message.content && (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Time and status */}
          <div
            className={cn(
              'flex items-center gap-1.5 mt-1.5',
              isOutgoing ? 'justify-end' : 'justify-start'
            )}
          >
            <span className={cn('text-[11px]', isOutgoing ? 'text-emerald-100' : 'text-gray-400')}>
              {formatTime(message.createdAt)}
            </span>
            {isOutgoing && <MessageStatus status={message.status} />}
          </div>
        </div>

        {/* Message reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div
            className={cn(
              'absolute -bottom-2.5 flex items-center gap-0.5 bg-white rounded-full px-2 py-1 shadow-lg border border-gray-100',
              isOutgoing ? 'right-2' : 'left-2'
            )}
          >
            {message.reactions.map((reaction, idx) => (
              <span key={idx} className="text-sm">
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}

        {/* Quick action buttons on hover */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                'absolute top-0 flex items-center gap-0.5 bg-white rounded-lg shadow-lg border border-gray-100 p-1',
                isOutgoing ? 'left-0 -translate-x-full -ml-2' : 'right-0 translate-x-full mr-2'
              )}
            >
              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                <Smile className="h-4 w-4 text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                <Reply className="h-4 w-4 text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Date Separator
function DateSeparator({ date }) {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <span className="px-4 py-1.5 bg-white rounded-full text-xs text-gray-500 font-medium shadow-sm border border-gray-100">
        {date}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}

// Main Unified Chat View Component
export function UnifiedChatView({
  conversation,
  messages = [],
  onSendMessage,
  onTyping,
  isLoading = false,
  currentUserId,
}) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage?.(inputValue);
    setInputValue('');
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get channel from conversation
  const channel = conversation?.channel || 'whatsapp';
  const channelConf = channelConfig[channel] || channelConfig.whatsapp;

  // Get contact info
  const contactName = conversation?.contact?.name || conversation?.contactName || 'Unknown';
  const contactPhone = conversation?.contact?.phone || conversation?.contactPhone || '';
  const contactAvatar = conversation?.contact?.avatar;
  const contactInitials = contactName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Chat Header - Modern Indigo Design */}
      <div
        className="flex items-center justify-between px-5 py-3.5 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Contact Avatar */}
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-lg">
              {contactAvatar ? (
                <img src={contactAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-white">{contactInitials}</span>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-indigo-900 shadow-md" />
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white text-base">{contactName}</h3>
            <p className="text-xs text-indigo-200">{contactPhone}</p>
          </div>
        </div>

        {/* Right side - Channel Badge + Actions */}
        <div className="flex items-center gap-4">
          {/* Channel Badge */}
          <ChannelBadge channel={channel} />

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-indigo-200 hover:text-white hover:bg-white/10"
                  >
                    <Phone className="h-4.5 w-4.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Call</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-indigo-200 hover:text-white hover:bg-white/10"
                  >
                    <Video className="h-4.5 w-4.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Video Call</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-indigo-200 hover:text-white hover:bg-white/10"
                  >
                    <Star className="h-4.5 w-4.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Star</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-indigo-200 hover:text-white hover:bg-white/10"
                  >
                    <MoreVertical className="h-4.5 w-4.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 bg-white border-0 shadow-xl rounded-xl"
                >
                  <DropdownMenuItem className="py-2.5">
                    <Pin className="h-4 w-4 mr-3 text-primary" />
                    Pin conversation
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5">
                    <BellOff className="h-4 w-4 mr-3 text-primary" />
                    Mute notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5">
                    <Archive className="h-4 w-4 mr-3 text-primary" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-2.5">
                    <User className="h-4 w-4 mr-3 text-primary" />
                    View contact
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5">
                    <Search className="h-4 w-4 mr-3 text-primary" />
                    Search in chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Date separator example */}
        <DateSeparator date="Today" />

        {/* Messages */}
        <AnimatePresence>
          {messages.map((message, index) => (
            <div key={message.id || index}>
              <MessageBubble
                message={message}
                isOutgoing={message.direction === 'outbound' || message.senderId === currentUserId}
                showAvatar={
                  index === 0 ||
                  messages[index - 1]?.direction !== message.direction ||
                  messages[index - 1]?.senderId !== message.senderId
                }
              />
            </div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {conversation?.isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md">
              <span className="text-xs font-semibold text-white">{contactInitials}</span>
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-100">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <span
                  className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area - Modern Design */}
      <div className="bg-white border-t border-gray-200 px-5 py-4 shadow-lg">
        {/* Signature indicator */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Signature: Professional</span>
          </div>
        </div>

        {/* Input row */}
        <div className="flex items-end gap-3">
          {/* Left action buttons */}
          <div className="flex items-center gap-1">
            {/* Attachment button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-52 bg-white border-0 shadow-xl rounded-xl p-1"
              >
                <DropdownMenuItem className="py-2.5 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  Photo & Video
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                    <File className="h-4 w-4 text-purple-600" />
                  </div>
                  Document
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Emoji button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-5 w-5" />
            </Button>

            {/* AI Suggestions */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
            >
              <Sparkles className="h-5 w-5" />
            </Button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                onTyping?.();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-indigo-100 px-4 py-3 text-[15px] transition-all"
            />
          </div>

          {/* Send / Voice button */}
          {inputValue.trim() ? (
            <Button
              onClick={handleSend}
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-11 w-11 rounded-xl transition-all',
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25'
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              )}
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnifiedChatView;
