'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Flag, Target, Calendar, Bell, CheckCircle2, Clock } from 'lucide-react';

const features = [
  {
    icon: Flag,
    title: 'Milestone Tracking',
    description: 'Track project milestones and key deliverables',
  },
  { icon: Target, title: 'Goal Setting', description: 'Set clear goals and success criteria' },
  {
    icon: Calendar,
    title: 'Timeline View',
    description: 'Visualize milestones on project timeline',
  },
  { icon: Bell, title: 'Reminders', description: 'Get notified before milestone deadlines' },
  {
    icon: CheckCircle2,
    title: 'Progress Tracking',
    description: 'Monitor milestone completion status',
  },
  { icon: Clock, title: 'Due Dates', description: 'Set and manage milestone due dates' },
];

export default function MilestonesPage() {
  return (
    <UnifiedLayout hubId="projects" pageTitle="Milestones">
      <ComingSoonPage
        title="Milestones"
        description="Track project milestones and deadlines. Set key deliverables, monitor progress, and keep your team aligned on important goals."
        icon={Flag}
        features={features}
        backHref="/projects"
        backLabel="Go to Projects"
      />
    </UnifiedLayout>
  );
}
