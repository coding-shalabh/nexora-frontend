'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HeadphonesIcon,
  Ticket,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowUpRight,
  BookOpen,
  FileQuestion,
  BarChart3,
  Star,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';

// Quick actions for service
const quickActions = [
  {
    label: 'Create Ticket',
    href: '/tickets/new',
    icon: Ticket,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Live Chat',
    href: '/inbox',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
  },
  { label: 'Knowledge Base', href: '/kb', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
  { label: 'Customer Survey', href: '/surveys', icon: Star, color: 'from-orange-500 to-amber-500' },
];

// Recent tickets
const recentTickets = [
  {
    id: 'T-1234',
    subject: 'Unable to login to dashboard',
    customer: 'John Smith',
    priority: 'high',
    status: 'open',
    created: '10 min ago',
  },
  {
    id: 'T-1233',
    subject: 'Billing inquiry for March invoice',
    customer: 'Sarah M.',
    priority: 'medium',
    status: 'pending',
    created: '1 hour ago',
  },
  {
    id: 'T-1232',
    subject: 'Feature request: Dark mode',
    customer: 'Mike R.',
    priority: 'low',
    status: 'open',
    created: '2 hours ago',
  },
  {
    id: 'T-1231',
    subject: 'API rate limit exceeded',
    customer: 'Tech Corp',
    priority: 'high',
    status: 'resolved',
    created: '3 hours ago',
  },
];

// Service tools
const tools = [
  { name: 'Tickets', description: 'Support tickets', href: '/tickets', icon: Ticket },
  { name: 'Live Chat', description: 'Real-time support', href: '/inbox', icon: MessageSquare },
  { name: 'Knowledge Base', description: 'Help articles', href: '/kb', icon: BookOpen },
  { name: 'Customer Portal', description: 'Self-service', href: '/service/portal', icon: Users },
  { name: 'SLAs', description: 'Service levels', href: '/service/slas', icon: Clock },
  { name: 'Surveys', description: 'Feedback collection', href: '/surveys', icon: Star },
];

export default function ServiceHubPage() {
  const stats = [
    createStat('Open Tickets', 47, Ticket, 'blue'),
    createStat('Avg Response', '2.4h', Timer, 'green'),
    createStat('CSAT Score', '4.7', Star, 'amber'),
    createStat('Resolved Today', 23, CheckCircle, 'purple'),
  ];

  const actions = [createAction('New Ticket', Plus, () => {}, { primary: true })];

  return (
    <UnifiedLayout
      hubId="service"
      pageTitle="Service Overview"
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
          {/* Recent Tickets */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Recent Tickets</CardTitle>
              <Link href="/tickets">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {ticket.id}
                        </Badge>
                        <p className="font-medium truncate">{ticket.subject}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{ticket.customer}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {ticket.created}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        'capitalize',
                        ticket.priority === 'high' && 'bg-red-100 text-red-700',
                        ticket.priority === 'medium' && 'bg-yellow-100 text-yellow-700',
                        ticket.priority === 'low' && 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge
                      className={cn(
                        'capitalize',
                        ticket.status === 'open' && 'bg-blue-100 text-blue-700',
                        ticket.status === 'pending' && 'bg-orange-100 text-orange-700',
                        ticket.status === 'resolved' && 'bg-green-100 text-green-700'
                      )}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Tools */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Service Tools</CardTitle>
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

        {/* Ticket Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Ticket Distribution by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    Open
                  </span>
                  <span className="font-medium">24</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    Pending
                  </span>
                  <span className="font-medium">12</span>
                </div>
                <Progress value={24} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    In Progress
                  </span>
                  <span className="font-medium">8</span>
                </div>
                <Progress value={16} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Resolved
                  </span>
                  <span className="font-medium">156</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
