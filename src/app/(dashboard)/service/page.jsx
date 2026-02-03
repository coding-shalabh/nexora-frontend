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

// Quick actions for service
const quickActions = [
  { label: 'Create Ticket', href: '/tickets/new', icon: Ticket, color: 'from-blue-500 to-cyan-500' },
  { label: 'Live Chat', href: '/inbox', icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
  { label: 'Knowledge Base', href: '/kb', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
  { label: 'Customer Survey', href: '/surveys', icon: Star, color: 'from-orange-500 to-amber-500' },
];

// Stats
const stats = [
  { label: 'Open Tickets', value: '47', change: '-8%', positive: true, icon: Ticket, color: 'text-blue-600' },
  { label: 'Avg Response Time', value: '2.4h', change: '-15%', positive: true, icon: Timer, color: 'text-green-600' },
  { label: 'CSAT Score', value: '4.7', change: '+0.2', positive: true, icon: Star, color: 'text-yellow-600' },
  { label: 'Resolved Today', value: '23', change: '+12', positive: true, icon: CheckCircle, color: 'text-purple-600' },
];

// Recent tickets
const recentTickets = [
  { id: 'T-1234', subject: 'Unable to login to dashboard', customer: 'John Smith', priority: 'high', status: 'open', created: '10 min ago' },
  { id: 'T-1233', subject: 'Billing inquiry for March invoice', customer: 'Sarah M.', priority: 'medium', status: 'pending', created: '1 hour ago' },
  { id: 'T-1232', subject: 'Feature request: Dark mode', customer: 'Mike R.', priority: 'low', status: 'open', created: '2 hours ago' },
  { id: 'T-1231', subject: 'API rate limit exceeded', customer: 'Tech Corp', priority: 'high', status: 'resolved', created: '3 hours ago' },
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
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Overview</h1>
          <p className="text-muted-foreground">
            Manage support tickets, knowledge base, and customer satisfaction
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Ticket
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
                  <Badge variant="secondary" className={cn('text-xs', stat.positive ? 'text-green-600' : 'text-red-600')}>
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
                      <Badge variant="outline" className="text-xs font-mono">{ticket.id}</Badge>
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
  );
}
