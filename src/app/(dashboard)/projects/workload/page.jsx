'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Users, BarChart3, Calendar, AlertCircle, Clock, Target } from 'lucide-react';

const features = [
  { icon: Users, title: 'Team Capacity', description: 'View team member availability' },
  { icon: BarChart3, title: 'Workload Charts', description: 'Visualize work distribution' },
  { icon: Calendar, title: 'Resource Planning', description: 'Plan resource allocation by week' },
  { icon: AlertCircle, title: 'Overload Alerts', description: 'Identify overworked team members' },
  { icon: Clock, title: 'Hours Tracking', description: 'Track estimated vs actual hours' },
  { icon: Target, title: 'Utilization', description: 'Monitor team utilization rates' },
];

export default function WorkloadPage() {
  return (
    <UnifiedLayout hubId="projects" pageTitle="Team Workload">
      <ComingSoonPage
        title="Team Workload"
        description="Monitor team capacity and resource allocation. Balance workloads, identify bottlenecks, and ensure optimal team utilization."
        icon={Users}
        features={features}
        backHref="/projects"
        backLabel="Go to Projects"
      />
    </UnifiedLayout>
  );
}
