'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  UserCircle,
  Users,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  Wallet,
  Award,
  GraduationCap,
  Plus,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Clock,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

// Quick actions
const quickActions = [
  {
    label: 'Add Employee',
    href: '/hr/employees/new',
    icon: UserPlus,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'Post Job',
    href: '/hr/recruitment/new',
    icon: Briefcase,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Review Leave',
    href: '/hr/leave',
    icon: CalendarDays,
    color: 'from-orange-500 to-amber-500',
  },
  { label: 'Run Payroll', href: '/hr/payroll', icon: Wallet, color: 'from-purple-500 to-pink-500' },
];

// Recent hires
const recentHires = [
  {
    name: 'Sarah Johnson',
    role: 'Product Designer',
    department: 'Design',
    joinDate: 'Dec 20, 2024',
    avatar: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    department: 'Engineering',
    joinDate: 'Dec 18, 2024',
    avatar: 'MC',
  },
  {
    name: 'Emily Brown',
    role: 'Marketing Manager',
    department: 'Marketing',
    joinDate: 'Dec 15, 2024',
    avatar: 'EB',
  },
  {
    name: 'David Wilson',
    role: 'Sales Executive',
    department: 'Sales',
    joinDate: 'Dec 12, 2024',
    avatar: 'DW',
  },
];

// Pending leave requests
const leaveRequests = [
  { name: 'John Doe', type: 'Annual Leave', dates: 'Dec 26-30', days: 5, status: 'pending' },
  { name: 'Jane Smith', type: 'Sick Leave', dates: 'Dec 23', days: 1, status: 'pending' },
  { name: 'Mike Ross', type: 'Work From Home', dates: 'Dec 24-25', days: 2, status: 'approved' },
];

// HR tools
const tools = [
  { name: 'Employees', description: 'Employee directory', href: '/hr/employees', icon: Users },
  {
    name: 'Recruitment',
    description: 'Job postings & hiring',
    href: '/hr/recruitment',
    icon: Briefcase,
  },
  {
    name: 'Attendance',
    description: 'Clock in/out tracking',
    href: '/hr/attendance',
    icon: CalendarCheck,
  },
  { name: 'Leave', description: 'Leave management', href: '/hr/leave', icon: CalendarDays },
  { name: 'Payroll', description: 'Salary processing', href: '/hr/payroll', icon: Wallet },
  { name: 'Performance', description: 'Reviews & goals', href: '/hr/performance', icon: Award },
];

export default function HRHubPage() {
  // Stats for HubLayout
  const stats = [
    createStat('Total Employees', '156', Users, 'blue'),
    createStat('Open Positions', '12', Briefcase, 'green'),
    createStat('On Leave Today', '8', CalendarDays, 'amber'),
    createStat('Pending Reviews', '23', Award, 'purple'),
  ];

  return (
    <HubLayout
      hubId="hr"
      title="HR Overview"
      description="Manage employees, recruitment, payroll, and performance"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
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
          {/* Recent Hires */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Recent Hires</CardTitle>
              <Link href="/hr/employees">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentHires.map((hire) => (
                  <div
                    key={hire.name}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{hire.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{hire.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {hire.role} • {hire.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="text-sm font-medium">{hire.joinDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leave Requests */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Pending Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaveRequests.map((request, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{request.name}</p>
                      <Badge
                        className={cn(
                          'capitalize text-xs',
                          request.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                          request.status === 'approved' && 'bg-green-100 text-green-700'
                        )}
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{request.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {request.dates} ({request.days} days)
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                Review All Requests
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* HR Tools */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">HR Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {tools.map((tool) => (
                <Link key={tool.name} href={tool.href}>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer text-center">
                    <tool.icon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: 'Engineering', count: 45, percentage: 29 },
                { name: 'Sales', count: 32, percentage: 21 },
                { name: 'Marketing', count: 28, percentage: 18 },
                { name: 'Operations', count: 51, percentage: 32 },
              ].map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{dept.name}</span>
                    <span className="font-medium">{dept.count}</span>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}
