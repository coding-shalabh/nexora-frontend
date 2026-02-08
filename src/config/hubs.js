/**
 * Nexora Hub Configuration
 *
 * Complete Business OS with 11 Hubs + Core Layer
 * Each hub's availability is based on subscription plan
 *
 * REVISED STRUCTURE (Based on HubSpot/Salesforce/Odoo patterns):
 * - Tickets Hub REMOVED (merged into Service Hub)
 * - Leads moved from CRM to Sales Hub
 * - Quotes moved from Commerce to Sales Hub
 * - Duplicate Segments removed from Marketing (CRM is master)
 * - Duplicate Tasks removed from CRM (CORE is master)
 * - Duplicate Meetings/Calls removed from Sales (CRM Activities is master)
 * - Duplicate Products/Inventory removed from Commerce (Inventory is master)
 * - Duplicate Sequences removed from Automation (Sales is master)
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
  Brain,
  Wand2,
  Lightbulb,
  Mic,
  Eye,
  MessageCircle,
  Cpu,
  Layers,
  ScanSearch,
  Magnet,

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
// These appear in the main navigation and are accessible from anywhere
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
    description: 'Unified communication (Email, WhatsApp, SMS, Chat)',
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
    description: 'Cross-functional tasks (master list)',
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
  /**
   * CRM Hub - Contact & Company Management
   * Owner of: Contacts, Companies, Segments, Activities
   * NOT owner of: Leads (Sales), Tasks (CORE)
   */
  CRM: {
    id: 'crm',
    name: 'CRM Hub',
    shortName: 'CRM',
    description: 'Contacts, companies & activities',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    basePath: '/crm',
    requiredPlan: PLANS.FREE,
    features: [
      { name: 'Contacts', path: '/crm/contacts', icon: Users },
      // People Section
      { name: 'Companies', path: '/crm/companies', icon: Building2, section: 'People' },
      { name: 'Segments', path: '/crm/segments', icon: Users, section: 'People' },
      // Activity Section (Activities are linked to contacts/companies)
      { name: 'Activities', path: '/crm/activities', icon: Clock, section: 'Activities' },
      { name: 'Meetings', path: '/crm/meetings', icon: Calendar, section: 'Activities' },
      { name: 'Calls', path: '/crm/calls', icon: Phone, section: 'Activities' },
      { name: 'Emails', path: '/crm/emails', icon: Mail, section: 'Activities' },
      { name: 'Notes', path: '/crm/notes', icon: FileText, section: 'Activities' },
      // Tools Section
      { name: 'Tags', path: '/crm/tags', icon: Tags, section: 'Tools' },
      { name: 'Custom Fields', path: '/crm/fields', icon: SlidersHorizontal, section: 'Tools' },
      // Data Section
      { name: 'Import', path: '/crm/import', icon: ArrowDownUp, section: 'Data' },
      { name: 'Export', path: '/crm/export', icon: ArrowDownUp, section: 'Data' },
      {
        name: 'Duplicates',
        path: '/crm/contacts/duplicates',
        icon: AlertTriangle,
        section: 'Data',
      },
      { name: 'Bulk Actions', path: '/crm/bulk', icon: LayoutGrid, section: 'Data' },
      {
        name: 'Enrich',
        path: '/crm/enrich',
        icon: Sparkles,
        section: 'Data',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      // AI Section
      {
        name: 'AI Scoring',
        path: '/crm/scoring',
        icon: Brain,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'AI Insights',
        path: '/crm/ai-insights',
        icon: Lightbulb,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Recommendations',
        path: '/crm/ai-recommendations',
        icon: Wand2,
        section: 'AI',
        requiredPlan: PLANS.ENTERPRISE,
      },
      // Reports Section
      { name: 'Reports', path: '/crm/reports', icon: BarChart3, section: 'Reports' },
      // Settings Section
      { name: 'Settings', path: '/crm/settings', icon: Settings, section: 'Settings' },
    ],
  },

  /**
   * Sales Hub - Pipeline & Revenue Management
   * Owner of: Leads, Deals, Pipeline, Quotes, Forecasts, Goals, Sequences
   * Merged from: Pipeline Hub (removed)
   */
  SALES: {
    id: 'sales',
    name: 'Sales Hub',
    shortName: 'Sales',
    description: 'Leads, pipeline, deals & revenue',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    basePath: '/sales',
    requiredPlan: PLANS.FREE,
    features: [
      { name: 'Overview', path: '/sales', icon: TrendingUp },
      // Leads Section (moved from CRM)
      { name: 'Leads', path: '/sales/leads', icon: Target, section: 'Leads' },
      { name: 'Prospecting', path: '/sales/prospecting', icon: Search, section: 'Leads' },
      // Pipeline Section
      { name: 'Pipeline', path: '/sales/pipeline', icon: Kanban, section: 'Pipeline' },
      { name: 'Deals', path: '/sales/deals', icon: Kanban, section: 'Pipeline' },
      // Quotes Section (moved from Commerce)
      { name: 'Quotes', path: '/sales/quotes', icon: FileText, section: 'Quotes' },
      { name: 'Products', path: '/sales/products', icon: Package, section: 'Quotes' },
      // Forecasting Section
      { name: 'Forecasts', path: '/sales/forecasts', icon: TrendingUp, section: 'Forecasting' },
      { name: 'Goals', path: '/sales/goals', icon: Target, section: 'Forecasting' },
      // Workspace Section
      { name: 'Workspace', path: '/sales/workspace', icon: LayoutGrid, section: 'Workspace' },
      { name: 'Documents', path: '/sales/documents', icon: FolderOpen, section: 'Workspace' },
      // Tools Section
      {
        name: 'Sequences',
        path: '/sales/sequences',
        icon: Repeat,
        section: 'Tools',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Playbooks',
        path: '/sales/playbooks',
        icon: BookOpen,
        section: 'Tools',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      { name: 'Coaching', path: '/sales/coaching', icon: GraduationCap, section: 'Tools' },
      // Analytics Section
      { name: 'Reports', path: '/sales/reports', icon: BarChart3, section: 'Analytics' },
      // AI Section
      {
        name: 'AI Forecasting',
        path: '/sales/ai-forecast',
        icon: Brain,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Call Intelligence',
        path: '/sales/call-intelligence',
        icon: Mic,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Deal Insights',
        path: '/sales/deal-insights',
        icon: Lightbulb,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Win Probability',
        path: '/sales/win-probability',
        icon: Target,
        section: 'AI',
        requiredPlan: PLANS.ENTERPRISE,
      },
    ],
  },

  /**
   * Marketing Hub - Campaigns & Lead Generation
   * Owner of: Campaigns, Email Marketing, Forms, Landing Pages
   * NOT owner of: Segments (CRM is master, Marketing uses/filters them)
   */
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
      // Campaigns Section
      { name: 'Campaigns', path: '/marketing/campaigns', icon: Megaphone, section: 'Campaigns' },
      { name: 'Broadcasts', path: '/marketing/broadcasts', icon: Megaphone, section: 'Campaigns' },
      // Channels Section
      { name: 'Email', path: '/marketing/email', icon: Mail, section: 'Channels' },
      {
        name: 'SMS',
        path: '/marketing/sms',
        icon: MessageSquare,
        section: 'Channels',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Social',
        path: '/marketing/social',
        icon: Share2,
        section: 'Channels',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Ads',
        path: '/marketing/ads',
        icon: MousePointer,
        section: 'Channels',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      // Content Section
      { name: 'Landing Pages', path: '/marketing/pages', icon: FileText, section: 'Content' },
      { name: 'Forms', path: '/marketing/forms', icon: FileCode, section: 'Content' },
      { name: 'CTAs', path: '/marketing/ctas', icon: MousePointer, section: 'Content' },
      { name: 'Templates', path: '/marketing/templates', icon: FileText, section: 'Content' },
      // Events Section
      { name: 'Events', path: '/marketing/events', icon: CalendarDays, section: 'Events' },
      // Analytics Section
      { name: 'Analytics', path: '/marketing/analytics', icon: BarChart3, section: 'Analytics' },
      // AI Section
      {
        name: 'AI Content Writer',
        path: '/marketing/ai-content',
        icon: Wand2,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Subject Line AI',
        path: '/marketing/ai-subject',
        icon: Mail,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Smart Segments',
        path: '/marketing/ai-segments',
        icon: Brain,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Predictive Send',
        path: '/marketing/ai-send-time',
        icon: Clock,
        section: 'AI',
        requiredPlan: PLANS.ENTERPRISE,
      },
    ],
  },

  /**
   * Service Hub - Support & Customer Success
   * Owner of: Tickets (absorbed Tickets Hub), Knowledge Base, Live Chat, Portal, SLAs
   * Merged from: Tickets Hub (removed)
   */
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
      // Tickets Section (absorbed from Tickets Hub)
      { name: 'All Tickets', path: '/service/tickets', icon: Ticket, section: 'Tickets' },
      { name: 'Open', path: '/service/tickets/open', icon: Ticket, section: 'Tickets' },
      { name: 'Pending', path: '/service/tickets/pending', icon: Clock, section: 'Tickets' },
      {
        name: 'Resolved',
        path: '/service/tickets/resolved',
        icon: CheckSquare,
        section: 'Tickets',
      },
      { name: 'My Tickets', path: '/service/tickets/my', icon: User, section: 'Tickets' },
      {
        name: 'Unassigned',
        path: '/service/tickets/unassigned',
        icon: AlertTriangle,
        section: 'Tickets',
      },
      { name: 'New Ticket', path: '/service/tickets/new', icon: FileText, section: 'Tickets' },
      // Channels Section
      { name: 'Live Chat', path: '/service/chat', icon: MessagesSquare, section: 'Channels' },
      // Knowledge Base Section
      { name: 'Knowledge Base', path: '/service/kb', icon: BookOpen, section: 'Knowledge Base' },
      { name: 'Articles', path: '/service/kb/articles', icon: FileText, section: 'Knowledge Base' },
      { name: 'Categories', path: '/service/kb/categories', icon: Tags, section: 'Knowledge Base' },
      // Customer Section
      {
        name: 'Customer Portal',
        path: '/service/portal',
        icon: Users,
        section: 'Customer',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      { name: 'Surveys', path: '/service/surveys', icon: Star, section: 'Customer' },
      // Management Section
      {
        name: 'SLAs',
        path: '/service/slas',
        icon: Clock,
        section: 'Management',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      { name: 'Reports', path: '/service/reports', icon: BarChart3, section: 'Management' },
      { name: 'Settings', path: '/service/settings', icon: Settings, section: 'Management' },
      // AI Section
      {
        name: 'AI Chatbot',
        path: '/service/ai-bot',
        icon: Bot,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Auto Routing',
        path: '/service/ai-routing',
        icon: GitBranch,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Sentiment Analysis',
        path: '/service/ai-sentiment',
        icon: Eye,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Reply Suggestions',
        path: '/service/ai-replies',
        icon: MessageCircle,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Ticket Summary',
        path: '/service/ai-summary',
        icon: Wand2,
        section: 'AI',
        requiredPlan: PLANS.ENTERPRISE,
      },
    ],
  },

  /**
   * Commerce Hub - Billing, Payments & Orders
   * Owner of: Orders, Invoices, Payments, Subscriptions
   * NOT owner of: Products (Inventory is master), Quotes (Sales is master)
   */
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
      // Orders Section
      { name: 'Orders', path: '/commerce/orders', icon: ClipboardCheck, section: 'Orders' },
      { name: 'Customers', path: '/commerce/customers', icon: Users, section: 'Orders' },
      // Billing Section
      { name: 'Invoices', path: '/commerce/invoices', icon: Receipt, section: 'Billing' },
      { name: 'Receipts', path: '/commerce/receipts', icon: Receipt, section: 'Billing' },
      // Payments Section
      { name: 'Payments', path: '/commerce/payments', icon: CreditCard, section: 'Payments' },
      { name: 'Payment Links', path: '/commerce/payment-links', icon: Link2, section: 'Payments' },
      { name: 'Wallet', path: '/commerce/wallet', icon: Wallet, section: 'Payments' },
      {
        name: 'Subscriptions',
        path: '/commerce/subscriptions',
        icon: RefreshCw,
        section: 'Payments',
        requiredPlan: PLANS.ENTERPRISE,
      },
      // Pricing Section
      { name: 'Discounts', path: '/commerce/discounts', icon: Tags, section: 'Pricing' },
      // Analytics Section
      { name: 'Revenue', path: '/commerce/revenue', icon: TrendingUp, section: 'Analytics' },
      { name: 'Reports', path: '/commerce/reports', icon: BarChart3, section: 'Analytics' },
      // Settings Section
      { name: 'Settings', path: '/commerce/settings', icon: Settings, section: 'Settings' },
    ],
  },

  /**
   * Projects Hub - Project & Work Management
   * Owner of: Projects, Milestones, Time Tracking
   * NOT owner of: Tasks (CORE is master, Projects shows contextual view)
   */
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
      // Projects Section
      { name: 'All Projects', path: '/projects/list', icon: LayoutGrid, section: 'Projects' },
      { name: 'Board', path: '/projects/board', icon: Kanban, section: 'Projects' },
      {
        name: 'Timeline',
        path: '/projects/timeline',
        icon: GanttChart,
        section: 'Projects',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      // Tasks Section (contextual view of CORE tasks)
      { name: 'My Tasks', path: '/projects/my-tasks', icon: ListTodo, section: 'Tasks' },
      { name: 'All Tasks', path: '/projects/tasks', icon: CheckSquare, section: 'Tasks' },
      { name: 'Milestones', path: '/projects/milestones', icon: Milestone, section: 'Tasks' },
      // Time Section
      {
        name: 'Time Tracking',
        path: '/projects/time-tracking',
        icon: Timer,
        section: 'Time',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      // Resources Section
      { name: 'Templates', path: '/projects/templates', icon: FileText, section: 'Resources' },
      { name: 'Reports', path: '/projects/reports', icon: BarChart3, section: 'Resources' },
    ],
  },

  /**
   * HR Hub - People & Workforce Management
   */
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
      // People Section
      { name: 'Employees', path: '/hr/employees', icon: Users, section: 'People' },
      { name: 'Organization', path: '/hr/org', icon: GitBranch, section: 'People' },
      // Talent Section
      { name: 'Recruitment', path: '/hr/recruitment', icon: Briefcase, section: 'Talent' },
      { name: 'Training', path: '/hr/training', icon: GraduationCap, section: 'Talent' },
      { name: 'Performance', path: '/hr/performance', icon: Award, section: 'Talent' },
      // Time & Attendance Section
      {
        name: 'Attendance',
        path: '/hr/attendance',
        icon: CalendarCheck,
        section: 'Time & Attendance',
      },
      { name: 'Leave', path: '/hr/leave', icon: CalendarDays, section: 'Time & Attendance' },
      // Compensation Section
      {
        name: 'Payroll',
        path: '/hr/payroll',
        icon: Wallet,
        section: 'Compensation',
        requiredPlan: PLANS.ENTERPRISE,
      },
      // Offboarding Section
      { name: 'Offboarding', path: '/hr/offboarding', icon: UserMinus, section: 'Exit' },
      // Reports Section
      { name: 'Reports', path: '/hr/reports', icon: BarChart3, section: 'Reports' },
      // AI Section
      {
        name: 'Resume Screening',
        path: '/hr/ai-screening',
        icon: ScanSearch,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Candidate Match',
        path: '/hr/ai-matching',
        icon: Magnet,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Attrition Risk',
        path: '/hr/ai-attrition',
        icon: AlertTriangle,
        section: 'AI',
        requiredPlan: PLANS.ENTERPRISE,
      },
      {
        name: 'Performance Insights',
        path: '/hr/ai-performance',
        icon: Brain,
        section: 'AI',
        requiredPlan: PLANS.ENTERPRISE,
      },
    ],
  },

  /**
   * Finance Hub - Accounting & Financial Management
   */
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
      // Accounting Section
      {
        name: 'Chart of Accounts',
        path: '/finance/accounts',
        icon: FileSpreadsheet,
        section: 'Accounting',
      },
      {
        name: 'Journal Entries',
        path: '/finance/journal',
        icon: ClipboardList,
        section: 'Accounting',
      },
      { name: 'General Ledger', path: '/finance/ledger', icon: BookOpen, section: 'Accounting' },
      // Receivables & Payables Section
      { name: 'Receivables', path: '/finance/receivables', icon: TrendingUp, section: 'AR/AP' },
      { name: 'Payables', path: '/finance/payables', icon: TrendingDown, section: 'AR/AP' },
      // Cash Management Section
      { name: 'Bank & Cash', path: '/finance/bank', icon: Landmark, section: 'Cash Management' },
      { name: 'Expenses', path: '/finance/expenses', icon: Receipt, section: 'Cash Management' },
      // Planning Section
      { name: 'Budgets', path: '/finance/budgets', icon: PiggyBank, section: 'Planning' },
      {
        name: 'Tax',
        path: '/finance/tax',
        icon: Calculator,
        section: 'Planning',
        requiredPlan: PLANS.ENTERPRISE,
      },
      // Reports Section
      { name: 'Reports', path: '/finance/reports', icon: BarChart3, section: 'Reports' },
    ],
  },

  /**
   * Inventory Hub - Stock & Warehouse Management
   * Owner of: Products (master), Stock, Warehouses
   */
  INVENTORY: {
    id: 'inventory',
    name: 'Inventory Hub',
    shortName: 'Inventory',
    description: 'Products, stock & warehouse management',
    icon: Warehouse,
    color: 'from-amber-500 to-yellow-500',
    basePath: '/inventory',
    requiredPlan: PLANS.PROFESSIONAL,
    features: [
      { name: 'Overview', path: '/inventory', icon: Warehouse },
      // Products Section (Master location for Products)
      { name: 'Products', path: '/inventory/products', icon: Package, section: 'Products' },
      { name: 'Categories', path: '/inventory/categories', icon: Tags, section: 'Products' },
      // Stock Section
      { name: 'Stock Levels', path: '/inventory/stock', icon: PackageSearch, section: 'Stock' },
      { name: 'Stock Moves', path: '/inventory/moves', icon: ArrowDownUp, section: 'Stock' },
      // Warehouse Section
      { name: 'Warehouses', path: '/inventory/warehouses', icon: Warehouse, section: 'Warehouse' },
      // Orders Section
      {
        name: 'Purchase Orders',
        path: '/inventory/purchase',
        icon: ClipboardCheck,
        section: 'Orders',
      },
      { name: 'Shipping', path: '/inventory/shipping', icon: Truck, section: 'Orders' },
      // Reports Section
      { name: 'Reports', path: '/inventory/reports', icon: BarChart3, section: 'Reports' },
    ],
  },

  /**
   * Analytics Hub - Reports & Business Intelligence
   * Owner of: Cross-hub dashboards, Custom reports, KPIs
   */
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
      // Dashboards Section
      {
        name: 'Dashboards',
        path: '/analytics/dashboards',
        icon: LayoutDashboard,
        section: 'Dashboards',
      },
      // Reports Section
      { name: 'Reports', path: '/analytics/reports', icon: BarChart3, section: 'Reports' },
      {
        name: 'Custom Reports',
        path: '/analytics/custom',
        icon: FileSpreadsheet,
        section: 'Reports',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      // Goals Section
      { name: 'Goals', path: '/analytics/goals', icon: Goal, section: 'Goals' },
      { name: 'KPIs', path: '/analytics/kpis', icon: Gauge, section: 'Goals' },
      // Website Section
      { name: 'Website', path: '/analytics/website', icon: MousePointer, section: 'Website' },
      { name: 'Tracking', path: '/analytics/tracking', icon: Target, section: 'Website' },
      // AI Section
      {
        name: 'AI Insights',
        path: '/analytics/ai-insights',
        icon: Lightbulb,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Ask AI',
        path: '/analytics/ai-ask',
        icon: MessageCircle,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Anomaly Detection',
        path: '/analytics/ai-anomalies',
        icon: AlertTriangle,
        section: 'AI',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Predictions',
        path: '/analytics/ai-predictions',
        icon: Brain,
        section: 'AI',
        requiredPlan: PLANS.ENTERPRISE,
      },
    ],
  },

  /**
   * Automation Hub - Workflows & AI Automation
   * Owner of: Workflows, Triggers, AI Agents
   * NOT owner of: Sequences (Sales is master)
   */
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
      // Workflows Section
      { name: 'Workflows', path: '/automation/workflows', icon: Workflow, section: 'Workflows' },
      { name: 'Active', path: '/automation/active', icon: CheckSquare, section: 'Workflows' },
      { name: 'Archived', path: '/automation/archived', icon: FolderOpen, section: 'Workflows' },
      // Triggers Section
      { name: 'Triggers', path: '/automation/triggers', icon: Zap, section: 'Triggers' },
      // AI & Scoring Section
      { name: 'Lead Scoring', path: '/automation/scoring', icon: Target, section: 'AI & Scoring' },
      {
        name: 'Intent Detection',
        path: '/automation/intent',
        icon: Sparkles,
        section: 'AI & Scoring',
      },
      {
        name: 'AI Agents',
        path: '/automation/agents',
        icon: Bot,
        section: 'AI & Scoring',
        requiredPlan: PLANS.ENTERPRISE,
      },
      // AI Copilot Section
      {
        name: 'AI Builder',
        path: '/automation/ai-builder',
        icon: Wand2,
        section: 'AI Copilot',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Natural Language',
        path: '/automation/ai-nlp',
        icon: MessageCircle,
        section: 'AI Copilot',
        requiredPlan: PLANS.PROFESSIONAL,
      },
      {
        name: 'Smart Triggers',
        path: '/automation/ai-triggers',
        icon: Zap,
        section: 'AI Copilot',
        requiredPlan: PLANS.ENTERPRISE,
      },
      {
        name: 'Predictive Actions',
        path: '/automation/ai-actions',
        icon: Brain,
        section: 'AI Copilot',
        requiredPlan: PLANS.ENTERPRISE,
      },
      // Analytics Section
      { name: 'Analytics', path: '/automation/analytics', icon: BarChart3, section: 'Analytics' },
      // Settings Section
      { name: 'Settings', path: '/automation/settings', icon: Settings, section: 'Settings' },
    ],
  },

  // NOTE: TICKETS Hub has been REMOVED and merged into SERVICE Hub

  /**
   * Settings Hub - Configuration & Administration
   */
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
      { name: 'Billing', path: '/settings/billing', icon: Receipt, section: 'Billing' },
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

// Hub categories for organization (TICKETS removed)
export const HUB_CATEGORIES = {
  CORE: {
    name: 'Core',
    hubs: [], // Core features are not hubs
    features: Object.values(CORE_FEATURES),
  },
  CUSTOMER: {
    name: 'Customer',
    hubs: ['CRM', 'SALES', 'MARKETING', 'SERVICE'],
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
