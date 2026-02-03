'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Repeat,
  CreditCard,
  Calendar,
  TrendingUp,
  Users,
  Bell
} from 'lucide-react';

const features = [
  {
    icon: Repeat,
    title: 'Recurring Billing',
    description: 'Automated recurring payment collection'
  },
  {
    icon: Calendar,
    title: 'Billing Cycles',
    description: 'Flexible weekly, monthly, yearly billing'
  },
  {
    icon: CreditCard,
    title: 'Payment Methods',
    description: 'Multiple payment method support'
  },
  {
    icon: TrendingUp,
    title: 'MRR Tracking',
    description: 'Monthly recurring revenue dashboard'
  },
  {
    icon: Users,
    title: 'Plan Management',
    description: 'Create and manage subscription plans'
  },
  {
    icon: Bell,
    title: 'Renewal Alerts',
    description: 'Automated renewal notifications'
  },
];

export default function SubscriptionsPage() {
  return (
    <ComingSoonPage
      title="Subscriptions"
      description="Manage recurring revenue with subscription billing. Create plans, automate payments, and track MRR growth."
      icon={Repeat}
      features={features}
      backHref="/billing/invoices"
      backLabel="Go to Invoices"
    />
  );
}
