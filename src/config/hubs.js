/**
 * Nexora Hub Configuration
 *
 * Complete Business OS with 11 Hubs + Core Layer
 * Each hub's availability is based on subscription plan
 */

import {
  // Core icons
  Home,
  Inbox,
  FileSignature,
  Calendar,
  CheckSquare,
  FolderOpen,
  Search,
  Bell,

  // Sales icons
  TrendingUp,
  Users,
  Building2,
  Kanban,
  Target,
  FileText,
  Phone,
  GraduationCap,
  Repeat,
  BookOpen,

  // Marketing icons
  Megaphone,
  Mail,
  MessageSquare,
  Share2,
  MousePointer,
  FileCode,
  CalendarDays,

  // Service icons
  HeadphonesIcon,
  Ticket,
  HelpCircle,
  Clock,
  Star,
  MessagesSquare,

  // Commerce icons
  ShoppingCart,
  Package,
  CreditCard,
  Receipt,
  Link2,
  RefreshCw,

  // Projects icons
  FolderKanban,
  ListTodo,
  GanttChart,
  Timer,
  Milestone,
  LayoutGrid,

  // HR icons
  UserCircle,
  Briefcase,
  CalendarCheck,
  Wallet,
  Award,
  GraduationCap as Training,
  UserMinus,
  ClipboardList,

  // Finance icons
  Landmark,
  Calculator,
  PiggyBank,
  ArrowDownUp,
  FileSpreadsheet,
  Coins,
  TrendingDown,

  // Inventory icons
  Warehouse,
  PackageSearch,
  Truck,
  ClipboardCheck,
  BarChart3,

  // Analytics icons
  PieChart,
  LineChart,
  Goal,
  Gauge,
  LayoutDashboard,

  // Automation icons
  Zap,
  Workflow,
  Bot,
  Sparkles,
  GitBranch,

  // Settings icons
  SlidersHorizontal,
  Settings,
  Shield,
  Key,
  Database,
  History,
  Tags,
  Puzzle,
  User,
  Palette,
  Webhook,
  AlertTriangle,
} from 'lucide-react';

// Subscription Plans
export const PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
};

// Core Layer - Cross-functional features (not hub-based)
export const CORE_FEATURES = {
  HOME: {
    id: 'home',
    name: 'Home',
    path: '/home',
    icon: Home,
    description: 'Dashboard & activity feed',
  },
  INBOX: {
    id: 'inbox',
    name: 'Inbox',
    path: '/inbox',
    icon: Inbox,
    description: 'Unified communication',
  },
  CALENDAR: {
    id: 'calendar',
    name: 'Calendar',
    path: '/calendar',
    icon: Calendar,
    description: 'Meetings & events',
  },
  TASKS: {
    id: 'tasks',
    name: 'Tasks',
    path: '/tasks',
    icon: CheckSquare,
    description: 'Cross-functional tasks',
  },
  FILES: {
    id: 'files',
    name: 'Files',
    path: '/files',
    icon: FolderOpen,
    description: 'Documents & storage',
  },
  NOTIFICATIONS: {
    id: 'notifications',
    name: 'Notifications',
    path: '/notifications',
    icon: Bell,
    description: 'All notifications',
  },
};

// Hub Definitions
export const HUBS = {
  SALES: {
    id: 'sales',
    name: 'Sales Hub',
    shortName: 'Sales',
    description: 'CRM, pipeline & revenue',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    basePath: '/sales',
    requiredPlan: PLANS.FREE,
    features: [
      { name: 'Overview', path: '/sales', icon: TrendingUp },
      { name: 'Contacts', path: '/crm/contacts', icon: Users, shared: true },
      { name: 'Companies', path: '/crm/companies', icon: Building2, shared: true },
      { name: 'Deals', path: '/pipeline/deals', icon: Kanban },
      { name: 'Leads', path: '/pipeline/leads', icon: Target },
      { name: 'Quotes', path: '/sales/quotes', icon: FileText },
      { name: 'Meetings', path: '/sales/meetings', icon: Calendar },
      { name: 'Calls', path: '/sales/calls', icon: Phone },
      {
        name: 'Sequences',
        path: '/sales/sequences',
        icon: Repeat,
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Playbooks',
        path: '/sales/playbooks',
        icon: BookOpen,
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Forecast',
        path: '/sales/forecast',
        icon: TrendingUp,
        requiredPlan: PLANS.PROFESSIONAL,
      },
      { name: 'Reports', path: '/sales/reports', icon: BarChart3 },
    ],
  },

  MARKETING: {
    id: 'marketing',
    name: 'Marketing Hub',
    shortName: 'Marketing',
    description: 'Campaigns & lead generation',
    icon: Megaphone,
    color: 'from-pink-500 to-rose-500',
    basePath: '/marketing',
    requiredPlan: PLANS.STARTER,
    features: [
      { name: 'Overview', path: '/marketing', icon: Megaphone },
      { name: 'Broadcasts', path: '/marketing/broadcasts', icon: Megaphone },
      { name: 'Campaigns', path: '/marketing/campaigns', icon: Megaphone },
      { name: 'Email', path: '/marketing/email', icon: Mail },
      {
        name: 'SMS',
        path: '/marketing/sms',
        icon: MessageSquare,
        requiredPlan: PLANS.PROFESSIONAL,
      },
      { name: 'Social', path: '/marketing/social', icon: Share2, requiredPlan: PLANS.PROFESSIONAL },
      { name: 'Ads', path: '/marketing/ads', icon: MousePointer, requiredPlan: PLANS.PROFESSIONAL },
      { name: 'Landing Pages', path: '/marketing/pages', icon: FileText },
      { name: 'Forms', path: '/marketing/forms', icon: FileCode },
      { name: 'CTAs', path: '/marketing/ctas', icon: MousePointer },
      { name: 'Events', path: '/marketing/events', icon: CalendarDays },
      { name: 'Segments', path: '/marketing/segments', icon: Users },
      { name: 'Analytics', path: '/marketing/analytics', icon: BarChart3 },
    ],
  },

  SERVICE: {
    id: 'service',
    name: 'Service Hub',
    shortName: 'Service',
    description: 'Support & customer success',
    icon: HeadphonesIcon,
    color: 'from-orange-500 to-amber-500',
    basePath: '/service',
    requiredPlan: PLANS.STARTER,
    features: [
      { name: 'Overview', path: '/service', icon: HeadphonesIcon },
      { name: 'Tickets', path: '/service/tickets', icon: Ticket },
      { name: 'Live Chat', path: '/service/chat', icon: MessagesSquare },
      { name: 'Knowledge Base', path: '/service/kb', icon: BookOpen },
      {
        name: 'Customer Portal',
        path: '/service/portal',
        icon: Users,
        requiredPlan: PLANS.PROFESSIONAL,
      },
      { name: 'SLAs', path: '/service/slas', icon: Clock, requiredPlan: PLANS.PROFESSIONAL },
      { name: 'Surveys', path: '/service/surveys', icon: Star },
      { name: 'Reports', path: '/service/reports', icon: BarChart3 },
    ],
  },

  COMMERCE: {
    id: 'commerce',
    name: 'Commerce Hub',
    shortName: 'Commerce',
    description: 'Billing, payments & orders',
    icon: ShoppingCart,
    color: 'from-cyan-500 to-blue-500',
    basePath: '/commerce',
    requiredPlan: PLANS.PROFESSIONAL,
    features: [
      { name: 'Overview', path: '/commerce', icon: ShoppingCart },
      { name: 'Products', path: '/commerce/products', icon: Package },
      { name: 'Orders', path: '/commerce/orders', icon: ClipboardCheck },
      { name: 'Invoices', path: '/commerce/invoices', icon: Receipt },
      { name: 'Payments', path: '/commerce/payments', icon: CreditCard },
      {
        name: 'Subscriptions',
        path: '/commerce/subscriptions',
        icon: RefreshCw,
        requiredPlan: PLANS.ENTERPRISE,
      },
      { name: 'Payment Links', path: '/commerce/payment-links', icon: Link2 },
      { name: 'Reports', path: '/commerce/reports', icon: BarChart3 },
    ],
  },

  PROJECTS: {
    id: 'projects',
    name: 'Projects Hub',
    shortName: 'Projects',
    description: 'Project & work management',
    icon: FolderKanban,
    color: 'from-violet-500 to-purple-500',
    basePath: '/projects',
    requiredPlan: PLANS.FREE,
    features: [
      { name: 'Overview', path: '/projects', icon: FolderKanban },
      { name: 'All Projects', path: '/projects/list', icon: LayoutGrid },
      { name: 'My Tasks', path: '/projects/my-tasks', icon: ListTodo },
      { name: 'Board', path: '/projects/board', icon: Kanban },
      {
        name: 'Timeline',
        path: '/projects/timeline',
        icon: GanttChart,
        requiredPlan: PLANS.PROFESSIONAL,
      },
      { name: 'Milestones', path: '/projects/milestones', icon: Milestone },
      {
        name: 'Time Tracking',
        path: '/projects/time',
        icon: Timer,
        requiredPlan: PLANS.PROFESSIONAL,
      },
      { name: 'Templates', path: '/projects/templates', icon: FileText },
      { name: 'Reports', path: '/projects/reports', icon: BarChart3 },
    ],
  },

  HR: {
    id: 'hr',
    name: 'HR Hub',
    shortName: 'HR',
    description: 'People & workforce management',
    icon: UserCircle,
    color: 'from-blue-500 to-indigo-500',
    basePath: '/hr',
    requiredPlan: PLANS.PROFESSIONAL,
    features: [
      { name: 'Overview', path: '/hr', icon: UserCircle },
      { name: 'Employees', path: '/hr/employees', icon: Users },
      { name: 'Organization', path: '/hr/org', icon: GitBranch },
      { name: 'Recruitment', path: '/hr/recruitment', icon: Briefcase },
      { name: 'Attendance', path: '/hr/attendance', icon: CalendarCheck },
      { name: 'Leave', path: '/hr/leave', icon: CalendarDays },
      { name: 'Payroll', path: '/hr/payroll', icon: Wallet, requiredPlan: PLANS.ENTERPRISE },
      { name: 'Performance', path: '/hr/performance', icon: Award },
      { name: 'Training', path: '/hr/training', icon: GraduationCap },
      { name: 'Offboarding', path: '/hr/offboarding', icon: UserMinus },
      { name: 'Reports', path: '/hr/reports', icon: BarChart3 },
    ],
  },

  FINANCE: {
    id: 'finance',
    name: 'Finance Hub',
    shortName: 'Finance',
    description: 'Accounting & financial management',
    icon: Landmark,
    color: 'from-green-500 to-emerald-500',
    basePath: '/finance',
    requiredPlan: PLANS.PROFESSIONAL,
    features: [
      { name: 'Overview', path: '/finance', icon: Landmark },
      { name: 'Chart of Accounts', path: '/finance/accounts', icon: FileSpreadsheet },
      { name: 'Journal Entries', path: '/finance/journal', icon: ClipboardList },
      { name: 'General Ledger', path: '/finance/ledger', icon: BookOpen },
      { name: 'Receivables', path: '/finance/receivables', icon: TrendingUp },
      { name: 'Payables', path: '/finance/payables', icon: TrendingDown },
      { name: 'Bank & Cash', path: '/finance/bank', icon: Landmark },
      { name: 'Expenses', path: '/finance/expenses', icon: Receipt },
      { name: 'Budgets', path: '/finance/budgets', icon: PiggyBank },
      { name: 'Tax', path: '/finance/tax', icon: Calculator, requiredPlan: PLANS.ENTERPRISE },
      { name: 'Reports', path: '/finance/reports', icon: BarChart3 },
    ],
  },

  INVENTORY: {
    id: 'inventory',
    name: 'Inventory Hub',
    shortName: 'Inventory',
    description: 'Stock & warehouse management',
    icon: Warehouse,
    color: 'from-amber-500 to-yellow-500',
    basePath: '/inventory',
    requiredPlan: PLANS.PROFESSIONAL,
    features: [
      { name: 'Overview', path: '/inventory', icon: Warehouse },
      { name: 'Products', path: '/inventory/products', icon: Package },
      { name: 'Warehouses', path: '/inventory/warehouses', icon: Warehouse },
      { name: 'Stock Levels', path: '/inventory/stock', icon: PackageSearch },
      { name: 'Stock Moves', path: '/inventory/moves', icon: ArrowDownUp },
      { name: 'Purchase Orders', path: '/inventory/purchase', icon: ClipboardCheck },
      { name: 'Shipping', path: '/inventory/shipping', icon: Truck },
      { name: 'Reports', path: '/inventory/reports', icon: BarChart3 },
    ],
  },

  ANALYTICS: {
    id: 'analytics',
    name: 'Analytics Hub',
    shortName: 'Analytics',
    description: 'Reports & business intelligence',
    icon: PieChart,
    color: 'from-fuchsia-500 to-pink-500',
    basePath: '/analytics',
    requiredPlan: PLANS.STARTER,
    features: [
      { name: 'Overview', path: '/analytics', icon: PieChart },
      { name: 'Dashboards', path: '/analytics/dashboards', icon: LayoutDashboard },
      { name: 'Reports', path: '/analytics/reports', icon: BarChart3 },
      { name: 'Goals', path: '/analytics/goals', icon: Goal },
      { name: 'KPIs', path: '/analytics/kpis', icon: Gauge },
      {
        name: 'Custom Reports',
        path: '/analytics/custom',
        icon: FileSpreadsheet,
        requiredPlan: PLANS.PROFESSIONAL,
      },
    ],
  },

  AUTOMATION: {
    id: 'automation',
    name: 'Automation Hub',
    shortName: 'Automation',
    description: 'Workflows & AI automation',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    basePath: '/automation',
    requiredPlan: PLANS.PROFESSIONAL,
    features: [
      { name: 'Overview', path: '/automation', icon: Zap },
      { name: 'Workflows', path: '/automation/workflows', icon: Workflow },
      { name: 'Sequences', path: '/automation/sequences', icon: Repeat },
      { name: 'Lead Scoring', path: '/automation/scoring', icon: Target },
      { name: 'AI Agents', path: '/automation/agents', icon: Bot, requiredPlan: PLANS.ENTERPRISE },
      { name: 'Templates', path: '/automation/templates', icon: FileText },
      { name: 'Logs', path: '/automation/logs', icon: History },
    ],
  },

  SETTINGS: {
    id: 'settings',
    name: 'Settings',
    shortName: 'Settings',
    description: 'Configuration & administration',
    icon: Settings,
    color: 'from-slate-500 to-gray-500',
    basePath: '/settings',
    requiredPlan: PLANS.FREE,
    adminOnly: false,
    features: [
      // General
      { name: 'Overview', path: '/settings', icon: Settings },
      // Account Section
      { name: 'Profile', path: '/settings/profile', icon: User, section: 'Account' },
      { name: 'Preferences', path: '/settings/preferences', icon: Palette, section: 'Account' },
      { name: 'Notifications', path: '/settings/notifications', icon: Bell, section: 'Account' },
      // Organization Section
      {
        name: 'Organization',
        path: '/settings/organization',
        icon: Building2,
        section: 'Organization',
      },
      { name: 'Users & Teams', path: '/settings/users', icon: Users, section: 'Organization' },
      { name: 'Roles', path: '/settings/roles', icon: Shield, section: 'Organization' },
      // Channels Section
      { name: 'Channels', path: '/settings/channels', icon: Link2, section: 'Channels' },
      { name: 'Email', path: '/settings/email', icon: Mail, section: 'Channels' },
      { name: 'WhatsApp', path: '/settings/whatsapp', icon: MessageSquare, section: 'Channels' },
      { name: 'Templates', path: '/settings/templates', icon: FileText, section: 'Channels' },
      // Inbox Section
      { name: 'Inbox Settings', path: '/settings/inbox', icon: Inbox, section: 'Inbox' },
      { name: 'Signatures', path: '/settings/signatures', icon: FileSignature, section: 'Inbox' },
      {
        name: 'Canned Responses',
        path: '/settings/canned-responses',
        icon: MessageSquare,
        section: 'Inbox',
      },
      // Configuration Section
      {
        name: 'Custom Fields',
        path: '/settings/custom-fields',
        icon: SlidersHorizontal,
        section: 'Configuration',
      },
      { name: 'Pipelines', path: '/settings/pipelines', icon: GitBranch, section: 'Configuration' },
      { name: 'Tags', path: '/settings/tags', icon: Tags, section: 'Configuration' },
      // Security & Compliance Section
      { name: 'Security', path: '/settings/security', icon: Key, section: 'Security' },
      {
        name: 'Compliance',
        path: '/settings/compliance',
        icon: AlertTriangle,
        section: 'Security',
      },
      {
        name: 'Audit Logs',
        path: '/settings/audit',
        icon: History,
        section: 'Security',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      // Developer Section
      {
        name: 'API Keys',
        path: '/settings/api-keys',
        icon: Key,
        section: 'Developer',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Webhooks',
        path: '/settings/webhooks',
        icon: Webhook,
        section: 'Developer',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      { name: 'Integrations', path: '/settings/integrations', icon: Puzzle, section: 'Developer' },
      // Billing Section
      {
        name: 'Subscription',
        path: '/settings/subscription',
        icon: CreditCard,
        section: 'Billing',
      },
      { name: 'Wallet', path: '/settings/wallet', icon: Wallet, section: 'Billing' },
    ],
  },
};

// Get hub by ID
export const getHub = (hubId) => HUBS[hubId?.toUpperCase()];

// Get all hubs as array
export const getAllHubs = () => Object.values(HUBS);

// Get core features as array
export const getCoreFeatures = () => Object.values(CORE_FEATURES);

// Get hubs available for a plan
export const getHubsForPlan = (plan) => {
  const planOrder = [PLANS.FREE, PLANS.STARTER, PLANS.PROFESSIONAL, PLANS.ENTERPRISE];
  const planIndex = planOrder.indexOf(plan);

  return getAllHubs().filter((hub) => {
    const hubPlanIndex = planOrder.indexOf(hub.requiredPlan);
    return hubPlanIndex <= planIndex;
  });
};

// Get features available for a plan within a hub
export const getHubFeaturesForPlan = (hub, plan) => {
  const planOrder = [PLANS.FREE, PLANS.STARTER, PLANS.PROFESSIONAL, PLANS.ENTERPRISE];
  const planIndex = planOrder.indexOf(plan);

  return hub.features.filter((feature) => {
    const featurePlan = feature.requiredPlan || hub.requiredPlan;
    const featurePlanIndex = planOrder.indexOf(featurePlan);
    return featurePlanIndex <= planIndex;
  });
};

// Check if user has access to a hub
export const hasHubAccess = (hubId, userPlan, isAdmin = false) => {
  const hub = getHub(hubId);
  if (!hub) return false;

  // Admin-only hubs require admin role
  if (hub.adminOnly && !isAdmin) return false;

  const planOrder = [PLANS.FREE, PLANS.STARTER, PLANS.PROFESSIONAL, PLANS.ENTERPRISE];
  const userPlanIndex = planOrder.indexOf(userPlan);
  const hubPlanIndex = planOrder.indexOf(hub.requiredPlan);

  return hubPlanIndex <= userPlanIndex;
};

// Check if user has access to a feature
export const hasFeatureAccess = (hubId, featurePath, userPlan) => {
  const hub = getHub(hubId);
  if (!hub) return false;

  const feature = hub.features.find((f) => f.path === featurePath);
  if (!feature) return true; // If feature not found in config, allow access

  const featurePlan = feature.requiredPlan || hub.requiredPlan;
  const planOrder = [PLANS.FREE, PLANS.STARTER, PLANS.PROFESSIONAL, PLANS.ENTERPRISE];
  const userPlanIndex = planOrder.indexOf(userPlan);
  const featurePlanIndex = planOrder.indexOf(featurePlan);

  return featurePlanIndex <= userPlanIndex;
};

// Hub categories for organization
export const HUB_CATEGORIES = {
  CORE: {
    name: 'Core',
    hubs: [], // Core features are not hubs
    features: Object.values(CORE_FEATURES),
  },
  CUSTOMER: {
    name: 'Customer',
    hubs: ['SALES', 'MARKETING', 'SERVICE'],
  },
  OPERATIONS: {
    name: 'Operations',
    hubs: ['PROJECTS', 'HR', 'INVENTORY'],
  },
  FINANCE: {
    name: 'Finance',
    hubs: ['COMMERCE', 'FINANCE'],
  },
  PLATFORM: {
    name: 'Platform',
    hubs: ['ANALYTICS', 'AUTOMATION', 'SETTINGS'],
  },
};

// Default export
export default HUBS;
