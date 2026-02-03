'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Smartphone,
  Send,
  Users,
  BarChart3,
  Zap,
  MessageSquare
} from 'lucide-react';

const features = [
  {
    icon: Send,
    title: 'Bulk SMS',
    description: 'Send campaigns to thousands instantly'
  },
  {
    icon: Users,
    title: 'Segmentation',
    description: 'Target specific audience segments'
  },
  {
    icon: Zap,
    title: 'Automation',
    description: 'Trigger-based SMS automation'
  },
  {
    icon: MessageSquare,
    title: 'Two-Way SMS',
    description: 'Receive and respond to messages'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track delivery, opens, and clicks'
  },
  {
    icon: Smartphone,
    title: 'Templates',
    description: 'Pre-built SMS templates'
  },
];

export default function SMSMarketingPage() {
  return (
    <ComingSoonPage
      title="SMS Marketing"
      description="Reach customers instantly with SMS campaigns. High open rates, automation, and seamless integration with your CRM."
      icon={Smartphone}
      features={features}
      backHref="/inbox"
      backLabel="Go to Inbox"
    />
  );
}
