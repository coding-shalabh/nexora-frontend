'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { FileText } from 'lucide-react';

export default function LandingPagesPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="Landing Pages" fixedMenu={null}>
      <ComingSoonPage
        title="Landing Pages"
        description="Create high-converting landing pages without code. Drag-and-drop builder, A/B testing, and seamless form integration."
        icon={FileText}
        features={[
          {
            icon: FileText,
            title: 'Visual Builder',
            description: 'Drag-and-drop landing page builder',
          },
          {
            icon: FileText,
            title: 'Mobile Responsive',
            description: 'Pages that look great on any device',
          },
          {
            icon: FileText,
            title: 'Templates',
            description: 'Professional templates for every use case',
          },
          {
            icon: FileText,
            title: 'AI Page Builder',
            description: 'Generate pages with AI assistance',
          },
          {
            icon: FileText,
            title: 'A/B Testing',
            description: 'Test and optimize for conversions',
          },
          {
            icon: FileText,
            title: 'Form Integration',
            description: 'Capture leads directly from pages',
          },
        ]}
        backHref="/forms"
        backLabel="Go to Forms"
      />
    </UnifiedLayout>
  );
}
