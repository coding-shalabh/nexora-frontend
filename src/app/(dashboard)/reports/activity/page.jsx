'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Activity,
  Clock,
  Users,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Activity Timeline',
    description: 'Real-time feed of all activities'
  },
  {
    icon: Users,
    title: 'Team Activity',
    description: 'See what your team is working on'
  },
  {
    icon: MessageSquare,
    title: 'Conversations',
    description: 'Track all customer communications'
  },
  {
    icon: Phone,
    title: 'Calls',
    description: 'Call logs and recordings'
  },
  {
    icon: Mail,
    title: 'Emails',
    description: 'Email activity and engagement'
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    description: 'See how time is spent'
  },
];

export default function ActivityFeedPage() {
  return (
    <ComingSoonPage
      title="Activity Feed"
      description="Stay on top of everything happening in your CRM. Real-time activity feed for all sales, marketing, and support interactions."
      icon={Activity}
      features={features}
      backHref="/analytics"
      backLabel="Go to Dashboards"
    />
  );
}
