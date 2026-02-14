'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';
import { Gauge, Sparkles, Target, TrendingUp, Settings, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI Scoring',
    description: 'Machine learning-based lead scoring',
  },
  {
    icon: Target,
    title: 'Custom Criteria',
    description: 'Define your own scoring rules',
  },
  {
    icon: TrendingUp,
    title: 'Behavioral Scoring',
    description: 'Score based on engagement and activity',
  },
  {
    icon: Gauge,
    title: 'Fit Scoring',
    description: 'Score based on ideal customer profile',
  },
  {
    icon: Settings,
    title: 'Score Decay',
    description: 'Automatic score adjustment over time',
  },
  {
    icon: BarChart3,
    title: 'Score Analytics',
    description: 'Analyze scoring effectiveness',
  },
];

export default function LeadScoringPage() {
  return (
    <UnifiedLayout hubId="automation" pageTitle="Lead Scoring">
      <ComingSoonPage
        title="Lead Scoring"
        description="Prioritize leads automatically with AI-powered scoring. Combine fit and behavioral data to identify your best opportunities."
        icon={Gauge}
        features={features}
        backHref="/pipeline/leads"
        backLabel="Go to Leads"
      />
    </UnifiedLayout>
  );
}
