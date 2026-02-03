'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Link2,
  CreditCard,
  Share2,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: Link2,
    title: 'Quick Links',
    description: 'Create payment links in seconds'
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share via email, SMS, or social'
  },
  {
    icon: CreditCard,
    title: 'Multiple Methods',
    description: 'Accept cards, bank transfers, wallets'
  },
  {
    icon: Shield,
    title: 'Secure Checkout',
    description: 'PCI-compliant payment processing'
  },
  {
    icon: BarChart3,
    title: 'Tracking',
    description: 'Track link views and conversions'
  },
  {
    icon: Zap,
    title: 'One-Click Pay',
    description: 'Frictionless payment experience'
  },
];

export default function PaymentLinksPage() {
  return (
    <ComingSoonPage
      title="Payment Links"
      description="Get paid faster with shareable payment links. Create links in seconds, share anywhere, and track conversions."
      icon={Link2}
      features={features}
      backHref="/billing/payments"
      backLabel="Go to Payments"
    />
  );
}
