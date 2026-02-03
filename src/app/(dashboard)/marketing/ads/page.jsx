'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Target,
  DollarSign,
  BarChart3,
  Users,
  TrendingUp,
  Layers
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Ad Management',
    description: 'Manage Google, Facebook, LinkedIn ads'
  },
  {
    icon: Users,
    title: 'Audience Sync',
    description: 'Sync CRM segments to ad platforms'
  },
  {
    icon: DollarSign,
    title: 'Budget Tracking',
    description: 'Monitor ad spend across platforms'
  },
  {
    icon: TrendingUp,
    title: 'ROI Attribution',
    description: 'Track ad spend to revenue'
  },
  {
    icon: BarChart3,
    title: 'Performance',
    description: 'Real-time ad performance metrics'
  },
  {
    icon: Layers,
    title: 'Lookalike Audiences',
    description: 'Create lookalikes from your CRM data'
  },
];

export default function AdsPage() {
  return (
    <ComingSoonPage
      title="Ad Management"
      description="Manage paid advertising across Google, Facebook, LinkedIn, and more. Track ROI, sync audiences, and optimize your ad spend."
      icon={Target}
      features={features}
      backHref="/marketing/campaigns"
      backLabel="Go to Campaigns"
    />
  );
}
