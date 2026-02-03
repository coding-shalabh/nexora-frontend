'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const forecastData = {
  thisQuarter: {
    commit: 1250000,
    bestCase: 1850000,
    pipeline: 2450000,
    closed: 650000,
    quota: 2000000,
  },
  byRep: [
    { name: 'You', commit: 450000, bestCase: 650000, pipeline: 850000, quota: 600000, deals: 12 },
    { name: 'Jane Doe', commit: 380000, bestCase: 580000, pipeline: 720000, quota: 500000, deals: 10 },
    { name: 'Mike Johnson', commit: 420000, bestCase: 620000, pipeline: 880000, quota: 900000, deals: 15 },
  ],
  byMonth: [
    { month: 'January', commit: 420000, bestCase: 620000, pipeline: 820000, closed: 380000 },
    { month: 'February', commit: 450000, bestCase: 650000, pipeline: 850000, closed: 0 },
    { month: 'March', commit: 380000, bestCase: 580000, pipeline: 780000, closed: 270000 },
  ],
  accuracy: {
    lastQuarter: 87,
    last3Months: 82,
    trend: 'up',
  },
};

const dealCategories = [
  { name: 'Commit', value: 1250000, deals: 8, color: 'bg-green-500' },
  { name: 'Best Case', value: 600000, deals: 5, color: 'bg-blue-500' },
  { name: 'Pipeline', value: 600000, deals: 12, color: 'bg-purple-500' },
];

export default function ForecastPage() {
  const [timePeriod, setTimePeriod] = useState('quarter');
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatShortCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const quotaProgress = (forecastData.thisQuarter.closed / forecastData.thisQuarter.quota) * 100;
  const commitProgress = (forecastData.thisQuarter.commit / forecastData.thisQuarter.quota) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Forecast</h1>
          <p className="text-muted-foreground">Track and predict revenue across your sales pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Quota</p>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(forecastData.thisQuarter.quota)}</p>
              <Progress value={quotaProgress} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{quotaProgress.toFixed(0)}% achieved</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Closed Won</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(forecastData.thisQuarter.closed)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {((forecastData.thisQuarter.closed / forecastData.thisQuarter.quota) * 100).toFixed(0)}% of quota
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Commit</p>
              <p className="text-2xl font-bold">{formatCurrency(forecastData.thisQuarter.commit)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {((forecastData.thisQuarter.commit / forecastData.thisQuarter.quota) * 100).toFixed(0)}% of quota
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  forecastData.accuracy.trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}>
                  {forecastData.accuracy.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold">{forecastData.accuracy.lastQuarter}%</p>
              <p className="text-xs text-muted-foreground mt-2">Last quarter accuracy</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Forecast Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Breakdown</CardTitle>
          <CardDescription>Revenue forecast by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dealCategories.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", category.color)} />
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="outline">{category.deals} deals</Badge>
                  </div>
                  <span className="text-lg font-bold">{formatCurrency(category.value)}</span>
                </div>
                <Progress
                  value={(category.value / forecastData.thisQuarter.quota) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-rep">By Rep</TabsTrigger>
          <TabsTrigger value="by-month">By Month</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Total Pipeline</p>
                  <p className="text-2xl font-bold">{formatCurrency(forecastData.thisQuarter.pipeline)}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Best Case</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(forecastData.thisQuarter.bestCase)}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Gap to Quota</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(forecastData.thisQuarter.quota - forecastData.thisQuarter.commit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-rep" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Forecast by Sales Rep</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecastData.byRep.map((rep) => (
                  <div key={rep.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">{rep.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{rep.name}</p>
                          <p className="text-sm text-muted-foreground">{rep.deals} deals</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Quota</p>
                        <p className="font-bold">{formatCurrency(rep.quota)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Commit</p>
                        <p className="font-semibold text-green-600">{formatShortCurrency(rep.commit)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Best Case</p>
                        <p className="font-semibold text-blue-600">{formatShortCurrency(rep.bestCase)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Pipeline</p>
                        <p className="font-semibold text-purple-600">{formatShortCurrency(rep.pipeline)}</p>
                      </div>
                    </div>
                    <Progress value={(rep.commit / rep.quota) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {((rep.commit / rep.quota) * 100).toFixed(0)}% of quota
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-month" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecastData.byMonth.map((month) => (
                  <div key={month.month} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{month.month}</span>
                      </div>
                      {month.closed > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Closed: {formatShortCurrency(month.closed)}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Commit</p>
                        <p className="font-bold">{formatCurrency(month.commit)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Best Case</p>
                        <p className="font-bold">{formatCurrency(month.bestCase)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Pipeline</p>
                        <p className="font-bold">{formatCurrency(month.pipeline)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
