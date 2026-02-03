'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Megaphone,
  Mail,
  MessageSquare,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  Calendar,
  Plus,
  ArrowUpRight,
  Eye,
  MousePointer,
  Send,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Quick actions for marketing
const quickActions = [
  { label: 'Send Broadcast', href: '/marketing/broadcasts', icon: Send, color: 'from-green-500 to-emerald-500' },
  { label: 'Create Campaign', href: '/marketing/campaigns/new', icon: Megaphone, color: 'from-purple-500 to-pink-500' },
  { label: 'Send Email', href: '/marketing/email/compose', icon: Mail, color: 'from-blue-500 to-cyan-500' },
  { label: 'Schedule Post', href: '/marketing/social/new', icon: Calendar, color: 'from-orange-500 to-amber-500' },
];

// Stats
const stats = [
  { label: 'Total Contacts', value: '12,847', change: '+12%', icon: Users, color: 'text-blue-600' },
  { label: 'Email Open Rate', value: '34.2%', change: '+5%', icon: Eye, color: 'text-green-600' },
  { label: 'Click Rate', value: '8.7%', change: '+2%', icon: MousePointer, color: 'text-purple-600' },
  { label: 'Emails Sent', value: '45,230', change: '+18%', icon: Send, color: 'text-orange-600' },
];

// Recent campaigns
const recentCampaigns = [
  { id: '1', name: 'Spring Sale 2024', type: 'Email', status: 'active', sent: 12500, opened: 4200, clicks: 890 },
  { id: '2', name: 'Product Launch', type: 'Multi-channel', status: 'scheduled', sent: 0, opened: 0, clicks: 0 },
  { id: '3', name: 'Newsletter Weekly', type: 'Email', status: 'completed', sent: 8900, opened: 3100, clicks: 620 },
  { id: '4', name: 'Summer Promo', type: 'SMS', status: 'draft', sent: 0, opened: 0, clicks: 0 },
];

// Marketing tools
const tools = [
  { name: 'Broadcasts', description: 'Bulk messaging', href: '/marketing/broadcasts', icon: Send },
  { name: 'Campaigns', description: 'Multi-channel campaigns', href: '/marketing/campaigns', icon: Megaphone },
  { name: 'Email', description: 'Email marketing', href: '/marketing/email', icon: Mail },
  { name: 'SMS', description: 'Text messaging', href: '/marketing/sms', icon: MessageSquare },
  { name: 'Social', description: 'Social media', href: '/marketing/social', icon: Target },
  { name: 'Forms', description: 'Lead capture forms', href: '/forms', icon: FileText },
  { name: 'Landing Pages', description: 'Page builder', href: '/marketing/pages', icon: FileText },
];

export default function MarketingHubPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing Overview</h1>
          <p className="text-muted-foreground">
            Manage campaigns, emails, and grow your audience
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={action.href}>
              <Card className="hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg bg-gradient-to-br', action.color)}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                  <Badge variant="secondary" className="text-xs text-green-600">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Campaigns</CardTitle>
            <Link href="/marketing/campaigns">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{campaign.name}</p>
                      <Badge variant="outline" className="text-xs">{campaign.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      {campaign.sent > 0 && <span>{campaign.sent.toLocaleString()} sent</span>}
                      {campaign.opened > 0 && <span>{campaign.opened.toLocaleString()} opened</span>}
                      {campaign.clicks > 0 && <span>{campaign.clicks.toLocaleString()} clicks</span>}
                      {campaign.sent === 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Not started</span>}
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      'capitalize',
                      campaign.status === 'active' && 'bg-green-100 text-green-700',
                      campaign.status === 'scheduled' && 'bg-blue-100 text-blue-700',
                      campaign.status === 'completed' && 'bg-gray-100 text-gray-700',
                      campaign.status === 'draft' && 'bg-yellow-100 text-yellow-700'
                    )}
                  >
                    {campaign.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Marketing Tools */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Marketing Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tools.map((tool) => (
                <Link key={tool.name} href={tool.href}>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <tool.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Email Performance This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Open Rate</span>
                <span className="font-medium">34.2%</span>
              </div>
              <Progress value={34.2} className="h-2" />
              <p className="text-xs text-muted-foreground">Industry avg: 21.5%</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Click Rate</span>
                <span className="font-medium">8.7%</span>
              </div>
              <Progress value={8.7} className="h-2" />
              <p className="text-xs text-muted-foreground">Industry avg: 2.6%</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bounce Rate</span>
                <span className="font-medium">1.2%</span>
              </div>
              <Progress value={1.2} className="h-2" />
              <p className="text-xs text-muted-foreground">Industry avg: 2.1%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
