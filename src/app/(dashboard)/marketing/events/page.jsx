'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';
import { CalendarDays } from 'lucide-react';

export default function EventsPage() {
  return (
    <UnifiedLayout hubId="marketing" pageTitle="Events" fixedMenu={null}>
      <ComingSoonPage
        title="Events Management"
        description="Plan, promote, and execute successful events. From webinars to conferences, manage the entire event lifecycle."
        icon={CalendarDays}
        features={[
          {
            icon: CalendarDays,
            title: 'Event Management',
            description: 'Create and manage webinars, conferences, workshops',
          },
          {
            icon: CalendarDays,
            title: 'Registration',
            description: 'Customizable registration forms and ticketing',
          },
          {
            icon: CalendarDays,
            title: 'Email Reminders',
            description: 'Automated event reminders and follow-ups',
          },
          {
            icon: CalendarDays,
            title: 'Virtual Events',
            description: 'Host webinars and virtual conferences',
          },
          {
            icon: CalendarDays,
            title: 'Attendee Management',
            description: 'Track registrations and check-ins',
          },
          {
            icon: CalendarDays,
            title: 'Event Analytics',
            description: 'Measure event ROI and engagement',
          },
        ]}
        backHref="/marketing/campaigns"
        backLabel="Go to Campaigns"
      />
    </UnifiedLayout>
  );
}
