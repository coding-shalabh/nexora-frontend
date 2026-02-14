'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Settings, Bell, Users, Mail, Clock, Shield } from 'lucide-react';

const features = [
  { icon: Settings, title: 'General Settings', description: 'Configure service hub preferences' },
  { icon: Bell, title: 'Notifications', description: 'Set up ticket alerts and reminders' },
  { icon: Users, title: 'Team Settings', description: 'Manage agent roles and permissions' },
  { icon: Mail, title: 'Email Configuration', description: 'Configure support email settings' },
  { icon: Clock, title: 'Business Hours', description: 'Set working hours and holidays' },
  { icon: Shield, title: 'Security', description: 'Access control and data protection' },
];

export default function ServiceSettingsPage() {
  return (
    <UnifiedLayout hubId="service" pageTitle="Service Settings">
      <ComingSoonPage
        title="Service Settings"
        description="Configure your service hub settings. Manage notifications, team settings, email configuration, and business hours."
        icon={Settings}
        features={features}
        backHref="/service"
        backLabel="Go to Service"
      />
    </UnifiedLayout>
  );
}
