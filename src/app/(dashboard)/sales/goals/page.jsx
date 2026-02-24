'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Target,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const salesGoals = [
  {
    id: 1,
    name: 'Q1 Revenue Target',
    target: 500000,
    current: 425000,
    period: 'Q1 2024',
    status: 'on-track',
    assignedTo: 'Sales Team',
  },
  {
    id: 2,
    name: 'New Customer Acquisition',
    target: 50,
    current: 42,
    period: 'Q1 2024',
    status: 'on-track',
    assignedTo: 'Sales Team',
  },
  {
    id: 3,
    name: 'Enterprise Deals',
    target: 10,
    current: 3,
    period: 'Q1 2024',
    status: 'at-risk',
    assignedTo: 'Enterprise Team',
  },
  {
    id: 4,
    name: 'Average Deal Size',
    target: 25000,
    current: 28000,
    period: 'Q1 2024',
    status: 'achieved',
    assignedTo: 'All Reps',
  },
];

export default function SalesGoalsPage() {
  const router = useRouter();

  const stats = [
    createStat('Total Goals', salesGoals.length, Target, 'blue'),
    createStat(
      'On Track',
      salesGoals.filter((g) => g.status === 'on-track').length,
      TrendingUp,
      'green'
    ),
    createStat(
      'At Risk',
      salesGoals.filter((g) => g.status === 'at-risk').length,
      AlertTriangle,
      'orange'
    ),
    createStat(
      'Achieved',
      salesGoals.filter((g) => g.status === 'achieved').length,
      CheckCircle,
      'purple'
    ),
  ];

  const actions = [
    createAction('Add Goal', Plus, () => router.push('/sales/goals/new'), { primary: true }),
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'on-track': 'bg-green-100 text-green-700',
      'at-risk': 'bg-amber-100 text-amber-700',
      achieved: 'bg-blue-100 text-blue-700',
      missed: 'bg-red-100 text-red-700',
    };
    const icons = {
      'on-track': <TrendingUp className="h-3 w-3 mr-1" />,
      'at-risk': <AlertTriangle className="h-3 w-3 mr-1" />,
      achieved: <CheckCircle className="h-3 w-3 mr-1" />,
      missed: <Clock className="h-3 w-3 mr-1" />,
    };
    return (
      <Badge className={styles[status]}>
        {icons[status]}
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const formatValue = (value) => {
    if (value >= 1000) {
      return `$${value.toLocaleString()}`;
    }
    return value;
  };

  return (
    <UnifiedLayout
      hubId="sales"
      pageTitle="Sales Goals"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          {salesGoals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            return (
              <Card key={goal.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {goal.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {goal.assignedTo}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(goal.status)}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span>
                      Current: <span className="font-medium">{formatValue(goal.current)}</span>
                    </span>
                    <span>
                      Target: <span className="font-medium">{formatValue(goal.target)}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        progress >= 100
                          ? 'bg-blue-500'
                          : progress >= 75
                            ? 'bg-green-500'
                            : progress >= 50
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {progress.toFixed(0)}% complete
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </UnifiedLayout>
  );
}
