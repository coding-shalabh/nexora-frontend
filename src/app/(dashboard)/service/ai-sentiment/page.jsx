'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { Heart, TrendingUp, AlertTriangle, Smile, BarChart3, Bell } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Emotion Detection',
    description: 'Identify customer emotions in real-time',
  },
  {
    icon: AlertTriangle,
    title: 'Frustration Alerts',
    description: 'Get notified of upset customers',
  },
  {
    icon: TrendingUp,
    title: 'Sentiment Trends',
    description: 'Track sentiment changes over time',
  },
  {
    icon: Smile,
    title: 'Satisfaction Scores',
    description: 'Predict customer satisfaction',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Visualize sentiment metrics',
  },
  {
    icon: Bell,
    title: 'Proactive Alerts',
    description: 'Intervene before issues escalate',
  },
];

export default function SentimentAnalysisPage() {
  return (
    <ComingSoonPage
      title="Sentiment Analysis"
      description="Understand customer emotions with AI-powered sentiment analysis. Detect frustration early and take proactive action to improve satisfaction."
      icon={Heart}
      features={features}
      backHref="/service"
      backLabel="Go to Service"
    />
  );
}
