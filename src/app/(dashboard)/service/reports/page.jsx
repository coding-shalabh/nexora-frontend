'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Ticket, Clock, Star, Users, BarChart3, Activity } from 'lucide-react';

const features = [
  {
    icon: Ticket,
    title: 'Ticket Analytics',
    description: 'Track ticket volume and trends',
  },
  {
    icon: Clock,
    title: 'SLA Compliance',
    description: 'Monitor response and resolution times',
  },
  {
    icon: Star,
    title: 'CSAT & NPS',
    description: 'Customer satisfaction metrics',
  },
  {
    icon: Users,
    title: 'Agent Performance',
    description: 'Individual agent metrics',
  },
  {
    icon: Activity,
    title: 'Trend Analysis',
    description: 'Historical data insights',
  },
  {
    icon: BarChart3,
    title: 'Custom Reports',
    description: 'Build your own reports',
  },
];

export default function ServiceReportsPage() {
  return (
    <ComingSoonPage
      title="Service Reports"
      description="Service reports are being consolidated into the central Analytics hub. Visit Analytics for comprehensive support metrics, SLA compliance, and agent performance."
      icon={BarChart3}
      features={features}
      backHref="/analytics"
      backLabel="Go to Analytics"
    />
  );
}
