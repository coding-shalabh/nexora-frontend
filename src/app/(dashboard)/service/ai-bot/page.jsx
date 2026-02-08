'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Bot, MessageSquare, Zap, Brain, Settings, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Responses',
    description: 'Automated answers to common questions',
  },
  {
    icon: MessageSquare,
    title: 'Natural Language',
    description: 'Understands customer intent naturally',
  },
  {
    icon: Zap,
    title: 'Instant Replies',
    description: '24/7 instant customer support',
  },
  {
    icon: Brain,
    title: 'Learning System',
    description: 'Improves from interactions over time',
  },
  {
    icon: Settings,
    title: 'Custom Training',
    description: 'Train on your knowledge base',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track chatbot performance metrics',
  },
];

export default function AIChatbotPage() {
  return (
    <ComingSoonPage
      title="AI Chatbot"
      description="Deploy an intelligent chatbot that handles customer inquiries automatically. Train it on your knowledge base for accurate, contextual responses."
      icon={Bot}
      features={features}
      backHref="/service"
      backLabel="Go to Service"
    />
  );
}
