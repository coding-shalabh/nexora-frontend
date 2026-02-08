'use client';

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Building2,
  Users,
  Shield,
  Lock,
  Zap,
  FileText,
  Key,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Mail,
  Link2,
  Tags,
  FormInput,
  Code2,
  BarChart3,
  MessageSquare,
  GitBranch,
  Puzzle,
  Smartphone,
  FileCode,
  Webhook,
  Terminal,
  UsersRound,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Phone,
  Radio,
  Database,
  Workflow,
  Receipt,
  Wallet,
  Settings,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ═══════════════════════════════════════════════════════════════════════════════
// WHATSAPP ICON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════
const navigationSections = [
  {
    id: 'account',
    title: 'Account',
    subtitle: 'Personal settings',
    icon: Users,
    items: [
      { title: 'Profile', href: '/settings/profile', icon: Users },
      { title: 'Preferences', href: '/settings/preferences', icon: Settings },
      { title: 'Notifications', href: '/settings/notifications', icon: Zap },
    ],
  },
  {
    id: 'organization',
    title: 'Organization',
    subtitle: 'Workspace management',
    icon: Building2,
    items: [
      { title: 'Company Profile', href: '/settings/organization', icon: Building2 },
      { title: 'Users', href: '/settings/users', icon: Users },
      { title: 'Teams', href: '/settings/teams', icon: UsersRound },
      { title: 'Roles', href: '/settings/roles', icon: Shield },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    subtitle: 'Security & compliance',
    icon: ShieldCheck,
    items: [
      { title: 'Security', href: '/settings/security', icon: Lock },
      { title: '2FA', href: '/settings/2fa', icon: Fingerprint },
      { title: 'Sessions', href: '/settings/sessions', icon: KeyRound },
      { title: 'Audit Logs', href: '/settings/audit', icon: FileText },
    ],
  },
  {
    id: 'channels',
    title: 'Channels',
    subtitle: 'Communication channels',
    icon: Radio,
    items: [
      {
        title: 'WhatsApp',
        href: '/settings/whatsapp',
        icon: WhatsAppIcon,
        color: 'text-[#25d366]',
        bgColor: 'bg-[#25d366]/10',
      },
      {
        title: 'Email',
        href: '/settings/email',
        icon: Mail,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      },
      {
        title: 'SMS',
        href: '/settings/sms',
        icon: MessageSquare,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
      },
      {
        title: 'Voice',
        href: '/settings/voice',
        icon: Phone,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
      },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    subtitle: 'Data configuration',
    icon: Database,
    items: [
      { title: 'Custom Fields', href: '/settings/custom-fields', icon: FormInput },
      { title: 'Pipelines', href: '/settings/pipelines', icon: GitBranch },
      { title: 'Tags', href: '/settings/tags', icon: Tags },
      { title: 'Templates', href: '/settings/templates', icon: FileText },
    ],
  },
  {
    id: 'automation',
    title: 'Automation',
    subtitle: 'Workflow automation',
    icon: Workflow,
    items: [
      { title: 'Workflows', href: '/settings/workflows', icon: Workflow },
      { title: 'Triggers', href: '/settings/triggers', icon: Zap },
      { title: 'Integrations', href: '/settings/integrations', icon: Puzzle },
    ],
  },
  {
    id: 'developer',
    title: 'Developer',
    subtitle: 'API & integrations',
    icon: Code2,
    items: [
      { title: 'API Keys', href: '/settings/api-keys', icon: Key },
      { title: 'Webhooks', href: '/settings/webhooks', icon: Webhook },
      { title: 'Tracking Scripts', href: '/settings/tracking', icon: FileCode },
      { title: 'Mini Apps', href: '/settings/mini-apps', icon: Smartphone },
      { title: 'SDK', href: '/settings/sdk', icon: Terminal },
      { title: 'Analytics Hub', href: '/settings/analytics', icon: BarChart3 },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    subtitle: 'Subscription & payments',
    icon: CreditCard,
    items: [
      { title: 'Subscription', href: '/settings/subscription', icon: CreditCard },
      { title: 'Wallet', href: '/settings/wallet', icon: Wallet },
      { title: 'Invoices', href: '/settings/invoices', icon: Receipt },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT FOR SHARING SELECTED SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const SettingsContext = createContext(null);

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS PROVIDER (Wraps everything to share state)
// ═══════════════════════════════════════════════════════════════════════════════
export function SettingsProvider({ children }) {
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('organization');

  // Find which section contains the active item
  useEffect(() => {
    for (const section of navigationSections) {
      for (const item of section.items) {
        if (pathname === item.href || pathname.startsWith(item.href + '/')) {
          setSelectedSection(section.id);
          return;
        }
      }
    }
  }, [pathname]);

  const currentSection = useMemo(
    () => navigationSections.find((s) => s.id === selectedSection),
    [selectedSection]
  );

  const contextValue = useMemo(
    () => ({
      currentSection,
      selectedSection,
      setSelectedSection,
      navigationSections,
      pathname,
    }),
    [currentSection, selectedSection, pathname]
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS SIDEBAR (CORE MENU ONLY)
// ═══════════════════════════════════════════════════════════════════════════════
export function SettingsSidebar() {
  const { selectedSection, setSelectedSection, navigationSections } = useSettingsContext();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('settings-sidebar-collapsed');
    if (saved !== null) setIsCollapsed(JSON.parse(saved));
  }, []);

  // Handle section click - navigate to first item of section
  const handleSectionClick = (section) => {
    setSelectedSection(section.id);
    // Navigate to the first item of the section
    if (section.items && section.items.length > 0) {
      router.push(section.items[0].href);
    }
  };

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('settings-sidebar-collapsed', JSON.stringify(newState));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 180 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
        className="relative h-full flex flex-col border-r shrink-0 bg-transparent border-gray-300"
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-300">
          {!isCollapsed && <h2 className="text-sm font-semibold text-gray-700">Settings</h2>}
          {isCollapsed && (
            <div className="flex justify-center">
              <Settings className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </div>

        {/* Core Menu Items */}
        <nav
          className="flex-1 overflow-y-auto py-2 px-2"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
        >
          <div className="space-y-1">
            {navigationSections.map((section) => {
              const SectionIcon = section.icon;
              const isSelected = selectedSection === section.id;

              if (isCollapsed) {
                return (
                  <Tooltip key={section.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleSectionClick(section)}
                        className={cn(
                          'w-full flex items-center justify-center p-2 rounded-lg transition-all',
                          isSelected
                            ? 'bg-gray-100 text-brand shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
                        )}
                      >
                        <SectionIcon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-white border border-gray-200 shadow-lg"
                    >
                      <span className="font-medium text-gray-800">{section.title}</span>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-left',
                    isSelected
                      ? 'bg-gray-100 text-brand shadow-sm font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  )}
                >
                  <SectionIcon
                    className={cn('h-4 w-4 shrink-0', isSelected ? 'text-brand' : 'text-gray-500')}
                  />
                  <span className="text-sm truncate">{section.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-16 h-6 w-6 rounded-full bg-white border-gray-300 text-gray-600 shadow-md hover:bg-gray-50 hover:text-gray-900 z-10"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE-SPECIFIC STATS CONFIGURATION
// TODO: These stats should be fetched dynamically from the API
// ═══════════════════════════════════════════════════════════════════════════════
const pageStats = {
  '/settings/organization': [
    { value: '1', label: 'Workspace', icon: Building2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '3', label: 'Members', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: 'Starter',
      label: 'Plan',
      icon: CreditCard,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    {
      value: '80%',
      label: 'Complete',
      icon: CheckCircle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/settings/users': [
    { value: '3', label: 'Total Users', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '1', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '2', label: 'Pending', icon: Clock, bg: 'bg-orange-50', color: 'text-orange-600' },
    { value: '3', label: 'Teams', icon: UsersRound, bg: 'bg-purple-50', color: 'text-purple-600' },
  ],
  '/settings/teams': [
    { value: '3', label: 'Teams', icon: UsersRound, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '6', label: 'Members', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Channels',
      icon: MessageSquare,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Leads', icon: Shield, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/settings/roles': [
    { value: '9', label: 'Roles', icon: Shield, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '9', label: 'System', icon: Lock, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Custom', icon: FormInput, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '1', label: 'Users', icon: Users, bg: 'bg-orange-50', color: 'text-orange-600' },
  ],
  '/settings/security': [
    { value: '75%', label: 'Score', icon: ShieldCheck, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '1', label: 'Sessions', icon: KeyRound, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'API Keys', icon: Key, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: 'Off', label: '2FA', icon: Fingerprint, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/settings/2fa': [
    { value: 'On', label: 'Status', icon: Fingerprint, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '8', label: 'Backup', icon: Key, bg: 'bg-amber-50', color: 'text-amber-600' },
    {
      value: 'High',
      label: 'Security',
      icon: ShieldCheck,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      value: 'TOTP',
      label: 'Method',
      icon: Smartphone,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ],
  '/settings/sessions': [
    { value: '4', label: 'Sessions', icon: KeyRound, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '1', label: 'Active', icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '3',
      label: 'Devices',
      icon: Smartphone,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    {
      value: 'Safe',
      label: 'Status',
      icon: ShieldCheck,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
    },
  ],
  '/settings/audit': [
    { value: '15K', label: 'Events', icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '234', label: 'Today', icon: Clock, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '3', label: 'Alerts', icon: Zap, bg: 'bg-amber-50', color: 'text-amber-600' },
    { value: '12', label: 'Failed', icon: Lock, bg: 'bg-red-50', color: 'text-red-600' },
  ],
  '/settings/whatsapp': [
    { value: '0', label: 'Numbers', icon: Phone, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '0',
      label: 'Messages',
      icon: MessageSquare,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    { value: '₹0', label: 'Balance', icon: Wallet, bg: 'bg-purple-50', color: 'text-purple-600' },
    {
      value: '-',
      label: 'Delivery',
      icon: CheckCircle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/settings/email': [
    { value: '0', label: 'Accounts', icon: Mail, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '0',
      label: 'Verified',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '0',
      label: 'Sent',
      icon: MessageSquare,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '-', label: 'Delivery', icon: Zap, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/settings/sms': [
    {
      value: '0',
      label: 'Connected',
      icon: MessageSquare,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '0', label: 'Templates', icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '0', label: 'Sent', icon: Zap, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '98%',
      label: 'Delivered',
      icon: CheckCircle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
  ],
  '/settings/voice': [
    { value: '1', label: 'Connected', icon: Phone, bg: 'bg-orange-50', color: 'text-orange-600' },
    { value: '156', label: 'Calls', icon: Zap, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '89',
      label: 'Inbound',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      value: '67',
      label: 'Outbound',
      icon: MessageSquare,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ],
  '/settings/custom-fields': [
    { value: '12', label: 'Fields', icon: FormInput, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '5', label: 'Contacts', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '4',
      label: 'Companies',
      icon: Building2,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '3', label: 'Deals', icon: CreditCard, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/settings/pipelines': [
    { value: '3', label: 'Pipelines', icon: GitBranch, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '2', label: 'Deals', icon: CreditCard, bg: 'bg-green-50', color: 'text-green-600' },
    { value: '1', label: 'Leads', icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
    { value: '15', label: 'Stages', icon: Zap, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/settings/tags': [
    { value: '24', label: 'Tags', icon: Tags, bg: 'bg-blue-50', color: 'text-blue-600' },
    { value: '156', label: 'Contacts', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
    {
      value: '45',
      label: 'Companies',
      icon: Building2,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    { value: '89', label: 'Deals', icon: CreditCard, bg: 'bg-amber-50', color: 'text-amber-600' },
  ],
  '/settings/templates': [
    { value: '18', label: 'Templates', icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
    {
      value: '12',
      label: 'Approved',
      icon: CheckCircle,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    { value: '4', label: 'Pending', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
    { value: '2', label: 'Rejected', icon: Lock, bg: 'bg-red-50', color: 'text-red-600' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE-SPECIFIC ACTIONS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const pageActions = {
  '/settings/organization': [{ icon: 'save', label: 'Save Changes', variant: 'default' }],
  '/settings/security': [{ icon: 'shield', label: 'Run Security Scan', variant: 'default' }],
  '/settings/2fa': [{ icon: 'shield', label: 'Regenerate Codes', variant: 'default' }],
  '/settings/sessions': [{ icon: 'logout', label: 'Sign Out All', variant: 'default' }],
  '/settings/users': [
    { icon: 'download', label: 'Export', variant: 'outline' },
    { icon: 'plus', label: 'Invite User', variant: 'default' },
  ],
  '/settings/teams': [{ icon: 'plus', label: 'Create Team', variant: 'default' }],
  '/settings/roles': [{ icon: 'plus', label: 'New Role', variant: 'default' }],
  '/settings/whatsapp': [{ icon: 'plus', label: 'Add Number', variant: 'default' }],
  '/settings/email': [{ icon: 'plus', label: 'Add Account', variant: 'default' }],
  '/settings/sms': [{ icon: 'plus', label: 'Add Provider', variant: 'default' }],
  '/settings/voice': [{ icon: 'plus', label: 'Add Provider', variant: 'default' }],
  '/settings/custom-fields': [{ icon: 'plus', label: 'Add Field', variant: 'default' }],
  '/settings/pipelines': [{ icon: 'plus', label: 'New Pipeline', variant: 'default' }],
  '/settings/tags': [{ icon: 'plus', label: 'New Tag', variant: 'default' }],
  '/settings/templates': [{ icon: 'plus', label: 'New Template', variant: 'default' }],
  '/settings/api-keys': [{ icon: 'plus', label: 'Create Key', variant: 'default' }],
  '/settings/webhooks': [{ icon: 'plus', label: 'Add Webhook', variant: 'default' }],
  '/settings/integrations': [{ icon: 'plus', label: 'Add Integration', variant: 'default' }],
  '/settings/workflows': [{ icon: 'plus', label: 'New Workflow', variant: 'default' }],
  '/settings/triggers': [{ icon: 'plus', label: 'Add Trigger', variant: 'default' }],
  '/settings/audit': [{ icon: 'download', label: 'Export Logs', variant: 'default' }],
};

import {
  Plus,
  Download as DownloadIcon,
  Save,
  ShieldCheck as ShieldIcon,
  LogOut,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS HEADER (Status bar with title and stats)
// ═══════════════════════════════════════════════════════════════════════════════
export function SettingsHeader() {
  const { currentSection, pathname } = useSettingsContext();
  const router = useRouter();
  const [dynamicStats, setDynamicStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dynamic stats for channel pages
  const fetchChannelStats = async () => {
    if (
      !pathname.startsWith('/settings/whatsapp') &&
      !pathname.startsWith('/settings/email') &&
      !pathname.startsWith('/settings/sms') &&
      !pathname.startsWith('/settings/voice')
    ) {
      return;
    }

    setRefreshing(true);
    try {
      // Import api and stats utilities dynamically
      const { api } = await import('@/lib/api');
      const { formatStatsForDisplay } = await import('@/lib/integration-stats');

      const channelType = pathname.split('/')[2]; // whatsapp, email, sms, voice

      // Fetch combined stats from the new backend endpoint
      const statsRes = await api.get(`/integrations/messaging/combined-stats/${channelType}`);

      if (statsRes.success) {
        const combinedStats = statsRes.data;

        // Transform backend stats to frontend format
        const aggregatedStats = {
          numbers: combinedStats.totalIntegrations || 0,
          messages: combinedStats.sent || 0,
          balance: 0, // Will be calculated from byProvider
          deliveryRate: combinedStats.deliveryRate || 0,
          currency: 'INR',
        };

        // Calculate total balance from all providers (prefer INR, then USD)
        const balanceByCurrency = {};
        Object.values(combinedStats.byProvider || {}).forEach((providerStats) => {
          // For now, assume INR - in future, fetch actual balance from provider endpoints
          balanceByCurrency['INR'] = balanceByCurrency['INR'] || 0;
        });

        // Set primary balance
        if (balanceByCurrency['INR']) {
          aggregatedStats.balance = balanceByCurrency['INR'];
          aggregatedStats.currency = 'INR';
        } else if (balanceByCurrency['USD']) {
          aggregatedStats.balance = balanceByCurrency['USD'];
          aggregatedStats.currency = 'USD';
        }

        // Format stats for display
        const formattedStats = formatStatsForDisplay(channelType, aggregatedStats, {
          Phone,
          MessageSquare,
          Wallet,
          CheckCircle,
          Mail,
          Zap,
          FileText,
        });

        setDynamicStats(formattedStats);
      }
    } catch (err) {
      console.error('Failed to fetch channel stats:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChannelStats();
  }, [pathname]);

  if (!currentSection) return null;

  // Find the active sub-menu item (most specific match - longest href)
  const activeItem = currentSection.items
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0];

  // Get page-specific stats or default stats
  const stats = dynamicStats ||
    pageStats[pathname] ||
    pageStats[activeItem?.href] || [
      {
        value: currentSection.items.length,
        label: 'Items',
        icon: Settings,
        bg: 'bg-blue-50',
        color: 'text-blue-600',
      },
      {
        value: '2',
        label: 'Active',
        icon: CheckCircle,
        bg: 'bg-green-50',
        color: 'text-green-600',
      },
    ];

  // Get page-specific actions
  const actions = pageActions[pathname] || pageActions[activeItem?.href] || [];

  const getActionIcon = (iconName) => {
    switch (iconName) {
      case 'plus':
        return Plus;
      case 'download':
        return DownloadIcon;
      case 'save':
        return Save;
      case 'shield':
        return ShieldIcon;
      case 'logout':
        return LogOut;
      default:
        return Plus;
    }
  };

  // Handle action button click
  const handleActionClick = (action) => {
    // For channel settings pages (WhatsApp, Email, SMS, Voice), navigate to available tab
    if (
      action.icon === 'plus' &&
      (pathname.startsWith('/settings/whatsapp') ||
        pathname.startsWith('/settings/email') ||
        pathname.startsWith('/settings/sms') ||
        pathname.startsWith('/settings/voice'))
    ) {
      router.push(`${pathname}?tab=available`);
    }
    // Add more action handlers here as needed
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="shrink-0 bg-white border-b border-gray-300 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-4">
            {/* Breadcrumb: Core Menu > Sub Menu */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">{currentSection.title}</span>
              {activeItem && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-700 font-medium">{activeItem.title}</span>
                </>
              )}
            </div>

            <div className="w-px h-4 bg-gray-300" />

            {/* Stats Boxes - Page Specific */}
            <div className="flex items-center gap-3">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={index}
                    className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg', stat.bg)}
                  >
                    <StatIcon className={cn('h-3.5 w-3.5', stat.color)} />
                    <span className={cn('text-sm font-semibold', stat.color)}>{stat.value}</span>
                    <span className="text-[10px] text-gray-400">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons - Icons Only */}
          <div className="flex items-center gap-1.5">
            {actions.map((action, index) => {
              const ActionIcon = getActionIcon(action.icon);
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleActionClick(action)}
                      className={cn(
                        'h-7 w-7 rounded-lg flex items-center justify-center transition-colors',
                        action.variant === 'outline'
                          ? 'border border-gray-300 hover:bg-gray-50 text-gray-600'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      )}
                    >
                      <ActionIcon className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {action.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={fetchChannelStats}
                  disabled={refreshing}
                  className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Refresh
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS SUB-MENU PANEL (List of items for selected section)
// ═══════════════════════════════════════════════════════════════════════════════
export function SettingsSubMenu() {
  const { currentSection, pathname } = useSettingsContext();
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  if (!currentSection) return null;

  return (
    <aside className="relative flex flex-col shrink-0 rounded-2xl w-[280px] bg-white shadow-sm overflow-hidden border border-gray-300">
      <nav
        className="flex-1 overflow-y-auto p-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
      >
        <div className="space-y-1">
          {currentSection.items.map((item) => {
            const active = isActive(item.href);
            const ItemIcon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                    active
                      ? 'bg-gray-100 text-brand shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center h-9 w-9 rounded-lg shrink-0',
                      item.color
                        ? active
                          ? 'bg-gray-50'
                          : item.bgColor
                        : active
                          ? 'bg-brand'
                          : 'bg-gray-100'
                    )}
                  >
                    <ItemIcon
                      className={cn(
                        'h-4 w-4',
                        item.color ? item.color : active ? 'text-white' : 'text-gray-500'
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium flex-1',
                      active ? 'text-brand' : 'text-gray-800'
                    )}
                  >
                    {item.title}
                  </span>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
