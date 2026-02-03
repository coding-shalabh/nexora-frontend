'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  FileText,
  Palette,
  Smartphone,
  BarChart3,
  Sparkles,
  Copy
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Visual Builder',
    description: 'Drag-and-drop landing page builder'
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Pages that look great on any device'
  },
  {
    icon: Copy,
    title: 'Templates',
    description: 'Professional templates for every use case'
  },
  {
    icon: Sparkles,
    title: 'AI Page Builder',
    description: 'Generate pages with AI assistance'
  },
  {
    icon: BarChart3,
    title: 'A/B Testing',
    description: 'Test and optimize for conversions'
  },
  {
    icon: FileText,
    title: 'Form Integration',
    description: 'Capture leads directly from pages'
  },
];

export default function LandingPagesPage() {
  return (
    <ComingSoonPage
      title="Landing Pages"
      description="Create high-converting landing pages without code. Drag-and-drop builder, A/B testing, and seamless form integration."
      icon={FileText}
      features={features}
      backHref="/forms"
      backLabel="Go to Forms"
    />
  );
}
