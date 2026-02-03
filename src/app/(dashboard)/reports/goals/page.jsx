'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Target,
  TrendingUp,
  Users,
  Calendar,
  Bell,
  Award
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set revenue, activity, and custom goals'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Real-time goal progress updates'
  },
  {
    icon: Users,
    title: 'Team Goals',
    description: 'Individual and team objectives'
  },
  {
    icon: Calendar,
    title: 'Time Periods',
    description: 'Weekly, monthly, quarterly goals'
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Alerts for goal milestones'
  },
  {
    icon: Award,
    title: 'Achievements',
    description: 'Celebrate goals reached'
  },
];

export default function GoalsPage() {
  return (
    <ComingSoonPage
      title="Goals"
      description="Set and track goals for your team. Revenue targets, activity goals, and custom KPIs with real-time progress tracking."
      icon={Target}
      features={features}
      backHref="/analytics"
      backLabel="Go to Dashboards"
    />
  );
}
