'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';
import { Route, Users, Zap, Brain, BarChart3, Settings } from 'lucide-react';

const features = [
  {
    icon: Route,
    title: 'Smart Assignment',
    description: 'Auto-assign tickets to the right agent',
  },
  {
    icon: Brain,
    title: 'AI Classification',
    description: 'Categorize tickets by content analysis',
  },
  {
    icon: Users,
    title: 'Skill-Based Routing',
    description: 'Match tickets to agent expertise',
  },
  {
    icon: Zap,
    title: 'Priority Detection',
    description: 'Auto-detect urgent issues',
  },
  {
    icon: BarChart3,
    title: 'Load Balancing',
    description: 'Distribute workload evenly',
  },
  {
    icon: Settings,
    title: 'Custom Rules',
    description: 'Define your own routing logic',
  },
];

export default function AutoRoutingPage() {
  return (
    <UnifiedLayout hubId="service" pageTitle="Auto Routing" fixedMenu={null}>
      <ComingSoonPage
        title="Auto Routing"
        description="Automatically route tickets to the right agents using AI. Smart classification and skill-based assignment for faster resolution."
        icon={Route}
        features={features}
        backHref="/service"
        backLabel="Go to Service"
      />
    </UnifiedLayout>
  );
}
