'use client';

import { Settings, Clock, Database, FileOutput, Shield, Calendar } from 'lucide-react';
import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

const features = [
  {
    icon: Clock,
    title: 'Data Retention',
    description: 'Configure how long to keep analytics data',
  },
  { icon: Calendar, title: 'Date Ranges', description: 'Set default date ranges for reports' },
  {
    icon: FileOutput,
    title: 'Export Options',
    description: 'Configure data export formats and schedules',
  },
  { icon: Database, title: 'Data Collection', description: 'Manage what data is collected' },
  { icon: Shield, title: 'Privacy', description: 'Configure privacy and consent settings' },
];

export default function AnalyticsSettingsPage() {
  return (
    <UnifiedLayout hubId="analytics" pageTitle="Analytics Settings">
      <ComingSoonPage
        title="Analytics Settings"
        description="Configure data retention, default date ranges, export options, and privacy settings for your analytics."
        icon={Settings}
        features={features}
        backHref="/analytics"
        backLabel="Go to Analytics"
      />
    </UnifiedLayout>
  );
}
