'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Share2,
  Calendar,
  MessageCircle,
  BarChart3,
  Users,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Content Calendar',
    description: 'Schedule posts across all platforms'
  },
  {
    icon: Share2,
    title: 'Multi-Platform',
    description: 'Publish to LinkedIn, Twitter, Facebook, Instagram'
  },
  {
    icon: MessageCircle,
    title: 'Engagement',
    description: 'Monitor and respond to comments'
  },
  {
    icon: Sparkles,
    title: 'AI Captions',
    description: 'Generate engaging captions with AI'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track reach, engagement, and clicks'
  },
  {
    icon: Users,
    title: 'Lead Generation',
    description: 'Convert social interactions to leads'
  },
];

export default function SocialMarketingPage() {
  return (
    <ComingSoonPage
      title="Social Media Marketing"
      description="Manage all your social media from one place. Schedule posts, monitor engagement, and generate leads from your social presence."
      icon={Share2}
      features={features}
      backHref="/marketing/campaigns"
      backLabel="Go to Campaigns"
    />
  );
}
