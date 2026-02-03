'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Star,
  Users,
  Award,
  BarChart3,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const employees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    role: 'Product Designer',
    score: 92,
    goals: { completed: 8, total: 10 },
    rating: 5,
    trend: 'up',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    role: 'Software Engineer',
    score: 88,
    goals: { completed: 7, total: 8 },
    rating: 4,
    trend: 'up',
  },
  {
    id: 3,
    name: 'Emily Brown',
    avatar: 'EB',
    role: 'Marketing Manager',
    score: 75,
    goals: { completed: 5, total: 8 },
    rating: 3,
    trend: 'stable',
  },
  {
    id: 4,
    name: 'David Wilson',
    avatar: 'DW',
    role: 'Sales Executive',
    score: 95,
    goals: { completed: 12, total: 12 },
    rating: 5,
    trend: 'up',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    avatar: 'PS',
    role: 'HR Manager',
    score: 82,
    goals: { completed: 6, total: 8 },
    rating: 4,
    trend: 'down',
  },
];

const stats = [
  { label: 'Avg Performance', value: '86%', icon: BarChart3, color: 'text-blue-600' },
  { label: 'Goals Completed', value: '234', icon: Target, color: 'text-green-600' },
  { label: 'Top Performers', value: '28', icon: Award, color: 'text-purple-600' },
  { label: 'Reviews Due', value: '15', icon: Calendar, color: 'text-orange-600' },
];

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getProgressColor = (score) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 75) return 'bg-blue-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function PerformancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Performance</h1>
          <p className="text-muted-foreground">Track employee performance and goals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Q1 2026
          </Button>
          <Button className="gap-2">
            <Target className="h-4 w-4" />
            Start Review Cycle
          </Button>
        </div>
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
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Employee Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{employee.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{employee.name}</h3>
                    {employee.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className={cn('text-xl font-bold', getScoreColor(employee.score))}>
                      {employee.score}%
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Goals</span>
                      <span>
                        {employee.goals.completed}/{employee.goals.total}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', getProgressColor(employee.score))}
                        style={{
                          width: `${(employee.goals.completed / employee.goals.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < employee.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
