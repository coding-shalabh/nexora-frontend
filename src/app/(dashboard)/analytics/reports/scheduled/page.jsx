'use client';

import { useState } from 'react';
import { Clock, Plus, Calendar, Mail, Pause, Play, Trash2, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

const mockScheduledReports = [
  {
    id: 1,
    name: 'Weekly Sales Report',
    schedule: 'Every Monday at 9:00 AM',
    recipients: 3,
    status: 'active',
    lastRun: '2024-03-04',
    nextRun: '2024-03-11',
  },
  {
    id: 2,
    name: 'Monthly Revenue Summary',
    schedule: '1st of every month at 8:00 AM',
    recipients: 5,
    status: 'active',
    lastRun: '2024-03-01',
    nextRun: '2024-04-01',
  },
  {
    id: 3,
    name: 'Daily Activity Report',
    schedule: 'Every day at 6:00 PM',
    recipients: 2,
    status: 'paused',
    lastRun: '2024-03-09',
    nextRun: '-',
  },
];

export default function AnalyticsReportsScheduledPage() {
  const stats = [
    createStat('Scheduled Reports', mockScheduledReports.length, Clock, 'primary'),
    createStat(
      'Active',
      mockScheduledReports.filter((r) => r.status === 'active').length,
      Play,
      'green'
    ),
    createStat(
      'Paused',
      mockScheduledReports.filter((r) => r.status === 'paused').length,
      Pause,
      'amber'
    ),
    createStat(
      'Recipients',
      mockScheduledReports.reduce((sum, r) => sum + r.recipients, 0),
      Mail,
      'blue'
    ),
  ];

  return (
    <HubLayout
      hubId="analytics"
      title="Scheduled Reports"
      description="Manage automated report delivery"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Report
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          {mockScheduledReports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.schedule}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {report.recipients} recipients
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      report.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }
                  >
                    {report.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    {report.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-8 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Last run:</span> {report.lastRun}
                  </div>
                  <div>
                    <span className="font-medium">Next run:</span> {report.nextRun}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </HubLayout>
  );
}
