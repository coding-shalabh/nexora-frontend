'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDeals } from '@/hooks/use-deals';
import { useActivities } from '@/hooks/use-activities';
import { useContacts } from '@/hooks/use-contacts';
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

// Sales tools
const tools = [
  { name: 'Contacts', description: 'People & leads', href: '/crm/contacts', icon: Users },
  { name: 'Companies', description: 'Organizations', href: '/crm/companies', icon: Building2 },
  { name: 'Deals', description: 'Sales pipeline', href: '/pipeline/deals', icon: DollarSign },
  { name: 'Activities', description: 'Calls & meetings', href: '/activities', icon: Calendar },
  { name: 'Quotes', description: 'Sales quotes', href: '/quotes', icon: Briefcase },
  { name: 'Reports', description: 'Sales analytics', href: '/reports', icon: TrendingUp },
];

export default function SalesHubPage() {
  const router = useRouter();

  // Real API data
  const { data: dealsData } = useDeals({ limit: 5 });
  const { data: activitiesData } = useActivities({ limit: 3 });
  const { data: contactsData } = useContacts({ limit: 1 });

  const recentDeals = useMemo(() => dealsData?.data || [], [dealsData]);
  const recentActivities = useMemo(
    () => activitiesData?.data || activitiesData?.activities || [],
    [activitiesData]
  );
  const totalContacts = useMemo(
    () => contactsData?.meta?.total || contactsData?.pagination?.total || 0,
    [contactsData]
  );

  const totalRevenue = useMemo(() => {
    const won = recentDeals.filter((d) => d.stage?.isWon || d.status === 'WON');
    return won.reduce((sum, d) => sum + (d.value || 0), 0);
  }, [recentDeals]);

  const winRate = useMemo(() => {
    const closed = recentDeals.filter(
      (d) => d.stage?.isClosed || d.status === 'WON' || d.status === 'LOST'
    );
    const won = recentDeals.filter((d) => d.stage?.isWon || d.status === 'WON');
    return closed.length > 0 ? Math.round((won.length / closed.length) * 100) : 0;
  }, [recentDeals]);

  const stats = [
    createStat(
      'Revenue',
      totalRevenue > 0 ? `₹${totalRevenue.toLocaleString()}` : '₹0',
      DollarSign,
      'green'
    ),
    createStat('Active Deals', recentDeals.length, Briefcase, 'blue'),
    createStat('Contacts', totalContacts, Users, 'purple'),
    createStat('Win Rate', `${winRate}%`, Target, 'orange'),
  ];

  const actions = [
    createAction('New Deal', Plus, () => router.push('/sales/deals/new'), { primary: true }),
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
                {recentDeals.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No deals yet</p>
                ) : (
                  recentDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{deal.name || deal.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {deal.contact?.firstName} {deal.contact?.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{(deal.value || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {deal.probability || 0}% prob
                        </p>
                      </div>
                      <Badge variant="outline">{deal.stage?.name || deal.stageName || '—'}</Badge>
                    </div>
                  ))
                )}
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
                  {recentActivities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activities
                    </p>
                  ) : (
                    recentActivities.map((activity) => {
                      const type = (activity.type || 'task').toLowerCase();
                      return (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div
                            className={cn(
                              'p-1.5 rounded-full',
                              type === 'call' && 'bg-green-100 text-green-700',
                              type === 'meeting' && 'bg-blue-100 text-blue-700',
                              (type === 'task' || type === 'email') &&
                                'bg-orange-100 text-orange-700'
                            )}
                          >
                            {type === 'call' && <Phone className="h-3 w-3" />}
                            {type === 'meeting' && <Calendar className="h-3 w-3" />}
                            {(type === 'task' || type === 'email') && (
                              <CheckCircle className="h-3 w-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.contact?.firstName} {activity.contact?.lastName}
                            </p>
                            {activity.scheduledAt && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="h-3 w-3" />
                                {new Date(activity.scheduledAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pipeline Progress - derived from real deals */}
        {recentDeals.length > 0 &&
          (() => {
            const stageMap = {};
            recentDeals.forEach((deal) => {
              const stageName = deal.stage?.name || 'Unknown';
              if (!stageMap[stageName]) stageMap[stageName] = { count: 0, value: 0 };
              stageMap[stageName].count += 1;
              stageMap[stageName].value += deal.value || 0;
            });
            const stages = Object.entries(stageMap).slice(0, 4);
            const maxValue = Math.max(...stages.map(([, s]) => s.value), 1);
            return (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Pipeline Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-${Math.min(stages.length, 4)} gap-6`}
                  >
                    {stages.map(([stageName, data]) => (
                      <div key={stageName} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{stageName}</span>
                          <span className="font-medium">₹{Math.round(data.value / 1000)}K</span>
                        </div>
                        <Progress
                          value={Math.round((data.value / maxValue) * 100)}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {data.count} deal{data.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
      </div>
    </UnifiedLayout>
  );
}
