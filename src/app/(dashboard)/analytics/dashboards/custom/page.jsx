'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Plus,
  Settings,
  Trash2,
  Copy,
  BarChart3,
  PieChart,
  LineChart,
  Grid3X3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const mockDashboards = [
  { id: 1, name: 'Sales Overview', widgets: 6, lastModified: '2024-03-10', status: 'active' },
  { id: 2, name: 'Marketing Metrics', widgets: 4, lastModified: '2024-03-09', status: 'active' },
  { id: 3, name: 'Customer Insights', widgets: 8, lastModified: '2024-03-08', status: 'draft' },
];

const widgetTypes = [
  { name: 'Bar Chart', icon: BarChart3 },
  { name: 'Pie Chart', icon: PieChart },
  { name: 'Line Chart', icon: LineChart },
  { name: 'Table', icon: Grid3X3 },
];

export default function AnalyticsDashboardsCustomPage() {
  const stats = [
    createStat('Custom Dashboards', mockDashboards.length, LayoutDashboard, 'primary'),
    createStat(
      'Active',
      mockDashboards.filter((d) => d.status === 'active').length,
      LayoutDashboard,
      'green'
    ),
    createStat(
      'Total Widgets',
      mockDashboards.reduce((sum, d) => sum + d.widgets, 0),
      Grid3X3,
      'blue'
    ),
  ];

  return (
    <UnifiedLayout hubId="analytics" pageTitle="Custom Dashboards" stats={stats} fixedMenu={null}>
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          {mockDashboards.map((dashboard) => (
            <Card key={dashboard.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                  <CardDescription>
                    {dashboard.widgets} widgets • Last modified: {dashboard.lastModified}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={dashboard.status === 'active' ? 'default' : 'secondary'}>
                    {dashboard.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Widget Types</CardTitle>
            <CardDescription>Add these to your custom dashboards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {widgetTypes.map((widget) => (
                <div
                  key={widget.name}
                  className="p-4 rounded-lg border text-center hover:border-primary/50 cursor-pointer transition-colors"
                >
                  <widget.icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">{widget.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
