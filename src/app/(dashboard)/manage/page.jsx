'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileCode,
  Tags,
  FileText,
  Users,
  GitBranch,
  Repeat,
  Database,
  History,
  ArrowRight,
  TrendingUp,
  Clock,
  Settings,
  Zap,
  Shield,
  Activity,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Management areas with stats
const managementAreas = [
  {
    title: 'Custom Fields',
    description: 'Define custom properties for contacts, companies, deals, and more',
    href: '/manage/fields',
    icon: FileCode,
    color: 'from-blue-500 to-cyan-500',
    stats: { total: 47, apps: 4 },
    badge: 'Essential',
  },
  {
    title: 'Tags',
    description: 'Organize and categorize records with color-coded tags',
    href: '/manage/tags',
    icon: Tags,
    color: 'from-purple-500 to-pink-500',
    stats: { total: 23, usage: '89%' },
    badge: null,
  },
  {
    title: 'Templates',
    description: 'Email, WhatsApp, and SMS message templates',
    href: '/manage/templates',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    stats: { total: 34, approved: 28 },
    badge: 'Popular',
  },
  {
    title: 'Segments & Lists',
    description: 'Create dynamic segments and static lists for targeting',
    href: '/manage/segments',
    icon: Users,
    color: 'from-orange-500 to-amber-500',
    stats: { total: 15, contacts: '12.5K' },
    badge: null,
  },
  {
    title: 'Pipelines',
    description: 'Configure sales and support pipelines with custom stages',
    href: '/manage/pipelines',
    icon: GitBranch,
    color: 'from-indigo-500 to-violet-500',
    stats: { total: 4, stages: 18 },
    badge: null,
  },
  {
    title: 'Lifecycle Stages',
    description: 'Define customer journey stages from lead to advocate',
    href: '/manage/lifecycle',
    icon: Repeat,
    color: 'from-teal-500 to-cyan-500',
    stats: { total: 8, active: 8 },
    badge: null,
  },
  {
    title: 'Data Tools',
    description: 'Import, export, merge duplicates, and bulk operations',
    href: '/manage/data',
    icon: Database,
    color: 'from-rose-500 to-pink-500',
    stats: { lastImport: '2 days ago', records: '45K' },
    badge: 'New',
  },
  {
    title: 'Audit Logs',
    description: 'Track all changes and activities across your workspace',
    href: '/manage/audit',
    icon: History,
    color: 'from-slate-500 to-zinc-500',
    stats: { events: '2.3M', retention: '90 days' },
    badge: null,
  },
];

// Quick stats
const quickStats = [
  { label: 'Custom Fields', value: '47', change: '+5', trend: 'up' },
  { label: 'Active Templates', value: '28', change: '+3', trend: 'up' },
  { label: 'Segments', value: '15', change: '+2', trend: 'up' },
  { label: 'Data Health', value: '94%', change: '+1%', trend: 'up' },
];

// Recent activity
const recentActivity = [
  {
    action: 'Created custom field',
    target: 'Lead Score (Deals)',
    user: 'John D.',
    time: '2h ago',
    icon: FileCode,
  },
  {
    action: 'Updated template',
    target: 'Welcome Email',
    user: 'Sarah M.',
    time: '4h ago',
    icon: FileText,
  },
  {
    action: 'Imported contacts',
    target: '1,234 records',
    user: 'Mike R.',
    time: '1d ago',
    icon: Database,
  },
  {
    action: 'Created segment',
    target: 'High-Value Leads',
    user: 'John D.',
    time: '2d ago',
    icon: Users,
  },
  {
    action: 'Modified pipeline',
    target: 'Sales Pipeline',
    user: 'Sarah M.',
    time: '3d ago',
    icon: GitBranch,
  },
];

// Health indicators
const healthIndicators = [
  { label: 'Custom Fields Coverage', value: 87, status: 'good' },
  { label: 'Template Approval Rate', value: 82, status: 'good' },
  { label: 'Data Completeness', value: 94, status: 'excellent' },
  { label: 'Duplicate Rate', value: 3, status: 'good', inverse: true },
];

export default function ManageOverviewPage() {
  const layoutStats = [
    createStat('Fields', '47', FileCode, 'blue'),
    createStat('Templates', '28', FileText, 'green'),
    createStat('Segments', '15', Users, 'purple'),
    createStat('Health', '94%', Activity, 'orange'),
  ];

  const actionButtons = (
    <Button variant="outline" size="sm" asChild>
      <Link href="/settings">
        <Settings className="h-4 w-4 mr-2" />
        All Settings
      </Link>
    </Button>
  );

  const mainContent = (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Management Areas Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Management Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {managementAreas.map((area, index) => (
            <motion.div
              key={area.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={area.href}>
                <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${area.color}`}>
                        <area.icon className="h-5 w-5 text-white" />
                      </div>
                      {area.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {area.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {area.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {Object.entries(area.stats)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <span key={key} className="capitalize">
                              {value} {key}
                            </span>
                          ))}
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Data Health
            </CardTitle>
            <CardDescription>Monitor the health and quality of your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthIndicators.map((indicator) => (
              <div key={indicator.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{indicator.label}</span>
                  <span
                    className={`font-medium ${
                      indicator.inverse
                        ? indicator.value < 5
                          ? 'text-green-600'
                          : indicator.value < 10
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        : indicator.value >= 90
                          ? 'text-green-600'
                          : indicator.value >= 70
                            ? 'text-yellow-600'
                            : 'text-red-600'
                    }`}
                  >
                    {indicator.value}
                    {indicator.inverse ? '%' : '%'}
                  </span>
                </div>
                <Progress
                  value={indicator.inverse ? 100 - indicator.value : indicator.value}
                  className="h-2"
                />
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link href="/manage/data">
                View Data Tools
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest configuration changes in your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 py-2 border-b last:border-0"
                >
                  <div className="p-2 rounded-lg bg-muted">
                    <activity.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>{' '}
                      <span className="text-muted-foreground">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link href="/manage/audit">
                View All Activity
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/manage/fields">
                <FileCode className="h-4 w-4 mr-2" />
                Add Custom Field
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/manage/tags">
                <Tags className="h-4 w-4 mr-2" />
                Create Tag
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/manage/templates">
                <FileText className="h-4 w-4 mr-2" />
                New Template
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/manage/segments">
                <Users className="h-4 w-4 mr-2" />
                Create Segment
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/manage/data">
                <Database className="h-4 w-4 mr-2" />
                Import Data
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <HubLayout
      hubId="manage"
      title="Management Center"
      description="Configure and manage global settings across all Nexora apps"
      stats={layoutStats}
      actions={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
