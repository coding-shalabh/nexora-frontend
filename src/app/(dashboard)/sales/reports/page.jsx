'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { BarChart3, TrendingUp, DollarSign, Target, PieChart, Activity } from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Revenue Analytics',
    description: 'Track revenue trends over time',
  },
  {
    icon: Target,
    title: 'Pipeline Reports',
    description: 'Deal distribution by stage',
  },
  {
    icon: TrendingUp,
    title: 'Performance Metrics',
    description: 'Rep performance tracking',
  },
  {
    icon: PieChart,
    title: 'Win/Loss Analysis',
    description: 'Analyze deal outcomes',
  },
  {
    icon: Activity,
    title: 'Activity Reports',
    description: 'Calls, emails, meetings',
  },
  {
    icon: BarChart3,
    title: 'Custom Reports',
    description: 'Build your own reports',
  },
];

export default function SalesReportsPage() {
  return (
    <ComingSoonPage
      title="Sales Reports"
      description="Sales reports are being consolidated into the central Analytics hub. Visit Analytics for comprehensive sales metrics, pipeline analysis, and team performance."
      icon={BarChart3}
      features={features}
      backHref="/analytics"
      backLabel="Go to Analytics"
    />
  );
}
