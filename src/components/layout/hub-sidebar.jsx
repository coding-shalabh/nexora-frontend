'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HUBS, PLANS, hasFeatureAccess } from '@/config/hubs';

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
      // NOTE: /pipeline redirects to sales, /tickets redirects to service
      const pathToHub = {
        '/crm': 'crm',
        '/sales': 'sales',
        '/pipeline': 'sales',
        '/marketing': 'marketing',
        '/service': 'service',
        '/tickets': 'service',
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

  // Load collapsed state from localStorage (SSR-safe)
  // Hook must be called before any conditional returns (Rules of Hooks)
  useEffect(() => {
    if (typeof window === 'undefined' || !hubId) return;
    const saved = localStorage.getItem(`hub-sidebar-collapsed-${hubId}`);
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, [hubId]);

  // Save collapsed state
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== 'undefined' && hubId) {
      localStorage.setItem(`hub-sidebar-collapsed-${hubId}`, JSON.stringify(newState));
    }
  };

  // Early return after all hooks
  if (!hub) return null;

  const HubIcon = hub.icon;

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 260 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="relative h-full flex flex-col bg-transparent"
      >
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
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

                const linkContent = (
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                      isActive && 'text-white bg-primary',
                      !isActive &&
                        !isLocked &&
                        'text-gray-700 hover:bg-white/50 hover:text-gray-900',
                      isLocked && 'opacity-50 cursor-not-allowed',
                      isCollapsed && 'justify-center px-2 py-2'
                    )}
                  >
                    <FeatureIcon
                      className={cn(
                        'shrink-0',
                        isCollapsed ? 'h-5 w-5' : 'h-4 w-4',
                        isActive ? 'text-white' : 'text-gray-500'
                      )}
                    />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
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
                    )}
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
                    <TooltipContent side="right" className="bg-white border-0 px-3 py-2 shadow-lg">
                      <span className="font-medium text-gray-900">{feature.name}</span>
                      {isLocked && (
                        <span className="text-xs text-orange-500 block">Upgrade required</span>
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
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white border-gray-200 text-gray-600 shadow-md hover:bg-gray-50 hover:text-gray-900 z-10"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}

export default HubSidebar;
