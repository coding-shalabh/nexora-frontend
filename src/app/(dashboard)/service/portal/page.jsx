'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  Users2,
  Ticket,
  FileText,
  MessageSquare,
  Eye,
  Lock
} from 'lucide-react';

const features = [
  {
    icon: Ticket,
    title: 'Ticket Portal',
    description: 'Customers can view and manage their tickets'
  },
  {
    icon: FileText,
    title: 'Knowledge Base Access',
    description: 'Self-service help articles and guides'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Real-time support conversations'
  },
  {
    icon: Eye,
    title: 'Order Tracking',
    description: 'Customers track their orders and history'
  },
  {
    icon: Lock,
    title: 'Secure Login',
    description: 'Branded, secure customer login portal'
  },
  {
    icon: Users2,
    title: 'Community',
    description: 'Customer community and forums'
  },
];

export default function CustomerPortalPage() {
  return (
    <ComingSoonPage
      title="Customer Portal"
      description="Give your customers a branded self-service portal. They can view tickets, access knowledge base articles, and track orders without contacting support."
      icon={Users2}
      features={features}
      backHref="/tickets"
      backLabel="Go to Tickets"
    />
  );
}
