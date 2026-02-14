'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Target,
  Calendar,
  Phone,
  Mail,
  Plus,
  ArrowUpRight,
  ArrowUp,
  Clock,
  CheckCircle,
  Briefcase,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Quick actions for sales
const quickActions = [
  {
    label: 'Add Contact',
    href: '/crm/contacts/new',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Create Deal',
    href: '/pipeline/deals/new',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Log Activity',
    href: '/activities/new',
    icon: Calendar,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Schedule Call',
    href: '/meetings/new',
    icon: Phone,
    color: 'from-orange-500 to-amber-500',
  },
];

// Recent deals
const recentDeals = [
  {
    id: '1',
    name: 'Enterprise License',
    company: 'Acme Corp',
    value: 45000,
    stage: 'Negotiation',
    probability: 75,
  },
  {
    id: '2',
    name: 'Annual Contract',
    company: 'Tech Solutions',
    value: 28000,
    stage: 'Proposal',
    probability: 50,
  },
  {
    id: '3',
    name: 'Premium Support',
    company: 'StartupX',
    value: 12000,
    stage: 'Discovery',
    probability: 25,
  },
  {
    id: '4',
    name: 'Software License',
    company: 'Design Co',
    value: 8500,
    stage: 'Qualification',
    probability: 10,
  },
];

// Sales tools
const tools = [
  { name: 'Contacts', description: 'People & leads', href: '/crm/contacts', icon: Users },
  { name: 'Companies', description: 'Organizations', href: '/crm/companies', icon: Building2 },
  { name: 'Deals', description: 'Sales pipeline', href: '/pipeline/deals', icon: DollarSign },
  { name: 'Activities', description: 'Calls & meetings', href: '/activities', icon: Calendar },
  { name: 'Quotes', description: 'Sales quotes', href: '/quotes', icon: Briefcase },
  { name: 'Reports', description: 'Sales analytics', href: '/reports', icon: TrendingUp },
];

// Upcoming activities
const upcomingActivities = [
  { type: 'call', title: 'Call with John Smith', time: 'Today, 2:00 PM', company: 'Acme Corp' },
  {
    type: 'meeting',
    title: 'Demo presentation',
    time: 'Today, 4:30 PM',
    company: 'Tech Solutions',
  },
  { type: 'task', title: 'Send proposal', time: 'Tomorrow, 10:00 AM', company: 'StartupX' },
];

export default function SalesHubPage() {
  const stats = [
    createStat('Total Revenue', '$284,500', DollarSign, 'green'),
    createStat('Active Deals', '67', Briefcase, 'blue'),
    createStat('Contacts', '1,847', Users, 'purple'),
    createStat('Win Rate', '34%', Target, 'orange'),
  ];

  const actions = [
    createAction('New Deal', Plus, () => console.log('new deal'), { primary: true }),
  ];

  return (
    <UnifiedLayout
      hubId="sales"
      pageTitle="Sales Overview"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Deals */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Active Deals</CardTitle>
              <Link href="/pipeline/deals">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{deal.name}</p>
                      <p className="text-sm text-muted-foreground">{deal.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${deal.value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{deal.probability}% prob</p>
                    </div>
                    <Badge variant="outline">{deal.stage}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Tools & Activities */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Sales Tools</CardTitle>
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Upcoming Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={cn(
                          'p-1.5 rounded-full',
                          activity.type === 'call' && 'bg-green-100 text-green-700',
                          activity.type === 'meeting' && 'bg-blue-100 text-blue-700',
                          activity.type === 'task' && 'bg-orange-100 text-orange-700'
                        )}
                      >
                        {activity.type === 'call' && <Phone className="h-3 w-3" />}
                        {activity.type === 'meeting' && <Calendar className="h-3 w-3" />}
                        {activity.type === 'task' && <CheckCircle className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.company}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pipeline Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Pipeline Progress This Quarter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Qualification</span>
                  <span className="font-medium">$45K</span>
                </div>
                <Progress value={25} className="h-2" />
                <p className="text-xs text-muted-foreground">12 deals</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Discovery</span>
                  <span className="font-medium">$78K</span>
                </div>
                <Progress value={45} className="h-2" />
                <p className="text-xs text-muted-foreground">8 deals</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Proposal</span>
                  <span className="font-medium">$120K</span>
                </div>
                <Progress value={70} className="h-2" />
                <p className="text-xs text-muted-foreground">5 deals</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Negotiation</span>
                  <span className="font-medium">$95K</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground">3 deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
