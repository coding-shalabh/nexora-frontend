'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { HUBS, PLANS, HUB_CATEGORIES, hasHubAccess } from '@/config/hubs';

// Mock user subscription - In production, get from auth context
const useSubscription = () => {
  return {
    plan: PLANS.PROFESSIONAL,
    isAdmin: true,
  };
};

// Organize hubs by category
const hubsByCategory = {
  customer: [HUBS.SALES, HUBS.MARKETING, HUBS.SERVICE],
  operations: [HUBS.PROJECTS, HUBS.HR, HUBS.INVENTORY],
  finance: [HUBS.COMMERCE, HUBS.FINANCE],
  platform: [HUBS.ANALYTICS, HUBS.AUTOMATION, HUBS.SETTINGS],
};

const categoryLabels = {
  customer: 'Customer',
  operations: 'Operations',
  finance: 'Finance',
  platform: 'Platform',
};

export function HubSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { plan, isAdmin } = useSubscription();

  // Determine current hub from pathname
  const getCurrentHub = () => {
    if (pathname.startsWith('/sales') || pathname.startsWith('/pipeline')) return HUBS.SALES;
    if (pathname.startsWith('/marketing') || pathname.startsWith('/forms')) return HUBS.MARKETING;
    if (pathname.startsWith('/service') || pathname.startsWith('/tickets') || pathname.startsWith('/kb')) return HUBS.SERVICE;
    if (pathname.startsWith('/commerce') || pathname.startsWith('/billing')) return HUBS.COMMERCE;
    if (pathname.startsWith('/projects')) return HUBS.PROJECTS;
    if (pathname.startsWith('/hr')) return HUBS.HR;
    if (pathname.startsWith('/finance')) return HUBS.FINANCE;
    if (pathname.startsWith('/inventory')) return HUBS.INVENTORY;
    if (pathname.startsWith('/analytics')) return HUBS.ANALYTICS;
    if (pathname.startsWith('/automation')) return HUBS.AUTOMATION;
    if (pathname.startsWith('/settings')) return HUBS.SETTINGS;
    return HUBS.SALES;
  };

  const currentHub = getCurrentHub();
  const Icon = currentHub.icon;

  const handleHubSelect = (hub) => {
    if (hasHubAccess(hub.id, plan, isAdmin)) {
      router.push(hub.basePath);
    }
  };

  const renderHubItem = (hub) => {
    const HubIcon = hub.icon;
    const isActive = currentHub.id === hub.id;
    const hasAccess = hasHubAccess(hub.id, plan, isAdmin);

    return (
      <DropdownMenuItem
        key={hub.id}
        onClick={() => handleHubSelect(hub)}
        disabled={!hasAccess}
        className={cn(
          'gap-3 cursor-pointer',
          isActive && 'bg-primary/10',
          !hasAccess && 'opacity-50'
        )}
      >
        <div className={cn(
          'flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br',
          hub.color,
          !hasAccess && 'grayscale'
        )}>
          <HubIcon className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-sm">{hub.shortName}</span>
        </div>
        {!hasAccess && <Lock className="h-3 w-3 text-muted-foreground" />}
        {isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2">
          <div className={cn(
            'flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br',
            currentHub.color
          )}>
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="hidden sm:inline text-sm font-medium">{currentHub.shortName}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {Object.entries(hubsByCategory).map(([category, hubs], categoryIndex) => (
          <div key={category}>
            {categoryIndex > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1.5">
              {categoryLabels[category]}
            </DropdownMenuLabel>
            {hubs.map(renderHubItem)}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HubSwitcher;
