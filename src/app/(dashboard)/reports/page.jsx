'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Custom Reports',
    description: 'Build reports with drag-and-drop'
  },
  {
    icon: PieChart,
    title: 'Visualizations',
    description: 'Charts, graphs, and data tables'
  },
  {
    icon: Calendar,
    title: 'Scheduled Reports',
    description: 'Auto-send reports on schedule'
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis',
    description: 'Track metrics over time'
  },
  {
    icon: Download,
    title: 'Export',
    description: 'Export to PDF, Excel, CSV'
  },
  {
    icon: FileText,
    title: 'Templates',
    description: 'Pre-built report templates'
  },
];

export default function ReportsPage() {
  return (
    <ComingSoonPage
      title="Reports"
      description="Build custom reports to track any metric. Drag-and-drop builder, scheduled delivery, and multiple export formats."
      icon={FileText}
      features={features}
      backHref="/analytics"
      backLabel="Go to Dashboards"
    />
  );
}
