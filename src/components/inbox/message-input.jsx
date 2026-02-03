'use client'

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { cn } from '@/lib/utils'
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  X,
  Image as ImageIcon,
  FileText,
  Film,
  Loader2,
  Check,
  Settings,
  FileSignature,
  Camera,
  MapPin,
  User,
  Music,
  File,
  FileSpreadsheet,
  Presentation,
  FileType,
  Plus,
  Upload,
  AlertCircle,
  Zap,
} from 'lucide-react'
import { QuickRepliesPicker } from './quick-replies-picker'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ==================== WHATSAPP BUSINESS API LIMITS ====================
// Reference: https://docs.quickreply.ai/what-are-the-media-file-size-limits-and-aspect-ratio-in-whatsapp-business-api

const WHATSAPP_LIMITS = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5 MB
    formats: ['image/jpeg', 'image/png'],
    extensions: ['.jpg', '.jpeg', '.png'],
    label: '5 MB',
  },
  video: {
    maxSize: 16 * 1024 * 1024, // 16 MB
    formats: ['video/mp4', 'video/3gpp'],
    extensions: ['.mp4', '.3gp'],
    label: '16 MB',
  },
  audio: {
    maxSize: 16 * 1024 * 1024, // 16 MB
    formats: ['audio/aac', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/amr'],
    extensions: ['.aac', '.mp3', '.ogg', '.amr'],
    label: '16 MB',
  },
  document: {
    maxSize: 100 * 1024 * 1024, // 100 MB
    formats: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain'],
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
    label: '100 MB',
  },
  sticker: {
    maxSize: 500 * 1024, // 500 KB
    formats: ['image/webp'],
    extensions: ['.webp'],
    label: '500 KB',
  },
}

// Email has more relaxed limits
const EMAIL_LIMITS = {
  image: {
    maxSize: 25 * 1024 * 1024, // 25 MB
    formats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'],
    label: '25 MB',
  },
  video: {
    maxSize: 25 * 1024 * 1024, // 25 MB
    formats: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
    extensions: ['.mp4', '.webm', '.mov', '.avi'],
    label: '25 MB',
  },
  audio: {
    maxSize: 25 * 1024 * 1024, // 25 MB
    formats: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
    extensions: ['.mp3', '.wav', '.ogg'],
    label: '25 MB',
  },
  document: {
    maxSize: 25 * 1024 * 1024, // 25 MB (Gmail limit)
    formats: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'text/csv', 'application/zip', 'application/x-rar-compressed'],
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.zip', '.rar'],
    label: '25 MB',
  },
}

// SMS/MMS limits
const SMS_LIMITS = {
  image: {
    maxSize: 1.5 * 1024 * 1024, // 1.5 MB for MMS
    formats: ['image/jpeg', 'image/png', 'image/gif'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif'],
    label: '1.5 MB',
  },
  video: {
    maxSize: 1.5 * 1024 * 1024, // 1.5 MB for MMS
    formats: ['video/mp4', 'video/3gpp'],
    extensions: ['.mp4', '.3gp'],
    label: '1.5 MB',
  },
  audio: {
    maxSize: 1.5 * 1024 * 1024, // 1.5 MB for MMS
    formats: ['audio/mpeg', 'audio/amr'],
    extensions: ['.mp3', '.amr'],
    label: '1.5 MB',
  },
}

// Get limits based on channel
const getChannelLimits = (channelType) => {
  switch (channelType) {
    case 'whatsapp':
      return WHATSAPP_LIMITS
    case 'email':
      return EMAIL_LIMITS
    case 'sms':
      return SMS_LIMITS
    default:
      return EMAIL_LIMITS
  }
}

// Common emoji categories
const EMOJI_CATEGORIES = {
  smileys: {
    label: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐']
  },
  gestures: {
    label: 'Gestures',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶']
  },
  hearts: {
    label: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '😍', '🥰', '😘', '😻', '💑', '💏']
  },
  objects: {
    label: 'Objects',
    emojis: ['📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💾', '💿', '📀', '📷', '📸', '📹', '🎥', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📬', '📭', '📮', '📝', '📁', '📂', '📅', '📆', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️']
  },
  symbols: {
    label: 'Symbols',
    emojis: ['✅', '✔️', '❌', '❎', '➕', '➖', '➗', '✖️', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '🔔', '🔕', '🎵', '🎶', '🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '⚠️', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵', '🔞', '☢️', '☣️', '⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️', '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝']
  },
  business: {
    label: 'Business',
    emojis: ['💼', '👔', '👗', '🏢', '🏦', '🏨', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '📊', '📈', '📉', '📋', '📌', '📍', '📎', '🖇️', '📝', '✏️', '🖊️', '🖋️', '✒️', '📧', '📨', '📩', '📤', '📥', '💰', '💵', '💴', '💶', '💷', '💸', '💳', '🧾', '💹', '✉️', '📬', '📭', '📮', '🗃️', '🗄️', '🗑️', '🗂️', '📆', '📅', '🗓️', '📇', '🗃️', '📑', '🔖', '🏷️']
  },
}

// Attachment type configurations
const ATTACHMENT_TYPES = {
  whatsapp: [
    {
      id: 'document',
      label: 'Document',
      description: 'PDF, Word, Excel, PPT, TXT',
      icon: FileText,
      color: 'bg-purple-500',
      accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
      maxSize: '100 MB',
    },
    {
      id: 'image',
      label: 'Photos',
      description: 'JPEG, PNG images',
      icon: ImageIcon,
      color: 'bg-blue-500',
      accept: '.jpg,.jpeg,.png',
      maxSize: '5 MB',
    },
    {
      id: 'video',
      label: 'Video',
      description: 'MP4, 3GP videos',
      icon: Film,
      color: 'bg-pink-500',
      accept: '.mp4,.3gp',
      maxSize: '16 MB',
    },
    {
      id: 'audio',
      label: 'Audio',
      description: 'MP3, AAC, OGG, AMR',
      icon: Music,
      color: 'bg-orange-500',
      accept: '.mp3,.aac,.ogg,.amr',
      maxSize: '16 MB',
    },
    {
      id: 'camera',
      label: 'Camera',
      description: 'Take a photo',
      icon: Camera,
      color: 'bg-red-500',
      isAction: true,
    },
    {
      id: 'contact',
      label: 'Contact',
      description: 'Share a contact',
      icon: User,
      color: 'bg-teal-500',
      isAction: true,
    },
    {
      id: 'location',
      label: 'Location',
      description: 'Share location',
      icon: MapPin,
      color: 'bg-green-500',
      isAction: true,
    },
  ],
  email: [
    {
      id: 'document',
      label: 'Document',
      description: 'PDF, Word, Excel, PPT, TXT, CSV, ZIP',
      icon: FileText,
      color: 'bg-purple-500',
      accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar',
      maxSize: '25 MB',
    },
    {
      id: 'image',
      label: 'Images',
      description: 'JPEG, PNG, GIF, WebP, SVG',
      icon: ImageIcon,
      color: 'bg-blue-500',
      accept: '.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp',
      maxSize: '25 MB',
    },
    {
      id: 'video',
      label: 'Video',
      description: 'MP4, WebM, MOV, AVI',
      icon: Film,
      color: 'bg-pink-500',
      accept: '.mp4,.webm,.mov,.avi',
      maxSize: '25 MB',
    },
    {
      id: 'audio',
      label: 'Audio',
      description: 'MP3, WAV, OGG',
      icon: Music,
      color: 'bg-orange-500',
      accept: '.mp3,.wav,.ogg',
      maxSize: '25 MB',
    },
    {
      id: 'any',
      label: 'Any File',
      description: 'Upload any file type',
      icon: File,
      color: 'bg-gray-500',
      accept: '*',
      maxSize: '25 MB',
    },
  ],
  sms: [
    {
      id: 'image',
      label: 'Photo',
      description: 'JPEG, PNG, GIF (MMS)',
      icon: ImageIcon,
      color: 'bg-blue-500',
      accept: '.jpg,.jpeg,.png,.gif',
      maxSize: '1.5 MB',
    },
    {
      id: 'video',
      label: 'Video',
      description: 'Short video clip',
      icon: Film,
      color: 'bg-pink-500',
      accept: '.mp4,.3gp',
      maxSize: '1.5 MB',
    },
    {
      id: 'camera',
      label: 'Camera',
      description: 'Take a photo',
      icon: Camera,
      color: 'bg-red-500',
      isAction: true,
    },
  ],
  default: [
    {
      id: 'document',
      label: 'Document',
      description: 'PDF, Word, Excel, PPT',
      icon: FileText,
      color: 'bg-purple-500',
      accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
      maxSize: '25 MB',
    },
    {
      id: 'image',
      label: 'Image',
      description: 'JPEG, PNG, GIF',
      icon: ImageIcon,
      color: 'bg-blue-500',
      accept: '.jpg,.jpeg,.png,.gif,.webp',
      maxSize: '25 MB',
    },
    {
      id: 'video',
      label: 'Video',
      description: 'MP4, WebM',
      icon: Film,
      color: 'bg-pink-500',
      accept: '.mp4,.webm,.mov',
      maxSize: '25 MB',
    },
  ],
}

// File type icons and colors
const FILE_TYPE_CONFIG = {
  image: { icon: ImageIcon, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Image' },
  video: { icon: Film, color: 'text-pink-600', bgColor: 'bg-pink-50', label: 'Video' },
  audio: { icon: Music, color: 'text-orange-600', bgColor: 'bg-orange-50', label: 'Audio' },
  pdf: { icon: FileText, color: 'text-red-600', bgColor: 'bg-red-50', label: 'PDF' },
  word: { icon: FileType, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Word' },
  excel: { icon: FileSpreadsheet, color: 'text-green-600', bgColor: 'bg-green-50', label: 'Excel' },
  powerpoint: { icon: Presentation, color: 'text-orange-600', bgColor: 'bg-orange-50', label: 'PowerPoint' },
  document: { icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Document' },
  default: { icon: File, color: 'text-gray-600', bgColor: 'bg-gray-50', label: 'File' },
}

// Get file type from extension/mime
const getFileType = (file) => {
  const fileName = file.name.toLowerCase()
  const mimeType = file.type

  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) return 'pdf'
  if (mimeType.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'word'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || fileName.endsWith('.csv')) return 'excel'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation') || fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) return 'powerpoint'
  if (mimeType.startsWith('text/') || fileName.endsWith('.txt')) return 'document'
  return 'default'
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Validate file against channel limits
const validateFile = (file, channelType, attachmentType) => {
  const limits = getChannelLimits(channelType)
  const fileType = getFileType(file)

  // Map file type to limit category
  let limitCategory = 'document'
  if (fileType === 'image') limitCategory = 'image'
  else if (fileType === 'video') limitCategory = 'video'
  else if (fileType === 'audio') limitCategory = 'audio'

  const limit = limits[limitCategory]
  if (!limit) return { valid: true }

  // Check size
  if (file.size > limit.maxSize) {
    return {
      valid: false,
      error: `File exceeds ${limit.label} limit for ${channelType}`,
    }
  }

  // Check format for WhatsApp
  if (channelType === 'whatsapp' && limit.formats) {
    const isValidFormat = limit.formats.some(format => file.type === format || file.type.startsWith(format.split('/')[0]))
    if (!isValidFormat) {
      return {
        valid: false,
        error: `File format not supported for WhatsApp. Allowed: ${limit.extensions.join(', ')}`,
      }
    }
  }

  return { valid: true }
}

// Channel-specific styling
const CHANNEL_STYLES = {
  whatsapp: {
    bg: 'bg-[#F0F2F5]',
    inputBg: 'bg-white shadow-sm',
    inputBorder: '',
    inputRadius: 'rounded-[20px]',
    accentColor: '#25d366',
    sendBg: 'bg-[#25d366] hover:bg-[#1da851]',
    iconColor: 'text-[#54656F]',
    placeholder: 'Type a message',
  },
  sms: {
    bg: 'bg-[#f6f6f6]',
    inputBg: 'bg-white',
    inputBorder: 'border border-gray-300 focus:border-[#007AFF]',
    inputRadius: 'rounded-full',
    accentColor: '#007AFF',
    sendBg: 'bg-[#007AFF] hover:bg-[#0056b3]',
    iconColor: 'text-[#007AFF]',
    placeholder: 'iMessage',
  },
  email: {
    bg: 'bg-[#f5f5f5]',
    inputBg: 'bg-white',
    inputBorder: 'border border-gray-300 focus:border-[#0b57d0]',
    inputRadius: 'rounded-[20px]',
    accentColor: '#0b57d0',
    sendBg: 'bg-[#0b57d0] hover:bg-[#0842a0]',
    iconColor: 'text-gray-600',
    placeholder: 'Write a reply...',
  },
  default: {
    bg: 'bg-white dark:bg-card',
    inputBg: 'bg-muted/50',
    inputBorder: 'border',
    inputRadius: 'rounded-lg',
    accentColor: 'hsl(var(--primary))',
    sendBg: 'bg-primary hover:bg-primary/90',
    iconColor: 'text-muted-foreground',
    placeholder: 'Type a message...',
  },
}

// Emoji Picker Component
function EmojiPicker({ onSelect, accentColor }) {
  const [activeCategory, setActiveCategory] = useState('smileys')

  return (
    <div className="w-80">
      {/* Category tabs */}
      <div className="flex gap-1 p-2 border-b overflow-x-auto">
        {Object.entries(EMOJI_CATEGORIES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              'px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors',
              activeCategory === key
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted text-muted-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Emoji grid */}
      <div className="p-2 h-52 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(emoji)}
              className="h-8 w-8 flex items-center justify-center text-xl hover:bg-muted rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      {/* Recent/Quick access */}
      <div className="p-2 border-t">
        <div className="text-[10px] text-muted-foreground mb-1">Quick</div>
        <div className="flex gap-1">
          {['👍', '❤️', '😊', '🙏', '👏', '🎉', '✅', '💯'].map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(emoji)}
              className="h-7 w-7 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Attachment Popup Component (WhatsApp-style)
function AttachmentPopup({ channelType, onSelect, onClose, onCamera, onLocation, onContact }) {
  const attachmentTypes = ATTACHMENT_TYPES[channelType] || ATTACHMENT_TYPES.default
  const fileInputRefs = useRef({})

  const handleTypeClick = (type) => {
    if (type.isAction) {
      if (type.id === 'camera') onCamera?.()
      else if (type.id === 'location') onLocation?.()
      else if (type.id === 'contact') onContact?.()
      onClose()
    } else {
      // Trigger file input
      fileInputRefs.current[type.id]?.click()
    }
  }

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onSelect(files, type.id)
      onClose()
    }
    // Reset input
    e.target.value = ''
  }

  return (
    <div className="w-72 p-3">
      <div className="grid grid-cols-3 gap-3">
        {attachmentTypes.map((type) => {
          const Icon = type.icon
          return (
            <div key={type.id} className="relative">
              <button
                onClick={() => handleTypeClick(type)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors w-full"
              >
                <div className={cn(
                  'h-12 w-12 rounded-full flex items-center justify-center text-white',
                  type.color
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">{type.label}</div>
                  {type.maxSize && (
                    <div className="text-[10px] text-muted-foreground">
                      Max {type.maxSize}
                    </div>
                  )}
                </div>
              </button>
              {!type.isAction && (
                <input
                  ref={(el) => fileInputRefs.current[type.id] = el}
                  type="file"
                  multiple
                  accept={type.accept}
                  className="hidden"
                  onChange={(e) => handleFileChange(e, type)}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Channel-specific notes */}
      {channelType === 'whatsapp' && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-start gap-2 text-[10px] text-muted-foreground">
            <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
            <span>WhatsApp supports JPEG/PNG images, MP4 videos, and common document formats. Videos must use H.264 codec.</span>
          </div>
        </div>
      )}

      {channelType === 'sms' && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-start gap-2 text-[10px] text-muted-foreground">
            <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
            <span>MMS has a 1.5MB limit. Large files will be rejected by carriers.</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Variable Substitution Dialog Component
function VariableSubstitutionDialog({
  open,
  onOpenChange,
  variables = [],
  variableValues = {},
  onVariableChange,
  onSubmit,
  templateTitle,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Fill Template Variables
          </DialogTitle>
          <DialogDescription>
            {templateTitle ? `Template: "${templateTitle}"` : 'Fill in the placeholders to personalize your message'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
          {variables.map((variable) => (
            <div key={variable.name} className="space-y-2">
              <Label htmlFor={variable.name} className="text-sm font-medium capitalize">
                {variable.label || variable.name.replace(/_/g, ' ')}
              </Label>
              <Input
                id={variable.name}
                placeholder={variable.defaultValue || `Enter ${variable.label || variable.name}`}
                value={variableValues[variable.name] || ''}
                onChange={(e) => onVariableChange(variable.name, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Insert Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Extract variables from template content
const extractTemplateVariables = (content) => {
  const regex = /\{\{([^}]+)\}\}/g
  const variables = []
  let match
  while ((match = regex.exec(content)) !== null) {
    const name = match[1].trim()
    if (!variables.find(v => v.name === name)) {
      variables.push({ name, label: name.replace(/_/g, ' ') })
    }
  }
  return variables
}

// Auto-fill variables from contact context
const autoFillVariables = (variables, contact) => {
  console.log('[autoFillVariables] Input - variables:', variables, 'contact:', contact)
  const filled = {}
  const contactFieldMap = {
    name: ['firstName', 'name', 'displayName'],
    first_name: ['firstName'],
    firstname: ['firstName'],
    firstName: ['firstName'],
    last_name: ['lastName'],
    lastname: ['lastName'],
    lastName: ['lastName'],
    full_name: ['displayName', 'firstName'],
    fullname: ['displayName', 'firstName'],
    email: ['email'],
    phone: ['phone'],
    company: ['company', 'companyName'],
    companyName: ['company', 'companyName'],
  }

  variables.forEach(variable => {
    const varName = variable.name.toLowerCase()
    const possibleFields = contactFieldMap[varName] || contactFieldMap[variable.name]
    console.log(`[autoFillVariables] Variable "${variable.name}" -> varName "${varName}" -> possibleFields:`, possibleFields)

    if (possibleFields && contact) {
      for (const field of possibleFields) {
        console.log(`[autoFillVariables] Checking field "${field}" = "${contact[field]}"`)
        if (contact[field]) {
          // Handle name - combine first and last if full name needed
          if (varName === 'name' || varName === 'full_name' || varName === 'fullname') {
            if (contact.firstName && contact.lastName) {
              filled[variable.name] = `${contact.firstName} ${contact.lastName}`
              console.log(`[autoFillVariables] Filled "${variable.name}" with combined name: "${filled[variable.name]}"`)
            } else if (contact.firstName) {
              filled[variable.name] = contact.firstName
              console.log(`[autoFillVariables] Filled "${variable.name}" with firstName: "${filled[variable.name]}"`)
            } else if (contact[field]) {
              filled[variable.name] = contact[field]
              console.log(`[autoFillVariables] Filled "${variable.name}" with fallback field "${field}": "${filled[variable.name]}"`)
            }
          } else {
            filled[variable.name] = contact[field]
            console.log(`[autoFillVariables] Filled "${variable.name}" with field "${field}": "${filled[variable.name]}"`)
          }
          break
        }
      }
    } else {
      console.log(`[autoFillVariables] No possibleFields or no contact for variable "${variable.name}"`)
    }
  })

  console.log('[autoFillVariables] Result:', filled)
  return filled
}

// Substitute variables in content
const substituteVariables = (content, values) => {
  let result = content
  Object.entries(values).forEach(([key, value]) => {
    if (value) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      result = result.replace(regex, value)
    }
  })
  return result
}

// Main MessageInput Component
export const MessageInput = forwardRef(function MessageInput({
  channelType = 'default',
  value = '',
  onChange,
  onSend,
  onAttach,
  onCamera,
  onLocation,
  onContact,
  onCreateQuickReply,
  disabled = false,
  isLoading = false,
  signatures = [],
  selectedSignature = 'none',
  onSignatureChange,
  onManageSignatures,
  maxLength,
  showVoice = true,
  showQuickReplies = true,
  className,
  contact = null, // Contact data for auto-filling template variables
}, ref) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentPopup, setShowAttachmentPopup] = useState(false)
  const [showSignatureMenu, setShowSignatureMenu] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [attachmentErrors, setAttachmentErrors] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [showSlashCommand, setShowSlashCommand] = useState(false)
  // Variable substitution dialog state
  const [showVariableDialog, setShowVariableDialog] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState(null)
  const [templateVariables, setTemplateVariables] = useState([])
  const [variableValues, setVariableValues] = useState({})
  const textareaRef = useRef(null)
  const quickRepliesRef = useRef(null)

  // Expose focus method via ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus()
    },
    blur: () => {
      textareaRef.current?.blur()
    },
    openQuickReplies: () => {
      quickRepliesRef.current?.open()
    },
  }), [])

  const styles = CHANNEL_STYLES[channelType] || CHANNEL_STYLES.default

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150)
      textareaRef.current.style.height = `${Math.max(40, newHeight)}px`
    }
  }, [value])

  // Handle text change
  const handleChange = useCallback((e) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) return
    onChange?.(newValue)
  }, [onChange, maxLength])

  // Handle emoji selection
  const handleEmojiSelect = useCallback((emoji) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.slice(0, start) + emoji + value.slice(end)
      onChange?.(newValue)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length
        textarea.focus()
      }, 0)
    } else {
      onChange?.(value + emoji)
    }
    setShowEmojiPicker(false)
  }, [value, onChange])

  // Handle file selection from attachment popup
  const handleFileSelect = useCallback((files, attachmentTypeId) => {
    const errors = []
    const validAttachments = []

    files.forEach(file => {
      const validation = validateFile(file, channelType, attachmentTypeId)
      if (validation.valid) {
        validAttachments.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
          type: getFileType(file),
          attachmentType: attachmentTypeId,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        })
      } else {
        errors.push({ fileName: file.name, error: validation.error })
      }
    })

    if (errors.length > 0) {
      setAttachmentErrors(errors)
      // Clear errors after 5 seconds
      setTimeout(() => setAttachmentErrors([]), 5000)
    }

    if (validAttachments.length > 0) {
      setAttachments(prev => [...prev, ...validAttachments])
      onAttach?.(validAttachments)
    }
  }, [channelType, onAttach])

  // Remove attachment
  const removeAttachment = useCallback((id) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id)
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview)
      }
      return prev.filter(a => a.id !== id)
    })
  }, [])

  // Handle send
  const handleSend = useCallback(() => {
    if ((!value.trim() && attachments.length === 0) || isLoading) return
    onSend?.({
      text: value.trim(),
      attachments,
      signature: selectedSignature !== 'none' ? selectedSignature : null,
    })
    setAttachments([])
  }, [value, attachments, isLoading, onSend, selectedSignature])

  // Handle quick reply selection with variable substitution
  const handleQuickReplySelect = useCallback((content, response) => {
    console.log('[QuickReply] Content:', content)
    console.log('[QuickReply] Contact:', contact)

    // Extract variables from the content
    const variables = extractTemplateVariables(content)
    console.log('[QuickReply] Extracted variables:', variables)

    if (variables.length === 0) {
      // No variables - just insert the content
      onChange?.(content)
      setTimeout(() => textareaRef.current?.focus(), 0)
      return
    }

    // Auto-fill variables from contact context
    const autoFilled = autoFillVariables(variables, contact)
    console.log('[QuickReply] Auto-filled values:', autoFilled)

    // Check if all variables are filled
    const unfilledVariables = variables.filter(v => !autoFilled[v.name])
    console.log('[QuickReply] Unfilled variables:', unfilledVariables)

    if (unfilledVariables.length === 0) {
      // All variables auto-filled - substitute and insert
      const finalContent = substituteVariables(content, autoFilled)
      console.log('[QuickReply] Final content after substitution:', finalContent)
      onChange?.(finalContent)
      setTimeout(() => textareaRef.current?.focus(), 0)
    } else {
      // Some variables need user input - show dialog
      // Merge auto-filled values with template's default values
      const initialValues = { ...autoFilled }
      if (response?.variables) {
        response.variables.forEach(v => {
          if (!initialValues[v.name] && v.defaultValue) {
            initialValues[v.name] = v.defaultValue
          }
        })
      }

      setPendingTemplate({ content, response })
      setTemplateVariables(variables)
      setVariableValues(initialValues)
      setShowVariableDialog(true)
    }
  }, [onChange, contact])

  // Handle variable value change
  const handleVariableChange = useCallback((name, value) => {
    setVariableValues(prev => ({ ...prev, [name]: value }))
  }, [])

  // Handle variable dialog submit
  const handleVariableSubmit = useCallback(() => {
    if (!pendingTemplate) return

    console.log('[QuickReply Dialog] Submitting with values:', variableValues)
    const finalContent = substituteVariables(pendingTemplate.content, variableValues)
    console.log('[QuickReply Dialog] Final content:', finalContent)
    onChange?.(finalContent)

    // Reset dialog state
    setShowVariableDialog(false)
    setPendingTemplate(null)
    setTemplateVariables([])
    setVariableValues({})

    // Focus back on textarea
    setTimeout(() => textareaRef.current?.focus(), 0)
  }, [pendingTemplate, variableValues, onChange])

  // Handle key press
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    // Open quick replies with / at start of empty input or Ctrl+/
    if (e.key === '/' && (value === '' || e.ctrlKey || e.metaKey)) {
      if (e.ctrlKey || e.metaKey || value === '') {
        e.preventDefault()
        quickRepliesRef.current?.open()
      }
    }
  }, [handleSend, value])

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files, 'document')
    }
  }, [handleFileSelect])

  const hasContent = value.trim() || attachments.length > 0
  const currentSignature = signatures.find(s => s.id === selectedSignature)

  return (
    <div
      className={cn(
        'shrink-0 relative',
        styles.bg,
        isDragging && 'ring-2 ring-primary ring-inset',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Attachment Errors */}
      {attachmentErrors.length > 0 && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          {attachmentErrors.map((err, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span><strong>{err.fileName}:</strong> {err.error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Signature indicator */}
      {selectedSignature !== 'none' && currentSignature && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-gray-500 border-b border-gray-200/50">
          <FileSignature className="h-3 w-3" style={{ color: styles.accentColor }} />
          <span>Signature: {currentSignature.name}</span>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-200/50">
          <div className="flex gap-2 flex-wrap">
            {attachments.map((attachment) => {
              const config = FILE_TYPE_CONFIG[attachment.type] || FILE_TYPE_CONFIG.default
              const Icon = config.icon
              return (
                <div
                  key={attachment.id}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 rounded-lg',
                    config.bgColor
                  )}
                >
                  {attachment.preview ? (
                    <img
                      src={attachment.preview}
                      alt={attachment.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <Icon className={cn('h-5 w-5', config.color)} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate max-w-[120px]">
                      {attachment.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main input area */}
      <div className="p-2">
        <div className="flex items-end gap-2">
          {/* Emoji Picker */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-10 w-10 shrink-0 rounded-full',
                  channelType === 'sms' ? 'h-9 w-9' : '',
                  showEmojiPicker && 'bg-muted'
                )}
                disabled={disabled}
              >
                <Smile className={cn('h-5 w-5', styles.iconColor)} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              className="p-0 w-auto"
              sideOffset={8}
            >
              <EmojiPicker
                onSelect={handleEmojiSelect}
                accentColor={styles.accentColor}
              />
            </PopoverContent>
          </Popover>

          {/* Attachment Button with Popup */}
          <Popover open={showAttachmentPopup} onOpenChange={setShowAttachmentPopup}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-10 w-10 shrink-0 rounded-full',
                  channelType === 'sms' ? 'h-9 w-9' : '',
                  showAttachmentPopup && 'bg-muted'
                )}
                disabled={disabled}
              >
                <Paperclip className={cn('h-5 w-5', styles.iconColor)} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              className="p-0 w-auto"
              sideOffset={8}
            >
              <AttachmentPopup
                channelType={channelType}
                onSelect={handleFileSelect}
                onClose={() => setShowAttachmentPopup(false)}
                onCamera={onCamera}
                onLocation={onLocation}
                onContact={onContact}
              />
            </PopoverContent>
          </Popover>

          {/* Quick Replies Picker */}
          {showQuickReplies && (
            <QuickRepliesPicker
              ref={quickRepliesRef}
              onSelect={handleQuickReplySelect}
              onCreateNew={onCreateQuickReply}
              disabled={disabled}
              channelType={channelType}
              className={channelType === 'sms' ? 'h-9 w-9' : ''}
            />
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              placeholder={styles.placeholder}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={disabled}
              className={cn(
                'w-full min-h-[40px] max-h-[150px] py-2.5 px-4 resize-none text-sm focus:outline-none overflow-y-auto',
                styles.inputBg,
                styles.inputBorder,
                styles.inputRadius,
                channelType === 'sms' && 'min-h-[36px] py-2',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              style={{ height: channelType === 'sms' ? '36px' : '40px' }}
            />
            {/* Character count */}
            {maxLength && value.length > maxLength * 0.8 && (
              <div className={cn(
                'absolute bottom-1 right-3 text-[10px]',
                value.length >= maxLength ? 'text-red-500' : 'text-muted-foreground'
              )}>
                {value.length}/{maxLength}
              </div>
            )}
          </div>

          {/* Signature Selection (if signatures available) */}
          {signatures.length > 0 && (
            <Popover open={showSignatureMenu} onOpenChange={setShowSignatureMenu}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-10 w-10 shrink-0 rounded-full hover:bg-gray-200',
                    channelType === 'sms' ? 'h-9 w-9' : '',
                    selectedSignature !== 'none' && 'text-primary'
                  )}
                  style={{
                    color: selectedSignature !== 'none' ? styles.accentColor : undefined
                  }}
                  disabled={disabled}
                >
                  <FileSignature className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 p-2">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Select Signature
                </div>
                {signatures.map((sig) => (
                  <button
                    key={sig.id}
                    onClick={() => {
                      onSignatureChange?.(sig.id)
                      setShowSignatureMenu(false)
                    }}
                    className={cn(
                      'w-full text-left px-2 py-2 rounded text-sm hover:bg-muted',
                      selectedSignature === sig.id && 'bg-muted'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{sig.name}</span>
                      {selectedSignature === sig.id && (
                        <Check
                          className="h-4 w-4"
                          style={{ color: styles.accentColor }}
                        />
                      )}
                    </div>
                    {sig.content && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 whitespace-pre-line">
                        {sig.content.trim().substring(0, 50)}
                        {sig.content.trim().length > 50 && '...'}
                      </p>
                    )}
                  </button>
                ))}
                {onManageSignatures && (
                  <div className="border-t mt-2 pt-2">
                    <button
                      onClick={() => {
                        onManageSignatures()
                        setShowSignatureMenu(false)
                      }}
                      className="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-muted flex items-center gap-2 text-muted-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      Manage Signatures
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}

          {/* Send / Voice Button */}
          {hasContent ? (
            <Button
              size="icon"
              className={cn(
                'shrink-0 rounded-full',
                channelType === 'sms' ? 'h-8 w-8' : 'h-10 w-10',
                styles.sendBg
              )}
              onClick={handleSend}
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                <Loader2 className={cn(
                  'animate-spin',
                  channelType === 'sms' ? 'h-4 w-4' : 'h-5 w-5'
                )} />
              ) : (
                <Send className={cn(
                  channelType === 'sms' ? 'h-4 w-4' : 'h-5 w-5'
                )} />
              )}
            </Button>
          ) : showVoice ? (
            <Button
              variant={channelType === 'sms' ? 'ghost' : 'default'}
              size="icon"
              className={cn(
                'shrink-0 rounded-full',
                channelType === 'sms' ? 'h-9 w-9 text-[#007AFF]' : 'h-10 w-10',
                channelType !== 'sms' && styles.sendBg
              )}
              disabled={disabled}
            >
              <Mic className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              className={cn(
                'shrink-0 rounded-full',
                channelType === 'sms' ? 'h-8 w-8' : 'h-10 w-10',
                styles.sendBg
              )}
              disabled={true}
            >
              <Send className={cn(
                channelType === 'sms' ? 'h-4 w-4' : 'h-5 w-5'
              )} />
            </Button>
          )}
        </div>
      </div>

      {/* Drop overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex items-center gap-3">
            <Upload className="h-6 w-6 text-primary" />
            <span className="font-medium">Drop files to attach</span>
          </div>
        </div>
      )}

      {/* Variable Substitution Dialog */}
      <VariableSubstitutionDialog
        open={showVariableDialog}
        onOpenChange={setShowVariableDialog}
        variables={templateVariables}
        variableValues={variableValues}
        onVariableChange={handleVariableChange}
        onSubmit={handleVariableSubmit}
        templateTitle={pendingTemplate?.response?.title}
      />
    </div>
  )
})

export default MessageInput
