'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  Palette,
  Users,
  BarChart3,
  Sparkles,
  Clock,
  Construction,
  ArrowRight,
  Send,
  TrendingUp,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

const features = [
  {
    icon: Palette,
    title: 'Drag-and-Drop Editor',
    description: 'Create beautiful emails without coding',
  },
  {
    icon: Users,
    title: 'List Management',
    description: 'Segment contacts for targeted campaigns',
  },
  {
    icon: Sparkles,
    title: 'AI Content',
    description: 'Generate email content with AI assistance',
  },
  {
    icon: Clock,
    title: 'Send Time Optimization',
    description: 'AI-powered best time to send',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track opens, clicks, and conversions',
  },
  {
    icon: Mail,
    title: 'Templates',
    description: 'Library of professional email templates',
  },
];

export default function EmailMarketingPage() {
  // Stats for HubLayout (placeholder data for coming soon)
  const hubStats = [
    createStat('Campaigns', 0, Send, 'purple'),
    createStat('Subscribers', 0, Users, 'blue'),
    createStat('Avg Open Rate', '0%', TrendingUp, 'green'),
    createStat('Conversions', 0, Target, 'amber'),
  ];

  return (
    <HubLayout
      hubId="marketing"
      showTopBar={false}
      showSidebar={false}
      title="Email Marketing"
      description="Create and send beautiful email campaigns that convert"
      stats={hubStats}
      showFixedMenu={false}
    >
      {/* Coming Soon Content in CONTENT-AREA */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-lg"
          >
            <Mail className="h-12 w-12 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 text-4xl font-bold tracking-tight"
          >
            Email Marketing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-lg text-muted-foreground"
          >
            Create and send beautiful email campaigns that convert. Drag-and-drop editor, A/B
            testing, and advanced analytics to maximize your email ROI.
          </motion.p>

          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="rounded-xl border border-border/50 bg-card/50 p-4 text-left backdrop-blur-sm"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Coming Soon</span>
            </div>
            <Link href="/inbox">
              <Button variant="outline" className="gap-2">
                Go to Inbox
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </HubLayout>
  );
}
