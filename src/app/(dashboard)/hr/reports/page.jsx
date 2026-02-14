'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';
import { Users, TrendingUp, Calendar, DollarSign, BarChart3, UserPlus } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Headcount Report',
    description: 'Employee count by department',
  },
  {
    icon: TrendingUp,
    title: 'Attrition Analysis',
    description: 'Turnover rates and trends',
  },
  {
    icon: Calendar,
    title: 'Leave Reports',
    description: 'Leave balances and usage',
  },
  {
    icon: DollarSign,
    title: 'Payroll Summary',
    description: 'Salary and deductions',
  },
  {
    icon: BarChart3,
    title: 'Performance',
    description: 'Rating distribution',
  },
  {
    icon: UserPlus,
    title: 'Recruitment',
    description: 'Pipeline metrics',
  },
];

export default function HRReportsPage() {
  return (
    <UnifiedLayout hubId="hr" pageTitle="HR Reports" fixedMenu={null}>
      <ComingSoonPage
        title="HR Reports"
        description="HR reports are being consolidated into the central Analytics hub. Visit Analytics for comprehensive workforce metrics, attrition analysis, and performance insights."
        icon={BarChart3}
        features={features}
        backHref="/analytics"
        backLabel="Go to Analytics"
      />
    </UnifiedLayout>
  );
}
