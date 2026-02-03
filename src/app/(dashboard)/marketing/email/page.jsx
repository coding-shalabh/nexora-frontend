'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Mail,
  Palette,
  Users,
  BarChart3,
  Sparkles,
  Clock
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Drag-and-Drop Editor',
    description: 'Create beautiful emails without coding'
  },
  {
    icon: Users,
    title: 'List Management',
    description: 'Segment contacts for targeted campaigns'
  },
  {
    icon: Sparkles,
    title: 'AI Content',
    description: 'Generate email content with AI assistance'
  },
  {
    icon: Clock,
    title: 'Send Time Optimization',
    description: 'AI-powered best time to send'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track opens, clicks, and conversions'
  },
  {
    icon: Mail,
    title: 'Templates',
    description: 'Library of professional email templates'
  },
];

export default function EmailMarketingPage() {
  return (
    <ComingSoonPage
      title="Email Marketing"
      description="Create and send beautiful email campaigns that convert. Drag-and-drop editor, A/B testing, and advanced analytics to maximize your email ROI."
      icon={Mail}
      features={features}
      backHref="/inbox"
      backLabel="Go to Inbox"
    />
  );
}
