'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiggyBank,
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const budgets = [
  {
    id: 1,
    department: 'Engineering',
    allocated: 500000,
    spent: 420000,
    remaining: 80000,
    status: 'on-track',
  },
  {
    id: 2,
    department: 'Marketing',
    allocated: 300000,
    spent: 285000,
    remaining: 15000,
    status: 'warning',
  },
  {
    id: 3,
    department: 'Sales',
    allocated: 250000,
    spent: 180000,
    remaining: 70000,
    status: 'on-track',
  },
  {
    id: 4,
    department: 'HR',
    allocated: 150000,
    spent: 165000,
    remaining: -15000,
    status: 'exceeded',
  },
  {
    id: 5,
    department: 'Operations',
    allocated: 400000,
    spent: 320000,
    remaining: 80000,
    status: 'on-track',
  },
  {
    id: 6,
    department: 'Finance',
    allocated: 100000,
    spent: 45000,
    remaining: 55000,
    status: 'under',
  },
];

const stats = [
  { label: 'Total Budget', value: '₹17L', icon: PiggyBank, color: 'text-blue-600' },
  { label: 'Total Spent', value: '₹14.15L', icon: TrendingDown, color: 'text-orange-600' },
  { label: 'Remaining', value: '₹2.85L', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Exceeded', value: '1', icon: AlertTriangle, color: 'text-red-600' },
];

const formatCurrency = (amount) => {
  const absAmount = Math.abs(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(absAmount);
};

const getStatusBadge = (status) => {
  const styles = {
    'on-track': 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    exceeded: 'bg-red-100 text-red-700',
    under: 'bg-blue-100 text-blue-700',
  };
  const labels = {
    'on-track': 'On Track',
    warning: 'Warning',
    exceeded: 'Exceeded',
    under: 'Under Budget',
  };
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
};

const getProgressColor = (status) => {
  if (status === 'exceeded') return 'bg-red-500';
  if (status === 'warning') return 'bg-yellow-500';
  if (status === 'under') return 'bg-blue-500';
  return 'bg-green-500';
};

export default function BudgetsPage() {
  const [period, setPeriod] = useState('q1');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">Track departmental budgets and spending</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1">Q1 2026</SelectItem>
              <SelectItem value="q4">Q4 2025</SelectItem>
              <SelectItem value="q3">Q3 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Budget
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget, index) => (
          <motion.div
            key={budget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{budget.department}</h3>
                  {getStatusBadge(budget.status)}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', getProgressColor(budget.status))}
                        style={{
                          width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p
                        className={cn(
                          'font-medium',
                          budget.remaining < 0 ? 'text-red-600' : 'text-green-600'
                        )}
                      >
                        {budget.remaining < 0 && '-'}
                        {formatCurrency(budget.remaining)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Utilization</p>
                      <p className="font-medium">
                        {Math.round((budget.spent / budget.allocated) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
