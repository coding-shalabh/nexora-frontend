'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Timer, Clock, Calendar, Users, FileText, DollarSign } from 'lucide-react';

const features = [
  { icon: Timer, title: 'Time Entries', description: 'View and review time entries from team' },
  {
    icon: Clock,
    title: 'Approval Workflow',
    description: 'Review and approve timesheet submissions',
  },
  { icon: Calendar, title: 'Weekly View', description: 'See timesheets organized by week' },
  { icon: Users, title: 'Team Overview', description: 'View time entries across all team members' },
  { icon: FileText, title: 'Export Reports', description: 'Export timesheet data for payroll' },
  { icon: DollarSign, title: 'Billable Hours', description: 'Track billable vs non-billable time' },
];

export default function TimesheetsPage() {
  return (
    <UnifiedLayout hubId="projects" pageTitle="Timesheets">
      <ComingSoonPage
        title="Timesheets"
        description="Review and approve time entries from your team. Track billable hours, manage approvals, and export reports for payroll."
        icon={Timer}
        features={features}
        backHref="/projects"
        backLabel="Go to Projects"
      />
    </UnifiedLayout>
  );
}
