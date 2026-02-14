'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Inbox,
  Users,
  User,
  Tag,
  FileText,
  Radio,
  Star,
  Archive,
  Clock,
  Mail,
  Smartphone,
  Phone,
  PhoneCall,
  Bot,
  Send,
  Settings,
  BarChart3,
  MessageSquare,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Key,
  Building2,
  Loader2,
  Circle,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { useUpdateAgentStatus } from '@/hooks/use-inbox-agent';
import { Switch } from '@/components/ui/switch';

// WhatsApp icon component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/**
 * Accordion-based navigation structure
 * Organized into logical sections for better UX
 */
const navigationSections = [
  {
    id: 'conversations',
    title: 'Conversations',
    icon: Inbox,
    defaultExpanded: true, // Always expanded by default
    items: [
      {
        title: 'All Conversations',
        href: '/inbox',
        icon: Inbox,
        badgeKey: 'all',
      },
      {
        title: 'Unassigned',
        href: '/inbox?bucket=unassigned',
        icon: Users,
        badgeKey: 'unassigned',
      },
      {
        title: 'My Chats',
        href: '/inbox?bucket=my_chats',
        icon: User,
        badgeKey: 'mine',
      },
      {
        title: 'Starred',
        href: '/inbox?bucket=starred',
        icon: Star,
        badgeKey: 'starred',
      },
      {
        title: 'Snoozed',
        href: '/inbox?bucket=snoozed',
        icon: Clock,
        badgeKey: 'snoozed',
      },
      {
        title: 'Archived',
        href: '/inbox?bucket=archived',
        icon: Archive,
        badgeKey: 'archived',
      },
    ],
  },
  {
    id: 'channels',
    title: 'Channels',
    icon: MessageCircle,
    defaultExpanded: false,
    items: [
      {
        title: 'WhatsApp',
        href: '/inbox?channel=whatsapp',
        icon: WhatsAppIcon,
        color: 'text-[#25d366]',
        bgColor: 'bg-[#25d366]/10',
        badgeKey: 'whatsapp',
        isChannel: true,
      },
      {
        title: 'SMS',
        href: '/inbox?channel=sms',
        icon: Smartphone,
        color: 'text-slate-500',
        bgColor: 'bg-slate-100',
        badgeKey: 'sms',
        isChannel: true,
      },
      {
        title: 'Email',
        href: '/inbox?channel=email',
        icon: Mail,
        color: 'text-[#800020]',
        bgColor: 'bg-[#800020]/10',
        badgeKey: 'email',
        isChannel: true,
      },
      {
        title: 'Voice',
        href: '/inbox?channel=voice',
        icon: PhoneCall,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        badgeKey: 'voice',
        isChannel: true,
      },
    ],
  },
  {
    id: 'messaging',
    title: 'Messaging',
    icon: Send,
    defaultExpanded: false,
    items: [
      {
        title: 'Templates',
        href: '/inbox/templates',
        icon: FileText,
      },
      {
        title: 'Canned Responses',
        href: '/inbox/canned-responses',
        icon: MessageSquare,
      },
      {
        title: 'Broadcasts',
        href: '/inbox/broadcasts',
        icon: Radio,
      },
      // Sequences moved to Automation Hub - use /automation/sequences (redirect in place)
    ],
  },
  {
    id: 'voice',
    title: 'Voice & Calls',
    icon: Phone,
    defaultExpanded: false,
    items: [
      {
        title: 'IVR Setup',
        href: '/inbox/ivr',
        icon: Phone,
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    icon: Wrench,
    defaultExpanded: false,
    items: [
      {
        title: 'Tags',
        href: '/inbox/tags',
        icon: Tag,
      },
      {
        title: 'Activity',
        href: '/inbox/activity',
        icon: Activity,
      },
    ],
  },
  {
    id: 'automation',
    title: 'Automation',
    icon: Bot,
    defaultExpanded: false,
    items: [
      // Chatbots moved to Automation Hub - /automation/chatbots is primary
      // Link points directly to avoid redirect hop
      {
        title: 'Chatbots',
        href: '/automation/chatbots',
        icon: Bot,
      },
    ],
  },
];

// Bottom fixed items (always visible)
const bottomItems = [
  {
    title: 'Settings',
    href: '/inbox/settings',
    icon: Settings,
  },
  {
    title: 'Analytics',
    href: '/inbox/analytics',
    icon: BarChart3,
  },
];

// Channel setup options for unconfigured channels
const channelSetupOptions = {
  whatsapp: {
    title: 'WhatsApp Setup',
    description: 'Configure WhatsApp Business API to start messaging',
    options: [
      {
        id: 'self_service',
        title: 'Self-Service Setup',
        description: 'Connect your own MSG91 account using our secure integration',
        icon: Key,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        recommended: true,
      },
      {
        id: 'managed',
        title: 'Managed Setup',
        description: 'Let us handle the MSG91 onboarding on your behalf',
        icon: Building2,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
      },
      {
        id: 'byok',
        title: 'Bring Your Own Key',
        description: 'Use your existing WhatsApp API from any provider (Twilio, Gupshup, etc.)',
        icon: ExternalLink,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
      },
    ],
  },
  sms: {
    title: 'SMS Setup',
    description: 'Configure SMS gateway to send text messages',
    options: [
      {
        id: 'msg91',
        title: 'MSG91 Integration',
        description: 'Connect MSG91 for Indian SMS with DLT compliance',
        icon: Key,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        recommended: true,
      },
      {
        id: 'byok',
        title: 'Bring Your Own Key',
        description: 'Use your existing SMS provider (Twilio, etc.)',
        icon: ExternalLink,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
      },
    ],
  },
  email: {
    title: 'Email Setup',
    description: 'Connect your email account for inbox integration',
    options: [
      {
        id: 'gmail',
        title: 'Google Workspace',
        description: 'Connect Gmail or Google Workspace account',
        icon: Mail,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        recommended: true,
      },
      {
        id: 'microsoft',
        title: 'Microsoft 365',
        description: 'Connect Outlook or Microsoft 365 account',
        icon: Mail,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      },
      {
        id: 'smtp',
        title: 'Custom SMTP',
        description: 'Configure custom SMTP/IMAP settings',
        icon: Settings,
        color: 'text-gray-500',
        bgColor: 'bg-gray-500/10',
      },
    ],
  },
  voice: {
    title: 'Voice Setup',
    description: 'Configure voice calling for customer support',
    options: [
      {
        id: 'telecmi',
        title: 'TeleCMI Integration',
        description: 'Connect TeleCMI for Indian voice calling',
        icon: PhoneCall,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        recommended: true,
      },
      {
        id: 'byok',
        title: 'Bring Your Own Key',
        description: 'Use your existing voice provider',
        icon: ExternalLink,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
      },
    ],
  },
};

// Channel Configuration Modal Component
function ChannelConfigModal({ channel, isOpen, onClose, onSelectOption }) {
  const config = channelSetupOptions[channel];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!config) return null;

  const handleSelect = async (optionId) => {
    setSelectedOption(optionId);
    setIsLoading(true);
    try {
      await onSelectOption(channel, optionId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {config.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={isLoading}
              className={cn(
                'w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left',
                'hover:border-primary/50 hover:bg-muted/50',
                selectedOption === option.id && 'border-primary bg-primary/5',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className={cn('p-2 rounded-lg', option.bgColor)}>
                <option.icon className={cn('h-5 w-5', option.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{option.title}</span>
                  {option.recommended && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
              </div>
              {isLoading && selectedOption === option.id && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function InboxSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const activeChannel = searchParams.get('channel');
  const activeBucket = searchParams.get('bucket');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const updateAgentStatus = useUpdateAgentStatus();

  // Helper to find which section contains the active item
  const findActiveSectionId = () => {
    for (const section of navigationSections) {
      for (const item of section.items) {
        // Check channel match
        if (item.href.includes('?channel=')) {
          const channel = item.href.split('channel=')[1];
          if (activeChannel === channel) return section.id;
        }
        // Check bucket match
        else if (item.href.includes('?bucket=')) {
          const bucket = item.href.split('bucket=')[1];
          if (activeBucket === bucket) return section.id;
        }
        // Check exact path match for sub-pages
        else if (item.href !== '/inbox' && pathname.startsWith(item.href.split('?')[0])) {
          return section.id;
        }
        // Check "All Conversations" - when no bucket and no channel
        else if (
          item.href === '/inbox' &&
          pathname === '/inbox' &&
          !activeChannel &&
          !activeBucket
        ) {
          return section.id;
        }
      }
    }
    return null;
  };

  // Accordion state - track which sections are expanded
  const [expandedSections, setExpandedSections] = useState(() => {
    // Initialize with default expanded sections
    const defaults = {};
    navigationSections.forEach((section) => {
      defaults[section.id] = section.defaultExpanded;
    });
    return defaults;
  });

  // Load expanded sections from localStorage and auto-expand active section
  useEffect(() => {
    const saved = localStorage.getItem('inbox-sidebar-sections');
    let sections = {};

    if (saved) {
      try {
        sections = JSON.parse(saved);
      } catch {
        // If parse fails, use defaults
        navigationSections.forEach((section) => {
          sections[section.id] = section.defaultExpanded;
        });
      }
    } else {
      // Use defaults if nothing saved
      navigationSections.forEach((section) => {
        sections[section.id] = section.defaultExpanded;
      });
    }

    // Auto-expand the section containing the active menu item
    const activeSectionId = findActiveSectionId();
    if (activeSectionId) {
      sections[activeSectionId] = true;
    }

    setExpandedSections(sections);
  }, [pathname, activeChannel, activeBucket]);

  // Toggle section expansion and persist to localStorage
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId],
      };
      localStorage.setItem('inbox-sidebar-sections', JSON.stringify(newState));
      return newState;
    });
  };

  // Fetch initial online status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/inbox/agents/status');
        if (response.success && response.data) {
          const currentAgent = response.data.find((a) => a.id === user?.id);
          if (currentAgent) {
            setIsOnline(currentAgent.isOnline);
          }
        }
      } catch (error) {
        console.error('Failed to fetch agent status:', error);
      }
    };
    if (user?.id) {
      fetchStatus();
    }
  }, [user?.id]);

  // Handle status toggle
  const handleStatusToggle = async (checked) => {
    try {
      setIsOnline(checked);
      await updateAgentStatus.mutateAsync(checked);
    } catch (error) {
      setIsOnline(!checked); // Revert on error
      console.error('Failed to update agent status:', error);
    }
  };

  // Badge counts from API
  const [badgeCounts, setBadgeCounts] = useState({
    all: 0,
    unassigned: 0,
    mine: 0,
    starred: 0,
    snoozed: 0,
    archived: 0,
    whatsapp: 0,
    sms: 0,
    email: 0,
    voice: 0,
  });

  // Channel configuration state
  const [channelConfig, setChannelConfig] = useState({
    whatsapp: { configured: false, status: 'NOT_STARTED' },
    sms: { configured: false, status: 'NOT_STARTED' },
    email: { configured: false, status: 'NOT_STARTED' },
    voice: { configured: false, status: 'NOT_STARTED' },
  });
  const [configModalChannel, setConfigModalChannel] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);

  // Check if any channel is configured
  const hasAnyChannelConfigured = Object.values(channelConfig).some((config) => config.configured);

  // Fetch conversation counts from API
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await api.get('/inbox/counts');
        if (response.success && response.data) {
          setBadgeCounts(response.data);
        }
      } catch (error) {
        // If API fails, keep counts at 0
        console.error('Failed to fetch inbox counts:', error);
      }
    };
    fetchCounts();

    // Refresh counts every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load channel configuration status
  useEffect(() => {
    const fetchChannelConfig = async () => {
      try {
        const response = await api.get('/channels/config-status');
        if (response.success && response.data) {
          setChannelConfig(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch channel config:', error);
      }
    };
    fetchChannelConfig();
  }, []);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('inbox-sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('inbox-sidebar-collapsed', JSON.stringify(newState));
  };

  const isActive = (href) => {
    // "All Conversations" is active when no bucket and no channel filter
    if (href === '/inbox') return pathname === '/inbox' && !activeChannel && !activeBucket;
    // Handle channel query params
    if (href.includes('?channel=')) {
      const channel = href.split('channel=')[1];
      return activeChannel === channel;
    }
    // Handle bucket query params
    if (href.includes('?bucket=')) {
      const bucket = href.split('bucket=')[1];
      return activeBucket === bucket;
    }
    return pathname.startsWith(href.split('?')[0]);
  };

  // Handle channel click - redirect to settings if not configured
  const handleChannelClick = (e, channel) => {
    const config = channelConfig[channel];
    if (!config?.configured) {
      e.preventDefault();
      // Redirect to channel settings page for setup
      const settingsRoutes = {
        whatsapp: '/settings/whatsapp',
        email: '/settings/email',
        sms: '/settings/sms',
        voice: '/settings/voice',
      };
      router.push(settingsRoutes[channel] || '/settings/channels');
    }
  };

  // Handle channel setup option selection
  const handleSetupOptionSelect = async (channel, optionId) => {
    try {
      // Save the selected setup mode
      const response = await api.post('/channels/setup-mode', {
        channel,
        setupMode: optionId,
      });

      if (response.success) {
        // Navigate to the setup page for this channel
        router.push(`/inbox/settings?setup=${channel}&mode=${optionId}`);
        setIsConfigModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to set channel setup mode:', error);
    }
  };

  const NavItem = ({ item, showDescription = true, isChannel = false }) => {
    const active = isActive(item.href);

    // Check if this is a channel and get its config status
    const channelKey = item.href.includes('?channel=') ? item.href.split('channel=')[1] : null;
    const isConfigured = channelKey ? channelConfig[channelKey]?.configured : true;
    const configStatus = channelKey ? channelConfig[channelKey]?.status : null;

    // Determine if menu item should be disabled based on channel configuration
    // Tags and Activity should always be enabled
    const isAlwaysEnabled =
      item.href === '/inbox/tags' ||
      item.href === '/inbox/activity' ||
      item.href === '/settings' ||
      item.href === '/inbox/analytics' ||
      item.href === '/inbox/settings';
    const isDisabled = !hasAnyChannelConfigured && !isAlwaysEnabled && !isChannel;

    // Get badge count from API data using badgeKey
    const badgeCount = item.badgeKey ? badgeCounts[item.badgeKey] || 0 : 0;

    const linkContent = (
      <div
        className={cn(
          'flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all',
          active && 'text-white',
          !active && !isDisabled && 'text-gray-700 hover:bg-white/50 hover:text-gray-900',
          isCollapsed && 'justify-center px-2 py-2',
          (!isConfigured || isDisabled) && 'opacity-50',
          isDisabled && 'cursor-not-allowed',
          active && 'bg-primary'
        )}
      >
        {item.color ? (
          <span
            className={cn(
              'flex items-center justify-center rounded-md shrink-0 mt-0.5 relative',
              isCollapsed ? 'h-6 w-6' : 'h-5 w-5',
              active ? item.bgColor : 'bg-gray-100'
            )}
          >
            <item.icon className={cn(isCollapsed ? 'h-3.5 w-3.5' : 'h-3 w-3', item.color)} />
            {/* Show warning indicator for unconfigured channels */}
            {!isConfigured && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </span>
        ) : (
          <item.icon
            className={cn(
              'shrink-0 mt-0.5',
              isCollapsed ? 'h-5 w-5' : 'h-4 w-4',
              active ? 'text-white' : isCollapsed ? 'text-gray-700' : 'text-gray-500'
            )}
          />
        )}
        {!isCollapsed && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  'text-sm font-medium whitespace-nowrap',
                  active && 'text-white',
                  !active && 'text-gray-900',
                  item.color && active && item.color
                )}
              >
                {item.title}
              </span>
              {!isConfigured ? (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Setup
                </span>
              ) : badgeCount > 0 ? (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                    active ? 'bg-white/20 text-white' : 'text-white bg-primary'
                  )}
                >
                  {badgeCount}
                </span>
              ) : null}
            </div>
            {showDescription && item.description && (
              <p
                className={cn(
                  'text-xs truncate mt-0.5',
                  active ? 'text-white/70' : 'text-gray-500'
                )}
              >
                {isDisabled
                  ? 'Setup channel first'
                  : !isConfigured
                    ? 'Click to configure'
                    : item.description}
              </p>
            )}
          </div>
        )}
      </div>
    );

    // Handle click for channels and disabled items
    const handleClick = (e) => {
      if (isDisabled) {
        e.preventDefault();
        setShowSetupDialog(true);
        return;
      }
      if (channelKey && !isConfigured) {
        handleChannelClick(e, channelKey);
      }
    };

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href} onClick={handleClick}>
              {linkContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="flex flex-col gap-1 bg-white border-0 px-3 py-2 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.3),0_2px_8px_-2px_rgba(168,85,247,0.2)]"
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            {isDisabled ? (
              <span className="text-xs text-amber-600">Setup channel first</span>
            ) : !isConfigured ? (
              <span className="text-xs text-amber-600">Click to configure</span>
            ) : (
              <>
                {item.description && (
                  <span className="text-xs text-gray-500">{item.description}</span>
                )}
                {badgeCount > 0 && (
                  <span className="text-xs text-primary">{badgeCount} messages</span>
                )}
              </>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link href={item.href} onClick={handleClick}>
        {linkContent}
      </Link>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          width: isCollapsed ? 64 : 260,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8,
          opacity: { duration: 0.3 },
        }}
        className="relative h-full flex flex-col bg-transparent"
      >
        {/* Navigation Links - Accordion sections */}
        <nav
          className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent',
          }}
        >
          <div className="space-y-1">
            {navigationSections.map((section) => {
              const isExpanded = expandedSections[section.id];
              const SectionIcon = section.icon;

              // Calculate total badge count for section
              const sectionBadgeCount = section.items.reduce((sum, item) => {
                return sum + (item.badgeKey ? badgeCounts[item.badgeKey] || 0 : 0);
              }, 0);

              return (
                <div
                  key={section.id}
                  className={cn('mb-1', isCollapsed && 'border-b border-gray-200/50 pb-1')}
                >
                  {/* Section Header - Clickable to expand/collapse */}
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className={cn(
                            'w-full flex items-center justify-center p-1.5 rounded transition-all',
                            isExpanded ? 'text-gray-400' : 'text-gray-300 hover:text-gray-400'
                          )}
                        >
                          <SectionIcon className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-white border border-gray-200 shadow-lg"
                      >
                        <span className="font-medium text-gray-900">{section.title}</span>
                        {sectionBadgeCount > 0 && (
                          <span className="ml-2 text-xs text-primary">({sectionBadgeCount})</span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group',
                        isExpanded
                          ? 'bg-white/70 text-gray-900'
                          : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <SectionIcon
                          className={cn('h-4 w-4', isExpanded ? 'text-primary' : 'text-gray-500')}
                        />
                        <span className="text-sm font-medium">{section.title}</span>
                        {sectionBadgeCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white bg-primary">
                            {sectionBadgeCount}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 text-gray-400 transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </button>
                  )}

                  {/* Section Items - Animated expand/collapse with stagger */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className={cn('space-y-0.5', isCollapsed ? 'pt-1' : 'pt-1 pl-2')}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={{
                            open: {
                              transition: {
                                staggerChildren: 0.05,
                                delayChildren: 0.1,
                              },
                            },
                            closed: {
                              transition: {
                                staggerChildren: 0.03,
                                staggerDirection: -1,
                              },
                            },
                          }}
                        >
                          {section.items.map((item) => (
                            <motion.div
                              key={item.href}
                              variants={{
                                open: {
                                  y: 0,
                                  opacity: 1,
                                  transition: {
                                    y: { stiffness: 1000, velocity: -100 },
                                  },
                                },
                                closed: {
                                  y: 20,
                                  opacity: 0,
                                  transition: {
                                    y: { stiffness: 1000 },
                                  },
                                },
                              }}
                            >
                              <NavItem
                                item={item}
                                showDescription={false}
                                isChannel={item.isChannel}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom fixed items - Settings & Analytics (outside scrollable area) */}
        <div className="px-2 py-2 bg-transparent">
          <div className="space-y-0.5">
            {bottomItems.map((item) => (
              <NavItem key={item.href} item={item} showDescription={false} />
            ))}
          </div>
        </div>

        {/* Collapse Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white border-gray-200 text-gray-600 shadow-md hover:bg-gray-50 hover:text-gray-900 z-10"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </motion.aside>

      {/* Channel Configuration Modal */}
      <ChannelConfigModal
        channel={configModalChannel}
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSelectOption={handleSetupOptionSelect}
      />

      {/* Setup Required Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Channel Setup Required
            </DialogTitle>
            <DialogDescription>
              You need to connect at least one channel (WhatsApp, Email, SMS, or Voice) before
              accessing this feature.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground">Choose a channel to set up:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, color: 'text-[#25d366]' },
                { key: 'email', label: 'Email', icon: Mail, color: 'text-[#800020]' },
                { key: 'sms', label: 'SMS', icon: Smartphone, color: 'text-slate-500' },
                { key: 'voice', label: 'Voice', icon: PhoneCall, color: 'text-orange-500' },
              ].map((channel) => {
                const Icon = channel.icon;
                const isConfigured = channelConfig[channel.key]?.configured;
                return (
                  <Button
                    key={channel.key}
                    variant="outline"
                    className={cn(
                      'flex items-center gap-2 justify-start h-auto py-3',
                      isConfigured && 'bg-green-50 border-green-200'
                    )}
                    onClick={() => {
                      const settingsRoutes = {
                        whatsapp: '/settings/whatsapp',
                        email: '/settings/email',
                        sms: '/settings/sms',
                        voice: '/settings/voice',
                      };
                      router.push(settingsRoutes[channel.key]);
                      setShowSetupDialog(false);
                    }}
                  >
                    <Icon className={cn('h-4 w-4', channel.color)} />
                    <div className="flex flex-col items-start flex-1">
                      <span className="text-sm font-medium">{channel.label}</span>
                      {isConfigured && (
                        <span className="text-[10px] text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Connected
                        </span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowSetupDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
