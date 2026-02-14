'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, BarChart3, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const revenueBySource = [
  { source: 'Direct Sales', amount: 45000, percentage: 45 },
  { source: 'Online Store', amount: 30000, percentage: 30 },
  { source: 'Subscriptions', amount: 15000, percentage: 15 },
  { source: 'Services', amount: 10000, percentage: 10 },
];

const monthlyRevenue = [
  { month: 'January', revenue: 28000, growth: 5 },
  { month: 'February', revenue: 32000, growth: 14 },
  { month: 'March', revenue: 35000, growth: 9 },
];

export default function CommerceRevenuePage() {
  const totalRevenue = 100000;
  const monthlyGrowth = 12;

  const stats = [
    createStat('Total Revenue', `$${totalRevenue.toLocaleString()}`, DollarSign, 'green'),
    createStat('Monthly Growth', `+${monthlyGrowth}%`, TrendingUp, 'blue'),
    createStat('Avg. Order Value', '$245', BarChart3, 'primary'),
    createStat('Revenue Sources', revenueBySource.length, PieChart, 'purple'),
  ];

  return (
    <UnifiedLayout hubId="commerce" pageTitle="Revenue" stats={stats} fixedMenu={null}>
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Revenue by Source
              </CardTitle>
              <CardDescription>Breakdown of revenue streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBySource.map((item) => (
                  <div key={item.source} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.source}</span>
                      <span className="font-medium">${item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Trend
              </CardTitle>
              <CardDescription>Revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyRevenue.map((item) => (
                  <div
                    key={item.month}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{item.month}</p>
                      <p className="text-2xl font-bold">${item.revenue.toLocaleString()}</p>
                    </div>
                    <Badge
                      className={
                        item.growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }
                    >
                      {item.growth >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {item.growth >= 0 ? '+' : ''}
                      {item.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
            <CardDescription>Key metrics for this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Gross Revenue</p>
                <p className="text-xl font-bold text-green-600">$100,000</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Net Revenue</p>
                <p className="text-xl font-bold text-blue-600">$85,000</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Refunds</p>
                <p className="text-xl font-bold text-purple-600">$5,000</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Discounts</p>
                <p className="text-xl font-bold text-amber-600">$10,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
