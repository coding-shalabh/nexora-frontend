'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Bot,
  Sparkles,
  MessageSquare,
  Zap,
  Settings,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI Assistants',
    description: 'Autonomous AI agents for sales and support'
  },
  {
    icon: MessageSquare,
    title: 'Conversation AI',
    description: 'AI-powered customer conversations'
  },
  {
    icon: Zap,
    title: 'Task Automation',
    description: 'Agents that complete tasks autonomously'
  },
  {
    icon: Settings,
    title: 'Custom Agents',
    description: 'Build agents for your specific needs'
  },
  {
    icon: Users,
    title: 'Human Handoff',
    description: 'Seamless escalation to humans'
  },
  {
    icon: Bot,
    title: 'Agent Training',
    description: 'Train agents on your data and processes'
  },
];

export default function AIAgentsPage() {
  return (
    <ComingSoonPage
      title="AI Agents"
      description="Deploy AI agents that work 24/7. Prospecting agents, support agents, and custom agents that automate complex workflows."
      icon={Bot}
      features={features}
      backHref="/automation"
      backLabel="Go to Workflows"
    />
  );
}
