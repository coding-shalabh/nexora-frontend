'use client'

import { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react'
import { cn } from '@/lib/utils'
import {
  Zap,
  Search,
  Star,
  StarOff,
  User,
  Users,
  Globe,
  Folder,
  ChevronRight,
  Loader2,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useCannedResponses,
  useCannedResponseCategories,
  useTrackCannedResponseUsage,
} from '@/hooks/use-inbox-agent'

// Visibility options (values must match API enum: PERSONAL, TEAM)
const visibilityOptions = [
  { value: 'all', label: 'All', icon: Sparkles, description: 'All replies' },
  { value: 'PERSONAL', label: 'My Templates', icon: User, description: 'Personal templates' },
  { value: 'TEAM', label: 'Team', icon: Users, description: 'Team templates' },
]

// Format shortcut key display
const formatShortcutDisplay = (shortcut) => {
  if (!shortcut) return null
  return `/${shortcut}`
}

// Quick Replies Picker Component
export const QuickRepliesPicker = forwardRef(function QuickRepliesPicker(
  {
    onSelect,
    onCreateNew,
    className,
    disabled = false,
    channelType = 'default',
    showTriggerButton = true,
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showFavorites, setShowFavorites] = useState(false)

  // Queries
  const { data: categoriesData, isLoading: loadingCategories } = useCannedResponseCategories()
  const { data: responsesData, isLoading: loadingResponses } = useCannedResponses({
    categoryId: selectedCategory,
    visibility: activeTab !== 'all' ? activeTab : undefined,
    search: search || undefined,
    favorite: showFavorites || undefined,
  })

  const trackUsage = useTrackCannedResponseUsage()

  const categories = categoriesData?.data || []
  const responses = responsesData?.data || []

  // Expose open/close methods via ref
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
    isOpen: () => isOpen,
  }), [isOpen])

  // Handle response selection
  const handleSelect = useCallback((response) => {
    // Track usage
    trackUsage.mutate(response.id)

    // Call onSelect with the content
    onSelect?.(response.content, response)

    // Close picker
    setIsOpen(false)
    setSearch('')
  }, [onSelect, trackUsage])

  // Get visibility icon
  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'PERSONAL': return User
      case 'TEAM': return Users
      default: return Users
    }
  }

  // Get visibility badge color
  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case 'PERSONAL': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'TEAM': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Recently used (sort by usage and show top ones)
  const recentlyUsed = [...responses]
    .filter(r => r.usageCount > 0)
    .sort((a, b) => new Date(b.lastUsedAt || 0) - new Date(a.lastUsedAt || 0))
    .slice(0, 5)

  // Channel-specific accent color
  const getAccentColor = () => {
    switch (channelType) {
      case 'whatsapp': return '#25d366'
      case 'sms': return '#007AFF'
      case 'email': return '#0b57d0'
      default: return 'hsl(var(--primary))'
    }
  }

  const accentColor = getAccentColor()

  return (
    <TooltipProvider delayDuration={300}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        {showTriggerButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-10 w-10 shrink-0 rounded-full',
                    isOpen && 'bg-muted',
                    className
                  )}
                  disabled={disabled}
                >
                  <Zap className="h-5 w-5 text-amber-500" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>Quick Replies</p>
              <p className="text-muted-foreground">Type / to open</p>
            </TooltipContent>
          </Tooltip>
        )}

      <PopoverContent
        side="top"
        align="start"
        className="w-96 p-0"
        sideOffset={8}
      >
        <div className="flex flex-col h-[400px]">
          {/* Header */}
          <div className="p-3 border-b space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Zap className="h-4 w-4" style={{ color: accentColor }} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Quick Replies</h4>
                  <p className="text-xs text-muted-foreground">
                    Insert pre-written responses
                  </p>
                </div>
              </div>
              {onCreateNew && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs h-7"
                  onClick={() => {
                    setIsOpen(false)
                    onCreateNew()
                  }}
                >
                  <Plus className="h-3 w-3" />
                  New
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search replies or type /shortcut..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
                autoFocus
              />
            </div>

            {/* Visibility tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full h-8">
                {visibilityOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <TabsTrigger
                      key={option.value}
                      value={option.value}
                      className="flex-1 text-xs gap-1 h-7 px-2"
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{option.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            {loadingResponses ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : responses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                <Zap className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No quick replies found</p>
                <p className="text-xs text-muted-foreground">
                  {search ? 'Try a different search' : 'Create your first quick reply'}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {/* Recently used section (only show when no search and showing all) */}
                {!search && activeTab === 'all' && recentlyUsed.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Recently Used
                    </div>
                    {recentlyUsed.map((response) => (
                      <QuickReplyItem
                        key={response.id}
                        response={response}
                        onSelect={handleSelect}
                        getVisibilityIcon={getVisibilityIcon}
                        getVisibilityColor={getVisibilityColor}
                        compact
                      />
                    ))}
                    <div className="border-b my-2" />
                  </div>
                )}

                {/* Categories */}
                {!search && categories.length > 0 && !selectedCategory && (
                  <div className="mb-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded flex items-center justify-center"
                            style={{ backgroundColor: category.color + '20', color: category.color }}
                          >
                            <Folder className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({category.responseCount || 0})
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                    <div className="border-b my-2" />
                  </div>
                )}

                {/* Back button when in category */}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md mb-2"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back to categories
                  </button>
                )}

                {/* Response items */}
                {responses.map((response) => (
                  <QuickReplyItem
                    key={response.id}
                    response={response}
                    onSelect={handleSelect}
                    getVisibilityIcon={getVisibilityIcon}
                    getVisibilityColor={getVisibilityColor}
                  />
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer hint */}
          <div className="p-2 border-t bg-muted/30">
            <p className="text-[10px] text-muted-foreground text-center">
              Type <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">/shortcut</kbd> in message to quickly insert
            </p>
          </div>
        </div>
      </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
})

// Individual quick reply item
function QuickReplyItem({
  response,
  onSelect,
  getVisibilityIcon,
  getVisibilityColor,
  compact = false,
}) {
  const VisibilityIcon = getVisibilityIcon(response.visibility)

  return (
    <button
      onClick={() => onSelect(response)}
      className={cn(
        'w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors group',
        compact && 'py-1.5'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
              {response.title}
            </span>
            {response.shortcut && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-mono">
                /{response.shortcut}
              </Badge>
            )}
            {response.isFavorite && (
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            )}
          </div>
          <p className={cn(
            'text-muted-foreground line-clamp-1 mt-0.5',
            compact ? 'text-[10px]' : 'text-xs'
          )}>
            {response.content.length > 80
              ? response.content.substring(0, 80) + '...'
              : response.content}
          </p>
        </div>
        <Badge
          className={cn(
            'text-[10px] px-1.5 py-0 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity',
            getVisibilityColor(response.visibility)
          )}
        >
          <VisibilityIcon className="h-2.5 w-2.5 mr-0.5" />
          {response.visibility}
        </Badge>
      </div>
    </button>
  )
}

export default QuickRepliesPicker
