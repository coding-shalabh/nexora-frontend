'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';
import { Brain, TrendingUp, Search, Bell, Target, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Topic Tracking',
    description: 'Monitor topics your buyers research',
  },
  {
    icon: TrendingUp,
    title: 'Intent Signals',
    description: 'Identify active buying behavior',
  },
  {
    icon: Bell,
    title: 'Real-time Alerts',
    description: 'Get notified of high-intent prospects',
  },
  {
    icon: Target,
    title: 'Account Intent',
    description: 'Track intent at the account level',
  },
  {
    icon: Brain,
    title: 'AI Predictions',
    description: 'Predict likelihood to purchase',
  },
  {
    icon: BarChart3,
    title: 'Intent Reports',
    description: 'Analyze intent trends and patterns',
  },
];

export default function BuyerIntentPage() {
  return (
    <UnifiedLayout hubId="automation" pageTitle="Buyer Intent">
      <ComingSoonPage
        title="Buyer Intent"
        description="Identify accounts actively researching solutions like yours. Get real-time alerts when prospects show buying signals."
        icon={Brain}
        features={features}
        backHref="/pipeline/leads"
        backLabel="Go to Leads"
      />
    </UnifiedLayout>
  );
}
