'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { UnifiedLayout } from '@/components/layout/unified';
import { Sparkles, MessageSquare, Zap, Brain, FileText, Settings } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Smart Suggestions',
    description: 'AI-generated response suggestions',
  },
  {
    icon: MessageSquare,
    title: 'Context-Aware',
    description: 'Responses based on conversation history',
  },
  {
    icon: FileText,
    title: 'Template Integration',
    description: 'Combine AI with your templates',
  },
  {
    icon: Brain,
    title: 'Learning System',
    description: 'Learns from your best responses',
  },
  {
    icon: Zap,
    title: 'One-Click Send',
    description: 'Accept and send with one click',
  },
  {
    icon: Settings,
    title: 'Customization',
    description: 'Adjust tone and style preferences',
  },
];

export default function ReplySuggestionsPage() {
  return (
    <UnifiedLayout hubId="service" pageTitle="Reply Suggestions" fixedMenu={null}>
      <ComingSoonPage
        title="Reply Suggestions"
        description="Get AI-powered response suggestions for faster ticket resolution. Context-aware replies that match your brand voice and style."
        icon={Sparkles}
        features={features}
        backHref="/service"
        backLabel="Go to Service"
      />
    </UnifiedLayout>
  );
}
