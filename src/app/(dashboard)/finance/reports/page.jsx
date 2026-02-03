'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { DollarSign, TrendingUp, PieChart, FileText, BarChart3, Calculator } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Profit & Loss',
    description: 'Income and expense summary',
  },
  {
    icon: BarChart3,
    title: 'Balance Sheet',
    description: 'Assets and liabilities overview',
  },
  {
    icon: DollarSign,
    title: 'Cash Flow',
    description: 'Track cash movements',
  },
  {
    icon: FileText,
    title: 'AR/AP Aging',
    description: 'Receivables and payables',
  },
  {
    icon: Calculator,
    title: 'Tax Reports',
    description: 'GST, TDS summaries',
  },
  {
    icon: PieChart,
    title: 'Budget Analysis',
    description: 'Budget vs actual',
  },
];

export default function FinanceReportsPage() {
  return (
    <ComingSoonPage
      title="Financial Reports"
      description="Financial reports are being consolidated into the central Analytics hub. Visit Analytics for comprehensive financial metrics, P&L, and budget analysis."
      icon={BarChart3}
      features={features}
      backHref="/analytics"
      backLabel="Go to Analytics"
    />
  );
}
