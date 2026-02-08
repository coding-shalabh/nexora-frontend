'use client';

import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: BarChart3,
    title: 'Custom Reports',
    description: 'Build reports with drag-and-drop',
  },
  {
    icon: PieChart,
    title: 'Visualizations',
    description: 'Charts, graphs, and data tables',
  },
  {
    icon: Calendar,
    title: 'Scheduled Reports',
    description: 'Auto-send reports on schedule',
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis',
    description: 'Track metrics over time',
  },
  {
    icon: Download,
    title: 'Export',
    description: 'Export to PDF, Excel, CSV',
  },
  {
    icon: FileText,
    title: 'Templates',
    description: 'Pre-built report templates',
  },
];

export default function ReportsPage() {
  const stats = [
    createStat('Total Reports', 0, FileText, 'blue'),
    createStat('Scheduled', 0, Calendar, 'purple'),
    createStat('Templates', 6, BarChart3, 'green'),
  ];

  return (
    <HubLayout
      hubId="reports"
      title="Reports"
      description="Build custom reports to track any metric. Drag-and-drop builder, scheduled delivery, and multiple export formats."
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button variant="outline" asChild>
          <Link href="/analytics">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Dashboards
          </Link>
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Banner */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground text-lg">
              We're working hard to bring you powerful reporting capabilities.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card className="mt-8 p-6 bg-muted/50 border-dashed">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">What to Expect</h3>
                <p className="text-sm text-muted-foreground">
                  Our reporting system will allow you to create custom dashboards with drag-and-drop
                  widgets, schedule automated report deliveries via email, and export data in
                  multiple formats including PDF, Excel, and CSV. You'll be able to track any metric
                  across your business operations with powerful visualization tools.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </HubLayout>
  );
}
