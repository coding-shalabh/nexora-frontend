'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Copy, FolderKanban, Star, Edit, Layers, CheckCircle2 } from 'lucide-react';

const features = [
  { icon: Copy, title: 'Project Templates', description: 'Create new projects from templates' },
  {
    icon: FolderKanban,
    title: 'Built-in Templates',
    description: 'Use pre-built project templates',
  },
  { icon: Star, title: 'Favorites', description: 'Mark frequently used templates' },
  { icon: Edit, title: 'Customization', description: 'Modify templates to fit your needs' },
  { icon: Layers, title: 'Categories', description: 'Organize templates by category' },
  { icon: CheckCircle2, title: 'Quick Start', description: 'Start projects faster with templates' },
];

export default function ProjectTemplatesPage() {
  return (
    <UnifiedLayout hubId="projects" pageTitle="Project Templates">
      <ComingSoonPage
        title="Project Templates"
        description="Start new projects faster with pre-built templates. Save time by reusing project structures, tasks, and milestones."
        icon={Copy}
        features={features}
        backHref="/projects"
        backLabel="Go to Projects"
      />
    </UnifiedLayout>
  );
}
