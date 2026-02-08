'use client';

import { useState } from 'react';
import { BarChart3, Plus, Calendar, Filter, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

const mockCustomReports = [
  {
    id: 1,
    name: 'Monthly Sales Summary',
    type: 'sales',
    lastRun: '2024-03-10',
    schedule: 'monthly',
  },
  {
    id: 2,
    name: 'Top Products Analysis',
    type: 'products',
    lastRun: '2024-03-09',
    schedule: 'weekly',
  },
  {
    id: 3,
    name: 'Customer Revenue Report',
    type: 'customers',
    lastRun: '2024-03-08',
    schedule: 'on-demand',
  },
];

export default function CommerceReportsCustomPage() {
  const stats = [
    createStat('Custom Reports', mockCustomReports.length, BarChart3, 'primary'),
    createStat(
      'Scheduled',
      mockCustomReports.filter((r) => r.schedule !== 'on-demand').length,
      Calendar,
      'blue'
    ),
    createStat('Run This Week', 3, BarChart3, 'green'),
  ];

  const getScheduleBadge = (schedule) => {
    const styles = {
      monthly: 'bg-purple-100 text-purple-700',
      weekly: 'bg-blue-100 text-blue-700',
      'on-demand': 'bg-gray-100 text-gray-700',
    };
    return <Badge className={styles[schedule]}>{schedule}</Badge>;
  };

  return (
    <HubLayout
      hubId="commerce"
      title="Custom Reports"
      description="Create and manage custom commerce reports"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Report
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          {mockCustomReports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <CardDescription>
                    Type: {report.type} • Last run: {report.lastRun}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getScheduleBadge(report.schedule)}
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Custom Report</CardTitle>
            <CardDescription>Build a new report with custom filters and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Create custom reports by selecting metrics, filters, and date ranges
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Building
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}
