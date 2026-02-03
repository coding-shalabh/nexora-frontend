'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  MousePointer,
  Palette,
  Target,
  BarChart3,
  Sparkles,
  Layers
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'CTA Designer',
    description: 'Create eye-catching call-to-action buttons'
  },
  {
    icon: Target,
    title: 'Smart CTAs',
    description: 'Personalized CTAs based on visitor data'
  },
  {
    icon: Layers,
    title: 'Pop-ups & Banners',
    description: 'Exit intent, scroll-triggered pop-ups'
  },
  {
    icon: BarChart3,
    title: 'Click Analytics',
    description: 'Track CTA performance and clicks'
  },
  {
    icon: Sparkles,
    title: 'A/B Testing',
    description: 'Test different CTA variations'
  },
  {
    icon: MousePointer,
    title: 'Embed Anywhere',
    description: 'Add CTAs to any page or email'
  },
];

export default function CTAsPage() {
  return (
    <ComingSoonPage
      title="Calls-to-Action"
      description="Create dynamic, personalized CTAs that convert. Pop-ups, banners, and smart CTAs that adapt to your visitors."
      icon={MousePointer}
      features={features}
      backHref="/marketing/pages"
      backLabel="Go to Landing Pages"
    />
  );
}
