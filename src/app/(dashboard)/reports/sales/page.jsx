'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  PieChart,
  BarChart3
} from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Revenue Analytics',
    description: 'Track revenue and deal metrics'
  },
  {
    icon: TrendingUp,
    title: 'Pipeline Analysis',
    description: 'Pipeline velocity and conversion'
  },
  {
    icon: Users,
    title: 'Rep Performance',
    description: 'Individual rep metrics and rankings'
  },
  {
    icon: Target,
    title: 'Forecast Accuracy',
    description: 'Compare forecasts to actuals'
  },
  {
    icon: PieChart,
    title: 'Win/Loss Analysis',
    description: 'Understand why deals win or lose'
  },
  {
    icon: BarChart3,
    title: 'Activity Metrics',
    description: 'Calls, emails, and meetings data'
  },
];

export default function SalesAnalyticsPage() {
  return (
    <ComingSoonPage
      title="Sales Analytics"
      description="Deep dive into your sales performance. Revenue trends, pipeline health, rep performance, and forecast accuracy."
      icon={TrendingUp}
      features={features}
      backHref="/analytics"
      backLabel="Go to Dashboards"
    />
  );
}
