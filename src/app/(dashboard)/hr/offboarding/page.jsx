'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserMinus,
  Plus,
  Search,
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  FileText,
  Key,
  Laptop,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const offboardingCases = [
  {
    id: 1,
    name: 'Alex Thompson',
    avatar: 'AT',
    role: 'Software Engineer',
    department: 'Engineering',
    lastDay: '2026-01-31',
    reason: 'Resignation',
    progress: 75,
    tasks: { completed: 6, total: 8 },
    status: 'in-progress',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    avatar: 'MG',
    role: 'Marketing Specialist',
    department: 'Marketing',
    lastDay: '2026-02-15',
    reason: 'Career Change',
    progress: 25,
    tasks: { completed: 2, total: 8 },
    status: 'in-progress',
  },
  {
    id: 3,
    name: 'Robert Kim',
    avatar: 'RK',
    role: 'Sales Executive',
    department: 'Sales',
    lastDay: '2026-01-20',
    reason: 'Retirement',
    progress: 100,
    tasks: { completed: 8, total: 8 },
    status: 'completed',
  },
  {
    id: 4,
    name: 'Lisa Wang',
    avatar: 'LW',
    role: 'HR Coordinator',
    department: 'HR',
    lastDay: '2026-02-28',
    reason: 'Relocation',
    progress: 0,
    tasks: { completed: 0, total: 8 },
    status: 'pending',
  },
];

const checklistItems = [
  { icon: FileText, label: 'Exit Interview', status: 'completed' },
  { icon: Key, label: 'Access Revoked', status: 'completed' },
  { icon: Laptop, label: 'Equipment Return', status: 'pending' },
  { icon: CreditCard, label: 'Final Settlement', status: 'pending' },
];

const stats = [
  { label: 'Active Offboarding', value: '4', icon: UserMinus, color: 'text-orange-600' },
  { label: 'Pending Exit', value: '2', icon: Clock, color: 'text-yellow-600' },
  { label: 'Completed (Month)', value: '8', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Pending Tasks', value: '12', icon: AlertTriangle, color: 'text-red-600' },
];

const getStatusBadge = (status) => {
  const styles = {
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
  };
  const labels = {
    'in-progress': 'In Progress',
    completed: 'Completed',
    pending: 'Pending',
  };
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
};

export default function OffboardingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offboarding</h1>
          <p className="text-muted-foreground">Manage employee exits and transitions</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Initiate Offboarding
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offboarding cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {offboardingCases.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{employee.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {employee.role} • {employee.department}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(employee.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Last Working Day</p>
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar className="h-4 w-4" />
                      {employee.lastDay}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reason</p>
                    <p className="font-medium">{employee.reason}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tasks Progress</span>
                    <span>
                      {employee.tasks.completed}/{employee.tasks.total} completed
                    </span>
                  </div>
                  <Progress value={employee.progress} className="h-2" />
                </div>

                <div className="mt-4 flex gap-2">
                  {checklistItems.slice(0, 4).map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center gap-1 text-xs px-2 py-1 rounded',
                        i < employee.tasks.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      <item.icon className="h-3 w-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
