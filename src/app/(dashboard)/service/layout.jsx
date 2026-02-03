'use client';

import { HubLayout } from '@/components/layout/hub-layout';

export default function ServiceLayout({ children }) {
  return <HubLayout hubId="service">{children}</HubLayout>;
}
