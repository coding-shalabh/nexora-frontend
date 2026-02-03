'use client';

/**
 * Email Channel Panel - Notion-style compact UI
 * Displays email accounts, shared inboxes, and settings
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Mail,
  Plus,
  ChevronRight,
  ChevronDown,
  Settings,
  Users,
  Inbox,
  Send,
  FileText,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Zap,
  Link2,
  Eye,
  MousePointer,
  Calendar,
  PenLine,
  Loader2,
  Star,
  Archive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEmailAccounts } from '@/hooks/use-email-accounts';
import { useRouter } from 'next/navigation';

// Provider icons with colors
const PROVIDERS = {
  gmail: { icon: '📧', color: 'text-red-500', bg: 'bg-red-50' },
  google: { icon: '📧', color: 'text-red-500', bg: 'bg-red-50' },
  outlook: { icon: '📨', color: 'text-blue-500', bg: 'bg-blue-50' },
  microsoft: { icon: '📨', color: 'text-blue-500', bg: 'bg-blue-50' },
  yahoo: { icon: '📬', color: 'text-purple-500', bg: 'bg-purple-50' },
  imap: { icon: '✉️', color: 'text-gray-500', bg: 'bg-gray-50' },
  default: { icon: '📩', color: 'text-gray-500', bg: 'bg-gray-50' },
};

function getProviderStyle(provider) {
  return PROVIDERS[provider?.toLowerCase()] || PROVIDERS.default;
}

// Compact row item (Notion-style)
function ListItem({ icon: Icon, emoji, label, count, badge, active, onClick, actions, className }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
        'hover:bg-accent/50',
        active && 'bg-accent',
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {emoji ? (
        <span className="text-sm w-5 text-center">{emoji}</span>
      ) : Icon ? (
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      ) : null}

      <span className="flex-1 text-sm truncate">{label}</span>

      {count !== undefined && (
        <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
      )}

      {badge && (
        <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
          {badge}
        </Badge>
      )}

      {actions && isHovered && <div className="flex items-center gap-0.5">{actions}</div>}
    </div>
  );
}

// Collapsible section (Notion-style)
function Section({ title, children, defaultOpen = true, action }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-0.5">
      <div
        className="flex items-center gap-1 px-2 py-1 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex-1">
          {title}
        </span>
        {action && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">{action}</div>
        )}
      </div>
      {isOpen && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}

// Email account row
function EmailAccountRow({ account, onManage }) {
  const style = getProviderStyle(account.provider);
  const isActive = account.status === 'ACTIVE';

  return (
    <div className="group flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/50 transition-colors">
      <div
        className={cn('w-8 h-8 rounded-md flex items-center justify-center text-base', style.bg)}
      >
        {style.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">{account.email}</span>
          {account.isDefault && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="capitalize">{account.provider}</span>
          {isActive ? (
            <span className="flex items-center gap-0.5 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-red-500">
              <AlertCircle className="h-3 w-3" />
              Error
            </span>
          )}
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sync Now</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onManage?.(account)}>
              <Users className="h-4 w-4 mr-2" />
              Share Access
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Archive className="h-4 w-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Feature card for empty state
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// Main component
export function EmailChannelPanel({ onClose }) {
  const router = useRouter();
  const { data: accounts = [], isLoading } = useEmailAccounts();
  const [activeView, setActiveView] = useState('overview');

  const connectedCount = accounts.filter((a) => a.status === 'ACTIVE').length;
  const hasAccounts = accounts.length > 0;

  const goToSettings = () => router.push('/settings/email');
  const goToTemplates = () => router.push('/inbox/templates');
  const goToSequences = () => router.push('/inbox/sequences');

  // Stats
  const stats = {
    sent: 156,
    received: 432,
    openRate: 68,
    responseRate: 42,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold">Email</h2>
                <p className="text-xs text-muted-foreground">
                  {hasAccounts
                    ? `${connectedCount} account${connectedCount !== 1 ? 's' : ''} connected`
                    : 'Not configured'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToSettings}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={goToSettings}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2">
          {hasAccounts ? (
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-2 px-2">
                <div className="text-center p-2 rounded-lg bg-accent/30">
                  <p className="text-lg font-semibold">{stats.sent}</p>
                  <p className="text-[10px] text-muted-foreground">Sent</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-accent/30">
                  <p className="text-lg font-semibold">{stats.received}</p>
                  <p className="text-[10px] text-muted-foreground">Received</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-accent/30">
                  <p className="text-lg font-semibold">{stats.openRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Open Rate</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-accent/30">
                  <p className="text-lg font-semibold">{stats.responseRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Response</p>
                </div>
              </div>

              {/* Connected Accounts */}
              <Section
                title="Accounts"
                action={
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={goToSettings}>
                    <Plus className="h-3 w-3" />
                  </Button>
                }
              >
                {accounts.map((account) => (
                  <EmailAccountRow key={account.id} account={account} />
                ))}
              </Section>

              {/* Shared Inboxes */}
              <Section
                title="Shared Inboxes"
                action={
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={goToSettings}>
                    <Plus className="h-3 w-3" />
                  </Button>
                }
              >
                <ListItem emoji="📥" label="Support" badge="Coming Soon" onClick={() => {}} />
                <ListItem emoji="💼" label="Sales" badge="Coming Soon" onClick={() => {}} />
              </Section>

              {/* Email Tools */}
              <Section title="Tools">
                <ListItem icon={FileText} label="Templates" count={12} onClick={goToTemplates} />
                <ListItem icon={Zap} label="Sequences" count={3} onClick={goToSequences} />
                <ListItem
                  icon={PenLine}
                  label="Signatures"
                  onClick={() => router.push('/settings/signatures')}
                />
                <ListItem
                  icon={BarChart2}
                  label="Analytics"
                  onClick={() => router.push('/inbox/analytics')}
                />
              </Section>

              {/* Email Settings */}
              <Section title="Settings" defaultOpen={false}>
                <ListItem icon={Eye} label="Email Tracking" badge="On" onClick={goToSettings} />
                <ListItem icon={Clock} label="Send Later" onClick={goToSettings} />
                <ListItem icon={Link2} label="Link to CRM" badge="Auto" onClick={goToSettings} />
              </Section>
            </div>
          ) : (
            /* Empty State */
            <div className="space-y-4 p-2">
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Connect Your Email</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send and receive emails directly from your CRM
                </p>
                <Button onClick={goToSettings}>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Email Account
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground px-2">Features</p>
                <FeatureCard
                  icon={Inbox}
                  title="Unified Inbox"
                  description="All your emails in one place"
                />
                <FeatureCard
                  icon={Eye}
                  title="Email Tracking"
                  description="Know when emails are opened"
                />
                <FeatureCard
                  icon={Link2}
                  title="CRM Integration"
                  description="Auto-link to contacts & deals"
                />
                <FeatureCard
                  icon={Sparkles}
                  title="AI Assistance"
                  description="Smart replies & suggestions"
                />
              </div>

              <div className="text-center pt-2">
                <Button variant="link" size="sm" onClick={goToSettings}>
                  Learn more about email features
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {hasAccounts && (
          <div className="px-4 py-3 border-t bg-accent/20">
            <Button variant="outline" className="w-full justify-center" onClick={goToSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Email Settings
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export default EmailChannelPanel;
