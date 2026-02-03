/**
 * Fixed Menu Configuration for all sidebar modules
 *
 * Based on UI principles and competitor analysis (HubSpot, Zoho, Salesforce, Pipedrive)
 *
 * Design Pattern:
 * - Fixed Actions: Always visible at top (Add, Import, Export)
 * - Modules: Tab-like navigation between related modules
 * - Quick Filters: Radio - One active at a time (All, Mine, Recent)
 * - Multi-Filters: Checkbox - Combinable (Status, Source, Type)
 * - Toggle Filters: Switch - Binary options (Hide Completed)
 * - Tools/Settings: Bottom section - Management & config
 */

import {
  // Actions
  Plus,
  Upload,
  Download,
  UserPlus,
  Send,
  RefreshCw,

  // Navigation
  Users,
  Building2,
  Activity,
  Layers,
  Target,
  Kanban,
  FileText,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  CheckSquare,
  Clock,
  AlertTriangle,
  AlertCircle,
  Trophy,
  XCircle,
  Star,
  Eye,

  // Tools
  Tag,
  Settings,
  BarChart3,
  TrendingUp,
  Copy,
  Zap,
  Bot,
  Workflow,
  Megaphone,
  Gift,
  CreditCard,
  Receipt,
  Package,
  ShoppingCart,
  Ticket,
  HelpCircle,
  FolderKanban,
  ListTodo,
  PieChart,
  Gauge,
  LayoutDashboard,
  Smartphone,
} from 'lucide-react';

// ============================================================================
// INBOX HUB - Task-First Design
// ============================================================================
export const inboxFixedMenu = {
  pageKey: 'inbox',

  // Fixed Actions (Always Visible - Top)
  fixedActions: [{ id: 'compose', label: 'Compose', icon: Send, variant: 'default' }],

  // Views (Primary Navigation - Radio)
  views: [
    { id: 'all', label: 'All', count: true },
    { id: 'unread', label: 'Unread', count: true },
    { id: 'mine', label: 'Assigned to Me', count: true },
    { id: 'unassigned', label: 'Unassigned', count: true },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'snoozed', label: 'Snoozed', icon: Clock },
  ],

  // Channels (Checkbox - Multi-select, default all checked)
  channels: [
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: '#25d366' },
    { id: 'email', label: 'Email', icon: Mail, color: '#ea4335' },
    { id: 'sms', label: 'SMS', icon: Smartphone, color: '#6b7280' },
  ],

  // Status Filter (Radio)
  statusFilters: [
    { id: 'all', label: 'All Status' },
    { id: 'open', label: 'Open' },
    { id: 'pending', label: 'Pending' },
    { id: 'snoozed', label: 'Snoozed' },
    { id: 'resolved', label: 'Resolved' },
  ],

  // Tools (Bottom Section)
  tools: [
    { id: 'templates', label: 'Templates', icon: FileText, href: '/inbox/templates' },
    { id: 'canned', label: 'Canned Responses', icon: MessageSquare, href: '/inbox/canned' },
    { id: 'broadcasts', label: 'Broadcasts', icon: Megaphone, href: '/inbox/broadcasts' },
    { id: 'sequences', label: 'Sequences', icon: Workflow, href: '/inbox/sequences' },
  ],

  viewModes: ['list'],
};

// ============================================================================
// CRM HUB - Contact Management
// ============================================================================
export const crmFixedMenu = {
  pageKey: 'crm',

  // Fixed Actions (Always Visible - Top)
  fixedActions: [
    { id: 'add', label: 'Add Contact', icon: UserPlus, variant: 'default' },
    { id: 'import', label: 'Import', icon: Upload, variant: 'outline' },
    { id: 'export', label: 'Export', icon: Download, variant: 'outline' },
  ],

  // Modules (Tab-like navigation)
  modules: [
    { id: 'contacts', label: 'Contacts', icon: Users, href: '/crm/contacts', count: true },
    { id: 'companies', label: 'Companies', icon: Building2, href: '/crm/companies', count: true },
    { id: 'activities', label: 'Activities', icon: Activity, href: '/crm/activities' },
  ],

  // Quick Filters (Radio - One active)
  quickFilters: [
    { id: 'all', label: 'All' },
    { id: 'mine', label: 'My Contacts' },
    { id: 'recent', label: 'Recently Added' },
    { id: 'contacted', label: 'Recently Contacted' },
    { id: 'inactive', label: 'No Activity (30+ days)', icon: AlertCircle },
  ],

  // Lifecycle Stage Filter (Checkbox - Multi-select)
  lifecycleFilters: [
    { id: 'subscriber', label: 'Subscriber', color: 'bg-slate-100 text-slate-700' },
    { id: 'lead', label: 'Lead', color: 'bg-blue-100 text-blue-700' },
    { id: 'mql', label: 'MQL', color: 'bg-cyan-100 text-cyan-700' },
    { id: 'sql', label: 'SQL', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'opportunity', label: 'Opportunity', color: 'bg-purple-100 text-purple-700' },
    { id: 'customer', label: 'Customer', color: 'bg-green-100 text-green-700' },
  ],

  // Source Filter (Checkbox - Multi-select)
  sourceFilters: [
    { id: 'website', label: 'Website' },
    { id: 'referral', label: 'Referral' },
    { id: 'social', label: 'Social Media' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'cold_call', label: 'Cold Call' },
    { id: 'event', label: 'Event/Trade Show' },
  ],

  // Management Tools (Bottom)
  tools: [
    { id: 'segments', label: 'Segments', icon: Layers, href: '/crm/segments' },
    { id: 'tags', label: 'Tags', icon: Tag, href: '/crm/tags' },
    { id: 'fields', label: 'Custom Fields', icon: Settings, href: '/crm/fields' },
    { id: 'duplicates', label: 'Duplicates', icon: Copy, href: '/crm/contacts/duplicates' },
  ],

  viewModes: ['list', 'grid', 'table'],
};

// CRM Activities Sub-Module
export const crmActivitiesFixedMenu = {
  pageKey: 'crm.activities',

  // Fixed Actions
  fixedActions: [{ id: 'log', label: 'Log Activity', icon: Plus, variant: 'default' }],

  // Activity Types (Checkbox - Multi-select)
  activityTypes: [
    { id: 'all', label: 'All', icon: null },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'emails', label: 'Emails', icon: Mail },
  ],

  // Status Filter (Radio)
  statusFilters: [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'overdue', label: 'Overdue', color: 'text-red-600' },
  ],

  // Date Range Filter (Radio)
  dateFilters: [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ],

  // Toggle Filters
  toggleFilters: [{ id: 'hideCompleted', label: 'Hide Completed', defaultValue: false }],

  viewModes: ['list', 'timeline'],
};

// ============================================================================
// PIPELINE HUB - Deal Management
// ============================================================================
export const pipelineFixedMenu = {
  pageKey: 'pipeline',

  // Fixed Actions (Always Visible - Top)
  fixedActions: [
    { id: 'add', label: 'Add Deal', icon: Plus, variant: 'default' },
    { id: 'import', label: 'Import', icon: Upload, variant: 'outline' },
    { id: 'export', label: 'Export', icon: Download, variant: 'outline' },
  ],

  // Pipelines (Selectable - Shows different Kanban boards)
  pipelines: [
    { id: 'sales', label: 'Sales Pipeline', isDefault: true },
    { id: 'enterprise', label: 'Enterprise' },
    { id: 'partners', label: 'Partners' },
  ],

  // Quick Filters (Radio - One active)
  quickFilters: [
    { id: 'all', label: 'All Deals' },
    { id: 'mine', label: 'My Deals' },
    { id: 'closing', label: 'Closing Soon', icon: Clock },
    { id: 'stale', label: 'Stale (>30 days)', icon: AlertTriangle },
    { id: 'won', label: 'Won', icon: Trophy },
    { id: 'lost', label: 'Lost', icon: XCircle },
  ],

  // Value Range Filter (Radio)
  valueFilters: [
    { id: 'all', label: 'All Values' },
    { id: 'small', label: '< ₹1L' },
    { id: 'medium', label: '₹1L - ₹5L' },
    { id: 'large', label: '₹5L - ₹10L' },
    { id: 'enterprise', label: '> ₹10L' },
  ],

  // Close Date Filter (Radio)
  dateFilters: [
    { id: 'all', label: 'All Time' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'overdue', label: 'Overdue', color: 'text-red-600' },
  ],

  // Tools (Bottom)
  tools: [
    { id: 'forecast', label: 'Forecast', icon: TrendingUp, href: '/pipeline/forecast' },
    { id: 'reports', label: 'Reports', icon: BarChart3, href: '/pipeline/reports' },
    { id: 'settings', label: 'Pipeline Settings', icon: Settings, href: '/pipeline/settings' },
  ],

  viewModes: ['kanban', 'list', 'table', 'forecast'],
};

// Pipeline Leads Sub-Module
export const pipelineLeadsFixedMenu = {
  pageKey: 'pipeline.leads',

  // Fixed Actions
  fixedActions: [
    { id: 'add', label: 'Add Lead', icon: Plus, variant: 'default' },
    { id: 'import', label: 'Import', icon: Upload, variant: 'outline' },
    { id: 'export', label: 'Export', icon: Download, variant: 'outline' },
  ],

  // Quick Filters (Radio)
  quickFilters: [
    { id: 'all', label: 'All Leads' },
    { id: 'mine', label: 'My Leads' },
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'unqualified', label: 'Unqualified' },
  ],

  // Source Filter (Checkbox)
  sourceFilters: [
    { id: 'website', label: 'Website' },
    { id: 'referral', label: 'Referral' },
    { id: 'social', label: 'Social Media' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'cold_call', label: 'Cold Call' },
  ],

  // Tools
  tools: [
    { id: 'convert', label: 'Bulk Convert', icon: Target },
    { id: 'assign', label: 'Bulk Assign', icon: Users },
  ],

  viewModes: ['list', 'kanban'],
};

// ============================================================================
// SERVICE HUB - Tickets & Support
// ============================================================================
export const serviceFixedMenu = {
  pageKey: 'service',

  // Fixed Actions
  fixedActions: [{ id: 'create', label: 'Create Ticket', icon: Plus, variant: 'default' }],

  // Modules
  modules: [
    { id: 'tickets', label: 'Tickets', icon: Ticket, href: '/service/tickets', count: true },
    { id: 'kb', label: 'Knowledge Base', icon: HelpCircle, href: '/service/kb' },
  ],

  // Quick Filters (Radio)
  quickFilters: [
    { id: 'all', label: 'All Tickets' },
    { id: 'mine', label: 'Assigned to Me' },
    { id: 'unassigned', label: 'Unassigned' },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle },
  ],

  // Status Filter (Checkbox)
  statusFilters: [
    { id: 'open', label: 'Open', color: 'bg-blue-100 text-blue-700' },
    { id: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-700' },
    { id: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-700' },
  ],

  // Priority Filter (Checkbox)
  priorityFilters: [
    { id: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
  ],

  // Tools
  tools: [
    { id: 'sla', label: 'SLA Policies', icon: Clock, href: '/service/slas' },
    { id: 'portal', label: 'Customer Portal', icon: Eye, href: '/service/portal' },
  ],

  viewModes: ['list', 'kanban'],
};

// ============================================================================
// MARKETING HUB
// ============================================================================
export const marketingFixedMenu = {
  pageKey: 'marketing',

  // Fixed Actions
  fixedActions: [{ id: 'create', label: 'Create Campaign', icon: Plus, variant: 'default' }],

  // Modules
  modules: [
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, href: '/marketing/campaigns' },
    { id: 'email', label: 'Email', icon: Mail, href: '/marketing/email' },
    { id: 'sms', label: 'SMS', icon: Smartphone, href: '/marketing/sms' },
    { id: 'social', label: 'Social', icon: MessageSquare, href: '/marketing/social' },
  ],

  // Quick Filters
  quickFilters: [
    { id: 'all', label: 'All Campaigns' },
    { id: 'active', label: 'Active' },
    { id: 'draft', label: 'Draft' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'completed', label: 'Completed' },
  ],

  // Tools
  tools: [
    { id: 'forms', label: 'Forms', icon: FileText, href: '/marketing/forms' },
    { id: 'pages', label: 'Landing Pages', icon: LayoutDashboard, href: '/marketing/pages' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/marketing/analytics' },
  ],

  viewModes: ['grid', 'list'],
};

// ============================================================================
// COMMERCE HUB
// ============================================================================
export const commerceFixedMenu = {
  pageKey: 'commerce',

  // Fixed Actions
  fixedActions: [
    { id: 'add', label: 'Add Product', icon: Plus, variant: 'default' },
    { id: 'order', label: 'New Order', icon: ShoppingCart, variant: 'outline' },
  ],

  // Modules
  modules: [
    { id: 'products', label: 'Products', icon: Package, href: '/commerce/products', count: true },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/commerce/orders', count: true },
    { id: 'invoices', label: 'Invoices', icon: Receipt, href: '/commerce/invoices' },
    { id: 'payments', label: 'Payments', icon: CreditCard, href: '/commerce/payments' },
  ],

  // Quick Filters
  quickFilters: [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'draft', label: 'Draft' },
    { id: 'outOfStock', label: 'Out of Stock', icon: AlertTriangle },
  ],

  // Tools
  tools: [
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: RefreshCw,
      href: '/commerce/subscriptions',
    },
    { id: 'links', label: 'Payment Links', icon: CreditCard, href: '/commerce/payment-links' },
  ],

  viewModes: ['grid', 'list', 'table'],
};

// ============================================================================
// PROJECTS HUB
// ============================================================================
export const projectsFixedMenu = {
  pageKey: 'projects',

  // Fixed Actions
  fixedActions: [
    { id: 'create', label: 'New Project', icon: Plus, variant: 'default' },
    { id: 'task', label: 'Add Task', icon: CheckSquare, variant: 'outline' },
  ],

  // Modules
  modules: [
    { id: 'projects', label: 'Projects', icon: FolderKanban, href: '/projects' },
    { id: 'tasks', label: 'My Tasks', icon: ListTodo, href: '/projects/tasks' },
  ],

  // Quick Filters
  quickFilters: [
    { id: 'all', label: 'All Projects' },
    { id: 'active', label: 'Active' },
    { id: 'myProjects', label: 'My Projects' },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle },
    { id: 'completed', label: 'Completed' },
  ],

  // Tools
  tools: [
    { id: 'reports', label: 'Reports', icon: BarChart3, href: '/projects/reports' },
    { id: 'templates', label: 'Templates', icon: FileText, href: '/projects/templates' },
  ],

  viewModes: ['grid', 'list', 'kanban', 'timeline'],
};

// ============================================================================
// ANALYTICS HUB
// ============================================================================
export const analyticsFixedMenu = {
  pageKey: 'analytics',

  // Fixed Actions
  fixedActions: [
    { id: 'create', label: 'New Dashboard', icon: Plus, variant: 'default' },
    { id: 'export', label: 'Export', icon: Download, variant: 'outline' },
  ],

  // Modules
  modules: [
    { id: 'dashboards', label: 'Dashboards', icon: LayoutDashboard, href: '/analytics/dashboards' },
    { id: 'reports', label: 'Reports', icon: BarChart3, href: '/analytics/reports' },
    { id: 'website', label: 'Website', icon: PieChart, href: '/analytics/website' },
  ],

  // Quick Filters
  quickFilters: [
    { id: 'all', label: 'All' },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'recent', label: 'Recently Viewed' },
  ],

  // Date Range (Radio)
  dateFilters: [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'custom', label: 'Custom' },
  ],

  // Tools
  tools: [
    { id: 'goals', label: 'Goals', icon: Target, href: '/analytics/goals' },
    { id: 'kpis', label: 'KPIs', icon: Gauge, href: '/analytics/kpis' },
  ],

  viewModes: ['grid', 'list'],
};

// ============================================================================
// AUTOMATION HUB
// ============================================================================
export const automationFixedMenu = {
  pageKey: 'automation',

  // Fixed Actions
  fixedActions: [{ id: 'create', label: 'Create Workflow', icon: Plus, variant: 'default' }],

  // Modules
  modules: [
    { id: 'workflows', label: 'Workflows', icon: Workflow, href: '/automation/workflows' },
    { id: 'sequences', label: 'Sequences', icon: RefreshCw, href: '/automation/sequences' },
    { id: 'scoring', label: 'Lead Scoring', icon: Target, href: '/automation/scoring' },
    { id: 'agents', label: 'AI Agents', icon: Bot, href: '/automation/agents' },
  ],

  // Quick Filters
  quickFilters: [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'paused', label: 'Paused' },
    { id: 'draft', label: 'Draft' },
  ],

  // Tools
  tools: [
    { id: 'templates', label: 'Templates', icon: FileText, href: '/automation/templates' },
    { id: 'logs', label: 'Execution Logs', icon: Activity, href: '/automation/logs' },
  ],

  viewModes: ['grid', 'list'],
};

// ============================================================================
// SETTINGS HUB
// ============================================================================
export const settingsFixedMenu = {
  pageKey: 'settings',

  // No Fixed Actions for Settings

  // Modules (Grouped settings)
  modules: [
    { id: 'profile', label: 'Profile', icon: Users, href: '/settings/profile' },
    { id: 'organization', label: 'Organization', icon: Building2, href: '/settings/organization' },
    { id: 'users', label: 'Users & Teams', icon: Users, href: '/settings/users' },
    { id: 'channels', label: 'Channels', icon: MessageSquare, href: '/settings/channels' },
    { id: 'security', label: 'Security', icon: Settings, href: '/settings/security' },
  ],

  // Tools
  tools: [
    { id: 'api', label: 'API Keys', icon: Settings, href: '/settings/api-keys' },
    { id: 'webhooks', label: 'Webhooks', icon: Zap, href: '/settings/webhooks' },
    { id: 'billing', label: 'Subscription', icon: CreditCard, href: '/settings/subscription' },
  ],

  viewModes: ['list'],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get fixed menu configuration by page key
 */
export const getFixedMenu = (pageKey) => {
  const menus = {
    inbox: inboxFixedMenu,
    crm: crmFixedMenu,
    'crm.contacts': crmFixedMenu,
    'crm.companies': crmFixedMenu,
    'crm.activities': crmActivitiesFixedMenu,
    pipeline: pipelineFixedMenu,
    'pipeline.deals': pipelineFixedMenu,
    'pipeline.leads': pipelineLeadsFixedMenu,
    service: serviceFixedMenu,
    'service.tickets': serviceFixedMenu,
    marketing: marketingFixedMenu,
    commerce: commerceFixedMenu,
    projects: projectsFixedMenu,
    analytics: analyticsFixedMenu,
    automation: automationFixedMenu,
    settings: settingsFixedMenu,
  };
  return menus[pageKey] || null;
};

/**
 * Export all fixed menus
 */
export const allFixedMenus = {
  inboxFixedMenu,
  crmFixedMenu,
  crmActivitiesFixedMenu,
  pipelineFixedMenu,
  pipelineLeadsFixedMenu,
  serviceFixedMenu,
  marketingFixedMenu,
  commerceFixedMenu,
  projectsFixedMenu,
  analyticsFixedMenu,
  automationFixedMenu,
  settingsFixedMenu,
};
