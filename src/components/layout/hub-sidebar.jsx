'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HUBS, PLANS, hasFeatureAccess } from '@/config/hubs';

// Feature descriptions for each hub
const featureDescriptions = {
  // Sales Hub
  '/sales': 'Dashboard & metrics',
  '/crm/contacts': 'Manage people & leads',
  '/crm/companies': 'Manage organizations',
  '/pipeline/deals': 'Track opportunities',
  '/pipeline/leads': 'Qualify prospects',
  '/sales/quotes': 'Generate proposals',
  '/sales/meetings': 'Schedule meetings',
  '/sales/calls': 'Phone & call logs',
  '/sales/sequences': 'Outreach automation',
  '/sales/playbooks': 'Sales methodology',
  '/sales/forecast': 'Revenue prediction',
  '/sales/reports': 'Performance analytics',

  // Marketing Hub
  '/marketing': 'Dashboard & metrics',
  '/marketing/campaigns': 'Multi-channel campaigns',
  '/marketing/email': 'Email marketing',
  '/marketing/sms': 'Text messaging',
  '/marketing/social': 'Social publishing',
  '/marketing/ads': 'Paid advertising',
  '/marketing/pages': 'Landing pages',
  '/marketing/forms': 'Lead capture forms',
  '/marketing/ctas': 'Call-to-action buttons',
  '/marketing/events': 'Event management',
  '/marketing/segments': 'Audience segments',
  '/marketing/analytics': 'Campaign analytics',

  // Service Hub
  '/service': 'Dashboard & metrics',
  '/service/tickets': 'Support tickets',
  '/service/chat': 'Live chat support',
  '/service/kb': 'Help articles',
  '/service/portal': 'Customer self-service',
  '/service/slas': 'Service level rules',
  '/service/surveys': 'Customer feedback',
  '/service/reports': 'Support analytics',

  // Commerce Hub
  '/commerce': 'Dashboard & metrics',
  '/commerce/products': 'Product catalog',
  '/commerce/orders': 'Order management',
  '/commerce/invoices': 'Send invoices',
  '/commerce/payments': 'Payment tracking',
  '/commerce/subscriptions': 'Recurring billing',
  '/commerce/payment-links': 'One-click payments',
  '/commerce/reports': 'Revenue reports',

  // Projects Hub
  '/projects': 'Dashboard & metrics',
  '/projects/list': 'All projects',
  '/projects/my-tasks': 'Your tasks',
  '/projects/board': 'Kanban board',
  '/projects/timeline': 'Gantt chart',
  '/projects/milestones': 'Key milestones',
  '/projects/time': 'Track time spent',
  '/projects/templates': 'Project templates',
  '/projects/reports': 'Project analytics',

  // HR Hub
  '/hr': 'Dashboard & metrics',
  '/hr/employees': 'Employee directory',
  '/hr/org': 'Organization chart',
  '/hr/recruitment': 'Job postings & hiring',
  '/hr/attendance': 'Clock in/out',
  '/hr/leave': 'Leave requests',
  '/hr/payroll': 'Salary & payments',
  '/hr/performance': 'Reviews & goals',
  '/hr/training': 'Learning & courses',
  '/hr/offboarding': 'Exit process',
  '/hr/reports': 'HR analytics',

  // Finance Hub
  '/finance': 'Dashboard & metrics',
  '/finance/accounts': 'Chart of accounts',
  '/finance/journal': 'Journal entries',
  '/finance/ledger': 'General ledger',
  '/finance/receivables': 'Money owed to you',
  '/finance/payables': 'Bills to pay',
  '/finance/bank': 'Bank accounts',
  '/finance/expenses': 'Expense claims',
  '/finance/budgets': 'Budget planning',
  '/finance/tax': 'Tax management',
  '/finance/reports': 'Financial reports',

  // Inventory Hub
  '/inventory': 'Dashboard & metrics',
  '/inventory/products': 'Product master',
  '/inventory/warehouses': 'Storage locations',
  '/inventory/stock': 'Stock levels',
  '/inventory/moves': 'Stock movements',
  '/inventory/purchase': 'Purchase orders',
  '/inventory/shipping': 'Deliveries',
  '/inventory/reports': 'Inventory reports',

  // Analytics Hub
  '/analytics': 'Dashboard & metrics',
  '/analytics/dashboards': 'Custom dashboards',
  '/analytics/reports': 'All reports',
  '/analytics/goals': 'Goals & targets',
  '/analytics/kpis': 'Key metrics',
  '/analytics/custom': 'Build reports',

  // Automation Hub
  '/automation': 'Dashboard & metrics',
  '/automation/workflows': 'Visual workflows',
  '/automation/sequences': 'Time-based flows',
  '/automation/scoring': 'Lead qualification',
  '/automation/agents': 'AI automation',
  '/automation/templates': 'Workflow templates',
  '/automation/logs': 'Execution history',

  // Settings Hub
  '/settings': 'Configuration overview',
  '/settings/profile': 'Your personal settings',
  '/settings/preferences': 'Theme & language',
  '/settings/notifications': 'Notification preferences',
  '/settings/inbox': 'Inbox configuration',
  '/settings/signatures': 'Email signatures',
  '/settings/canned-responses': 'Quick reply templates',
  '/settings/organization': 'Company settings',
  '/settings/users': 'Team members',
  '/settings/roles': 'Permissions',
  '/settings/channels': 'Channel connections',
  '/settings/email': 'Email accounts',
  '/settings/whatsapp': 'WhatsApp setup',
  '/settings/security': 'Security settings',
  '/settings/compliance': 'Compliance center',
  '/settings/fields': 'Custom properties',
  '/settings/pipelines': 'Stage configuration',
  '/settings/tags': 'Labels & tags',
  '/settings/templates': 'Message templates',
  '/settings/integrations': 'Connected apps',
  '/settings/api-keys': 'API access',
  '/settings/webhooks': 'Webhook endpoints',
  '/settings/audit': 'Activity logs',
  '/settings/subscription': 'Plan & billing',
  '/settings/wallet': 'Credits & top-up',
};

// Mock subscription - In production, get from auth context
const useSubscription = () => {
  return {
    plan: PLANS.PROFESSIONAL,
    isAdmin: true,
  };
};

export function HubSidebar({ hubId: propHubId }) {
  const pathname = usePathname();
  const { plan, isAdmin } = useSubscription();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-detect hubId from pathname if not provided
  const hubId =
    propHubId ||
    (() => {
      // Map pathname prefixes to hub IDs
      const pathToHub = {
        '/crm': 'sales',
        '/sales': 'sales',
        '/pipeline': 'sales',
        '/marketing': 'marketing',
        '/service': 'service',
        '/commerce': 'commerce',
        '/projects': 'projects',
        '/hr': 'hr',
        '/finance': 'finance',
        '/inventory': 'inventory',
        '/analytics': 'analytics',
        '/automation': 'automation',
        '/settings': 'settings',
      };

      // Find the matching hub from the pathname
      for (const [prefix, hub] of Object.entries(pathToHub)) {
        if (pathname?.startsWith(prefix)) {
          return hub;
        }
      }
      return null;
    })();

  // Get hub config
  const hub = hubId ? HUBS[hubId.toUpperCase()] : null;
  if (!hub) return null;

  const HubIcon = hub.icon;

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`hub-sidebar-collapsed-${hubId}`);
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, [hubId]);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(`hub-sidebar-collapsed-${hubId}`, JSON.stringify(newState));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 260 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="relative h-full border-r border-gray-200 flex flex-col bg-transparent"
      >
        {/* Hub Header */}
        <div
          className={cn(
            'flex items-center gap-3 p-4 border-b border-gray-200',
            isCollapsed && 'justify-center'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-center rounded-lg bg-gradient-to-br shrink-0',
              hub.color,
              isCollapsed ? 'h-8 w-8' : 'h-10 w-10'
            )}
          >
            <HubIcon className={cn('text-white', isCollapsed ? 'h-4 w-4' : 'h-5 w-5')} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h2 className="font-semibold text-base whitespace-nowrap text-gray-900">
                  {hub.name}
                </h2>
                <p className="text-xs text-gray-500">{hub.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {(() => {
              // Group features by section
              const grouped = {};
              const noSection = [];

              hub.features.forEach((feature) => {
                if (feature.section) {
                  if (!grouped[feature.section]) {
                    grouped[feature.section] = [];
                  }
                  grouped[feature.section].push(feature);
                } else {
                  noSection.push(feature);
                }
              });

              const sections = Object.keys(grouped);

              const renderFeature = (feature) => {
                const FeatureIcon = feature.icon;
                const isActive =
                  pathname === feature.path ||
                  (feature.path !== hub.basePath && pathname.startsWith(feature.path));
                const hasAccess = hasFeatureAccess(hubId, feature.path, plan);
                const isLocked = !hasAccess;
                const description = featureDescriptions[feature.path] || '';

                const linkContent = (
                  <div
                    className={cn(
                      'flex items-start gap-3 px-3 py-2 rounded-lg transition-all',
                      isActive && 'text-white',
                      !isActive &&
                        !isLocked &&
                        'text-gray-700 hover:bg-white/50 hover:text-gray-900',
                      isLocked && 'opacity-50 cursor-not-allowed',
                      isCollapsed && 'justify-center px-2 py-2'
                    )}
                    style={isActive ? { background: 'var(--brand-color)' } : undefined}
                  >
                    <FeatureIcon
                      className={cn(
                        'shrink-0 mt-0.5',
                        isCollapsed ? 'h-5 w-5' : 'h-4 w-4',
                        isActive ? 'text-white' : 'text-gray-500'
                      )}
                    />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex-1 min-w-0 overflow-hidden"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'text-sm font-medium whitespace-nowrap',
                                isActive ? 'text-white' : 'text-gray-900'
                              )}
                            >
                              {feature.name}
                            </span>
                            {isLocked && <Lock className="h-3 w-3 text-gray-400" />}
                          </div>
                          {description && (
                            <p
                              className={cn(
                                'text-xs truncate mt-0.5',
                                isActive ? 'text-white/70' : 'text-gray-500'
                              )}
                            >
                              {description}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );

                return isCollapsed ? (
                  <Tooltip key={feature.path}>
                    <TooltipTrigger asChild>
                      {isLocked ? (
                        <div>{linkContent}</div>
                      ) : (
                        <Link href={feature.path}>{linkContent}</Link>
                      )}
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex flex-col gap-1 bg-white border-0 px-3 py-2 shadow-lg"
                    >
                      <span className="font-medium text-gray-900">{feature.name}</span>
                      {description && <span className="text-xs text-gray-500">{description}</span>}
                      {isLocked && (
                        <span className="text-xs text-orange-500">Upgrade required</span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : isLocked ? (
                  <div key={feature.path}>{linkContent}</div>
                ) : (
                  <Link key={feature.path} href={feature.path}>
                    {linkContent}
                  </Link>
                );
              };

              return (
                <>
                  {/* Render features without section first (Overview) */}
                  {noSection.map((feature) => (
                    <div key={feature.path} className="mb-2 pb-2 border-b border-gray-200">
                      {renderFeature(feature)}
                    </div>
                  ))}

                  {/* Render grouped sections */}
                  {sections.map((section, sectionIndex) => (
                    <div key={section} className={cn(sectionIndex > 0 && 'mt-4')}>
                      {!isCollapsed && (
                        <h3 className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {section}
                        </h3>
                      )}
                      <div className="space-y-0.5">{grouped[section].map(renderFeature)}</div>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </nav>

        {/* Collapse Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white border-gray-200 text-gray-600 shadow-md hover:bg-gray-50 hover:text-gray-900 z-10"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}

export default HubSidebar;
