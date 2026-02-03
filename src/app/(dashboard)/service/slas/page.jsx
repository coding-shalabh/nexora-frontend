'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Clock,
  AlertTriangle,
  Target,
  BarChart3,
  Bell,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Response Time SLAs',
    description: 'Set first response time targets'
  },
  {
    icon: Target,
    title: 'Resolution SLAs',
    description: 'Define resolution time expectations'
  },
  {
    icon: AlertTriangle,
    title: 'Breach Alerts',
    description: 'Notifications before SLA breach'
  },
  {
    icon: Bell,
    title: 'Escalations',
    description: 'Auto-escalate breaching tickets'
  },
  {
    icon: BarChart3,
    title: 'SLA Reports',
    description: 'Track SLA compliance metrics'
  },
  {
    icon: Shield,
    title: 'Priority Rules',
    description: 'Different SLAs by priority level'
  },
];

export default function SLAsPage() {
  return (
    <ComingSoonPage
      title="SLA Management"
      description="Define and enforce service level agreements. Set response and resolution targets, get breach alerts, and track compliance."
      icon={Clock}
      features={features}
      backHref="/tickets"
      backLabel="Go to Tickets"
    />
  );
}
