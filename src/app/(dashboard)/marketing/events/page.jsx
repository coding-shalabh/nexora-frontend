'use client';

import { ComingSoonPage } from '@/components/common/coming-soon-page';
import {
  CalendarDays,
  Users,
  Ticket,
  Mail,
  BarChart3,
  Video
} from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Event Management',
    description: 'Create and manage webinars, conferences, workshops'
  },
  {
    icon: Ticket,
    title: 'Registration',
    description: 'Customizable registration forms and ticketing'
  },
  {
    icon: Mail,
    title: 'Email Reminders',
    description: 'Automated event reminders and follow-ups'
  },
  {
    icon: Video,
    title: 'Virtual Events',
    description: 'Host webinars and virtual conferences'
  },
  {
    icon: Users,
    title: 'Attendee Management',
    description: 'Track registrations and check-ins'
  },
  {
    icon: BarChart3,
    title: 'Event Analytics',
    description: 'Measure event ROI and engagement'
  },
];

export default function EventsPage() {
  return (
    <ComingSoonPage
      title="Events Management"
      description="Plan, promote, and execute successful events. From webinars to conferences, manage the entire event lifecycle."
      icon={CalendarDays}
      features={features}
      backHref="/marketing/campaigns"
      backLabel="Go to Campaigns"
    />
  );
}
