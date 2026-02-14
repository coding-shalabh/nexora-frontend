'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Timer, Clock, DollarSign, BarChart3, Calendar, FileText } from 'lucide-react';

const features = [
  { icon: Timer, title: 'Time Logging', description: 'Track time spent on projects and tasks' },
  { icon: Clock, title: 'Time Entries', description: 'View and manage all time entries' },
  { icon: DollarSign, title: 'Billable Hours', description: 'Track billable vs non-billable time' },
  { icon: BarChart3, title: 'Time Reports', description: 'Generate time tracking reports' },
  { icon: Calendar, title: 'Weekly View', description: 'See time entries by week' },
  { icon: FileText, title: 'Export', description: 'Export time data for invoicing' },
];

export default function TimeTrackingPage() {
  return (
    <UnifiedLayout hubId="projects" pageTitle="Time Tracking">
      <ComingSoonPage
        title="Time Tracking"
        description="Track time spent on projects and tasks. Log hours, manage billable time, and generate reports for invoicing."
        icon={Timer}
        features={features}
        backHref="/projects"
        backLabel="Go to Projects"
      />
    </UnifiedLayout>
  );
}
