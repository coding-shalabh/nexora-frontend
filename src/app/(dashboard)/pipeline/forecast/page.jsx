'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Revenue Forecast',
    description: 'Predict revenue by close date'
  },
  {
    icon: Sparkles,
    title: 'AI Predictions',
    description: 'ML-powered deal predictions'
  },
  {
    icon: Calendar,
    title: 'Time Periods',
    description: 'Monthly, quarterly, yearly views'
  },
  {
    icon: Users,
    title: 'By Rep',
    description: 'Individual rep forecasts'
  },
  {
    icon: BarChart3,
    title: 'Pipeline Coverage',
    description: 'Track coverage ratios'
  },
  {
    icon: TrendingUp,
    title: 'Trends',
    description: 'Historical forecast accuracy'
  },
];

export default function ForecastPage() {
  return (
    <ComingSoonPage
      title="Sales Forecast"
      description="Predict future revenue with AI-powered forecasting. Track pipeline coverage, commit vs. best case, and forecast accuracy."
      icon={TrendingUp}
      features={features}
      backHref="/pipeline/deals"
      backLabel="Go to Deals"
    />
  );
}
