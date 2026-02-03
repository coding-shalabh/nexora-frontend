'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Building2,
  Users,
  Shield,
  Link2,
  Mail,
  MessageSquare,
  FileText,
  Inbox,
  FileSignature,
  MessagesSquare,
  SlidersHorizontal,
  GitBranch,
  Tags,
  Key,
  AlertTriangle,
  History,
  Webhook,
  Puzzle,
  CreditCard,
  Wallet,
  ChevronRight,
  Search,
  Palette,
  Bell,
  Phone,
  Lock,
  Globe,
  Database,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// WhatsApp icon
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const settingsCategories = [
  {
    id: 'account',
    title: 'Account',
    description: 'Your personal settings',
    icon: User,
    color: 'from-blue-500 to-indigo-500',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        icon: User,
        href: '/settings/profile',
        description: 'Personal information and avatar'
      },
      {
        id: 'preferences',
        label: 'Preferences',
        icon: Palette,
        href: '/settings/preferences',
        description: 'Theme, language, and display options'
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        href: '/settings/notifications',
        description: 'Email and push notification settings'
      },
    ]
  },
  {
    id: 'organization',
    title: 'Organization',
    description: 'Workspace settings',
    icon: Building2,
    color: 'from-emerald-500 to-teal-500',
    items: [
      {
        id: 'organization',
        label: 'Company Info',
        icon: Building2,
        href: '/settings/organization',
        description: 'Company details and branding'
      },
      {
        id: 'users',
        label: 'Users & Teams',
        icon: Users,
        href: '/settings/users',
        description: 'Manage team members and groups'
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        icon: Shield,
        href: '/settings/roles',
        description: 'Access control and permissions'
      },
    ]
  },
  {
    id: 'channels',
    title: 'Channels',
    description: 'Communication channels',
    icon: Link2,
    color: 'from-green-500 to-emerald-500',
    items: [
      {
        id: 'channels',
        label: 'All Channels',
        icon: Link2,
        href: '/settings/channels',
        description: 'Connected communication channels'
      },
      {
        id: 'email',
        label: 'Email',
        icon: Mail,
        href: '/settings/email',
        description: 'Email accounts and SMTP settings'
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        icon: WhatsAppIcon,
        href: '/settings/whatsapp',
        description: 'WhatsApp Business API connection'
      },
      {
        id: 'templates',
        label: 'Templates',
        icon: FileText,
        href: '/settings/templates',
        description: 'Message and email templates'
      },
      {
        id: 'dlt',
        label: 'DLT Compliance',
        icon: Shield,
        href: '/settings/dlt',
        description: 'SMS DLT registration (India)',
        badge: 'India'
      },
    ]
  },
  {
    id: 'inbox',
    title: 'Inbox',
    description: 'Inbox configuration',
    icon: Inbox,
    color: 'from-purple-500 to-pink-500',
    items: [
      {
        id: 'inbox',
        label: 'Inbox Settings',
        icon: Inbox,
        href: '/settings/inbox',
        description: 'Auto-assignment and SLA rules'
      },
      {
        id: 'signatures',
        label: 'Signatures',
        icon: FileSignature,
        href: '/settings/signatures',
        description: 'Email and message signatures'
      },
      {
        id: 'widget',
        label: 'Chat Widget',
        icon: MessagesSquare,
        href: '/settings/widget',
        description: 'Website chat widget settings'
      },
    ]
  },
  {
    id: 'configuration',
    title: 'Configuration',
    description: 'CRM customization',
    icon: SlidersHorizontal,
    color: 'from-orange-500 to-amber-500',
    items: [
      {
        id: 'custom-fields',
        label: 'Custom Fields',
        icon: SlidersHorizontal,
        href: '/settings/custom-fields',
        description: 'Create custom data fields'
      },
      {
        id: 'pipelines',
        label: 'Pipelines',
        icon: GitBranch,
        href: '/pipeline/settings',
        description: 'Deal and lead pipeline stages'
      },
      {
        id: 'tags',
        label: 'Tags',
        icon: Tags,
        href: '/settings/tags',
        description: 'Organize records with tags'
      },
    ]
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'Security settings',
    icon: Lock,
    color: 'from-red-500 to-rose-500',
    items: [
      {
        id: 'security',
        label: 'Security',
        icon: Lock,
        href: '/settings/security/access',
        description: 'Password and login settings'
      },
      {
        id: 'compliance',
        label: 'Compliance',
        icon: AlertTriangle,
        href: '/settings/compliance',
        description: 'GDPR, opt-outs, and consent'
      },
      {
        id: 'audit',
        label: 'Audit Logs',
        icon: History,
        href: '/settings/security/audit',
        description: 'Activity and change history',
        badge: 'Pro'
      },
    ]
  },
  {
    id: 'developer',
    title: 'Developer',
    description: 'API and integrations',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    items: [
      {
        id: 'api-keys',
        label: 'API Keys',
        icon: Key,
        href: '/settings/api-keys',
        description: 'Generate and manage API keys',
        badge: 'Pro'
      },
      {
        id: 'webhooks',
        label: 'Webhooks',
        icon: Webhook,
        href: '/settings/webhooks',
        description: 'Real-time event notifications',
        badge: 'Pro'
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: Puzzle,
        href: '/settings/integrations',
        description: 'Third-party app connections'
      },
    ]
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'Subscription and payments',
    icon: CreditCard,
    color: 'from-cyan-500 to-blue-500',
    items: [
      {
        id: 'subscription',
        label: 'Subscription',
        icon: CreditCard,
        href: '/settings/subscription',
        description: 'Plan and billing details'
      },
      {
        id: 'wallet',
        label: 'Wallet',
        icon: Wallet,
        href: '/settings/wallet',
        description: 'Credits and payment history'
      },
    ]
  },
];

function SettingsCard({ item, onClick }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
    >
      <Card
        className="cursor-pointer hover:shadow-md transition-all group h-full"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {item.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SettingsHubPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search
  const filteredCategories = settingsCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account, organization, and application settings
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search settings..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-muted-foreground">My Account</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Link2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-muted-foreground">Channels</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Team Members</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Puzzle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Integrations</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Categories */}
      <div className="space-y-8">
        {filteredCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br', category.color)}>
                  <CategoryIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{category.title}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item, itemIndex) => (
                  <SettingsCard
                    key={item.id}
                    item={item}
                    onClick={() => router.push(item.href)}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* No Results */}
      {searchQuery && filteredCategories.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-medium mb-2">No settings found</h3>
          <p className="text-sm text-muted-foreground">
            Try searching with different keywords
          </p>
        </Card>
      )}
    </div>
  );
}
