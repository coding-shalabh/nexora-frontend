'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Calendar, Clock, Flag, Users, Bell, Eye } from 'lucide-react';

const features = [
  { icon: Calendar, title: 'Calendar View', description: 'View project events on calendar' },
  { icon: Clock, title: 'Deadlines', description: 'Track upcoming task and project deadlines' },
  { icon: Flag, title: 'Milestones', description: 'See milestones on the timeline' },
  { icon: Users, title: 'Team Events', description: 'View team meetings and reviews' },
  { icon: Bell, title: 'Reminders', description: 'Get reminders for important dates' },
  { icon: Eye, title: 'Multiple Views', description: 'Day, week, and month calendar views' },
];

export default function ProjectCalendarPage() {
  return (
    <UnifiedLayout hubId="projects" pageTitle="Project Calendar">
      <ComingSoonPage
        title="Project Calendar"
        description="View project timeline and deadlines in a calendar format. Track milestones, team events, and important dates all in one place."
        icon={Calendar}
        features={features}
        backHref="/projects"
        backLabel="Go to Projects"
      />
    </UnifiedLayout>
  );
}
