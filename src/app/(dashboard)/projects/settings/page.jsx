'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Settings, Users, Bell, Tag, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: Settings,
    title: 'General Settings',
    description: 'Configure project management preferences',
  },
  { icon: Users, title: 'Team Permissions', description: 'Manage team roles and access levels' },
  { icon: Bell, title: 'Notifications', description: 'Set up project notifications and alerts' },
  { icon: Tag, title: 'Labels & Tags', description: 'Customize task labels and categories' },
  { icon: Clock, title: 'Time Tracking', description: 'Configure time tracking rules' },
  { icon: Shield, title: 'Privacy', description: 'Control project visibility settings' },
];

export default function ProjectSettingsPage() {
  return (
    <UnifiedLayout hubId="projects" pageTitle="Project Settings">
      <ComingSoonPage
        title="Project Settings"
        description="Configure project management preferences. Customize labels, manage permissions, and set up notifications."
        icon={Settings}
        features={features}
        backHref="/projects"
        backLabel="Go to Projects"
      />
    </UnifiedLayout>
  );
}
